import sqlite3
from contextlib import asynccontextmanager, nullcontext
from contextvars import ContextVar
from pathlib import Path

from starlette.concurrency import run_in_threadpool


SCHEMA = """
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,password TEXT NOT NULL,created_at TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'user');
CREATE TABLE IF NOT EXISTS profiles(user_id TEXT PRIMARY KEY REFERENCES users(id),data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),expires BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS devices(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),identifier TEXT NOT NULL,name TEXT NOT NULL,created_at TEXT NOT NULL,UNIQUE(user_id,identifier));
CREATE TABLE IF NOT EXISTS measurements(device_id TEXT NOT NULL REFERENCES devices(id),sample_id TEXT NOT NULL,recorded_at TEXT NOT NULL,steps INTEGER NOT NULL,heart_rate DOUBLE PRECISION,battery DOUBLE PRECISION,PRIMARY KEY(device_id,sample_id));
CREATE INDEX IF NOT EXISTS measurements_time ON measurements(device_id,recorded_at);
CREATE TABLE IF NOT EXISTS monitoring_grants(user_id TEXT NOT NULL REFERENCES users(id), admin_id TEXT NOT NULL REFERENCES users(id), PRIMARY KEY(user_id, admin_id));
CREATE TABLE IF NOT EXISTS live_predictions(user_id TEXT PRIMARY KEY REFERENCES users(id), activity TEXT NOT NULL, confidence DOUBLE PRECISION NOT NULL, device_time BIGINT NOT NULL, received_at TEXT NOT NULL);
"""


class SQLiteDatabase:
    integrity_error = sqlite3.IntegrityError

    def __init__(self, path):
        if path != ':memory:':
            Path(path).resolve().parent.mkdir(parents=True, exist_ok=True)
        self.connection = sqlite3.connect(path, check_same_thread=False)
        self.connection.row_factory = sqlite3.Row
        self.connection.executescript('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;' + SCHEMA)
        columns = self.connection.execute('PRAGMA table_info(users)')
        if 'role' not in {row['name'] for row in columns}:
            self.connection.execute("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'")

    def request(self, use_database):
        return nullcontext()

    def execute(self, statement, parameters=()):
        return self.connection.execute(statement, parameters)

    def transaction(self):
        return self.connection

    def close(self):
        self.connection.close()


class PostgresDatabase:
    def __init__(self, url):
        from psycopg import IntegrityError
        from psycopg.rows import dict_row
        from psycopg_pool import ConnectionPool

        self.integrity_error = IntegrityError
        self.request_connection = ContextVar('postgres_request_connection')
        self.pool = ConnectionPool(
            url, min_size=0, max_size=4, open=True,
            kwargs={'autocommit': True, 'row_factory': dict_row, 'prepare_threshold': None},
            check=ConnectionPool.check_connection,
        )
        try:
            with self.pool.connection() as connection, connection.transaction():
                connection.execute('SELECT pg_advisory_xact_lock(5460385)')
                connection.execute(SCHEMA)
        except Exception:
            self.pool.close()
            raise

    @asynccontextmanager
    async def request(self, use_database):
        if not use_database:
            yield
            return
        connection = await run_in_threadpool(self.pool.getconn)
        token = self.request_connection.set(connection)
        try:
            yield
        finally:
            self.request_connection.reset(token)
            self.pool.putconn(connection)

    def execute(self, statement, parameters=()):
        return self.request_connection.get().execute(statement.replace('?', '%s'), parameters)

    def transaction(self):
        return self.request_connection.get().transaction()

    def close(self):
        self.pool.close()


def open_database(path, url=None):
    return PostgresDatabase(url) if url else SQLiteDatabase(path)
