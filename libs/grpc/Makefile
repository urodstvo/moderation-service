

generate-proto:
    protoc --proto_path=./auth --go_out=./auth --go-grpc_out=./auth --go_opt=paths=source_relative --go-grpc_opt=paths=source_relative .\auth\*.proto
    protoc --proto_path=./task --go_out=./task --go-grpc_out=./task --go_opt=paths=source_relative --go-grpc_opt=paths=source_relative .\task\*.proto
    protoc --proto_path=./webhook --go_out=./webhook --go-grpc_out=./webhook --go_opt=paths=source_relative --go-grpc_opt=paths=source_relative .\webhook\*.proto