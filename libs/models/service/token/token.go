package token

import (
	"context"

	"github.com/urodstvo/moderation-service/libs/models/gomodels"
	repo "github.com/urodstvo/moderation-service/libs/models/repository/token"
)

type service struct {
	repo repo.TokenRepository
}

type TokenService interface {
	Create(ctx context.Context, token string, userId int) error
	GetByUserId(ctx context.Context, userId int) (*gomodels.Token, error)
	GetByToken(ctx context.Context, token string) (*gomodels.Token, error)
}

func NewTokenService(repo repo.TokenRepository) TokenService {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, token string, userId int) error {
	return s.repo.Create(ctx, token, userId)
}

func (s *service) GetByUserId(ctx context.Context, userId int) (*gomodels.Token, error) {
	return s.repo.GetByUserId(ctx, userId)
}

func (s *service) GetByToken(ctx context.Context, token string) (*gomodels.Token, error) {
	return s.repo.GetByToken(ctx, token)
}
