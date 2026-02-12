# backend/db.py
from sqlmodel import create_engine, Session
from typing import Generator
from config import settings
import logging

logger = logging.getLogger(__name__)

engine = None

try:
    if not settings.database_url:
        raise ValueError("DATABASE_URL not set")

    connection_string = str(settings.database_url)

    # ❗ IMPORTANT: asyncpg REMOVE
    # SQLModel Session is SYNC
    if connection_string.startswith("postgresql+asyncpg"):
        connection_string = connection_string.replace(
            "postgresql+asyncpg", "postgresql"
        )

    engine = create_engine(
        connection_string,
        pool_pre_ping=True,
        pool_recycle=300,
        echo=False,
    )

    logger.info("Database engine created successfully")

except Exception as e:
    logger.error(f"Database init failed: {e}")
    engine = None


def get_session() -> Generator[Session, None, None]:
    if engine is None:
        raise RuntimeError("Database engine not initialized")

    with Session(engine) as session:
        yield session
