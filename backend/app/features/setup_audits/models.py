import uuid
from typing import Any

from sqlalchemy import CheckConstraint, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base, Timestamped


class SetupAudit(Timestamped, Base):
    """A snapshot of someone's AI setup (memory file, skills, servers) and its analysis."""

    __tablename__ = "setup_audits"
    __table_args__ = (CheckConstraint("score BETWEEN 0 AND 100", name="score_pct"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid7)
    label: Mapped[str] = mapped_column(String(80))
    score: Mapped[int] = mapped_column(Integer)
    setup: Mapped[dict[str, Any]] = mapped_column(JSONB)
    report: Mapped[dict[str, Any]] = mapped_column(JSONB)
