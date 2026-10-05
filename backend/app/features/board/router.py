from fastapi import APIRouter, HTTPException, status
from sqlalchemy import delete, func, select
from sqlalchemy.dialects.postgresql import insert

from app.core.db import SessionDep
from app.core.security import Slug

from .models import BoardPin
from .schemas import PinOut, PinUpsert

router = APIRouter(prefix="/board", tags=["board"])

MAX_PINS = 24


@router.get("")
async def list_pins(session: SessionDep) -> list[PinOut]:
    rows = await session.scalars(select(BoardPin).order_by(BoardPin.key))
    return [PinOut.model_validate(p) for p in rows]


@router.put("/{key}")
async def upsert_pin(key: Slug, payload: PinUpsert, session: SessionDep) -> PinOut:
    exists = await session.get(BoardPin, key)
    if exists is None:
        total = await session.scalar(select(func.count()).select_from(BoardPin))
        if (total or 0) >= MAX_PINS:
            raise HTTPException(status.HTTP_409_CONFLICT, "Board is full")
    values = payload.model_dump()
    stmt = (
        insert(BoardPin)
        .values(key=key, **values)
        .on_conflict_do_update(
            index_elements=[BoardPin.key], set_={**values, "updated_at": func.now()}
        )
        .returning(BoardPin)
        .execution_options(populate_existing=True)
    )
    pin = (await session.scalars(stmt)).one()
    await session.commit()
    return PinOut.model_validate(pin)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def reset_board(session: SessionDep) -> None:
    await session.execute(delete(BoardPin))
    await session.commit()
