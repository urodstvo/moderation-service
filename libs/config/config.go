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
}

func NewWithEnvPath(envPath string) (*Config, error) {
	fmt.Println("Loading .env from:", envPath)
	var newCfg Config
	_ = godotenv.Overload(envPath)

	fmt.Println("Postgres URL:", os.Getenv("POSTGRES_URL"))

	if err := envconfig.Process("", &newCfg); err != nil {
		return nil, err
	}

	// fmt.Println(newCfg.DatabaseUrl)
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
	// fmt.Println(envPath)

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
