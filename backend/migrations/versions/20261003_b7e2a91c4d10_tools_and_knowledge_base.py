"""tools and knowledge base: entries (replacing notes), setup audits, assessments, experiments

Revision ID: b7e2a91c4d10
Revises: 6c41f8f22ad0
Create Date: 2026-10-03 22:00:00
"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "b7e2a91c4d10"
down_revision: str | None = "6c41f8f22ad0"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def _timestamps() -> list[sa.Column]:
    now = sa.text("now()")
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=now, nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=now, nullable=False),
    ]


def upgrade() -> None:
    op.create_table(
        "entries",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("topic", sa.String(length=64), nullable=False),
        sa.Column("kind", sa.String(length=16), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=True),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("url", sa.String(length=2048), nullable=True),
        sa.Column("pinned", sa.Boolean(), nullable=False),
        *_timestamps(),
        sa.CheckConstraint(
            "kind IN ('note', 'finding', 'source', 'question')", name=op.f("ck_entries_kind_known")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_entries")),
    )
    op.create_index(op.f("ix_entries_topic"), "entries", ["topic"], unique=False)

    # notes become knowledge-base entries of kind "note"; nothing is lost
    op.execute(
        "INSERT INTO entries (id, topic, kind, title, body, url, pinned, created_at, updated_at) "
        "SELECT id, section, 'note', NULL, body, NULL, false, created_at, updated_at FROM notes"
    )
    op.drop_index(op.f("ix_notes_section"), table_name="notes")
    op.drop_table("notes")

    op.create_table(
        "setup_audits",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("label", sa.String(length=80), nullable=False),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.Column("setup", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("report", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        *_timestamps(),
        sa.CheckConstraint("score BETWEEN 0 AND 100", name=op.f("ck_setup_audits_score_pct")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_setup_audits")),
    )
    op.create_table(
        "assessments",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("overall", sa.Integer(), nullable=False),
        sa.Column("answers", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("scores", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        *_timestamps(),
        sa.CheckConstraint("overall BETWEEN 0 AND 100", name=op.f("ck_assessments_overall_pct")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_assessments")),
    )
    op.create_table(
        "experiments",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("title", sa.String(length=120), nullable=False),
        sa.Column("template", sa.String(length=64), nullable=False),
        sa.Column("hypothesis", sa.Text(), nullable=False),
        sa.Column("variant_a", sa.String(length=60), nullable=False),
        sa.Column("variant_b", sa.String(length=60), nullable=False),
        *_timestamps(),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_experiments")),
    )
    op.create_table(
        "experiment_runs",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("experiment_id", sa.Uuid(), nullable=False),
        sa.Column("variant", sa.String(length=1), nullable=False),
        sa.Column("tokens", sa.Integer(), nullable=True),
        sa.Column("cost", sa.Float(), nullable=True),
        sa.Column("minutes", sa.Float(), nullable=True),
        sa.Column("corrections", sa.Integer(), nullable=True),
        sa.Column("quality", sa.Integer(), nullable=True),
        sa.Column("note", sa.Text(), nullable=False),
        *_timestamps(),
        sa.CheckConstraint("variant IN ('A', 'B')", name=op.f("ck_experiment_runs_variant_ab")),
        sa.CheckConstraint(
            "quality IS NULL OR quality BETWEEN 1 AND 5",
            name=op.f("ck_experiment_runs_quality_1_5"),
        ),
        sa.ForeignKeyConstraint(
            ["experiment_id"],
            ["experiments.id"],
            name=op.f("fk_experiment_runs_experiment_id_experiments"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_experiment_runs")),
    )
    op.create_index(
        op.f("ix_experiment_runs_experiment_id"), "experiment_runs", ["experiment_id"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_experiment_runs_experiment_id"), table_name="experiment_runs")
    op.drop_table("experiment_runs")
    op.drop_table("experiments")
    op.drop_table("assessments")
    op.drop_table("setup_audits")

    op.create_table(
        "notes",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("section", sa.String(length=64), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        *_timestamps(),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_notes")),
    )
    op.create_index(op.f("ix_notes_section"), "notes", ["section"], unique=False)
    op.execute(
        "INSERT INTO notes (id, section, body, created_at, updated_at) "
        "SELECT id, topic, body, created_at, updated_at FROM entries WHERE kind = 'note'"
    )
    op.drop_index(op.f("ix_entries_topic"), table_name="entries")
    op.drop_table("entries")
