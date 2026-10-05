import uuid
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import or_, select

from app.core.db import SessionDep
from app.core.limits import ensure_capacity
from app.core.security import Slug

from .models import Entry
from .schemas import EntryCreate, EntryOut, EntryUpdate, Kind

router = APIRouter(prefix="/entries", tags=["knowledge base"])

MAX_ENTRIES = 5000


@router.get("")
async def list_entries(
    session: SessionDep,
    topic: Slug | None = None,
    kind: Kind | None = None,
    q: Annotated[str | None, Query(max_length=100)] = None,
) -> list[EntryOut]:
    stmt = select(Entry).order_by(Entry.pinned.desc(), Entry.updated_at.desc()).limit(1000)
    if topic:
        stmt = stmt.where(Entry.topic == topic)
    if kind:
        stmt = stmt.where(Entry.kind == kind)
    if q:
        like = f"%{q.replace('%', r'\%').replace('_', r'\_')}%"
        stmt = stmt.where(or_(Entry.title.ilike(like), Entry.body.ilike(like)))
    return [EntryOut.model_validate(e) for e in await session.scalars(stmt)]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_entry(payload: EntryCreate, session: SessionDep) -> EntryOut:
    await ensure_capacity(session, Entry, MAX_ENTRIES)
    data = payload.model_dump()
    data["url"] = str(payload.url) if payload.url else None
    entry = Entry(**data)
    session.add(entry)
    await session.commit()
    await session.refresh(entry)
    return EntryOut.model_validate(entry)


async def _get(session: SessionDep, entry_id: uuid.UUID) -> Entry:
    entry = await session.get(Entry, entry_id)
    if entry is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Entry not found")
    return entry


@router.patch("/{entry_id}")
async def update_entry(entry_id: uuid.UUID, payload: EntryUpdate, session: SessionDep) -> EntryOut:
    entry = await _get(session, entry_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(entry, field, str(value) if field == "url" and value is not None else value)
    await session.commit()
    await session.refresh(entry)
    return EntryOut.model_validate(entry)


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(entry_id: uuid.UUID, session: SessionDep) -> None:
    await session.delete(await _get(session, entry_id))
    await session.commit()
