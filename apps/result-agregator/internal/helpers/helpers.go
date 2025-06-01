package helpers

import (
	"net/url"
	"strings"
)

func ExtractFilenameFromURL(fileURL string) string {
	parsedURL, err := url.Parse(fileURL)
	if err != nil {
		// Если ошибка парсинга, можно вернуть пустую строку или ошибку
		return ""
	}

	// Разбиваем путь по символу '/'
	pathParts := strings.Split(parsedURL.Path, "/")

	// Возвращаем последний элемент массива, который и будет именем файла
	return pathParts[len(pathParts)-1]
}
