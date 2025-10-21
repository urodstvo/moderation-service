package signals

import (
	"encoding/json"
)

// DecodeCreateNode decodes a dynamic payload into CreateNodeSignal.
func DecodeCreateNode(payload map[string]interface{}) (CreateNodeSignal, error) {
	b, err := json.Marshal(payload)
	if err != nil {
		return CreateNodeSignal{}, err
	}
	var sig CreateNodeSignal
	if err := json.Unmarshal(b, &sig); err != nil {
		return CreateNodeSignal{}, err
	}
	return sig, nil
}

// DecodeUpdateNode decodes a dynamic payload into UpdateNodeSignal.
func DecodeUpdateNode(payload map[string]interface{}) (UpdateNodeSignal, error) {
	b, err := json.Marshal(payload)
	if err != nil {
		return UpdateNodeSignal{}, err
	}
	var sig UpdateNodeSignal
	if err := json.Unmarshal(b, &sig); err != nil {
		return UpdateNodeSignal{}, err
	}
	return sig, nil
}
