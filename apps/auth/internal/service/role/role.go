package role

import (
	"context"

	repo "github.com/urodstvo/moderation-service/apps/auth/internal/repository/role"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type service struct {
	repo repo.RoleRepository
}

type RoleService interface {
	GetRoleById(ctx context.Context, id int) (gomodels.Role, error)
	GetRoleByName(ctx context.Context, role string) (gomodels.Role, error)
	GetRoleForUser(ctx context.Context, userId int) (gomodels.Role, error)

	GetPermissionById(ctx context.Context, id int) (gomodels.Permission, error)
	GetPermissionByName(ctx context.Context, permission string) (gomodels.Permission, error)
	GetPermissionsForRole(ctx context.Context, roleId int) ([]gomodels.Permission, error)

	IsUserHavePermission(ctx context.Context, userId int, permission string) (bool, error)
}

func NewRoleService(repo repo.RoleRepository) RoleService {
	return &service{repo: repo}
}

func (s *service) GetRoleById(ctx context.Context, id int) (gomodels.Role, error) {
	return s.repo.GetRoleById(ctx, id)
}

func (s *service) GetRoleByName(ctx context.Context, role string) (gomodels.Role, error) {
	return s.repo.GetRoleByName(ctx, role)
}

func (s *service) GetRoleForUser(ctx context.Context, userId int) (gomodels.Role, error) {
	return s.repo.GetRoleForUser(ctx, userId)
}

func (s *service) GetPermissionById(ctx context.Context, id int) (gomodels.Permission, error) {
	return s.repo.GetPermissionById(ctx, id)
}

func (s *service) GetPermissionByName(ctx context.Context, permission string) (gomodels.Permission, error) {
	return s.repo.GetPermissionByName(ctx, permission)
}

func (s *service) GetPermissionsForRole(ctx context.Context, roleId int) ([]gomodels.Permission, error) {
	return s.repo.GetPermissionsForRole(ctx, roleId)
}

func (s *service) IsUserHavePermission(ctx context.Context, userId int, permission string) (bool, error) {
	role, err := s.GetRoleForUser(ctx, userId)
	if err != nil {
		return false, err
	}

	permissions, err := s.GetPermissionsForRole(ctx, role.Id)
	if err != nil {
		return false, err
	}

	for _, perm := range permissions {
		if perm.Name == permission {
			return true, nil
		}
	}

	return false, nil
}
