import { useRef, useState } from "react";
import { CodeEditor } from "../components/code-editor";
import { BACKEND_HOST } from "../config";
import { useAnalysisContext } from "../provider";

const code = `const moderate = async (files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("file", files[i]);
  }

  const response = await fetch('${BACKEND_HOST}/api/v2/moderation', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer test-api-token',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Ошибка при отправке запроса.');
  }

  const data = await response.json();
};`;

export const DemoSection = () => {
  const context = useAnalysisContext();
  const [files, setFiles] = useState<FileList | null>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async () => {
    if (!files || files.length === 0) return;

    context.setIsLoading(true);
    context.setError(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    const response = await fetch(`${BACKEND_HOST}/api/v2/moderation`, {
      method: "POST",
      headers: {
        Authorization: "Bearer test-api-token",
      },
      body: formData,
    });

    if (!response.ok) {
      context.setError(response.statusText);
    }

    setFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    context.setIsLoading(false);
  };

  return (
    <section>
      <h3>Демонстрация запроса</h3>
      <p>Эта секция является интерфейсом для для отправки запроса на анализ контента.</p>
      <p>Форма отправки состоит всего из одного поля файл. Можно загружать как один файл, так и несколько.</p>
      <p>Ограничение отправки 100Мб.</p>
      <p>Ниже представлен пример кода на JavaScript запроса на интеллектуальный анализ.</p>
      <div>
        <CodeEditor code={code} disabled />
      </div>
      <p>
        В качестве ответа пользователь получает <strong>group_id</strong> (номер группы задач).
      </p>
      <p>
        С помощью формы ниже можно опробовать функционал сервиса. Загрузите непустой(-ые) файлы для корректной работы.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="form-row">
          <label htmlFor="file-input">Файл(ы):</label>
          <input
            ref={fileInputRef}
            id="file-input"
            type="file"
            multiple
            accept="image/png,image/jpg,image/jpeg,image/gif,image/bmp,video/mp4,video/avi,video/mov,video/wmv,audio/mp3,audio/wav,audio/ogg,text/markdown,text/plain,application/json,text/csv"
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>
        <div className="form-row">
          <button disabled={context.isLoading || files?.length === 0}>
            {context.isLoading ? "Отправка запроса" : "Отправить запрос"}
          </button>
        </div>
      </form>
    </section>
  );
};
