package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/urodstvo/moderation-service/cli/codegen"
)

func main() {
	rootCmd := &cobra.Command{
		Use:   "cli",
		Short: "CLI for project management",
	}
	codegenCmd := &cobra.Command{
		Use:   "codegen",
		Short: "Run code generation commands",
	}
	codegenCmd.AddCommand(codegen.NewPermissionsCmd())
	codegenCmd.AddCommand(codegen.NewGrpcCmd())
	rootCmd.AddCommand(codegenCmd)
	rootCmd.AddCommand(NewPrepareCmd())

	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
