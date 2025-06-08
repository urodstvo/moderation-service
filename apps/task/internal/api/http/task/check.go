// package task_routes

// import (
// 	"context"
// 	"strconv"

// 	"github.com/danielgtaylor/huma/v2"
// )

// type checkRequest struct {
// 	GroupId string `path:"groupId"`
// }

// type checkResponse struct {
// 	Body struct {
// 		GroupId string `json:"group_id"`
// 		Status  string `json:"status"`
// 		Tasks   []struct {
// 			TaskId int    `json:"task_id"`
// 			Status string `json:"status"`
// 		}
// 	}
// }

// func (h *handler) Check(ctx context.Context, input checkRequest) (*checkResponse, error) {
// 	groupId, err := strconv.Atoi(input.GroupId)
// 	if err != nil {
// 		h.Logger.Error(err.Error())
// 		return nil, huma.Error400BadRequest("Invalid group id")
// 	}

// 	group, err := h.TaskGroupService.GetById(ctx, groupId)
// 	if err != nil {
// 		h.Logger.Error(err.Error())
// 		return nil, huma.Error500InternalServerError("Failed to get group status")
// 	}

// 	tasks, err := h.TaskService.GetByGroupId(ctx, groupId)
// 	if err != nil {
// 		h.Logger.Error(err.Error())
// 		return nil, huma.Error500InternalServerError("Failed to get tasks")
// 	}

// 	response := &checkResponse{}
// 	response.Body.GroupId = input.GroupId
// 	response.Body.Status = group.Status

// 	for _, task := range tasks {
// 		response.Body.Tasks = append(response.Body.Tasks, struct {
// 			TaskId int    `json:"task_id"`
// 			Status string `json:"status"`
// 		}{
// 			TaskId: task.Id,
// 			Status: task.Status,
// 		})
// 	}

// 	return response, nil

// }
