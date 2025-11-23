package status

import (
	"context"
	"fmt"
	"hash/fnv"
	"sort"
	"time"

	"github.com/urodstvo/moderation-service/libs/logger"
	"go.temporal.io/api/enums/v1"
	"go.temporal.io/api/history/v1"
	"go.temporal.io/sdk/client"
)

// Graph представляет граф выполнения workflow
type Graph struct {
	Nodes []*Node `json:"nodes"`
	Edges []*Edge `json:"edges"`
}

// Node представляет узел в графе
type Node struct {
	ID      string     `json:"id"`
	Title   string     `json:"title"`
	Status  string     `json:"status"`
	Start   *time.Time `json:"start,omitempty"`
	End     *time.Time `json:"end,omitempty"`
	Details string     `json:"details,omitempty"`
	Group   string     `json:"group,omitempty"` // Имя workflow, к которому принадлежит активность
}

// Edge представляет связь в графе
type Edge struct {
	From string   `json:"from"`
	To   []string `json:"to"`
}

type GraphBuilder struct {
	RootWorkflowID string
	RootRunID      string
	TemporalClient client.Client
	Logger         logger.Logger
	nodes          map[string]*Node
	edges          []*Edge
	workflowGroups map[string]string // workflowID -> workflowType (для группировки)
}

func NewGraphBuilder(client client.Client, logger logger.Logger) *GraphBuilder {
	return &GraphBuilder{
		TemporalClient: client,
		Logger:         logger,
		nodes:          make(map[string]*Node),
		edges:          make([]*Edge, 0),
		workflowGroups: make(map[string]string),
	}
}

func (b *GraphBuilder) BuildExecutionGraph(ctx context.Context, workflowID, runID string) (*Graph, error) {
	b.RootWorkflowID = workflowID
	b.RootRunID = runID
	b.nodes = make(map[string]*Node)
	b.edges = make([]*Edge, 0)
	b.workflowGroups = make(map[string]string)

	// Получаем основную информацию о workflow
	desc, err := b.TemporalClient.DescribeWorkflowExecution(ctx, workflowID, runID)
	if err != nil {
		return nil, fmt.Errorf("failed to describe workflow: %w", err)
	}

	// Получаем полную историю workflow
	history, err := b.getWorkflowHistory(ctx, workflowID, runID)
	if err != nil {
		return nil, err
	}

	// Регистрируем основную workflow для группировки
	mainWorkflowType := "Main Workflow"
	if desc.WorkflowExecutionInfo.Type != nil {
		mainWorkflowType = desc.WorkflowExecutionInfo.Type.Name
	}
	b.workflowGroups[workflowID] = mainWorkflowType

	// Анализируем историю для построения графа
	err = b.analyzeHistoryAndBuildGraph(ctx, history, workflowID)
	if err != nil {
		return nil, err
	}

	return &Graph{
		Nodes: b.getOrderedNodes(),
		Edges: b.edges,
	}, nil
}

func (b *GraphBuilder) analyzeHistoryAndBuildGraph(ctx context.Context, history *history.History, parentWorkflowID string) error {
	activities := make(map[int64]*ActivityTracking)
	childWorkflows := make(map[string]*ChildWorkflowTracking)

	// Первый проход: собираем базовую информацию
	for _, event := range history.Events {
		b.processEventForTracking(event, activities, childWorkflows)
	}

	// Второй проход: обновляем статусы и времена
	for _, event := range history.Events {
		b.processEventForStatus(event, activities, childWorkflows)
	}

	// Строим граф для активностей текущего workflow
	b.buildActivityGraph(activities, parentWorkflowID)

	// Обрабатываем дочерние workflow
	for _, childWF := range childWorkflows {
		// Регистрируем дочернюю workflow для группировки
		b.workflowGroups[childWF.WorkflowID] = childWF.WorkflowType

		if childWF.RunID != "" {
			childHistory, err := b.getWorkflowHistory(ctx, childWF.WorkflowID, childWF.RunID)
			if err != nil {
				b.Logger.Warn("Failed to get child workflow history", "workflowId", childWF.WorkflowID, "error", err)
				continue
			}
			err = b.analyzeHistoryAndBuildGraph(ctx, childHistory, childWF.WorkflowID)
			if err != nil {
				b.Logger.Warn("Failed to build child workflow graph", "workflowId", childWF.WorkflowID, "error", err)
				continue
			}
		} else {
			// Если RunID неизвестен, создаем базовую активность для представления workflow
			b.createWorkflowPlaceholderActivity(childWF, parentWorkflowID)
		}
	}

	return nil
}

type ActivityTracking struct {
	ActivityID       string
	ActivityType     string
	Status           string
	StartTime        *time.Time
	EndTime          *time.Time
	Error            string
	ScheduledEventId int64
}

type ChildWorkflowTracking struct {
	WorkflowID    string
	RunID         string
	WorkflowType  string
	Status        string
	InitiatedTime *time.Time
	StartTime     *time.Time
	EndTime       *time.Time
}

func (b *GraphBuilder) processEventForTracking(event *history.HistoryEvent, activities map[int64]*ActivityTracking, childWorkflows map[string]*ChildWorkflowTracking) {
	switch event.GetEventType() {
	case enums.EVENT_TYPE_ACTIVITY_TASK_SCHEDULED:
		attrs := event.GetActivityTaskScheduledEventAttributes()
		activities[event.GetEventId()] = &ActivityTracking{
			ActivityID:       attrs.GetActivityId(),
			ActivityType:     attrs.GetActivityType().GetName(),
			Status:           "SCHEDULED",
			ScheduledEventId: event.GetEventId(),
		}

	case enums.EVENT_TYPE_START_CHILD_WORKFLOW_EXECUTION_INITIATED:
		attrs := event.GetStartChildWorkflowExecutionInitiatedEventAttributes()
		time := event.EventTime.AsTime()
		childWorkflows[attrs.GetWorkflowId()] = &ChildWorkflowTracking{
			WorkflowID:    attrs.GetWorkflowId(),
			WorkflowType:  attrs.GetWorkflowType().GetName(),
			Status:        "INITIATED",
			InitiatedTime: &time,
		}
	}
}

func (b *GraphBuilder) processEventForStatus(event *history.HistoryEvent, activities map[int64]*ActivityTracking, childWorkflows map[string]*ChildWorkflowTracking) {
	eventTime := event.GetEventTime().AsTime()

	switch event.GetEventType() {
	// Activity events
	case enums.EVENT_TYPE_ACTIVITY_TASK_STARTED:
		attrs := event.GetActivityTaskStartedEventAttributes()
		if activity, exists := activities[attrs.GetScheduledEventId()]; exists {
			activity.Status = "STARTED"
			activity.StartTime = &eventTime
		}

	case enums.EVENT_TYPE_ACTIVITY_TASK_COMPLETED:
		attrs := event.GetActivityTaskCompletedEventAttributes()
		if activity, exists := activities[attrs.GetScheduledEventId()]; exists {
			activity.Status = "COMPLETED"
			activity.EndTime = &eventTime
		}

	case enums.EVENT_TYPE_ACTIVITY_TASK_FAILED:
		attrs := event.GetActivityTaskFailedEventAttributes()
		if activity, exists := activities[attrs.GetScheduledEventId()]; exists {
			activity.Status = "FAILED"
			activity.EndTime = &eventTime
		}

	// Child workflow events
	case enums.EVENT_TYPE_CHILD_WORKFLOW_EXECUTION_STARTED:
		attrs := event.GetChildWorkflowExecutionStartedEventAttributes()
		workflowID := attrs.GetWorkflowExecution().GetWorkflowId()
		if childWF, exists := childWorkflows[workflowID]; exists {
			childWF.Status = "STARTED"
			childWF.StartTime = &eventTime
			childWF.RunID = attrs.GetWorkflowExecution().GetRunId()
		}

	case enums.EVENT_TYPE_CHILD_WORKFLOW_EXECUTION_COMPLETED:
		attrs := event.GetChildWorkflowExecutionCompletedEventAttributes()
		workflowID := attrs.GetWorkflowExecution().GetWorkflowId()
		if childWF, exists := childWorkflows[workflowID]; exists {
			childWF.Status = "COMPLETED"
			childWF.EndTime = &eventTime
		}

	case enums.EVENT_TYPE_CHILD_WORKFLOW_EXECUTION_FAILED:
		attrs := event.GetChildWorkflowExecutionFailedEventAttributes()
		workflowID := attrs.GetWorkflowExecution().GetWorkflowId()
		if childWF, exists := childWorkflows[workflowID]; exists {
			childWF.Status = "FAILED"
			childWF.EndTime = &eventTime
		}
	}
}

func (b *GraphBuilder) buildActivityGraph(activities map[int64]*ActivityTracking, workflowID string) {
	// Получаем имя группы для workflow
	groupName := b.workflowGroups[workflowID]
	if groupName == "" {
		groupName = workflowID
	}

	// Собираем активности с временами начала/окончания
	var activitiesWithTime []*ActivityTracking
	for _, activity := range activities {
		if activity.StartTime != nil {
			activitiesWithTime = append(activitiesWithTime, activity)
		}
	}

	// Сортируем по времени начала
	sort.Slice(activitiesWithTime, func(i, j int) bool {
		return activitiesWithTime[i].StartTime.Before(*activitiesWithTime[j].StartTime)
	})

	// Создаем узлы для активностей
	activityNodes := make(map[string]string) // activityID -> nodeID
	for _, activity := range activitiesWithTime {
		nodeID := b.createActivityNode(activity, groupName)
		activityNodes[activity.ActivityID] = nodeID
	}

	// Строим связи между активностями на основе временных интервалов
	b.buildActivityEdges(activitiesWithTime, activityNodes)
}

func (b *GraphBuilder) buildActivityEdges(activities []*ActivityTracking, activityNodes map[string]string) {
	if len(activities) < 2 {
		return
	}

	// Группируем активности по параллельным группам
	parallelGroups := b.detectParallelGroups(activities)

	// Строим edges на основе групп
	for i, group := range parallelGroups {
		if i == 0 {
			// Первая группа - начинается от корня
			continue
		}

		previousGroup := parallelGroups[i-1]
		currentGroup := group

		// Находим связи между предыдущей и текущей группой
		b.connectActivityGroups(previousGroup, currentGroup, activityNodes)
	}
}

func (b *GraphBuilder) detectParallelGroups(activities []*ActivityTracking) [][]*ActivityTracking {
	if len(activities) == 0 {
		return nil
	}

	var groups [][]*ActivityTracking
	currentGroup := []*ActivityTracking{activities[0]}

	for i := 1; i < len(activities); i++ {
		currentActivity := activities[i]

		// Проверяем пересечение по времени с любой активностью в группе
		overlaps := false
		for _, groupActivity := range currentGroup {
			if b.activitiesOverlap(groupActivity, currentActivity) {
				overlaps = true
				break
			}
		}

		if overlaps {
			currentGroup = append(currentGroup, currentActivity)
		} else {
			groups = append(groups, currentGroup)
			currentGroup = []*ActivityTracking{currentActivity}
		}
	}

	if len(currentGroup) > 0 {
		groups = append(groups, currentGroup)
	}

	return groups
}

func (b *GraphBuilder) activitiesOverlap(a1, a2 *ActivityTracking) bool {
	if a1.EndTime == nil || a2.StartTime == nil {
		return false
	}
	return a1.StartTime.Before(*a2.EndTime) && a2.StartTime.Before(*a1.EndTime)
}

func (b *GraphBuilder) connectActivityGroups(prevGroup, currGroup []*ActivityTracking, activityNodes map[string]string) {
	if len(prevGroup) == 1 && len(currGroup) == 1 {
		// Простая последовательная связь
		fromNode := activityNodes[prevGroup[0].ActivityID]
		toNode := activityNodes[currGroup[0].ActivityID]
		b.addEdge(fromNode, []string{toNode})
	} else if len(prevGroup) == 1 && len(currGroup) > 1 {
		// От одной активности к нескольким (параллельное выполнение)
		fromNode := activityNodes[prevGroup[0].ActivityID]
		var toNodes []string
		for _, activity := range currGroup {
			toNodes = append(toNodes, activityNodes[activity.ActivityID])
		}
		b.addEdge(fromNode, toNodes)
	} else if len(prevGroup) > 1 && len(currGroup) == 1 {
		// От нескольких активностей к одной (сбор параллельного выполнения)
		var fromNodes []string
		for _, activity := range prevGroup {
			fromNodes = append(fromNodes, activityNodes[activity.ActivityID])
		}
		toNode := activityNodes[currGroup[0].ActivityID]
		// Создаем отдельные edges для каждой связи
		for _, fromNode := range fromNodes {
			b.addEdge(fromNode, []string{toNode})
		}
	} else {
		// От нескольких к нескольким - создаем полный bipartite граф
		var fromNodes []string
		for _, activity := range prevGroup {
			fromNodes = append(fromNodes, activityNodes[activity.ActivityID])
		}
		var toNodes []string
		for _, activity := range currGroup {
			toNodes = append(toNodes, activityNodes[activity.ActivityID])
		}
		// Создаем edges от каждой активности в предыдущей группе к каждой в текущей
		for _, fromNode := range fromNodes {
			b.addEdge(fromNode, toNodes)
		}
	}
}

func (b *GraphBuilder) createActivityNode(activity *ActivityTracking, group string) string {
	nodeID := b.generateActivityNodeID(activity.ActivityID)

	b.nodes[nodeID] = &Node{
		ID:      nodeID,
		Title:   activity.ActivityType,
		Status:  convertActivityStatus(activity.Status),
		Start:   activity.StartTime,
		End:     activity.EndTime,
		Details: activity.ActivityID,
		Group:   group,
	}

	return nodeID
}

func (b *GraphBuilder) createWorkflowPlaceholderActivity(childWF *ChildWorkflowTracking, parentWorkflowID string) {
	groupName := b.workflowGroups[parentWorkflowID]
	if groupName == "" {
		groupName = parentWorkflowID
	}

	nodeID := b.generateActivityNodeID("wf_" + childWF.WorkflowID)

	b.nodes[nodeID] = &Node{
		ID:      nodeID,
		Title:   fmt.Sprintf("Workflow: %s", childWF.WorkflowType),
		Status:  convertChildWorkflowStatus(childWF.Status),
		Start:   childWF.InitiatedTime,
		End:     childWF.EndTime,
		Details: childWF.WorkflowID,
		Group:   groupName,
	}
}

func (b *GraphBuilder) addEdge(from string, to []string) {
	b.edges = append(b.edges, &Edge{
		From: from,
		To:   to,
	})
}

func (b *GraphBuilder) generateActivityNodeID(activityID string) string {
	hash := fnv.New32a()
	hash.Write([]byte(activityID))
	return fmt.Sprintf("act_%d", hash.Sum32())
}

func (b *GraphBuilder) getOrderedNodes() []*Node {
	nodes := make([]*Node, 0, len(b.nodes))
	for _, node := range b.nodes {
		nodes = append(nodes, node)
	}

	// Сортируем узлы для детерминированного вывода
	sort.Slice(nodes, func(i, j int) bool {
		return nodes[i].ID < nodes[j].ID
	})

	return nodes
}

func (b *GraphBuilder) getWorkflowHistory(ctx context.Context, workflowID, runID string) (*history.History, error) {
	iter := b.TemporalClient.GetWorkflowHistory(
		ctx, workflowID, runID, false, enums.HISTORY_EVENT_FILTER_TYPE_ALL_EVENT,
	)

	var events []*history.HistoryEvent
	for iter.HasNext() {
		event, err := iter.Next()
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	return &history.History{Events: events}, nil
}

func convertActivityStatus(status string) string {
	switch status {
	case "SCHEDULED":
		return "created"
	case "STARTED":
		return "processing"
	case "COMPLETED":
		return "completed"
	case "FAILED", "TIMED_OUT":
		return "failed"
	case "CANCELED":
		return "canceled"
	default:
		return "unknown"
	}
}

func convertChildWorkflowStatus(status string) string {
	switch status {
	case "INITIATED":
		return "created"
	case "STARTED":
		return "processing"
	case "COMPLETED":
		return "completed"
	case "FAILED", "TIMED_OUT":
		return "failed"
	case "CANCELED", "TERMINATED":
		return "canceled"
	default:
		return "unknown"
	}
}
