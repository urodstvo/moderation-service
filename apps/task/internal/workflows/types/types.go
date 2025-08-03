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
	Classification any                  `json:"classification"`
}

type TextResultItem struct {
	Id               int
	OriginalFilename string
	Filename         string
	RecognizedText   string
	ContentType      gomodels.ContentType
	Classification   string
}

type ResultItem struct {
	Id               int
	OriginalFilename string
	Filename         string
	RecognizedText   string
	ContentType      gomodels.ContentType
}
