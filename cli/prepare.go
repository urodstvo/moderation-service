package main

import (
	"github.com/spf13/cobra"
	"github.com/urodstvo/moderation-service/cli/codegen"
)

func NewPrepareCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "prepare",
		Short: "Run all codegeneration tasks",
		RunE: func(cmd *cobra.Command, _ []string) error {
			permOut := "./apps/auth/internal/permissions/permissions_gen.go"
			permCmd := codegen.NewPermissionsCmd()
			permCmd.SetArgs([]string{permOut})
			if err := permCmd.Execute(); err != nil {
				return err
			}

			permOut = "./apps/task/internal/permissions/permissions_gen.go"
			permCmd = codegen.NewPermissionsCmd()
			permCmd.SetArgs([]string{permOut})
			if err := permCmd.Execute(); err != nil {
				return err
			}

			grpcCmd := codegen.NewGrpcCmd()
			grpcCmd.SetArgs([]string{})
			if err := grpcCmd.Execute(); err != nil {
				return err
			}

			return nil
		},
	}

	return cmd
}
