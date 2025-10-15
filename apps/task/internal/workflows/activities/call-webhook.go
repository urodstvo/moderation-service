package activities

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/urodstvo/moderation-service/libs/grpc/proto"
)

func (a *Activity) CallWebhook(ctx context.Context, userId int, input any) error {
	inputBytes, err := json.Marshal(input)
	if err != nil {
		return err
	}

	req := &proto.SendByWebhookRequest{
		UserId:  int32(userId),
		Message: string(inputBytes),
	}

	if _, err := a.WebhookClient.SendByWebhook(ctx, req); err != nil {
		return fmt.Errorf("failed to send webhook: %w", err)
	}
	return nil
}
