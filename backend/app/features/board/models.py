from sqlalchemy import CheckConstraint, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base, Timestamped


class BoardPin(Timestamped, Base):
    """A tool placed on the control-flow vs memory-ownership board (brief §1)."""

    __tablename__ = "board_pins"
    __table_args__ = (
        CheckConstraint("control BETWEEN 0 AND 1", name="control_unit"),
        CheckConstraint("memory BETWEEN 0 AND 1", name="memory_unit"),
    )

    key: Mapped[str] = mapped_column(String(64), primary_key=True)
    label: Mapped[str] = mapped_column(String(48))
    # 0 = the human owns it, 1 = the model / system owns it
    control: Mapped[float] = mapped_column(Float)
    memory: Mapped[float] = mapped_column(Float)
