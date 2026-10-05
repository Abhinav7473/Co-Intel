# syntax=docker/dockerfile:1.7
# Python deps go straight into the image's system interpreter via uv — no venv.

FROM python:3.14-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_SYSTEM_PYTHON=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy
COPY --from=ghcr.io/astral-sh/uv:0.12.23 /uv /usr/local/bin/uv
RUN groupadd --system app && useradd --system --gid app --home-dir /app app
WORKDIR /app
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/uv uv pip install -r requirements.txt
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# ---------------------------------------------------------------- dev
FROM base AS dev
ENV RUFF_CACHE_DIR=/tmp/ruff
COPY requirements-dev.txt .
RUN --mount=type=cache,target=/root/.cache/uv uv pip install -r requirements-dev.txt
COPY --chown=app:app . .
USER app
CMD ["granian", "--interface", "asgi", "--host", "0.0.0.0", "--port", "8000", \
     "--reload", "--reload-paths", "app", "--log-level", "info", "app.main:app"]

# --------------------------------------------------------------- prod
FROM base AS prod
COPY --chown=app:app . .
USER app
CMD ["granian", "--interface", "asgi", "--host", "0.0.0.0", "--port", "8000", \
     "--workers", "2", "--respawn-failed-workers", "--log-level", "warning", "app.main:app"]
