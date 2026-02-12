# backend/config.py
from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    database_url: Optional[str] = None
    better_auth_secret: Optional[str] = None
    frontend_url: str = "http://localhost:3000"
    environment: str = "development"

    model_config = {"env_file": ".env" if os.path.exists(".env") else None}


settings = Settings()
