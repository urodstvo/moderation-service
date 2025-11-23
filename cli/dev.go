package main

import (
	"bufio"
	"context"
	"fmt"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"syscall"

	"github.com/spf13/cobra"
)

var projectRoot string

var devCmd = &cobra.Command{
	Use:   "dev",
	Short: "Run all services and workers concurrently",
	Run:   runDev,
}

func init() {
	rootCmd.AddCommand(devCmd)
}

func runDev(cmd *cobra.Command, args []string) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Create a WaitGroup to manage goroutines
	var wg sync.WaitGroup

	// Define services and workers to run
	// Use absolute path to project root
	rootDir := "Z:/Programming/Projects/moderation-service"
	// expose project root for execCommand to use
	projectRoot = rootDir

	services := []struct {
		name    string
		command string
		dir     string
	}{
		{"auth", "go run cmd/main.go", filepath.Join(rootDir, "apps", "auth")},
		{"task", "go run cmd/main.go", filepath.Join(rootDir, "apps", "task")},
		{"webhook", "go run cmd/main.go", filepath.Join(rootDir, "apps", "webhook")},
		{"text-worker", "poetry install; poetry run python main.py", filepath.Join(rootDir, "apps", "workers", "text")},
		{"image-worker", "poetry install; poetry run python main.py", filepath.Join(rootDir, "apps", "workers", "image")},
		{"video-worker", "poetry install; poetry run python main.py", filepath.Join(rootDir, "apps", "workers", "video")},
		{"audio-worker", "poetry install; poetry run python main.py", filepath.Join(rootDir, "apps", "workers", "audio")},
	}

	// Start each service in a goroutine
	for _, svc := range services {
		wg.Add(1)
		go func(s struct {
			name    string
			command string
			dir     string
		}) {
			defer wg.Done()
			cmd := execCommand(ctx, s.command, s.dir)
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr

			fmt.Printf("Starting %s...\n", s.name)
			if err := cmd.Run(); err != nil && ctx.Err() == nil {
				fmt.Printf("Error running %s: %v\n", s.name, err)
			}
		}(svc)
	}

	// Handle graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	fmt.Println("\nShutting down all services...")
	cancel()
	wg.Wait()
	fmt.Println("All services stopped")
}

func execCommand(ctx context.Context, command string, dir string) *exec.Cmd {
	var cmd *exec.Cmd

	if runtime.GOOS == "windows" {
		cmd = exec.CommandContext(ctx, "powershell.exe", "-Command", command)
	} else {
		cmd = exec.CommandContext(ctx, "bash", "-c", command)
	}

	// Prepare environment: inherit parent env, then load root .env and local.env (if present)
	env := os.Environ()

	// load root .env so child processes get common variables (POSTGRES_URL, etc.)
	rootEnvPath := filepath.Join(projectRoot, ".env")
	if froot, err := os.Open(rootEnvPath); err == nil {
		scannerRoot := bufio.NewScanner(froot)
		for scannerRoot.Scan() {
			line := strings.TrimSpace(scannerRoot.Text())
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			if idx := strings.Index(line, "="); idx > 0 {
				k := strings.TrimSpace(line[:idx])
				v := strings.TrimSpace(line[idx+1:])
				if hash := strings.Index(v, "#"); hash >= 0 {
					v = strings.TrimSpace(v[:hash])
				}
				env = append(env, k+"="+v)
			}
		}
		froot.Close()
	}

	localEnvPath := filepath.Join(dir, "local.env")
	if f, err := os.Open(localEnvPath); err == nil {
		scanner := bufio.NewScanner(f)
		for scanner.Scan() {
			line := strings.TrimSpace(scanner.Text())
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			if idx := strings.Index(line, "="); idx > 0 {
				k := strings.TrimSpace(line[:idx])
				v := strings.TrimSpace(line[idx+1:])
				// strip inline comments after value
				if hash := strings.Index(v, "#"); hash >= 0 {
					v = strings.TrimSpace(v[:hash])
				}
				env = append(env, k+"="+v)
			}
		}
		f.Close()
	}

	// For Python workers, ensure local libs are on PYTHONPATH so local package is used
	if strings.Contains(dir, filepath.Join("apps", "workers")) {
		pythonPath := filepath.Join(projectRoot, "libs", "config-python")
		existing := os.Getenv("PYTHONPATH")
		if existing != "" {
			sep := string(os.PathListSeparator)
			pythonPath = pythonPath + sep + existing
		}
		env = append(env, "PYTHONPATH="+pythonPath)
	}

	// If POSTGRES_URL is present (possibly from root .env or local.env), ensure Python workers get DATABASE_URL too
	// Look up POSTGRES_URL in merged env slice
	funcGet := func(key string) (string, bool) {
		prefix := key + "="
		for _, e := range env {
			if strings.HasPrefix(e, prefix) {
				return e[len(prefix):], true
			}
		}
		return "", false
	}
	if v, ok := funcGet("POSTGRES_URL"); ok {
		// append DATABASE_URL unless already present
		if _, present := funcGet("DATABASE_URL"); !present {
			env = append(env, "DATABASE_URL="+v)
		}
	}

	cmd.Dir = dir
	cmd.Env = env
	return cmd
}
