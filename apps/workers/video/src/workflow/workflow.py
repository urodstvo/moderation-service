import asyncio
from dataclasses import dataclass, field
from datetime import timedelta
from typing import Dict, List, Optional

from temporalio import workflow
from temporalio.common import RetryPolicy
from temporalio.exceptions import FailureError

import src.activity as activities


@dataclass
class Item:
    id: int
    filename: str
    original_filename: str


@dataclass
class KeyframeInfo:
    frame_id: str
    timestamp_seconds: float
    filename: str = ""


@dataclass
class VideoWorkflowResult:
    id: int
    filename: str
    original_filename: str
    audio_filename: str = ""
    audio_error: Optional[str] = None
    video_moderation: Optional[activities.VideoModerationResult] = None
    video_error: Optional[str] = None
    keyframes: List[KeyframeInfo] = field(default_factory=list)


def _activity_timeout(minutes: int) -> timedelta:
    return timedelta(minutes=minutes)


@workflow.defn(name="video_workflow")
class Workflow:
    @workflow.run
    async def run(
        self,
        workflow_id: int,
        user_id: int,
        items: List[Item],
        nsfw_model_name: str,
    ) -> List[VideoWorkflowResult]:
        print(f"video_workflow START: items={len(items)}")
        try:
            extraction_policy = RetryPolicy(maximum_attempts=3)
            nsfw_policy = RetryPolicy(initial_interval=timedelta(seconds=2), backoff_coefficient=2.0, maximum_attempts=3)

            print("video_workflow: starting extract_audio_from_video")
            audio_future = workflow.execute_activity(
                activities.extract_audio_from_video,
                items,
                start_to_close_timeout=_activity_timeout(10),
                retry_policy=extraction_policy,
            )
            print("video_workflow: starting extract_keyframes")
            keyframes_future = workflow.execute_activity(
                activities.extract_keyframes,
                items,
                start_to_close_timeout=_activity_timeout(10),
                retry_policy=extraction_policy,
            )
            print("video_workflow: waiting for results")

            print("video_workflow: awaiting asyncio.gather...")
            audio_results, keyframe_results = await asyncio.gather(audio_future, keyframes_future)
            print("video_workflow: after gather")
            print(f"video_workflow: got results - audio={len(audio_results)}, keyframes={len(keyframe_results)}")

            workflow.logger.info(f"video_workflow: keyframe_results count={len(keyframe_results)}")
            for kr in keyframe_results:
                print(f"video_workflow: keyframe result video_id={kr.video_id}, frames={len(kr.frames)}")
                workflow.logger.info(f"video_workflow: video_id={kr.video_id}, frames={len(kr.frames)}")

            print("video_workflow: uploading frames to minio")
            uploaded_frames = await workflow.execute_activity(
                activities.upload_frames_to_minio,
                keyframe_results,
                start_to_close_timeout=_activity_timeout(10),
                retry_policy=extraction_policy,
            )

            workflow.logger.info(f"video_workflow: uploaded_frames count={len(uploaded_frames)}")
            frame_tasks = [frame for result in keyframe_results for frame in result.frames]

            initial_scores = await workflow.execute_activity(
                activities.nsfw_batch_check,
                args=[frame_tasks, nsfw_model_name],
                start_to_close_timeout=_activity_timeout(10),
                retry_policy=nsfw_policy,
            ) if frame_tasks else []

            initial_aggregated = await workflow.execute_activity(
                activities.aggregate_moderation_result,
                args=[keyframe_results, initial_scores],
                start_to_close_timeout=timedelta(minutes=2),
                retry_policy=RetryPolicy(maximum_attempts=3),
            )

            refine_requests = [
                activities.RefineSegmentsRequest(
                    video_id=result.video_id,
                    filename=result.filename,
                    original_filename=result.original_filename,
                    segments=result.suspicious_segments,
                )
                for result in initial_aggregated
                if result.suspicious_segments
            ]

            final_aggregated = initial_aggregated
            if refine_requests:
                refined_keyframes = await workflow.execute_activity(
                    activities.refine_segments,
                    refine_requests,
                    start_to_close_timeout=_activity_timeout(10),
                    retry_policy=extraction_policy,
                )
                refined_frames = [frame for result in refined_keyframes for frame in result.frames]
                refined_scores = await workflow.execute_activity(
                    activities.nsfw_batch_check,
                    args=[refined_frames, nsfw_model_name],
                    start_to_close_timeout=_activity_timeout(10),
                    retry_policy=nsfw_policy,
                ) if refined_frames else []

                combined_extractions = _merge_extractions(keyframe_results, refined_keyframes)
                combined_scores = initial_scores + refined_scores

                final_aggregated = await workflow.execute_activity(
                    activities.aggregate_moderation_result,
                    args=[combined_extractions, combined_scores],
                    start_to_close_timeout=timedelta(minutes=2),
                    retry_policy=RetryPolicy(maximum_attempts=3),
                )

            audio_by_id = {result.id: result for result in audio_results}
            moderation_by_id = {result.video_id: result for result in final_aggregated}
            frame_filename_map: Dict[str, str] = {uf.frame_id: uf.filename for uf in uploaded_frames}
            keyframes_by_id: Dict[int, List[KeyframeInfo]] = {}
            for result in keyframe_results:
                keyframes_by_id[result.video_id] = [
                    KeyframeInfo(
                        frame_id=f.frame_id,
                        timestamp_seconds=f.timestamp_seconds,
                        filename=frame_filename_map.get(f.frame_id, ""),
                    )
                    for f in result.frames
                ]

            results: List[VideoWorkflowResult] = []
            for item in items:
                audio_result = audio_by_id.get(item.id)
                moderation_result = moderation_by_id.get(item.id)
                keyframes = keyframes_by_id.get(item.id, [])
                workflow.logger.info(f"video_workflow: item_id={item.id}, keyframes_count={len(keyframes)}")
                results.append(
                    VideoWorkflowResult(
                        id=item.id,
                        filename=item.filename,
                        original_filename=item.original_filename,
                        audio_filename=audio_result.filename if audio_result and not audio_result.error else "",
                        audio_error=audio_result.error if audio_result else "audio result missing",
                        video_moderation=moderation_result.video_moderation if moderation_result else None,
                        video_error=None if moderation_result else "video moderation result missing",
                        keyframes=keyframes,
                    )
                )

            workflow.logger.info(f"video_workflow: returning {len(results)} results")
            return results

        except FailureError as exc:
            workflow.logger.error(f"[VideoWorkflow] Failed: {exc}")
            raise


def _merge_extractions(
    primary: List[activities.ExtractedFramesResult],
    refined: List[activities.ExtractedFramesResult],
) -> List[activities.ExtractedFramesResult]:
    refined_by_id = {item.video_id: item for item in refined}
    primary_ids = {item.video_id for item in primary}
    merged: List[activities.ExtractedFramesResult] = []

    for item in primary:
        refined_item = refined_by_id.get(item.video_id)
        if refined_item is None:
            merged.append(item)
            continue

        merged.append(
            activities.ExtractedFramesResult(
                video_id=item.video_id,
                filename=item.filename,
                original_filename=item.original_filename,
                frames=item.frames + refined_item.frames,
                partial=item.partial or refined_item.partial,
            )
        )

    for item in refined:
        if item.video_id not in primary_ids:
            merged.append(item)

    return merged
