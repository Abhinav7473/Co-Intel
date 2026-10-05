import uuid
from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from app.core.security import Slug

Pct = Annotated[int, Field(ge=0, le=100)]


class AssessmentCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    answers: Annotated[dict[Slug, Annotated[int, Field(ge=0, le=9)]], Field(max_length=100)]
    scores: Annotated[dict[Slug, Pct], Field(max_length=30)]
    overall: Pct


class AssessmentOut(AssessmentCreate):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    created_at: datetime
