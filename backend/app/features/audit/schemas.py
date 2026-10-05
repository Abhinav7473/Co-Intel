from typing import Annotated

from pydantic import AfterValidator, BaseModel, ConfigDict, Field

from app.core.security import Slug


def _dedupe(keys: list[str]) -> list[str]:
    return list(dict.fromkeys(keys))


class AuditCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    mistakes: Annotated[list[Slug], Field(max_length=20), AfterValidator(_dedupe)]


class AuditSummary(BaseModel):
    responses: int
    counts: dict[str, int]
