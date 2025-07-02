package codegen

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/spf13/cobra"
)

func NewGrpcCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "grpc",
		Short: "Generate gRPC stubs or helpers from .proto files",
		RunE: func(cmd *cobra.Command, _ []string) error {
			absPath, err := filepath.Abs("./libs/grpc")
			if err != nil {
				return fmt.Errorf("failed to get absolute path: %w", err)
			}

			var dirsWithProto []string
			err = filepath.Walk(absPath, func(path string, info os.FileInfo, err error) error {
				if err != nil {
					return err
				}
				if info.IsDir() {
					files, err := os.ReadDir(path)
					if err != nil {
						return err
					}
					for _, f := range files {
						if !f.IsDir() && filepath.Ext(f.Name()) == ".proto" {
							dirsWithProto = append(dirsWithProto, path)
							break
						}
					}
				}
				return nil
			})
			if err != nil {
				return fmt.Errorf("error walking the path: %w", err)
			}

			fmt.Printf("Absolute path: %s\n", absPath)
			fmt.Println("Directories with .proto files:")
			for _, dir := range dirsWithProto {
				dirName := filepath.Base(dir)
				command := exec.Command("protoc",
					"--proto_path=./"+dirName,
					"--go_out=./"+dirName,
					"--go-grpc_out=./"+dirName,
					"--go_opt=paths=source_relative",
					"--go-grpc_opt=paths=source_relative",
					fmt.Sprintf("./%s/*.proto", dirName),
				)
				command.Dir = absPath
				command.Stdout = os.Stdout
				command.Stderr = os.Stderr
				if err := command.Run(); err != nil {
					fmt.Printf("Error running protoc in %s: %v\n", dir, err)
				}
				fmt.Println(command)

			}
			return nil
		},
	}
	return cmd
}
