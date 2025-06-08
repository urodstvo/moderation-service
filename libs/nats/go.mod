module github.com/urodstvo/moderation-service/libs/nats

go 1.24.2

require (
	github.com/nats-io/nats-server/v2 v2.11.4
	github.com/nats-io/nats.go v1.42.0
	github.com/stretchr/testify v1.10.0
	github.com/urodstvo/moderation-service/libs/config v0.0.0-00010101000000-000000000000
)

replace github.com/urodstvo/moderation-service/libs/config => ../config

require (
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/google/go-tpm v0.9.5 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/kelseyhightower/envconfig v1.4.0 // indirect
	github.com/klauspost/compress v1.18.0 // indirect
	github.com/minio/highwayhash v1.0.3 // indirect
	github.com/nats-io/jwt/v2 v2.7.4 // indirect
	github.com/nats-io/nkeys v0.4.11 // indirect
	github.com/nats-io/nuid v1.0.1 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	golang.org/x/crypto v0.38.0 // indirect
	golang.org/x/sys v0.33.0 // indirect
	golang.org/x/time v0.11.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)
