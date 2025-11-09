package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	DatabaseUrl string `required:"true"                            envconfig:"POSTGRES_URL"`
	AppEnv      string `required:"true"  default:"development"     envconfig:"APP_ENV"`

	S3PublicUrl   string `required:"false" envconfig:"CDN_PUBLIC_URL"`
	S3Host        string `required:"false" envconfig:"CDN_HOST"`
	S3Bucket      string `required:"false" envconfig:"CDN_BUCKET"`
	S3Region      string `required:"false" envconfig:"CDN_REGION"`
	S3AccessToken string `required:"false" envconfig:"CDN_ACCESS_TOKEN"`
	S3SecretToken string `required:"false" envconfig:"CDN_SECRET_TOKEN"`

	NatsUrl string `required:"false" default:"localhost:4222" envconfig:"NATS_URL"`

	JWTSecret string `required:"false" default:"jwt-secret" envconfig:"JWT_SECRET"`

	// Temporal configuration
	TemporalHost string `required:"false" default:"localhost" envconfig:"TEMPORAL_HOST"`
	TemporalPort int    `required:"false" default:"7233" envconfig:"TEMPORAL_PORT"`

	// Server configuration
	Port int `required:"false" default:"8000" envconfig:"PORT"`
}
func NewWithEnvPath(envPath string) (*Config, error) {
	if envPath != "" {
		fmt.Println("Loading .env from:", envPath)
		if err := godotenv.Overload(envPath); err != nil {
			return nil, fmt.Errorf("godotenv overload %s: %w", envPath, err)
		}
	} else {
		fmt.Println("No .env file found – using system environment only")
	}

	var cfg Config
	if err := envconfig.Process("", &cfg); err != nil {
		return nil, fmt.Errorf("envconfig process: %w", err)
	}

	return &cfg, nil
}

func New() (*Config, error) {
	wd, err := os.Getwd()
	if err != nil {
		return nil, err
	}

	// Специфика проекта: если мы внутри /workspace/* → считаем корень /workspace
	if strings.HasPrefix(wd, "/workspace") {
		wd = "/workspace"
	}

	dir := wd
	for {
		envPath := filepath.Join(dir, ".env")
		if _, err := os.Stat(envPath); err == nil {
			return NewWithEnvPath(envPath)
		}

		parent := filepath.Dir(dir)
		if parent == dir { // корень файловой системы
			break
		}
		dir = parent
	}

	// .env не найден → работаем без него
	return NewWithEnvPath("")
}

func NewFx() Config {
	config, err := New()
	if err != nil {
		panic(err)
	}

	return *config
}

func NewFxWithPath(path string) Config {
	config, err := NewWithEnvPath(path)
	if err != nil {
		panic(err)
	}

	return *config
}
