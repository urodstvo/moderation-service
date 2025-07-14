package types

type FileTypeParams struct {
	Id       int
	Filename string
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
}
