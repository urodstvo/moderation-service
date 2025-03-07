package gomodels

type Webhook struct {
	UserId     int    `json:"user_id"`
	WebhookUrl string `json:"webhook_url"`
}
