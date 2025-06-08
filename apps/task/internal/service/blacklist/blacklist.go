package blacklist

import (
	"context"

	repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/blacklist"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type service struct {
	repo repo.BlacklistRepository
}

type BlacklistService interface {
	Create(ctx context.Context, userId int, phrase string) error
	GetByUserId(ctx context.Context, userId int) ([]gomodels.Blacklist, error)
	GetOnlyPhrassesByUserId(ctx context.Context, userId int) ([]string, error)
}

func NewBlacklistService(repo repo.BlacklistRepository) BlacklistService {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, userId int, phrase string) error {
	return s.repo.Create(ctx, userId, phrase)
}

func (s *service) GetByUserId(ctx context.Context, userId int) ([]gomodels.Blacklist, error) {
	return s.repo.GetByUserId(ctx, userId)
}

func (s *service) GetOnlyPhrassesByUserId(ctx context.Context, userId int) ([]string, error) {
	blacklists, err := s.repo.GetByUserId(ctx, userId)
	if err != nil {
		return nil, err
	}

	var phrases []string
	for _, blacklist := range blacklists {
		phrases = append(phrases, blacklist.Phrase)
	}

	return phrases, nil
}
