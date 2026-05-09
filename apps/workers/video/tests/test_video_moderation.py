import importlib.util
import pathlib
import sys
import types
import unittest


class _ActivityStub:
    logger = types.SimpleNamespace(error=lambda *args, **kwargs: None)

    @staticmethod
    def defn(fn):
        return fn


temporalio_stub = types.ModuleType("temporalio")
temporalio_stub.activity = _ActivityStub()
sys.modules.setdefault("temporalio", temporalio_stub)

src_stub = types.ModuleType("src")
sys.modules.setdefault("src", src_stub)

utils_stub = types.ModuleType("src.utils")
utils_stub.CONFIG = types.SimpleNamespace(
    VideoSceneThreshold=0.3,
    VideoMaxKeyframes=100,
    VideoRefineFps=3,
    VideoSuspiciousScore=0.6,
    VideoFlagScore=0.8,
    VideoFlagRatio=0.1,
    VideoSegmentGapSeconds=1.2,
    VideoRefinedSegmentPaddingSeconds=1.5,
    VideoFrameWidth=320,
    VideoNsfwBatchConcurrency=2,
)
utils_stub.minio_client = types.SimpleNamespace(download_file=lambda *args, **kwargs: None)
sys.modules.setdefault("src.utils", utils_stub)

models_stub = types.ModuleType("src.models")
models_stub.get_nsfw_model_client = lambda model_name: None
sys.modules.setdefault("src.models", models_stub)

module_path = pathlib.Path(__file__).resolve().parents[1] / "src" / "activity" / "video_moderation.py"
module_spec = importlib.util.spec_from_file_location("video_moderation_under_test", module_path)
video_moderation = importlib.util.module_from_spec(module_spec)
assert module_spec.loader is not None
module_spec.loader.exec_module(video_moderation)


class VideoModerationAggregationTests(unittest.IsolatedAsyncioTestCase):
    async def test_safe_video_without_flagged_frames(self):
        extraction = video_moderation.ExtractedFramesResult(video_id=1, filename="safe.mp4", original_filename="safe.mp4")
        scores = [
            video_moderation.NSFWResult(frame_id="1", video_id=1, timestamp_seconds=0.0, nsfw_score=0.2, model="clip"),
            video_moderation.NSFWResult(frame_id="2", video_id=1, timestamp_seconds=1.0, nsfw_score=0.4, model="clip"),
        ]

        result = (await video_moderation.aggregate_moderation_result([extraction], scores))[0].video_moderation

        self.assertEqual(result.final_label, "SAFE")
        self.assertEqual(result.nsfw_ratio, 0.0)
        self.assertEqual(len(result.flagged_segments), 0)

    async def test_ratio_threshold_marks_video_nsfw(self):
        extraction = video_moderation.ExtractedFramesResult(video_id=2, filename="ratio.mp4", original_filename="ratio.mp4")
        scores = [
            video_moderation.NSFWResult(
                frame_id=str(i),
                video_id=2,
                timestamp_seconds=float(i),
                nsfw_score=0.9 if i < 2 else 0.1,
                model="clip",
            )
            for i in range(10)
        ]

        result = (await video_moderation.aggregate_moderation_result([extraction], scores))[0].video_moderation

        self.assertEqual(result.final_label, "NSFW")
        self.assertGreater(result.nsfw_ratio, 0.1)

    async def test_long_flagged_segment_marks_video_nsfw(self):
        extraction = video_moderation.ExtractedFramesResult(video_id=3, filename="segment.mp4", original_filename="segment.mp4")
        scores = [
            video_moderation.NSFWResult(frame_id="1", video_id=3, timestamp_seconds=0.0, nsfw_score=0.85, model="clip"),
            video_moderation.NSFWResult(frame_id="2", video_id=3, timestamp_seconds=1.1, nsfw_score=0.9, model="clip"),
            video_moderation.NSFWResult(frame_id="3", video_id=3, timestamp_seconds=2.3, nsfw_score=0.88, model="clip"),
        ]

        result = (await video_moderation.aggregate_moderation_result([extraction], scores))[0].video_moderation

        self.assertEqual(result.final_label, "NSFW")
        self.assertEqual(len(result.flagged_segments), 1)
        self.assertGreater(result.flagged_segments[0].end_seconds - result.flagged_segments[0].start_seconds, 2.0)

    async def test_suspicious_frames_trigger_review_and_refine_segments(self):
        extraction = video_moderation.ExtractedFramesResult(video_id=4, filename="review.mp4", original_filename="review.mp4")
        scores = [
            video_moderation.NSFWResult(frame_id="1", video_id=4, timestamp_seconds=5.0, nsfw_score=0.65, model="clip"),
            video_moderation.NSFWResult(frame_id="2", video_id=4, timestamp_seconds=5.5, nsfw_score=0.3, model="clip"),
        ]

        aggregate = (await video_moderation.aggregate_moderation_result([extraction], scores))[0]

        self.assertEqual(aggregate.video_moderation.final_label, "REVIEW")
        self.assertEqual(len(aggregate.suspicious_segments), 1)
        self.assertLessEqual(aggregate.suspicious_segments[0].start_seconds, 5.0)
        self.assertGreaterEqual(aggregate.suspicious_segments[0].end_seconds, 5.0)


if __name__ == "__main__":
    unittest.main()
