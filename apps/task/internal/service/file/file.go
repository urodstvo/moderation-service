package file

import (
	"context"

	repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/file"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type service struct {
	repo repo.FileRepository
}

type FileService interface {
	Create(ctx context.Context, requestId int, contentType gomodels.ContentType, filename string, originalFilename string) (int, error)
	GetById(ctx context.Context, id int) (gomodels.File, error)
	GetByRequestId(ctx context.Context, requestId int) ([]gomodels.File, error)
}

func NewFileService(repo repo.FileRepository) FileService {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, requestId int, contentType gomodels.ContentType, filename string, originalFilename string) (int, error) {
	return s.repo.Create(ctx, requestId, string(contentType), filename, originalFilename)
}

func (s *service) GetById(ctx context.Context, id int) (gomodels.File, error) {
	return s.repo.GetById(ctx, id)
}

func (s *service) GetByRequestId(ctx context.Context, requestId int) ([]gomodels.File, error) {
	return s.repo.GetByRequestId(ctx, requestId)
}
