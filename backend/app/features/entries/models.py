import uuid

from sqlalchemy import Boolean, CheckConstraint, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base, Timestamped

KINDS = ("note", "finding", "source", "question")


class Entry(Timestamped, Base):
    """Knowledge-base entry attached to a topic. The brief is the seed; these are yours."""

    __tablename__ = "entries"
    __table_args__ = (CheckConstraint(f"kind IN {KINDS}", name="kind_known"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid7)
    topic: Mapped[str] = mapped_column(String(64), index=True)
    kind: Mapped[str] = mapped_column(String(16), default="note")
    title: Mapped[str | None] = mapped_column(String(160))
    body: Mapped[str] = mapped_column(Text)
    url: Mapped[str | None] = mapped_column(String(2048))
    pinned: Mapped[bool] = mapped_column(Boolean, default=False)
