from functools import lru_cache
from typing import Literal

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """All config comes from the environment (compose passes .env)."""

    model_config = SettingsConfigDict(extra="ignore", frozen=True)

    environment: Literal["dev", "prod"] = "dev"

    postgres_user: str
    postgres_password: SecretStr
    postgres_db: str
    postgres_host: str = "db"
    postgres_port: int = 5432
    # A full URL wins over the parts (Railway injects DATABASE_URL).
    database_url: SecretStr | None = None

    allowed_hosts: list[str] = ["localhost", "127.0.0.1", "api"]

    @property
    def is_dev(self) -> bool:
        return self.environment == "dev"

    @property
    def sqlalchemy_url(self) -> str:
        if self.database_url is not None:
            url = self.database_url.get_secret_value()
            for prefix in ("postgresql://", "postgres://"):
                if url.startswith(prefix):
                    return "postgresql+asyncpg://" + url.removeprefix(prefix)
            return url
        password = self.postgres_password.get_secret_value()
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]  # populated from env
