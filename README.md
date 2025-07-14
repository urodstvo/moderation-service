v. 3.0-alpha

Need To DO

- add websocket for tracking task status (with visualisation process)
- configure yolo for segmentation

  maybe use other models

  - nudenet
  - jaranohaal/vit-base-violence-detection

- test webhooks
-

<!-- what is already done

Auth

- registration
- authentification
- authorization

Task-Agregator

- creating task
- checking status
- adding webhooks

Moderation

Result-Agregator

- agregating results
- sending results

Admin Analytics (Grafana)

- requests in a day, a week
- number of negative content
- top users with negative content -->

TASKS

rework database scheme
rewrite libs/migrations
rewrite libs/nats for jetstream support
rewrite libs/models for new tables
write libs on Python:

[x] config

[x] logger

[x] minio

[x] nats

create libs/grpc
write grpc server initialisation on services
write cli for permission and grpc codegen
write libs/jwt
write apps/auth

<!-- --> write apps/task

update migrations (sync models)

write workers:

[] text

[] audio

[] video

[] image

configure prometheus + grafana

collect dataset for yolo11
train yolo11

collect dataset for span_detector
train span_detector

update configs (docker, etc.)

## Prerequisites

- protoc
- protoc-gen-go-grpc
