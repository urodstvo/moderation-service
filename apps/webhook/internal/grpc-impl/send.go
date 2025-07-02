package grpcimpl

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/urodstvo/moderation-service/libs/grpc/webhook"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (i *Impl) SendByWebhook(ctx context.Context, req *webhook.SendByWebhookRequest) (*emptypb.Empty, error) {
	userAgent := "moderation-service"

	webhook, err := i.WebhookService.GetByUserId(ctx, int(req.UserId))
	if err != nil {
		return nil, fmt.Errorf("failed to get webhook for user %d: %w", req.UserId, err)
	}

	httpReq, err := http.NewRequestWithContext(ctx, "POST", webhook.WebhookUrl, strings.NewReader(req.Message))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("User-Agent", userAgent)
	httpReq.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return &emptypb.Empty{}, nil
}
