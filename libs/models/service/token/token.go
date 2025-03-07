package user

import (
	repo "github.com/urodstvo/moderation-service/libs/models/repository/token"
)

type service struct {
	repo repo.TokenRepository
}

type TokenService interface {
}

func NewTokenService(repo repo.TokenRepository) TokenService {
	return &service{repo: repo}
}
