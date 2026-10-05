import uuid
from datetime import datetime
from typing import Annotated, Literal

from pydantic import AnyHttpUrl, BaseModel, ConfigDict, StringConstraints

from app.core.security import Slug

Kind = Literal["note", "finding", "source", "question"]
Body = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=10_000)]
Title = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=160)]


class EntryCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    topic: Slug
    kind: Kind = "note"
    title: Title | None = None
    body: Body
    url: AnyHttpUrl | None = None


class EntryUpdate(BaseModel):
    """Partial update: only the fields sent are changed."""

    model_config = ConfigDict(extra="forbid")
    topic: Slug | None = None
    kind: Kind | None = None
    title: Title | None = None
    body: Body | None = None
    url: AnyHttpUrl | None = None
    pinned: bool | None = None


class EntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    topic: str
    kind: Kind
    title: str | None
    body: str
    url: str | None
    pinned: bool
    created_at: datetime
    updated_at: datetime
