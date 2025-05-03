import psycopg2
from src.config import POSTGRES_URL
from src.logger import logger


class Database:
    def __init__(self):
        try:
            self.conn = psycopg2.connect(POSTGRES_URL)
            self.closed = False
            logger.info("Постоянное подключение к PostgreSQL установлено")
        except Exception as e:
            logger.error("Ошибка при подключении к PostgreSQL: %s", e)
            self.conn = None
            self.closed = True

    def execute_query(self, query: str, params: tuple = None):
        if not self.conn or self.closed:
            logger.error("Нет соединения с базой данных")
            return

        try:
            with self.conn.cursor() as cursor:
                cursor.execute(query, params)
                self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            logger.error("Ошибка при выполнении запроса: %s", e)

    def fetch_query(self, query: str, params: tuple = None):
        if not self.conn or self.closed:
            logger.error("Нет соединения с базой данных")
            return

        try:
            with self.conn.cursor() as cursor:
                cursor.execute(query, params)
                result = cursor.fetchall()
                return result
        except Exception as e:
            self.conn.rollback()
            logger.error("Ошибка при получении данных: %s", e)
            return None

    def close_connection(self):
        if self.conn and not self.closed:
            self.conn.close()
            self.closed = True
            logger.info("Соединение с базой данных закрыто")

database = Database()