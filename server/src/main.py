import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src import settings
from src.core.error_handlers import app_exception_handler, unhandled_exception_handler
from src.core.exceptions import AppException
from src.models import loader
from src.models.helpers.mixins import *
from src.routers import inference, root_router

logging.basicConfig(level=settings.log_level, force=True)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    import __main__

    __main__.FeatureEngineerMixin = FeatureEngineerMixin
    __main__.CountryIQRCapper = CountryIQRCapper
    __main__.SelectiveStandardScaler = SelectiveStandardScaler

    loader(settings)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="Sehetna Services API\nProvides health risk predictions based on climate data.",
    contact={"name": "Sehetna Team", "email": "mohamedhussien.asu@gmail.com"},
    version=settings.VERSION,
    lifespan=lifespan,
)

app.add_exception_handler(Exception, unhandled_exception_handler)
app.add_exception_handler(AppException, app_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(root_router)
app.include_router(inference.router)


## To run the app use: fastapi dev "src\main.py" or fastapi dev "main.py"
