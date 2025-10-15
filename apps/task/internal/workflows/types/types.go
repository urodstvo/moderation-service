package types

import (
	"time"

	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type FileTypeParams struct {
	Id               int
	OriginalFilename string
	Filename         string
}

type WorkflowParams struct {
	Files struct {
		Images []FileTypeParams
		Videos []FileTypeParams
		Audios []FileTypeParams
		Texts  []FileTypeParams
	}
	RequestId int
	UserId    int
	IsAsync   bool
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
	FileId         int                  `json:"file_id"`
	Filename       string               `json:"filename"` //original
	ContentType    gomodels.ContentType `json:"content_type"`
	RecognizedText *string              `json:"recognized_text"`
	Classification Classification       `json:"classification"`
	Words          []DeletedWord        `json:"words,omitempty"`
}

type DeletedWord struct {
	Word  string  `json:"word"`
	Score float64 `json:"score"`
	Start int     `json:"start"`
	End   int     `json:"end"`
	Label string  `json:"label"`
}

type TextResultItem struct {
	Id               int
	OriginalFilename string
	Filename         string
	RecognizedText   string
	ContentType      gomodels.ContentType
	Classification   Classification
	Words            []DeletedWord
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
	Id               int
	OriginalFilename string
	Filename         string
	RecognizedText   string
	ContentType      gomodels.ContentType
}
