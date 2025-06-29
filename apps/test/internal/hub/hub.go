package hub

import (
	"sync"

	"github.com/danielgtaylor/huma/v2/sse"
)

type Client struct {
	ID     string
	Sender sse.Sender
}

type Hub struct {
	mu      sync.Mutex
	clients []Client
}

func New() *Hub {
	return &Hub{}
}

func (h *Hub) AddClient(id string, sender sse.Sender) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.clients = append(h.clients, Client{ID: id, Sender: sender})
}

func (h *Hub) RemoveClient(id string) {
	h.mu.Lock()
	defer h.mu.Unlock()
	for i, c := range h.clients {
		if c.ID == id {
			h.clients = append(h.clients[:i], h.clients[i+1:]...)
			break
		}
	}
}

func (h *Hub) Broadcast(msg any) {
	h.mu.Lock()
	defer h.mu.Unlock()
	for _, c := range h.clients {
		_ = c.Sender.Data(msg)
	}
}
