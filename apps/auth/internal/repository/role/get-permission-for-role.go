package role

import (
	"context"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetPermissionsForRole(ctx context.Context, roleId int) ([]gomodels.Permission, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("p.id, p.name, p.description").
		From("role_permissions rp").
		Join("permissions p ON rp.permission_id = p.id").
		Where(squirrel.Eq{"role_Id": roleId}).ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build query: %w", err)
	}

	rows, err := conn.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close()

	var t []gomodels.Permission

	for rows.Next() {
		p := gomodels.Permission{}
		err = rows.Scan(&p.Id, &p.Name, &p.Description)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		t = append(t, p)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	return t, nil
}
