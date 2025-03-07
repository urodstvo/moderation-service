package config

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	DatabaseUrl string `required:"true"                                        envconfig:"DATABASE_URL"`
	AppEnv      string `required:"true"  default:"development"                 envconfig:"APP_ENV"`

	S3PublicUrl   string `required:"false" envconfig:"MINIO_PUBLIC_URL"`
	S3Host        string `required:"false" envconfig:"MINIO_HOST"`
	S3Bucket      string `required:"false" envconfig:"MINIO_BUCKET"`
	S3Region      string `required:"false" envconfig:"MINIO_REGION"`
	S3AccessToken string `required:"false" envconfig:"MINIO_ACCESS_TOKEN"`
	S3SecretToken string `required:"false" envconfig:"MINIO_SECRET_TOKEN"`
	NatsUrl       string `required:"false" default:"localhost:4222" envconfig:"NATS_URL"`
}

func NewWithEnvPath(envPath string) (*Config, error) {
	var newCfg Config
	_ = godotenv.Load(envPath)

	if err := envconfig.Process("", &newCfg); err != nil {
		return nil, err
	}

	return &newCfg, nil
}

func New() (*Config, error) {
	wd, err := os.Getwd()
	if err != nil {
		return nil, err
	}

	if strings.HasPrefix(wd, "/workspace") {
		wd = "/workspace"
	} else {
		wd = filepath.Join(wd, "..", "..")
	}

	envPath := filepath.Join(wd, ".env")

	return NewWithEnvPath(envPath)
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
