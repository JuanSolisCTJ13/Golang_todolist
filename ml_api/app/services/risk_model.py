import math
from dataclasses import dataclass
from datetime import UTC, datetime

from app.core.settings import Settings
from app.schemas import PredictionFeatures


@dataclass(frozen=True)
class ModelMetadata:
    name: str
    version: str
    loaded_at: str


class RiskModelService:
    """Servicio de inferencia para un modelo lineal logístico baseline."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._weights = {
            "age": -0.03,
            "annual_income": -0.000015,
            "credit_score": -0.012,
            "existing_loans": 0.22,
            "late_payments_12m": 0.35,
            "debt_to_income": 2.1,
        }
        self._bias = 3.9
        self.metadata = ModelMetadata(
            name=settings.model_name,
            version=settings.model_version,
            loaded_at=datetime.now(UTC).isoformat(),
        )

    def _sigmoid(self, value: float) -> float:
        return 1.0 / (1.0 + math.exp(-value))

    def predict_risk_score(self, features: PredictionFeatures) -> float:
        linear_output = (
            self._weights["age"] * features.age
            + self._weights["annual_income"] * features.annual_income
            + self._weights["credit_score"] * features.credit_score
            + self._weights["existing_loans"] * features.existing_loans
            + self._weights["late_payments_12m"] * features.late_payments_12m
            + self._weights["debt_to_income"] * features.debt_to_income
            + self._bias
        )
        return round(self._sigmoid(linear_output), 3)

    def predict_label(self, risk_score: float) -> str:
        if risk_score >= self._settings.risk_threshold:
            return "high"
        if risk_score >= 0.2:
            return "medium"
        return "low"
