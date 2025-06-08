package user

import (
	"context"

	repo "github.com/urodstvo/moderation-service/apps/auth/internal/repository/user"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type service struct {
	repo repo.UserRepository
}

type UserService interface {
	GetByEmail(ctx context.Context, email string) (gomodels.User, error)
	Create(ctx context.Context, email string, password string) (int, error)
}

func NewUserService(repo repo.UserRepository) UserService {
	return &service{repo: repo}
}

func (s *service) GetByEmail(ctx context.Context, email string) (gomodels.User, error) {
	return s.repo.GetByEmail(ctx, email)
}

func (s *service) Create(ctx context.Context, email string, password string) (int, error) {
	return s.repo.Create(ctx, email, password)
}
