from fastapi import APIRouter

from src.core.settings import settings
from src.domain.schemas.root import RootResponse

__all__ = ["root_router"]

root_router = APIRouter(tags=["status", "health", "root"])


@root_router.get("/", response_model=RootResponse)
async def root():
    return RootResponse(
        message="Climate Health Simulation API",
        version=settings.version,
        state=settings.env_state,
        status="running",
        description="Predict health outcomes with minimal climate data input",
    )
