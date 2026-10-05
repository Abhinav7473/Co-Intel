"""Import every model so Base.metadata is complete (Alembic reads this)."""

from app.core.db import Base
from app.features.assessments.models import Assessment
from app.features.audit.models import AuditResponse
from app.features.board.models import BoardPin
from app.features.checklist.models import ChecklistItem
from app.features.entries.models import Entry
from app.features.experiments.models import Experiment, Run
from app.features.setup_audits.models import SetupAudit

__all__ = [
    "Assessment",
    "AuditResponse",
    "Base",
    "BoardPin",
    "ChecklistItem",
    "Entry",
    "Experiment",
    "Run",
    "SetupAudit",
]
