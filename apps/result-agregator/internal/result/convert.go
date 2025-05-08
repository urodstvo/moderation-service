package result

import "errors"

type Input struct {
	PhrasesScore []PhraseScore      `json:"phrases_score"`
	TotalScore   map[string]float64 `json:"total_score"`
}

type PhraseScore struct {
	End         int     `json:"end"`
	EntityGroup string  `json:"entity_group"`
	Score       float64 `json:"score"`
	Start       int     `json:"start"`
	Word        string  `json:"word"`
}

type Output struct {
	TaskID         int                `json:"task_id"`
	ContentType    string             `json:"content_type"`
	RecognizedText string             `json:"recognized_text"`
	Predictions    map[string]float64 `json:"predictions"`
}

func Convert(inputData map[string]any, taskID int, contentType string) (map[string]any, error) {
	phrasesRaw, ok := inputData["phrases_score"]
	if !ok {
		return nil, errors.New("missing 'phrases_score' field")
	}

	phrases, ok := phrasesRaw.([]any)
	if !ok || len(phrases) == 0 {
		return nil, errors.New("'phrases_score' must be a non-empty array")
	}

	firstPhrase, ok := phrases[0].(map[string]any)
	if !ok {
		return nil, errors.New("invalid format of 'phrases_score[0]'")
	}

	word, ok := firstPhrase["word"].(string)
	if !ok {
		return nil, errors.New("missing or invalid 'word' field in first phrase")
	}

	totalScoreRaw, ok := inputData["total_score"]
	if !ok {
		return nil, errors.New("missing 'total_score' field")
	}

	predictions, ok := totalScoreRaw.(map[string]any)
	if !ok {
		return nil, errors.New("'total_score' must be an object")
	}

	result := map[string]any{
		"task_id":         taskID,
		"content_type":    contentType,
		"recognized_text": word,
		"predictions":     predictions,
	}

	return result, nil
}
