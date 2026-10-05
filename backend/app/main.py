from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import async_sessionmaker

from app.core.config import Settings, get_settings
from app.core.db import SessionDep, make_engine
from app.core.security import SecurityHeadersMiddleware
from app.features.assessments.router import router as assessments_router
from app.features.audit.router import router as audit_router
from app.features.board.router import router as board_router
from app.features.checklist.router import router as checklist_router
from app.features.entries.router import router as entries_router
from app.features.experiments.router import router as experiments_router
from app.features.setup_audits.router import router as setup_audits_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings: Settings = app.state.settings
    engine = make_engine(settings.sqlalchemy_url)
    app.state.sessionmaker = async_sessionmaker(engine, expire_on_commit=False)
    yield
    await engine.dispose()


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    docs = settings.is_dev  # no public schema in prod

    app = FastAPI(
        title="Workflow Habits API",
        lifespan=lifespan,
        docs_url="/api/docs" if docs else None,
        redoc_url=None,
        openapi_url="/api/openapi.json" if docs else None,
    )
    app.state.settings = settings

    # Same-origin app behind nginx, so no CORS middleware on purpose:
    # browsers will refuse cross-origin calls by default.
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.allowed_hosts)
    app.add_middleware(SecurityHeadersMiddleware)

    api = APIRouter(prefix="/api")

    @api.get("/health", tags=["meta"])
    async def health(session: SessionDep) -> dict[str, str]:
        await session.execute(text("SELECT 1"))
        return {"status": "ok"}

    for router in (
        entries_router,
        setup_audits_router,
        assessments_router,
        experiments_router,
        board_router,
        checklist_router,
        audit_router,
    ):
        api.include_router(router)
    app.include_router(api)
    return app


app = create_app()
