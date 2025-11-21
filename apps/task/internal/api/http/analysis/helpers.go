package analysis

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
	"path/filepath"
	"strings"
	"time"

	"github.com/gabriel-vasile/mimetype"
	"github.com/minio/minio-go/v7"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (h *handler) uploadToMinioFromBytes(ctx context.Context, data []byte, filename string) error {
	reader := bytes.NewReader(data)
	_, err := h.Minio.PutObject(ctx, h.Config.S3Bucket, filename, reader, int64(len(data)), minio.PutObjectOptions{
		Expires: time.Now().Add(time.Hour * 24),
	})
	return err
}

func detectFileTypeFromReader(reader io.Reader, filenameHint string) (gomodels.ContentType, error) {
	// Сбросим reader, если нужно (для multipart.File)
	if seeker, ok := reader.(io.ReadSeeker); ok {
		seeker.Seek(0, io.SeekStart)
	}

	mime, err := mimetype.DetectReader(reader)
	if err != nil {
		return "", fmt.Errorf("failed to detect MIME type: %w", err)
	}

	// Опционально: используй имя файла как подсказку
	if mime.String() == "application/octet-stream" && filenameHint != "" {
		// Попробуем по расширению
		ext := strings.ToLower(strings.TrimPrefix(filepath.Ext(filenameHint), "."))
		guessed := mimetype.Lookup(ext)
		if guessed != nil {
			mime = guessed
		}
	}

	// Извлекаем основную часть: image, video, audio, text и т.д.
	parts := strings.SplitN(mime.String(), "/", 2)
	if len(parts) == 0 {
		return "", fmt.Errorf("invalid MIME type: %s", mime.String())
	}

	switch parts[0] {
	case "image":
		return gomodels.ContentTypeImage, nil
	case "video":
		return gomodels.ContentTypeVideo, nil
	case "audio":
		return gomodels.ContentTypeAudio, nil
	case "text":
		return gomodels.ContentTypeText, nil
	case "application":
		// Дополнительная логика для PDF, DOCX и т.д.
		if strings.Contains(mime.String(), "pdf") {
			return gomodels.ContentTypeText, nil // или отдельный тип
		}
		if strings.Contains(mime.String(), "msword") || strings.Contains(mime.String(), "officedocument") {
			return gomodels.ContentTypeText, nil
		}
	}

	return "", fmt.Errorf("unsupported content type: %s", parts[0])
}

func generateUniqueFileName(originalName string) string {
	ext := filepath.Ext(originalName)
	randomBytes := make([]byte, 8)
	rand.Read(randomBytes)
	randomString := hex.EncodeToString(randomBytes)
	return randomString + ext
}
