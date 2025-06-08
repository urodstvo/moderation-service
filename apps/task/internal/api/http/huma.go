// package http

// import (
// 	"encoding/json"
// 	"io"
// 	"strconv"

// 	"github.com/danielgtaylor/huma/v2"
// 	"github.com/danielgtaylor/huma/v2/adapters/humagin"
// 	"github.com/urodstvo/moderation-service/libs/server"
// )

// func NewHuma(router *server.Server) huma.API {
// 	var jsonFormat = huma.Format{
// 		Marshal: func(w io.Writer, v any) error {
// 			return json.NewEncoder(w).Encode(v)
// 		},
// 		Unmarshal: json.Unmarshal,
// 	}

// 	config := huma.DefaultConfig("Task API", "1.0.0")
// 	huma.DefaultArrayNullable = false
// 	config.Formats = map[string]huma.Format{
// 		"application/json": jsonFormat,
// 		"json":             jsonFormat,
// 	}

// 	api := humagin.New(router.Engine, config)
// 	api.UseMiddleware(
// 		func(ctx huma.Context, next func(huma.Context)) {
// 			userIdStr := ctx.Header("X-User-Id")
// 			userId, err := strconv.Atoi(userIdStr)
// 			if err != nil {
// 				return
// 			}

// 			ctx = huma.WithValue(ctx, "UserId", userId)
// 			next(ctx)
// 		},
// 	)

// 	return api
// }
