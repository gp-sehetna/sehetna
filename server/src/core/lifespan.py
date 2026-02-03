from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.core.container import ServiceContainer
from src.core.settings import settings

__all__ = ["lifespan"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    services = ServiceContainer(settings=settings)
    services.load()
    app.state.services = services
    yield
