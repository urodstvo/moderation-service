package status_tree

import (
	"context"
	"database/sql"

	repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/status-tree"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type service struct {
	repo repo.StatusTreeRepository
}

type StatusTreeService interface {
	CreateNode(ctx context.Context, taskId int, node gomodels.NodeKeyName, details *string) error
	GetByTaskId(ctx context.Context, taskId int) ([]gomodels.TaskStatusNode, error)
	GetRelationsByTaskId(ctx context.Context, taskId int) ([]gomodels.TaskStatusNodeRelation, error)
	UpdateNodeStatus(ctx context.Context, taskId int, nodeKey gomodels.NodeKeyName, status gomodels.NodeStatus) error

	GetTaskStatusTree(ctx context.Context, taskId int) (gomodels.TaskStatusTree, error)
	GetTaskGroupStatusTree(ctx context.Context, taskIds []int, taskGroup gomodels.TaskGroup) (gomodels.TaskStatusTree, error)

	CreateTreeForText(ctx context.Context, taskId int) error
	CreateTreeForImage(ctx context.Context, taskId int) error
	CreateTreeForAudio(ctx context.Context, taskId int) error
	CreateTreeForVideo(ctx context.Context, taskId int) error
}

func NewStatusTreeService(repo repo.StatusTreeRepository) StatusTreeService {
	return &service{repo: repo}
}

func (s *service) CreateNode(ctx context.Context, taskId int, node gomodels.NodeKeyName, details *string) error {
	var nullString sql.NullString
	if details != nil {
		nullString = sql.NullString{String: *details, Valid: true}
	}

	treeNode := gomodels.TaskStatusNode{
		TaskId:  taskId,
		NodeKey: node,
		Details: nullString,
	}

	return s.repo.CreateNode(ctx, treeNode)
}

func (s *service) GetByTaskId(ctx context.Context, taskId int) ([]gomodels.TaskStatusNode, error) {
	return s.repo.GetByTaskId(ctx, taskId)
}

func (s *service) GetRelationsByTaskId(ctx context.Context, taskId int) ([]gomodels.TaskStatusNodeRelation, error) {
	return s.repo.GetRelationsByTaskId(ctx, taskId)
}

func (s *service) UpdateNodeStatus(ctx context.Context, taskId int, nodeKey gomodels.NodeKeyName, status gomodels.NodeStatus) error {
	return s.repo.UpdateNodeStatus(ctx, taskId, nodeKey, status)
}

func (s *service) GetTaskStatusTree(ctx context.Context, taskId int) (gomodels.TaskStatusTree, error) {
	nodes, err := s.repo.GetByTaskId(ctx, taskId)
	if err != nil {
		return gomodels.TaskStatusTree{}, err
	}

	relations, err := s.repo.GetRelationsByTaskId(ctx, taskId)
	if err != nil {
		return gomodels.TaskStatusTree{}, err
	}

	nodesMap := make(map[string]gomodels.TaskStatusNode)
	for _, node := range nodes {
		nodesMap[string(node.NodeKey)] = node
	}

	childrenMap := make(map[string][]string)
	for _, relation := range relations {
		childrenMap[relation.ParentKey] = append(childrenMap[relation.ParentKey], relation.ChildKey)
	}

	tree := buildTreeNode(string(gomodels.NodeKeyNameRoot), nodesMap, childrenMap)
	return tree, nil
}

func (s *service) GetTaskGroupStatusTree(ctx context.Context, taskIds []int, taskGroup gomodels.TaskGroup) (gomodels.TaskStatusTree, error) {
	treeTail := gomodels.TaskStatusTree{
		Name:      gomodels.NodeKeyNameSendingResult,
		Status:    gomodels.NodeStatus(taskGroup.Status),
		CreatedAt: taskGroup.CreatedAt,
		UpdatedAt: taskGroup.UpdatedAt,
	}

	trees := make([]gomodels.TaskStatusTree, 0, len(taskIds))
	for _, taskId := range taskIds {
		tree, err := s.GetTaskStatusTree(ctx, taskId)
		if err != nil {
			return gomodels.TaskStatusTree{}, err
		}
		tree.Children = append(tree.Children, treeTail)
		trees = append(trees, tree)
	}

	root := gomodels.TaskStatusTree{
		Name:      "TaskGroup",
		Details:   nil,
		Status:    gomodels.NodeStatus(taskGroup.Status),
		CreatedAt: taskGroup.CreatedAt,
		UpdatedAt: taskGroup.UpdatedAt,
		Children:  trees,
	}

	return root, nil
}

func buildTreeNode(nodeKey string, nodesMap map[string]gomodels.TaskStatusNode, childrenMap map[string][]string) gomodels.TaskStatusTree {
	node := nodesMap[nodeKey]

	tree := gomodels.TaskStatusTree{
		Name:      node.NodeKey,
		Status:    node.Status,
		CreatedAt: node.CreatedAt,
		UpdatedAt: node.UpdatedAt,
	}

	if node.Details.Valid {
		details := node.Details.String
		tree.Details = &details
	}

	if children, exists := childrenMap[nodeKey]; exists {
		tree.Children = make([]gomodels.TaskStatusTree, 0, len(children))
		for _, childKey := range children {
			childTree := buildTreeNode(childKey, nodesMap, childrenMap)
			tree.Children = append(tree.Children, childTree)
		}
	}

	return tree
}

//TODO: add implementation for CreateTreeForText, CreateTreeForImage, CreateTreeForAudio, and CreateTreeForVideo

func (s *service) CreateTreeForText(ctx context.Context, taskId int) error {

	return nil
}

func (s *service) CreateTreeForImage(ctx context.Context, taskId int) error {
	return nil
}

func (s *service) CreateTreeForAudio(ctx context.Context, taskId int) error {
	return nil
}

func (s *service) CreateTreeForVideo(ctx context.Context, taskId int) error {
	return nil
}
