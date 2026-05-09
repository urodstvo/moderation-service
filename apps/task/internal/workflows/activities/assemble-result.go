package activities

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/types"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (a *Activity) AssembleResult(ctx context.Context, requestId int, text []types.TextResultItem, videos []types.VideoWorkflowResult, imageResults []types.ResultItem) (types.WorkflowResult, error) {
	request, err := a.RequestService.GetById(ctx, requestId)
	if err != nil {
		return types.WorkflowResult{}, err
	}

	files, err := a.FileService.GetByRequestId(ctx, requestId)
	if err != nil {
		return types.WorkflowResult{}, err
	}

	textByID := make(map[int]types.TextResultItem, len(text))
	for _, item := range text {
		textByID[item.Id] = item
	}

	videoByID := make(map[int]types.VideoWorkflowResult, len(videos))
	for _, item := range videos {
		videoByID[item.Id] = item
	}

	imageByVideoID := make(map[int][]types.ResultItem)
	for _, img := range imageResults {
		imageByVideoID[img.Id] = append(imageByVideoID[img.Id], img)
	}

	var result types.WorkflowResult
	result.RequestId = requestId
	result.CreatedAt = request.CreatedAt
	result.UpdatedAt = request.UpdatedAt
	result.Status = "completed"
	result.TotalFiles = len(files)

	for _, file := range files {
		fileResult := types.WorkflowResultFile{
			FileId:      file.Id,
			Filename:    file.OriginalFilename,
			ContentType: file.ContentType,
		}

		switch file.ContentType {
		case gomodels.ContentTypeVideo:
			if video, ok := videoByID[file.Id]; ok {
				imgResults := imageByVideoID[video.Id]
				aggregatedResult := aggregateVideoResults(video, imgResults)
				fileResult.VideoModeration = aggregatedResult.VideoModeration
				fileResult.Keyframes = aggregatedResult.Keyframes
				if aggregatedResult.NsfwClassification != nil {
					fileResult.NsfwClassification = aggregatedResult.NsfwClassification
				}
			}
		default:
			if textItem, ok := textByID[file.Id]; ok {
				fileResult.RecognizedText = &textItem.RecognizedText
				fileResult.Classification = textItem.Classification
				fileResult.NsfwClassification = textItem.NsfwClassification
				fileResult.Words = textItem.Words
			}
		}

		result.Files = append(result.Files, fileResult)
	}

	return result, nil
}

func aggregateVideoResults(video types.VideoWorkflowResult, imageResults []types.ResultItem) struct {
	VideoModeration     *types.VideoModerationResult
	Keyframes          []types.KeyframeInfo
	NsfwClassification *types.NsfwClassification
} {
	var maxScore float64
	var nsfwCount int

	for _, img := range imageResults {
		if img.NsfwClassification != nil && img.NsfwClassification.Score > maxScore {
			maxScore = img.NsfwClassification.Score
		}
		if img.NsfwClassification != nil && img.NsfwClassification.IsNsfw {
			nsfwCount++
		}
	}

	keyframes := make([]types.KeyframeInfo, 0)
	if len(video.Keyframes) > 0 {
		for _, kf := range video.Keyframes {
			var frameScore float64
			var isNsfw bool
			for _, img := range imageResults {
				idx := strings.LastIndex(kf.FrameId, ":")
				if idx == -1 {
					continue
				}
				frameIDStr := kf.FrameId[idx+1:]
				frameID, err := strconv.Atoi(frameIDStr)
				if err != nil || img.Id != frameID {
					continue
				}
				if img.NsfwClassification != nil {
					frameScore = img.NsfwClassification.Score
					isNsfw = img.NsfwClassification.IsNsfw
					break
				}
			}
			keyframes = append(keyframes, types.KeyframeInfo{
				FrameId:          kf.FrameId,
				TimestampSeconds: kf.TimestampSeconds,
				Filename:         kf.Filename,
				NsfwScore:        frameScore,
				IsNsfw:           isNsfw,
			})
		}
	} else {
		for _, img := range imageResults {
			var frameScore float64
			var isNsfw bool
			if img.NsfwClassification != nil {
				frameScore = img.NsfwClassification.Score
				isNsfw = img.NsfwClassification.IsNsfw
			}
			keyframes = append(keyframes, types.KeyframeInfo{
				FrameId:          fmt.Sprintf("%d:frame:%d", video.Id, img.Id),
				TimestampSeconds: 0,
				Filename:         img.Filename,
				NsfwScore:        frameScore,
				IsNsfw:           isNsfw,
			})
		}
	}

	nsfwRatio := 0.0
	if len(imageResults) > 0 {
		nsfwRatio = float64(nsfwCount) / float64(len(imageResults))
	}

	var finalLabel string
	if nsfwRatio > 0.5 || maxScore > 0.8 {
		finalLabel = "NSFW"
	} else if nsfwRatio > 0.1 || maxScore > 0.4 {
		finalLabel = "REVIEW"
	} else {
		finalLabel = "SAFE"
	}

	var classification *types.NsfwClassification
	if len(imageResults) > 0 {
		classification = &types.NsfwClassification{
			Score:  maxScore,
			IsNsfw: finalLabel == "NSFW",
			Model:  "image_model",
		}
	}

	videoMod := &types.VideoModerationResult{
		VideoId:         video.Id,
		NsfwRatio:       nsfwRatio,
		MaxScore:        maxScore,
		FlaggedSegments: []types.FlaggedSegment{},
		FinalLabel:      finalLabel,
		Model:           "image_model",
	}

	return struct {
		VideoModeration     *types.VideoModerationResult
		Keyframes          []types.KeyframeInfo
		NsfwClassification *types.NsfwClassification
	}{
		VideoModeration:     videoMod,
		Keyframes:          keyframes,
		NsfwClassification: classification,
	}
}
