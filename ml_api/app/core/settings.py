from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "fastapi-ml-api"
    app_version: str = "1.0.0"
    model_name: str = "credit-risk-baseline"
    model_version: str = "1.0.0"
    risk_threshold: float = Field(default=0.5, ge=0.0, le=1.0)

    model_config = SettingsConfigDict(env_prefix="ML_API_", env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
