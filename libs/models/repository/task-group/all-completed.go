package task_group

import (
	"context"
)

func (r *repository) AreAllTasksCompleted(ctx context.Context, groupId int) (bool, error) {
	// Получаем количество задач в группе
	totalTasks, err := r.CountTasksInGroup(ctx, groupId)
	if err != nil {
		return false, err
	}

	// Получаем количество завершённых задач в группе
	completedTasks, err := r.CountCompletedTasksInGroup(ctx, groupId)
	if err != nil {
		return false, err
	}

	// Если все задачи завершены, возвращаем true
	return totalTasks > 0 && totalTasks == completedTasks, nil
}
