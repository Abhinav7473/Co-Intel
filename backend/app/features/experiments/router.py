import uuid

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.core.db import SessionDep
from app.core.limits import ensure_capacity

from .models import Experiment, Run
from .schemas import ExperimentCreate, ExperimentOut, ExperimentSummary, RunCreate, RunOut

router = APIRouter(prefix="/experiments", tags=["experiments"])

MAX_EXPERIMENTS = 200
MAX_RUNS_PER_EXPERIMENT = 500


@router.get("")
async def list_experiments(session: SessionDep) -> list[ExperimentSummary]:
    rows = await session.scalars(select(Experiment).order_by(Experiment.created_at.desc()))
    return [
        ExperimentSummary.model_validate(e).model_copy(update={"run_count": len(e.runs)})
        for e in rows
    ]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_experiment(payload: ExperimentCreate, session: SessionDep) -> ExperimentOut:
    await ensure_capacity(session, Experiment, MAX_EXPERIMENTS)
    exp = Experiment(**payload.model_dump(), runs=[])
    session.add(exp)
    await session.commit()
    return await get_experiment(exp.id, session)


async def _get(session: SessionDep, experiment_id: uuid.UUID) -> Experiment:
    exp = await session.get(Experiment, experiment_id, populate_existing=True)
    if exp is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Experiment not found")
    return exp


@router.get("/{experiment_id}")
async def get_experiment(experiment_id: uuid.UUID, session: SessionDep) -> ExperimentOut:
    return ExperimentOut.model_validate(await _get(session, experiment_id))


@router.delete("/{experiment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experiment(experiment_id: uuid.UUID, session: SessionDep) -> None:
    await session.delete(await _get(session, experiment_id))
    await session.commit()


@router.post("/{experiment_id}/runs", status_code=status.HTTP_201_CREATED)
async def add_run(experiment_id: uuid.UUID, payload: RunCreate, session: SessionDep) -> RunOut:
    await _get(session, experiment_id)
    await ensure_capacity(session, Run, MAX_RUNS_PER_EXPERIMENT, Run.experiment_id == experiment_id)
    run = Run(experiment_id=experiment_id, **payload.model_dump())
    session.add(run)
    await session.commit()
    await session.refresh(run)
    return RunOut.model_validate(run)


@router.delete("/{experiment_id}/runs/{run_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_run(experiment_id: uuid.UUID, run_id: uuid.UUID, session: SessionDep) -> None:
    run = await session.get(Run, run_id)
    if run is None or run.experiment_id != experiment_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Run not found")
    await session.delete(run)
    await session.commit()
