from fastapi import APIRouter, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import SessionDep

from .models import AuditResponse
from .schemas import AuditCreate, AuditSummary

router = APIRouter(prefix="/audit", tags=["audit"])


async def _summary(session: AsyncSession) -> AuditSummary:
    responses = await session.scalar(select(func.count()).select_from(AuditResponse)) or 0
    key = func.unnest(AuditResponse.mistakes).label("key")
    inner = select(key).subquery()
    rows = await session.execute(select(inner.c.key, func.count()).group_by(inner.c.key))
    return AuditSummary(responses=responses, counts={k: n for k, n in rows.tuples()})


@router.get("/summary")
async def get_summary(session: SessionDep) -> AuditSummary:
    return await _summary(session)


@router.post("", status_code=status.HTTP_201_CREATED)
async def submit(payload: AuditCreate, session: SessionDep) -> AuditSummary:
    session.add(AuditResponse(mistakes=payload.mistakes))
    await session.commit()
    return await _summary(session)
