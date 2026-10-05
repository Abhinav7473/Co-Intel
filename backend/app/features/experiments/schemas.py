import uuid
from datetime import datetime
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, StringConstraints

from app.core.security import Slug

Label = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=60)]


class ExperimentCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]
    template: Slug
    hypothesis: Annotated[str, StringConstraints(strip_whitespace=True, max_length=2000)] = ""
    variant_a: Label
    variant_b: Label


class RunCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    variant: Literal["A", "B"]
    tokens: Annotated[int, Field(ge=0, le=10_000_000)] | None = None
    cost: Annotated[float, Field(ge=0, le=10_000)] | None = None
    minutes: Annotated[float, Field(ge=0, le=10_000)] | None = None
    corrections: Annotated[int, Field(ge=0, le=1000)] | None = None
    quality: Annotated[int, Field(ge=1, le=5)] | None = None
    note: Annotated[str, StringConstraints(strip_whitespace=True, max_length=2000)] = ""


class RunOut(RunCreate):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    created_at: datetime


class ExperimentSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    title: str
    template: str
    variant_a: str
    variant_b: str
    created_at: datetime
    run_count: int = 0


class ExperimentOut(ExperimentCreate):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    created_at: datetime
    runs: list[RunOut]
