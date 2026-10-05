import uuid

from sqlalchemy import CheckConstraint, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base, Timestamped


class Assessment(Timestamped, Base):
    """One run of the guided self-assessment: raw answers and the per-topic scores."""

    __tablename__ = "assessments"
    __table_args__ = (CheckConstraint("overall BETWEEN 0 AND 100", name="overall_pct"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid7)
    overall: Mapped[int] = mapped_column(Integer)
    answers: Mapped[dict[str, int]] = mapped_column(JSONB)
    scores: Mapped[dict[str, int]] = mapped_column(JSONB)
