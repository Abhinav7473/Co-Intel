from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert

from app.core.db import SessionDep
from app.core.security import Slug

from .models import ChecklistItem
from .schemas import ItemOut, ItemUpdate

router = APIRouter(prefix="/checklist", tags=["checklist"])

MAX_ITEMS = 50


@router.get("")
async def list_items(session: SessionDep) -> list[ItemOut]:
    rows = await session.scalars(select(ChecklistItem))
    return [ItemOut.model_validate(i) for i in rows]


@router.put("/{key}")
async def set_item(key: Slug, payload: ItemUpdate, session: SessionDep) -> ItemOut:
    if await session.get(ChecklistItem, key) is None:
        total = await session.scalar(select(func.count()).select_from(ChecklistItem))
        if (total or 0) >= MAX_ITEMS:
            raise HTTPException(status.HTTP_409_CONFLICT, "Checklist is full")
    stmt = (
        insert(ChecklistItem)
        .values(key=key, done=payload.done)
        .on_conflict_do_update(
            index_elements=[ChecklistItem.key],
            set_={"done": payload.done, "updated_at": func.now()},
        )
        .returning(ChecklistItem)
        .execution_options(populate_existing=True)
    )
    item = (await session.scalars(stmt)).one()
    await session.commit()
    return ItemOut.model_validate(item)
