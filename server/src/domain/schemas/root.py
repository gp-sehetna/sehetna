from pydantic import BaseModel, ConfigDict


class RootResponse(BaseModel):
    message: str
    version: str
    status: str
    description: str
    model_config = ConfigDict(extra="allow")
