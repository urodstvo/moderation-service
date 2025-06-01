module github.com/urodstvo/moderation-service/libs/nats

go 1.23.2

require (
	github.com/nats-io/nats.go v1.39.1
	github.com/urodstvo/moderation-service/libs/config v0.0.0-00010101000000-000000000000
)

replace github.com/urodstvo/moderation-service/libs/config => ../config

require (
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/kelseyhightower/envconfig v1.4.0 // indirect
	github.com/klauspost/compress v1.18.0 // indirect
	github.com/nats-io/nkeys v0.4.9 // indirect
	github.com/nats-io/nuid v1.0.1 // indirect
	golang.org/x/crypto v0.36.0 // indirect
	golang.org/x/sys v0.31.0 // indirect
)
