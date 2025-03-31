package result

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func CollectResults(taskGroup gomodels.TaskGroup, results []map[string]interface{}) (map[string]interface{}, error) {
	var collectedTasks []map[string]interface{}

	for _, result := range results {
		taskID := result["task_id"].(int)
		contentType := result["content_type"].(string)
		recognizedText := result["recognized_text"].(string)
		predictionsRaw := result["predictions"].(map[string]interface{})

		predictions := make(map[string]float64)
		for key, value := range predictionsRaw {
			predictions[key] = value.(float64)
		}

		collectedTasks = append(collectedTasks, map[string]interface{}{
			"task_id":         taskID,
			"content_type":    contentType,
			"recognized_text": recognizedText,
			"predictions":     predictions,
		})
	}

	response := map[string]interface{}{
		"group_id":     taskGroup.Id,
		"created_at":   taskGroup.CreatedAt,
		"completed_at": taskGroup.UpdatedAt,
		"total_tasks":  len(collectedTasks),
		"tasks":        collectedTasks,
	}

	return response, nil
}

func SendResults(ctx context.Context, webhookUrl string, results map[string]interface{}) error {
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
