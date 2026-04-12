package gomodels

type Settings struct {
	UserId                          int    `json:"user_id"`
	ToxicityClassificationModelName string `json:"toxicity_classification_model_name"`
	NsfwClassificationModelName     string `json:"nsfw_classification_model_name"`
}
