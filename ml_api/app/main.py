from fastapi import FastAPI

from app.api.routes import router
from app.core.logging import configure_logging
from app.core.settings import get_settings

configure_logging()
settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Machine Learning API con FastAPI y buenas prácticas de ingeniería.",
)
app.include_router(router)
