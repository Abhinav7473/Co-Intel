from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints

Unit = Annotated[float, Field(ge=0, le=1)]
Label = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=48)]


class PinUpsert(BaseModel):
    model_config = ConfigDict(extra="forbid")
    label: Label
    control: Unit
    memory: Unit


class PinOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    key: str
    label: str
    control: float
    memory: float
