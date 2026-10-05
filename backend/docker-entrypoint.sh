#!/bin/sh
# Migrate, then hand PID 1 to the server so signals reach it.
set -eu
alembic upgrade head
exec "$@"
