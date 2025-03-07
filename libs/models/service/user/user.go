package user

import (
	repo "github.com/urodstvo/moderation-service/libs/models/repository/user"
)

type service struct {
	repo repo.UserRepository
}

type UserService interface {
}

func NewUserService(repo repo.UserRepository) UserService {
	return &service{repo: repo}
}
