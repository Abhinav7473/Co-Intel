from fastapi import HTTPException, status
from sqlalchemy import ColumnElement, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import Base


async def ensure_capacity(
    session: AsyncSession,
    model: type[Base],
    cap: int,
    where: ColumnElement[bool] | None = None,
) -> None:
    """Reject inserts past a row cap. There is no auth, so every table is bounded.

    Count-then-insert is not race-proof; it bounds abuse, it is not a quota.
    """
    stmt = select(func.count()).select_from(model)
    if where is not None:
        stmt = stmt.where(where)
    if (await session.scalar(stmt) or 0) >= cap:
        raise HTTPException(status.HTTP_409_CONFLICT, f"Limit of {cap} reached")
