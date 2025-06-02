package webhook

import (
	"net/http"
	"net/url"
	"time"
)

func isValidURL(rawURL string) bool {
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

	// ips, err := net.LookupIP(parsedURL.Hostname())
	// if err != nil {
	// 	return false
	// }

	// for _, ip := range ips {
	// 	if ip.IsLoopback() || ip.IsPrivate() {
	// 		// В dev-режиме разрешаем локальные адреса
	// 		return allowLocal
	// 	}
	// }

	return true
}

func ValidateWebhook(webhookURL string) bool {
	if !isValidURL(webhookURL) {
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
