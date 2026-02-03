import logging

from fastapi import FastAPI
from sklearn import set_config

from src.api.routers.inference import router as inference_router
from src.api.routers.root import root_router
from src.core.error_handlers import app_exception_handler, unhandled_exception_handler
from src.core.exceptions import AppException
from src.core.lifespan import lifespan
from src.core.settings import settings

set_config(transform_output="pandas")

logging.basicConfig(level=settings.log_level, force=True)

app = FastAPI(
    title=settings.app_name,
    root_path="/ai",
    description=settings.description,
    contact={"name": settings.team_name, "email": settings.team_email},
    version=settings.version,
    lifespan=lifespan,
)

app.add_exception_handler(Exception, unhandled_exception_handler)
app.add_exception_handler(AppException, app_exception_handler)
app.include_router(root_router)
app.include_router(inference_router)


## To run the app use: fastapi dev "src\main.py" or fastapi dev "main.py"
