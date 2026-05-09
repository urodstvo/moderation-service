import asyncio
import re
import subprocess
import tempfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Sequence, Tuple

from temporalio import activity

from src.models import get_nsfw_model_client
from src.utils import CONFIG, logger, minio_client


SHOWINFO_PATTERN = re.compile(r"pts_time:(?P<pts>[0-9]+(?:\.[0-9]+)?)")
EMPTY_OUTPUT_PATTERNS = (
    "No filtered frames for output stream",
    "Nothing was written into output file",
    "Output file is empty",
)


@dataclass
class VideoInput:
    id: int
    filename: str
    original_filename: str


@dataclass
class FrameTask:
    video_id: int
    frame_id: str
    timestamp_seconds: float
    frame_bytes: bytes


@dataclass
class ExtractedFramesResult:
    video_id: int
    filename: str
    original_filename: str
    frames: List[FrameTask] = field(default_factory=list)
    partial: bool = False
    error: Optional[str] = None


@dataclass
class NSFWResult:
    frame_id: str
    video_id: int
    timestamp_seconds: float
    nsfw_score: float
    model: str


@dataclass
class FlaggedSegment:
    start_seconds: float
    end_seconds: float
    max_score: float
    frame_count: int


@dataclass
class VideoModerationResult:
    video_id: int
    nsfw_ratio: float
    max_score: float
    flagged_segments: List[FlaggedSegment]
    final_label: str
    model: str


@dataclass
class RefineSegment:
    start_seconds: float
    end_seconds: float


@dataclass
class RefineSegmentsRequest:
    video_id: int
    filename: str
    original_filename: str
    segments: List[RefineSegment]


@dataclass
class AggregatedModerationResult:
    video_id: int
    filename: str
    original_filename: str
    video_moderation: VideoModerationResult
    suspicious_segments: List[RefineSegment] = field(default_factory=list)
    partial: bool = False


def _bounded_float(value: float) -> str:
    return f"{max(0.0, value):.3f}"


def _select_uniform_indices(total: int, limit: int) -> List[int]:
    if total <= limit:
        return list(range(total))
    if limit <= 1:
        return [0]

    indices = []
    for i in range(limit):
        idx = round(i * (total - 1) / (limit - 1))
        if not indices or idx != indices[-1]:
            indices.append(idx)

    if len(indices) < limit:
        seen = set(indices)
        for idx in range(total):
            if idx not in seen:
                indices.append(idx)
            if len(indices) == limit:
                break

    return sorted(indices[:limit])


def _group_segments(scores: Sequence[NSFWResult], threshold: float, gap_seconds: float) -> List[FlaggedSegment]:
    filtered = [score for score in sorted(scores, key=lambda item: item.timestamp_seconds) if score.nsfw_score > threshold]
    if not filtered:
        return []

    segments: List[FlaggedSegment] = []
    current_start = filtered[0].timestamp_seconds
    current_end = filtered[0].timestamp_seconds
    current_max = filtered[0].nsfw_score
    current_count = 1

    for item in filtered[1:]:
        if item.timestamp_seconds-current_end <= gap_seconds:
            current_end = item.timestamp_seconds
            current_max = max(current_max, item.nsfw_score)
            current_count += 1
            continue

        segments.append(
            FlaggedSegment(
                start_seconds=current_start,
                end_seconds=current_end,
                max_score=current_max,
                frame_count=current_count,
            )
        )
        current_start = item.timestamp_seconds
        current_end = item.timestamp_seconds
        current_max = item.nsfw_score
        current_count = 1

    segments.append(
        FlaggedSegment(
            start_seconds=current_start,
            end_seconds=current_end,
            max_score=current_max,
            frame_count=current_count,
        )
    )
    return segments


def _build_refine_segments(scores: Sequence[NSFWResult]) -> List[RefineSegment]:
    grouped = _group_segments(scores, CONFIG.VideoSuspiciousScore, CONFIG.VideoSegmentGapSeconds)
    segments: List[RefineSegment] = []

    for segment in grouped:
        start = max(0.0, segment.start_seconds - CONFIG.VideoRefinedSegmentPaddingSeconds)
        end = segment.end_seconds + CONFIG.VideoRefinedSegmentPaddingSeconds
        if end <= start:
            end = start + 1.0
        segments.append(RefineSegment(start_seconds=start, end_seconds=end))

    return segments


def _build_ffmpeg_command(
    input_path: str,
    output_pattern: str,
    filter_expression: str,
    segment: Optional[RefineSegment] = None,
) -> List[str]:
    command = [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "info",
        "-y",
    ]
    if segment is not None:
        command.extend(["-ss", _bounded_float(segment.start_seconds), "-to", _bounded_float(segment.end_seconds)])

    command.extend(
        [
            "-i",
            input_path,
            "-an",
            "-sn",
            "-dn",
            "-vf",
            filter_expression,
            "-fps_mode",
            "vfr",
            "-c:v",
            "png",
            output_pattern,
        ]
    )
    return command


def _is_empty_extraction(result: subprocess.CompletedProcess[str]) -> bool:
    stderr = result.stderr or ""
    return all(pattern in stderr for pattern in EMPTY_OUTPUT_PATTERNS[:2]) or any(
        pattern in stderr for pattern in EMPTY_OUTPUT_PATTERNS
    )


def _collect_frame_tasks(frame_paths: Sequence[Path], timestamps: Sequence[float], video_id: int, prefix: str) -> Tuple[List[FrameTask], bool]:
    selected_count = min(len(frame_paths), len(timestamps))
    partial = len(frame_paths) != len(timestamps)
    frames: List[FrameTask] = []

    for idx in range(selected_count):
        frame_path = frame_paths[idx]
        try:
            frame_bytes = frame_path.read_bytes()
        except OSError:
            partial = True
            continue

        frames.append(
            FrameTask(
                video_id=video_id,
                frame_id=f"{video_id}:{prefix}:{idx}",
                timestamp_seconds=timestamps[idx],
                frame_bytes=frame_bytes,
            )
        )

    return frames, partial


def _extract_frames(
    video: VideoInput,
    filter_expression: str,
    frame_prefix: str,
    max_frames: int,
    segments: Optional[Sequence[RefineSegment]] = None,
) -> ExtractedFramesResult:
    output = ExtractedFramesResult(
        video_id=video.id,
        filename=video.filename,
        original_filename=video.original_filename,
    )

    with tempfile.TemporaryDirectory(prefix=f"video-{video.id}-") as temp_dir:
        temp_path = Path(temp_dir)
        extension = Path(video.filename).suffix or ".mp4"
        input_path = temp_path / f"input{extension}"
        activity.logger.info(f"_extract_frames: downloading {video.filename}")
        minio_client.download_file(video.filename, str(input_path))
        activity.logger.info(f"_extract_frames: downloaded to {input_path}, exists={input_path.exists()}")

        all_frames: List[FrameTask] = []
        partial = False
        active_segments = list(segments or [None])

        for segment_index, segment in enumerate(active_segments):
            segment_dir = temp_path / f"segment-{segment_index}"
            segment_dir.mkdir(parents=True, exist_ok=True)
            output_pattern = str(segment_dir / "frame_%06d.png")
            command = _build_ffmpeg_command(input_path=str(input_path), output_pattern=output_pattern, filter_expression=filter_expression, segment=segment)
            activity.logger.info(f"_extract_frames: ffmpeg command: {' '.join(command)}")

            result = subprocess.run(command, capture_output=True, text=True, timeout=300)
            activity.logger.info(f"_extract_frames: ffmpeg returncode={result.returncode}, stderr_len={len(result.stderr)}")
            if result.returncode != 0:
                if _is_empty_extraction(result):
                    activity.logger.info(
                        "ffmpeg extracted no frames for %s segment %s; continuing with empty sample",
                        video.filename,
                        segment_index,
                    )
                    continue
                raise RuntimeError(f"ffmpeg failed for {video.filename}: {result.stderr.strip()}")

            timestamps = [float(match.group("pts")) for match in SHOWINFO_PATTERN.finditer(result.stderr)]
            frame_paths = sorted(segment_dir.glob("frame_*.png"))
            activity.logger.info(f"_extract_frames: found {len(frame_paths)} frames, {len(timestamps)} timestamps")

            if len(frame_paths) > max_frames:
                selected_indices = _select_uniform_indices(len(frame_paths), max_frames)
                timestamps = [timestamps[index] for index in selected_indices if index < len(timestamps)]
                frame_paths = [frame_paths[index] for index in selected_indices]

            frames, is_partial = _collect_frame_tasks(
                frame_paths=frame_paths,
                timestamps=timestamps,
                video_id=video.id,
                prefix=f"{frame_prefix}:{segment_index}",
            )
            all_frames.extend(frames)
            partial = partial or is_partial

        if len(all_frames) > max_frames:
            selected_indices = _select_uniform_indices(len(all_frames), max_frames)
            all_frames = [all_frames[index] for index in selected_indices]
            partial = True

        output.frames = all_frames
        output.partial = partial
        return output


@activity.defn
async def extract_keyframes(input: List[VideoInput]) -> List[ExtractedFramesResult]:
    threshold = 0.01
    max_frames = 5  # Limit to avoid message size limit
    print(f"extract_keyframes START: processing {len(input)} videos, threshold={threshold}")
    results: List[ExtractedFramesResult] = []
    filter_expression = (
        f"select='gt(scene,{threshold})',"
        f"scale=160:-2:force_original_aspect_ratio=decrease,"
        "showinfo"
    )
    print(f"extract_keyframes: filter={filter_expression}")

    for video in input:
        print(f"extract_keyframes: processing video {video.id}, filename={video.filename}")
        try:
            result = _extract_frames(
                video=video,
                filter_expression=filter_expression,
                frame_prefix="scene",
                max_frames=max_frames,
            )
            print(f"extract_keyframes: video {video.id}, extracted frames={len(result.frames)}, error={result.error}")
            results.append(result)
        except Exception as exc:
            print(f"extract_keyframes FAILED for {video.filename}: {exc}")
            activity.logger.error(f"extract_keyframes failed for {video.filename}: {exc}")
            raise

    return results


@activity.defn
async def refine_segments(input: List[RefineSegmentsRequest]) -> List[ExtractedFramesResult]:
    results: List[ExtractedFramesResult] = []
    filter_expression = (
        f"fps={CONFIG.VideoRefineFps},"
        f"scale={CONFIG.VideoFrameWidth}:-2:force_original_aspect_ratio=decrease,"
        "showinfo"
    )

    for video in input:
        try:
            results.append(
                _extract_frames(
                    video=VideoInput(id=video.video_id, filename=video.filename, original_filename=video.original_filename),
                    filter_expression=filter_expression,
                    frame_prefix="refine",
                    max_frames=CONFIG.VideoMaxKeyframes,
                    segments=video.segments,
                )
            )
        except Exception as exc:
            activity.logger.error(f"refine_segments failed for {video.filename}: {exc}")
            raise

    return results


@activity.defn
async def nsfw_batch_check(frames: List[FrameTask], model_name: str) -> List[NSFWResult]:
    if not frames:
        return []

    client = get_nsfw_model_client(model_name)
    semaphore = asyncio.Semaphore(CONFIG.VideoNsfwBatchConcurrency)

    async def analyze(frame: FrameTask) -> NSFWResult:
        async with semaphore:
            classification = await client.analyze(frame.frame_bytes)
            return NSFWResult(
                frame_id=frame.frame_id,
                video_id=frame.video_id,
                timestamp_seconds=frame.timestamp_seconds,
                nsfw_score=classification.score,
                model=classification.model,
            )

    return await asyncio.gather(*(analyze(frame) for frame in frames))


@activity.defn
async def aggregate_moderation_result(extractions: List[ExtractedFramesResult], nsfw_results: List[NSFWResult]) -> List[AggregatedModerationResult]:
    scores_by_video: Dict[int, List[NSFWResult]] = {}
    for item in nsfw_results:
        scores_by_video.setdefault(item.video_id, []).append(item)

    aggregated: List[AggregatedModerationResult] = []
    for extraction in extractions:
        scores = sorted(scores_by_video.get(extraction.video_id, []), key=lambda item: item.timestamp_seconds)
        total_frames = len(scores)
        flagged_count = sum(1 for item in scores if item.nsfw_score > CONFIG.VideoFlagScore)
        nsfw_ratio = flagged_count / total_frames if total_frames else 0.0
        max_score = max((item.nsfw_score for item in scores), default=0.0)
        flagged_segments = _group_segments(scores, CONFIG.VideoFlagScore, CONFIG.VideoSegmentGapSeconds)
        suspicious_segments = _build_refine_segments(scores)
        has_long_segment = any(segment.end_seconds-segment.start_seconds > 2.0 for segment in flagged_segments)
        has_suspicious = any(item.nsfw_score > CONFIG.VideoSuspiciousScore for item in scores)

        if has_long_segment or nsfw_ratio > CONFIG.VideoFlagRatio:
            final_label = "NSFW"
        elif has_suspicious or extraction.partial or total_frames == 0:
            final_label = "REVIEW"
        else:
            final_label = "SAFE"

        aggregated.append(
            AggregatedModerationResult(
                video_id=extraction.video_id,
                filename=extraction.filename,
                original_filename=extraction.original_filename,
                partial=extraction.partial,
                suspicious_segments=suspicious_segments,
                video_moderation=VideoModerationResult(
                    video_id=extraction.video_id,
                    nsfw_ratio=nsfw_ratio,
                    max_score=max_score,
                    flagged_segments=flagged_segments,
                    final_label=final_label,
                    model=scores[0].model if scores else "",
                ),
            )
        )

    return aggregated


@dataclass
class UploadedFrame:
    frame_id: str
    video_id: int
    timestamp_seconds: float
    filename: str


@dataclass
class UploadFramesInput:
    video_id: int
    original_filename: str
    frames: List[FrameTask]


@activity.defn
async def upload_frames_to_minio(input: List[ExtractedFramesResult]) -> List[UploadedFrame]:
    activity.logger.info(f"upload_frames_to_minio: processing {len(input)} extractions")
    uploaded: List[UploadedFrame] = []
    for extraction in input:
        activity.logger.info(f"upload_frames_to_minio: video_id={extraction.video_id}, frames={len(extraction.frames)}")
        for frame in extraction.frames:
            object_name = f"frames/{extraction.video_id}/{frame.frame_id}.png"
            try:
                minio_client.put_object(
                    CONFIG.S3Bucket,
                    object_name,
                    frame.frame_bytes,
                    length=len(frame.frame_bytes),
                    content_type="image/png",
                )
                activity.logger.info(f"upload_frames_to_minio: uploaded {object_name}")
                uploaded.append(
                    UploadedFrame(
                        frame_id=frame.frame_id,
                        video_id=frame.video_id,
                        timestamp_seconds=frame.timestamp_seconds,
                        filename=object_name,
                    )
                )
            except Exception as e:
                activity.logger.error(f"upload_frames_to_minio: failed to upload {object_name}: {e}")
                raise
    activity.logger.info(f"upload_frames_to_minio: total uploaded {len(uploaded)} frames")
    return uploaded
