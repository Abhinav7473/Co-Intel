import uuid

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.core.db import SessionDep
from app.core.limits import ensure_capacity

from .models import SetupAudit
from .schemas import AuditCreate, AuditOut, AuditSummary

router = APIRouter(prefix="/setup-audits", tags=["setup audits"])

MAX_AUDITS = 500


@router.get("")
async def list_audits(session: SessionDep) -> list[AuditSummary]:
    stmt = select(SetupAudit).order_by(SetupAudit.created_at.desc()).limit(200)
    rows = await session.scalars(stmt)
    return [AuditSummary.model_validate(a) for a in rows]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_audit(payload: AuditCreate, session: SessionDep) -> AuditOut:
    await ensure_capacity(session, SetupAudit, MAX_AUDITS)
    audit = SetupAudit(
        label=payload.label,
        score=payload.report.score,
        setup=payload.setup.model_dump(),
        report=payload.report.model_dump(),
    )
    session.add(audit)
    await session.commit()
    await session.refresh(audit)
    return AuditOut.model_validate(audit)


async def _get(session: SessionDep, audit_id: uuid.UUID) -> SetupAudit:
    audit = await session.get(SetupAudit, audit_id)
    if audit is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Audit not found")
    return audit


@router.get("/{audit_id}")
async def get_audit(audit_id: uuid.UUID, session: SessionDep) -> AuditOut:
    return AuditOut.model_validate(await _get(session, audit_id))


@router.delete("/{audit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_audit(audit_id: uuid.UUID, session: SessionDep) -> None:
    await session.delete(await _get(session, audit_id))
    await session.commit()
