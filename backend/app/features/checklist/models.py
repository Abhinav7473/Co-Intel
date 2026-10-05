from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base, Timestamped


class ChecklistItem(Timestamped, Base):
    """Done-state of one guardrail from the brief's checklist (§6)."""

    __tablename__ = "checklist_items"

    key: Mapped[str] = mapped_column(String(64), primary_key=True)
    done: Mapped[bool] = mapped_column(Boolean, default=False)
