package gomodels

type Role struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Permission struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type RolePermission struct {
	RoleId       int `json:"role_id"`
	PermissionId int `json:"permission_id"`
}

type UserRole struct {
	UserId int `json:"user_id"`
	RoleId int `json:"role_id"`
}
