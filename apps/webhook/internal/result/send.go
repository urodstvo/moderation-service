package result

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func CollectResults(request gomodels.Request, results []map[string]any) (map[string]any, error) {
	var collectedTasks []map[string]any

	for _, result := range results {
		fileID := result["file_id"].(int)
		contentType := result["content_type"].(string)
		recognizedText := result["recognized_text"].(string)
		predictionsRaw := result["predictions"].(map[string]any)

		predictions := make(map[string]float64)
		for key, value := range predictionsRaw {
			predictions[key] = value.(float64)
		}

		collectedTasks = append(collectedTasks, map[string]any{
			"task_id":         fileID,
			"content_type":    contentType,
			"recognized_text": recognizedText,
			"predictions":     predictions,
		})
	}

	response := map[string]any{
		"request_id":   request.Id,
		"created_at":   request.CreatedAt,
		"completed_at": request.UpdatedAt,
		"total_tasks":  len(collectedTasks),
		"tasks":        collectedTasks,
	}

	return response, nil
}

func SendResults(ctx context.Context, webhookUrl string, results map[string]any) error {
	payload, err := json.Marshal(results)
	if err != nil {
		return fmt.Errorf("failed to marshal JSON: %w", err)
	}

	// Отправляем POST-запрос на вебхук
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, webhookUrl, bytes.NewBuffer(payload))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Проверяем успешность ответа
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("webhook returned non-2xx status: %d", resp.StatusCode)
	}

	return nil
}

/*
response =
{
	group_id: number;
	created_at: string;
	completed_at: string;
	total_tasks: number;
	tasks: [
		{
			task_id: number;
			content_type: string;
			recognized_text: string;
			predictions: {
				label1: float;
				label2: float;
				...
			}
		}
	]
}

task result =
{
	task_id: number;
	content_type: string;
	recognized_text: string;
	predictions: {
		label1: float;
		label2: float;
		...
	}
}
*/
