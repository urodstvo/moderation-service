// package auth

// import (
// 	"context"
// 	"strconv"
// 	"strings"

// 	"github.com/danielgtaylor/huma/v2"
// )

// type checkRequest struct {
// 	Authorization string `header:"Authorization"`
// }

// type checkResponse struct {
// 	UserId string `header:"X-User-Id"`
// }

// func (h *Auth) Check(ctx context.Context, input checkRequest) (*checkResponse, error) {
// 	// h.Logger.Info("header", slog.Any("auth:", input.Authorization))

// 	if input.Authorization == "" {
// 		h.Logger.Error("No Authorization header")
// 		return nil, huma.Error401Unauthorized("Unauthorized")
// 	}

// 	token := strings.Split(input.Authorization, " ")
// 	if len(token) != 2 || token[0] != "Bearer" {
// 		h.Logger.Error("error: not valid structure of Authorization header")
// 		return nil, huma.Error401Unauthorized("Unauthorized")
// 	}

// 	t, err := h.TokenService.GetByToken(ctx, token[1])
// 	if err != nil {
// 		h.Logger.Error("", "error: ", err.Error())
// 		return nil, huma.Error401Unauthorized("Unauthorized")
// 	}

// 	return &checkResponse{UserId: strconv.Itoa(t.UserId)}, nil
// }
