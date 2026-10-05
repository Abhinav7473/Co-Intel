from pydantic import BaseModel, ConfigDict


class ItemUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    done: bool


class ItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    key: str
    done: bool
