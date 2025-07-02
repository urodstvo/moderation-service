package grpcimpl

import (
	"context"
	"net"
	"net/http"
	"net/url"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/libs/grpc/webhook"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (i *Impl) UpdateWebhook(ctx context.Context, req *webhook.UpdateWebhookRequest) (*emptypb.Empty, error) {
	url := req.WebhookUrl
	userId := req.UserId

	if !ValidateWebhook(url, i.Config.AppEnv) {
		return nil, huma.Error400BadRequest("Invalid webhook url")
	}

	err := i.WebhookService.CreateOrUpdate(ctx, url, int(userId))
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create webhook")
	}
	return &emptypb.Empty{}, nil
}

func isValidURL(rawURL, appEnv string) bool {
	parsedURL, err := url.Parse(rawURL)
	if err != nil {
		return false
	}

	if parsedURL.Scheme != "http" && parsedURL.Scheme != "https" {
		return false
	}

	if parsedURL.Host == "" {
		return false
	}

	ips, err := net.LookupIP(parsedURL.Hostname())
	if err != nil {
		return false
	}

	for _, ip := range ips {
		if ip.IsLoopback() || ip.IsPrivate() {
			return appEnv == "development"
		}
	}

	return true
}

func ValidateWebhook(webhookURL, appEnv string) bool {
	if !isValidURL(webhookURL, appEnv) {
		return false
	}

	client := &http.Client{
		Timeout: 3 * time.Second,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}

	resp, err := client.Head(webhookURL)
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	return resp.StatusCode >= 200 && resp.StatusCode < 400
}
