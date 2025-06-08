package role

import (
	"context"

	"github.com/Masterminds/squirrel"
	trmpgx "github.com/avito-tech/go-transaction-manager/drivers/pgxv5/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type repository struct {
	db     *pgxpool.Pool
	getter *trmpgx.CtxGetter
}

type RoleRepository interface {
	GetRoleById(ctx context.Context, id int) (gomodels.Role, error)
	GetRoleByName(ctx context.Context, role string) (gomodels.Role, error)
	GetRoleForUser(ctx context.Context, userId int) (gomodels.Role, error)

	GetPermissionById(ctx context.Context, id int) (gomodels.Permission, error)
	GetPermissionByName(ctx context.Context, permission string) (gomodels.Permission, error)
	GetPermissionsForRole(ctx context.Context, roleId int) ([]gomodels.Permission, error)
}

func NewRoleRepository(db *pgxpool.Pool) RoleRepository {
	return &repository{
		db:     db,
		getter: trmpgx.DefaultCtxGetter,
	}
}

var sq = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)
