package activities

type TextItem struct {
	Id       int    `json:"id"`
	Filename string `json:"filename"`
	Text     string `json:"text"`
}

type TextItems []TextItem

func (a *Activity) CombineTexts(input []TextItems) TextItems {
	var result TextItems
	for _, part := range input {
		result = append(result, part...)
	}
	return result
}
