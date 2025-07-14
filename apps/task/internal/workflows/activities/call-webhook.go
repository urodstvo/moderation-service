package activities

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/urodstvo/moderation-service/libs/grpc/webhook"
)

func (a *Activity) CallWebhook(userId int, input any) error {
	inputBytes, err := json.Marshal(input)
	if err != nil {
		return err
	}

	req := &webhook.SendByWebhookRequest{
		UserId:  int32(userId),
		Message: string(inputBytes),
	}

	if _, err := a.WebhoockClient.SendByWebhook(context.Background(), req); err != nil {
		return fmt.Errorf("failed to send webhook: %w", err)
	}
	return nil
}
