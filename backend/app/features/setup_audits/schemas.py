import uuid
from datetime import datetime
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, StringConstraints

from app.core.security import Slug

Short = Annotated[str, StringConstraints(strip_whitespace=True, max_length=80)]


class Skill(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: Short
    description: Annotated[str, StringConstraints(max_length=1024)] = ""
    body: Annotated[str, StringConstraints(max_length=50_000)] = ""


class Server(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: Short
    tools: Annotated[int, Field(ge=0, le=500)]
    scope: Literal["global", "project"] = "global"


class Legs(BaseModel):
    model_config = ConfigDict(extra="forbid")
    private: bool = False
    untrusted: bool = False
    outbound: bool = False


class Setup(BaseModel):
    """What the user pasted. The analysis runs in the browser; the server stores it."""

    model_config = ConfigDict(extra="forbid")
    memory: Annotated[str, StringConstraints(max_length=100_000)] = ""
    skills: Annotated[list[Skill], Field(max_length=50)] = []
    servers: Annotated[list[Server], Field(max_length=50)] = []
    legs: Legs = Legs()


class Finding(BaseModel):
    model_config = ConfigDict(extra="forbid")
    rule: Slug
    severity: Literal["good", "info", "warn", "risk"]
    area: Literal["memory", "skills", "servers", "session"]
    title: Annotated[str, StringConstraints(max_length=200)]
    evidence: Annotated[str, StringConstraints(max_length=600)] = ""
    fix: Annotated[str, StringConstraints(max_length=400)] = ""
    topic: Slug


class Budget(BaseModel):
    model_config = ConfigDict(extra="forbid")
    memory: Annotated[int, Field(ge=0)]
    skills: Annotated[int, Field(ge=0)]
    tools: Annotated[int, Field(ge=0)]


class Report(BaseModel):
    model_config = ConfigDict(extra="forbid")
    score: Annotated[int, Field(ge=0, le=100)]
    findings: Annotated[list[Finding], Field(max_length=300)]
    budget: Budget


class AuditCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    label: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=80)]
    setup: Setup
    report: Report


class AuditSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    label: str
    score: int
    created_at: datetime


class AuditOut(AuditSummary):
    setup: Setup
    report: Report
