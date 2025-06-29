import { CodeEditor } from "../components/code-editor";
import { BACKEND_HOST } from "../config";

const code = `const register_webhook = async (webhook_url) => {
  const response = await fetch('${BACKEND_HOST}/api/v2/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test-api-token',
    },
    body: JSON.stringify({ webhook_url }),
  });

  if (!response.ok) {
    throw new Error('Ошибка регистрация вебхука');
  }

  const data = await response.json();
};`;

export const WebhookSection = () => {
  return (
    <section>
      <h3>Регистрация вебхука</h3>
      <p>
        Этап регистрации вебхука является обязательным, иначе все последующие запроса будут выполнены, но результат не
        будет получен. Данный этап сопровождается отправкой запроса с API токеном и url webhook'a, для привязки его к
        аккаунту.
      </p>
      <p>Ниже представлен пример кода на JavaScript запроса регистрации вебхука.</p>
      <div>
        <CodeEditor code={code} disabled />
      </div>
      <p>
        В рамках этой страницы используется тестовый сервер с вебхуком, который будет транслировать полученный ответ в
        последний блок страницы.
      </p>
    </section>
  );
};
