# backend/init_db.py
from sqlmodel import SQLModel, create_engine
from models import Task
from config import settings

def init_db():
    """Initialize the database and create tables."""
    try:
        # Create the database engine
        connection_string = str(settings.database_url)

        # For Neon, we need to ensure proper connection format
        # Replace postgresql with postgresql+asyncpg for SQLAlchemy
        if connection_string.startswith("postgresql://"):
            connection_string = connection_string.replace("postgresql://", "postgresql+asyncpg://", 1)

        # Create engine with proper connection parameters for Neon
        engine = create_engine(
            connection_string,
            echo=(settings.environment == "development"),
            pool_pre_ping=True,      # Verify connections before use
            pool_recycle=300,        # Recycle connections every 5 minutes
        )

        # Create all tables
        SQLModel.metadata.create_all(engine)
        print("Database tables created successfully!")

    except Exception as e:
        print(f"Error creating database tables: {e}")
        print("Make sure your database URL is correct and the database is accessible.")
        print("Check your Neon database settings and ensure the connection parameters are correct.")

if __name__ == "__main__":
    init_db()