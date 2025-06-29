export const Footer = () => {
  return (
    <footer>
      <p>© {new Date().getFullYear()} Moderation Service Demo.</p>
      <p>
        Создал{" "}
        <a href="://github.com/urodstvo" target="_blank" rel="noopener noreferrer">
          Зубцов Андрей
        </a>
        . Исходный код доступен на{" "}
        <a href="://github.com/urodstvo/moderation-service" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>
    </footer>
  );
};
