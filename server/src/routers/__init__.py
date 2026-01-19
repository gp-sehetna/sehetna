from fastapi import APIRouter

from src import settings
from src.schema import RootResponse

__all__ = ["root_router"]

root_router = APIRouter()


@root_router.get("/", response_model=RootResponse)
async def root():
    return RootResponse(
        message="Climate Health Simulation API",
        version=settings.version,
        status="running",
        description="Predict health outcomes with minimal climate data input",
    )
