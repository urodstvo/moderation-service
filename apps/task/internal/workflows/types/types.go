package types

import (
	"encoding/json"
	"time"

	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type FileTypeParams struct {
	Id               int    `json:"id"`
	OriginalFilename string `json:"original_filename"`
	Filename         string `json:"filename"`
}

type WorkflowParams struct {
	Files struct {
		Images []FileTypeParams
		Videos []FileTypeParams
		Audios []FileTypeParams
		Texts  []FileTypeParams
	}
	RequestId int  `json:"request_id"`
	UserId    int  `json:"user_id"`
	IsAsync   bool `json:"is_async"`
}

type WorkflowResult struct {
	RequestId  int `json:"request_id"`
	Status     gomodels.Status
	CreatedAt  time.Time            `json:"created_at"`
	UpdatedAt  time.Time            `json:"updated_at"`
	TotalFiles int                  `json:"total_files"`
	Files      []WorkflowResultFile `json:"files"`
}

type WorkflowResultFile struct {
	FileId             int                  `json:"file_id"`
	Filename           string               `json:"filename"` //original
	ContentType        gomodels.ContentType `json:"content_type"`
	RecognizedText     *string              `json:"recognized_text"`
	Classification     Classification       `json:"classification"`
	NsfwClassification *NsfwClassification  `json:"nsfw_classification,omitempty"`
	Words              []DeletedWord        `json:"words,omitempty"`
}

type NsfwClassification struct {
	Score  float64 `json:"score"`
	IsNsfw bool    `json:"is_nsfw"`
	Model  string  `json:"model"`
}

type DeletedWord struct {
	Word  string  `json:"word"`
	Score float64 `json:"score"`
	Start int     `json:"start"`
	End   int     `json:"end"`
	Label string  `json:"label"`
}

type TextResultItem struct {
	Id                 int                 `json:"id"`
	OriginalFilename   string              `json:"original_filename"`
	Filename           string              `json:"filename"`
	RecognizedText     string              `json:"recognized_text"`
	Classification     Classification      `json:"classification"`
	NsfwClassification *NsfwClassification `json:"nsfw_classification,omitempty"`
	Words              []DeletedWord       `json:"words,omitempty"`
}

type Classification struct {
	Toxicity       float64 `json:"toxicity"`
	SevereToxicity float64 `json:"severe_toxicity"`
	Obscene        float64 `json:"obscene"`
	Threat         float64 `json:"threat"`
	Insult         float64 `json:"insult"`
	IdentityAttack float64 `json:"identity_attack"`
}

type ResultItem struct {
	Id                 int                 `json:"id"`
	OriginalFilename   string              `json:"original_filename"`
	Filename           string              `json:"filename"`
	RecognizedText     string              `json:"recognized_text"`
	NsfwClassification *NsfwClassification `json:"nsfw_classification,omitempty"`
}

type ActivityStatus struct {
	ParentNodeID int             `json:"parent_node_id"`
	NodeID       int             `json:"node_id"`
	Status       gomodels.Status `json:"status"`
	Title        string          `json:"title"`
	Details      json.RawMessage `json:"details,omitempty"`
	ErrorMessage *string         `json:"error_message,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type WorkflowState struct {
	WorkflowID string                          `json:"workflow_id"`
	Status     gomodels.Status                 `json:"status"`
	Activities map[int]map[int]*ActivityStatus `json:"activities"` // ParentNodeID -> NodeID -> ActivityStatus
	Error      *string                         `json:"error,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
