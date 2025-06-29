import { CodeEditor } from "../components/code-editor";
import { BACKEND_HOST } from "../config";

const code = `const login = async (email, password) => {
  const response = await fetch('${BACKEND_HOST}/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Ошибка авторизации');
  }

  const data = await response.json();
};`;

export const AuthSection = () => {
  return (
    <section>
      <h3>Авторизация</h3>
      <p>
        Этап авторизации сопровождается отправкой запроса с электронной почтой и паролем, для входа или создания личного
        аккаунта.
      </p>
      <p>На этапе авторизации происходит получение токена, необходимого для доступа к сервису.</p>
      <p>Ниже представлен пример кода на JavaScript запроса авторизации.</p>
      <div>
        <CodeEditor code={code} disabled />
      </div>
      <p>
        Мы получаем token, который необходимо использовать в следующих заголовках запросов: "Authorization": "Bearer{" "}
        {`<api-token>`}".
      </p>
      <p>
        В рамках этой страницы используется тестовый пользователь с токеном <strong>test-api-token</strong>.
      </p>
    </section>
  );
};
