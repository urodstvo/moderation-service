package server

import (
	"context"
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/urodstvo/moderation-service/libs/config"
	"github.com/urodstvo/moderation-service/libs/logger"
	"github.com/urodstvo/moderation-service/libs/server/middlewares"
	"go.uber.org/fx"
)

type Opts struct {
	fx.In
	LC          fx.Lifecycle
	Logger      logger.Logger
	Middlewares *middlewares.Middlewares
	Config      config.Config
}

type Server struct {
	*gin.Engine
}

func New(opts Opts) *Server {
	r := gin.New()

	r.Use(
		cors.New(
			cors.Config{
				AllowAllOrigins:  true,
				AllowMethods:     []string{"*"},
				AllowHeaders:     []string{"*"},
				ExposeHeaders:    []string{"*"},
				AllowCredentials: true,
			},
		),
	)
	r.ForwardedByClientIP = true
	r.RemoteIPHeaders = append(r.RemoteIPHeaders, "Cf-Connecting-IP")

	r.Use(opts.Middlewares.Logging)
	r.Use(gin.Recovery())

	server := &Server{
		r,
	}

	opts.LC.Append(
		fx.Hook{
			OnStart: func(ctx context.Context) error {
				opts.Logger.Info("Starting server")
				go func() {
					server.StartServer(opts.Config.Port)
				}()
				return nil
			},
			OnStop: func(ctx context.Context) error {
				server.StopServer()
				return nil
			},
		},
	)

	return server
}

func (s *Server) StartServer(port int) {
	s.Run(fmt.Sprintf(":%d", port))
}

func (s *Server) StopServer() {

}
