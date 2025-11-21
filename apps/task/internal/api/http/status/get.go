package status

import (
	"context"
	"database/sql"
	"strconv"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/types"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type getStatusRequest struct {
	RequestId string `path:"requestId"`
}

type getStatusResponse struct {
	Body gomodels.StatusTree `json:"body"`
}

func (h *handler) Get(ctx context.Context, input *getStatusRequest) (*getStatusResponse, error) {
	// tree, err := h.StatusService.GetStatusTree(ctx, input.RequestId)
	resp, err := h.Temporal.QueryWorkflow(ctx, input.RequestId, "", "get_workflow_status")
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get status tree")
	}
	var status types.WorkflowState
	if err := resp.Get(&status); err != nil {
		return nil, huma.Error500InternalServerError("Failed to get status tree")
	}

	tree := ConvertToStatusTree(&status)
	if tree == nil {
		return nil, huma.Error500InternalServerError("Failed to get status tree")
	}

	return &getStatusResponse{Body: *tree}, nil
}

func ConvertToStatusTree(state *types.WorkflowState) *gomodels.StatusTree {
	if state == nil {
		return nil
	}

	// Parse RequestId
	requestID, err := strconv.Atoi(state.WorkflowID)
	if err != nil {
		requestID = 0 // Или обработай иначе
	}

	// Flat all nodes
	allNodes := make(map[int]*types.ActivityStatus)
	for _, nodeMap := range state.Activities {
		for _, act := range nodeMap {
			allNodes[act.NodeID] = act
		}
	}

	// Children map
	childrenMap := make(map[int][]int)
	for parentID, nodeMap := range state.Activities {
		for nodeID := range nodeMap {
			childrenMap[parentID] = append(childrenMap[parentID], nodeID)
		}
	}

	// Root
	root := &gomodels.StatusTree{
		StatusNode: &gomodels.StatusNode{
			Id:        0,
			RequestId: requestID,
			Title:     "Workflow Root",
			Details:   "",
			Status:    state.Status,
			CreatedAt: state.CreatedAt,
			UpdatedAt: state.UpdatedAt,
			DeletedAt: sql.NullTime{},
		},
		Children: []*gomodels.StatusTree{},
	}
	if state.Error != nil {
		root.Details = *state.Error
	}

	// Recursive build
	var buildTree func(parentID int) *gomodels.StatusTree
	buildTree = func(parentID int) *gomodels.StatusTree {
		if parentID == 0 {
			return root
		}
		act, ok := allNodes[parentID]
		if !ok {
			return nil
		}
		detailsStr := string(act.Details)
		if act.ErrorMessage != nil {
			if detailsStr != "" {
				detailsStr += " "
			}
			detailsStr += *act.ErrorMessage
		}
		node := &gomodels.StatusTree{
			StatusNode: &gomodels.StatusNode{
				Id:        act.NodeID,
				RequestId: requestID,
				Title:     act.Title,
				Details:   detailsStr,
				Status:    act.Status,
				CreatedAt: act.CreatedAt,
				UpdatedAt: act.UpdatedAt,
				DeletedAt: sql.NullTime{},
			},
			Children: []*gomodels.StatusTree{},
		}
		if childIDs, ok := childrenMap[act.NodeID]; ok {
			for _, childID := range childIDs {
				child := buildTree(childID)
				if child != nil {
					node.Children = append(node.Children, child)
				}
			}
		}
		return node
	}

	// Root children
	if rootChildIDs, ok := childrenMap[0]; ok {
		for _, childID := range rootChildIDs {
			child := buildTree(childID)
			if child != nil {
				root.Children = append(root.Children, child)
			}
		}
	}

	return root
}
