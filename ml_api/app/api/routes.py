import logging
from functools import lru_cache
from uuid import uuid4

from fastapi import APIRouter, Depends, Request

from app.core.settings import Settings, get_settings
from app.schemas import PredictionFeatures, PredictionResponse
from app.services.risk_model import RiskModelService

logger = logging.getLogger(__name__)
router = APIRouter()


@lru_cache
def _build_model_service() -> RiskModelService:
    return RiskModelService(get_settings())


def get_model_service() -> RiskModelService:
    return _build_model_service()


@router.get("/health/live")
def live() -> dict[str, str]:
    return {"status": "alive"}


@router.get("/health/ready")
def ready(model_service: RiskModelService = Depends(get_model_service)) -> dict[str, str]:
    return {
        "status": "ready",
        "model": model_service.metadata.name,
        "model_version": model_service.metadata.version,
    }


@router.post("/api/v1/predict", response_model=PredictionResponse)
def predict(
    payload: PredictionFeatures,
    request: Request,
    settings: Settings = Depends(get_settings),
    model_service: RiskModelService = Depends(get_model_service),
) -> PredictionResponse:
    request_id = request.headers.get("X-Request-ID", str(uuid4()))
    risk_score = model_service.predict_risk_score(payload)
    risk_label = model_service.predict_label(risk_score)

    logger.info(
        "prediction_completed",
        extra={
            "request_id": request_id,
            "model_version": model_service.metadata.version,
            "risk_score": risk_score,
            "risk_label": risk_label,
        },
    )

    return PredictionResponse(
        model_name=model_service.metadata.name,
        model_version=model_service.metadata.version,
        risk_score=risk_score,
        risk_label=risk_label,
        threshold=settings.risk_threshold,
        request_id=request_id,
    )
