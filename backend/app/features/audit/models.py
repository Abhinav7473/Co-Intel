import uuid

from sqlalchemy import String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base, Timestamped


class AuditResponse(Timestamped, Base):
    """One anonymous answer to "which of these did you do this month?" (§9)."""

    __tablename__ = "audit_responses"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid7)
    mistakes: Mapped[list[str]] = mapped_column(ARRAY(String(64)))
