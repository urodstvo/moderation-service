package http

import (
	"encoding/json"
	"io"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humagin"
	"github.com/urodstvo/moderation-service/apps/api/internal/server"
)

func NewHuma(router *server.Server) huma.API {
	var jsonFormat = huma.Format{
		Marshal: func(w io.Writer, v any) error {
			return json.NewEncoder(w).Encode(v)
		},
		Unmarshal: json.Unmarshal,
	}

	config := huma.DefaultConfig("API GATEWAY", "1.0.0")
	huma.DefaultArrayNullable = false
	config.Formats = map[string]huma.Format{
		"application/json": jsonFormat,
		"json":             jsonFormat,
	}

	api := humagin.New(router.Engine, config)

	return api
}
