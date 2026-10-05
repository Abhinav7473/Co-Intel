import uuid

from sqlalchemy import CheckConstraint, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base, Timestamped


class Experiment(Timestamped, Base):
    """An A/B comparison you run on your own workflow (e.g. bloated vs tiered memory)."""

    __tablename__ = "experiments"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid7)
    title: Mapped[str] = mapped_column(String(120))
    template: Mapped[str] = mapped_column(String(64))
    hypothesis: Mapped[str] = mapped_column(Text, default="")
    variant_a: Mapped[str] = mapped_column(String(60))
    variant_b: Mapped[str] = mapped_column(String(60))
    runs: Mapped[list["Run"]] = relationship(  # noqa: UP037 - Run is defined below
        back_populates="experiment",
        cascade="all, delete-orphan",
        order_by="Run.created_at",
        lazy="selectin",
    )


class Run(Timestamped, Base):
    """One measured attempt under variant A or B. Every metric is optional."""

    __tablename__ = "experiment_runs"
    __table_args__ = (
        CheckConstraint("variant IN ('A', 'B')", name="variant_ab"),
        CheckConstraint("quality IS NULL OR quality BETWEEN 1 AND 5", name="quality_1_5"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid7)
    experiment_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("experiments.id", ondelete="CASCADE"), index=True
    )
    variant: Mapped[str] = mapped_column(String(1))
    tokens: Mapped[int | None] = mapped_column(Integer)
    cost: Mapped[float | None] = mapped_column(Float)
    minutes: Mapped[float | None] = mapped_column(Float)
    corrections: Mapped[int | None] = mapped_column(Integer)
    quality: Mapped[int | None] = mapped_column(Integer)
    note: Mapped[str] = mapped_column(Text, default="")
    experiment: Mapped["Experiment"] = relationship(back_populates="runs")  # noqa: UP037
