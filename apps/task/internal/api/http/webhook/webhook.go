// package webhook_routes

// import (
// 	"context"
// 	"net/http"

// 	"github.com/danielgtaylor/huma/v2"
// 	"github.com/urodstvo/moderation-service/libs/logger"
// 	"github.com/urodstvo/moderation-service/libs/models/service/webhook"
// 	"go.uber.org/fx"
// )

// type handler struct {
// 	Logger         logger.Logger
// 	WebhookService webhook.WebhookService
// }

// type Opts struct {
// 	fx.In

// 	Logger         logger.Logger
// 	WebhookService webhook.WebhookService
// 	Huma           huma.API
// }

// func NewWebhookRoutes(opts Opts) handler {
// 	a := handler{
// 		Logger:         opts.Logger,
// 		WebhookService: opts.WebhookService,
// 	}

// 	huma.Register(
// 		opts.Huma,
// 		huma.Operation{
// 			OperationID: "webhook-register",
// 			Method:      http.MethodPost,
// 			Path:        "/webhook",
// 			Tags:        []string{"Webhook"},
// 			Summary:     "Webhook Register",
// 		},
// 		func(ctx context.Context, i *registerRequest) (*struct{}, error) {
// 			return a.Register(ctx, *i)
// 		},
// 	)

// 	return a
// }
