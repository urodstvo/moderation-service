package status

import (
	"context"

	repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/status"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type service struct {
	repo repo.StatusTreeRepository
}

type StatusTreeService interface {
	CreateNode(ctx context.Context, requestId int, title string, details *string) error
	CreateRelation(ctx context.Context, requestId int, parentId int, childId int) error
	UpdateStatus(ctx context.Context, requestId int, status gomodels.Status) error

	GetStatusTree(ctx context.Context, requestId int) (gomodels.StatusTree, error)
}

func NewStatusTreeService(repo repo.StatusTreeRepository) StatusTreeService {
	return &service{repo: repo}
}

func (s *service) CreateRelation(ctx context.Context, requestId int, parentId int, childId int) error {
	relation := gomodels.StatusNodeRelation{
		RequestId: requestId,
		ParentId:  parentId,
		ChildId:   childId,
	}
	return s.repo.CreateRelation(ctx, relation)
}

func (s *service) CreateNode(ctx context.Context, requestId int, title string, details *string) error {
	if details == nil {
		*details = ""
	}

	treeNode := gomodels.StatusNode{
		RequestId: requestId,
		Title:     title,
		Details:   *details,
	}

	return s.repo.CreateNode(ctx, treeNode)
}

func (s *service) UpdateStatus(ctx context.Context, nodeId int, status gomodels.Status) error {
	return s.repo.UpdateNodeStatus(ctx, nodeId, status)
}

func (s *service) GetStatusTree(ctx context.Context, requestId int) (gomodels.StatusTree, error) {
	nodes, err := s.repo.GetByRequestId(ctx, requestId)
	if err != nil {
		return gomodels.StatusTree{}, err
	}
	if len(nodes) == 0 {
		return gomodels.StatusTree{}, nil
	}

	relations, err := s.repo.GetRelationsByRequestId(ctx, requestId)
	if err != nil {
		return gomodels.StatusTree{}, err
	}

	nodeMap := make(map[int]*gomodels.StatusTree)
	for i := range nodes {
		n := nodes[i]
		nodeMap[n.Id] = &gomodels.StatusTree{StatusNode: &n}
	}

	for _, rel := range relations {
		parent, okP := nodeMap[rel.ParentId]
		child, okC := nodeMap[rel.ChildId]
		if okP && okC {
			parent.Children = append(parent.Children, child)
		}
	}

	root := nodeMap[nodes[0].Id]
	return *root, nil
}
