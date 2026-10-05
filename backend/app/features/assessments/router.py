import uuid

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.core.db import SessionDep
from app.core.limits import ensure_capacity

from .models import Assessment
from .schemas import AssessmentCreate, AssessmentOut

router = APIRouter(prefix="/assessments", tags=["self-assessment"])

MAX_ASSESSMENTS = 500


@router.get("")
async def list_assessments(session: SessionDep) -> list[AssessmentOut]:
    stmt = select(Assessment).order_by(Assessment.created_at.desc()).limit(100)
    rows = await session.scalars(stmt)
    return [AssessmentOut.model_validate(a) for a in rows]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_assessment(payload: AssessmentCreate, session: SessionDep) -> AssessmentOut:
    await ensure_capacity(session, Assessment, MAX_ASSESSMENTS)
    row = Assessment(**payload.model_dump())
    session.add(row)
    await session.commit()
    await session.refresh(row)
    return AssessmentOut.model_validate(row)


@router.delete("/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assessment(assessment_id: uuid.UUID, session: SessionDep) -> None:
    row = await session.get(Assessment, assessment_id)
    if row is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Assessment not found")
    await session.delete(row)
    await session.commit()
