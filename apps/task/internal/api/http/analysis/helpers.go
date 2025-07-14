package analysis

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"mime/multipart"
	"path/filepath"
	"strings"
	"time"

	"github.com/gabriel-vasile/mimetype"
	"github.com/minio/minio-go/v7"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (h *handler) uploadToMinio(ctx context.Context, file multipart.File, size int64, filename string) error {
	if size <= 0 {
		return fmt.Errorf("invalid file size")
	}
	_, err := h.Minio.PutObject(ctx, h.Config.S3Bucket, filename, file, size, minio.PutObjectOptions{
		Expires: time.Now().Add(time.Hour * 24),
	})
	if err != nil {
		return err
	}

	return nil
}

func detectFileType(filename string) (gomodels.ContentType, error) {
	mime, err := mimetype.DetectFile(filename)
	if err != nil {
		return "", fmt.Errorf("failed to detect file type: %w", err)
	}
	parts := strings.SplitN(mime.String(), "/", 2)
	if len(parts) > 0 {
		return gomodels.ContentType(parts[0]), nil
	}
	return "", fmt.Errorf("failed to detect file type: %w", err)
}

func generateUniqueFileName(originalName string) string {
	ext := filepath.Ext(originalName)
	randomBytes := make([]byte, 8)
	rand.Read(randomBytes)
	randomString := hex.EncodeToString(randomBytes)
	return randomString + ext
}
