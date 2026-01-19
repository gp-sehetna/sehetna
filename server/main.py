import logging

from fastapi import FastAPI
from sklearn import set_config

from src import lifespan, settings
from src.core.error_handlers import app_exception_handler, unhandled_exception_handler
from src.core.exceptions import AppException
from src.routers import inference, root_router

set_config(transform_output="pandas")

logging.basicConfig(level=settings.log_level, force=True)

app = FastAPI(
    title=settings.app_name,
    description=settings.description,
    contact={"name": settings.team_name, "email": settings.team_email},
    version=settings.version,
    lifespan=lifespan,
)

app.add_exception_handler(Exception, unhandled_exception_handler)
app.add_exception_handler(AppException, app_exception_handler)
app.include_router(root_router)
app.include_router(inference.router)


## To run the app use: fastapi dev "src\main.py" or fastapi dev "main.py"
