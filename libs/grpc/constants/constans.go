package constants

const (
	TASK_SERVER_PORT = 55051 + iota
	WEBHOOK_SERVER_PORT
	AUTH_SERVER_PORT
)

var (
	ServerPorts = []int{
		TASK_SERVER_PORT,
		WEBHOOK_SERVER_PORT,
		AUTH_SERVER_PORT,
	}
)
