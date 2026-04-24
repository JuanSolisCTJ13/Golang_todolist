from pydantic import BaseModel, Field


class PredictionFeatures(BaseModel):
    age: int = Field(..., ge=18, le=100)
    annual_income: float = Field(..., gt=0)
    credit_score: int = Field(..., ge=300, le=850)
    existing_loans: int = Field(..., ge=0, le=30)
    late_payments_12m: int = Field(..., ge=0, le=24)
    debt_to_income: float = Field(..., ge=0.0, le=1.0)


class PredictionResponse(BaseModel):
    model_name: str
    model_version: str
    risk_score: float = Field(..., ge=0.0, le=1.0)
    risk_label: str
    threshold: float = Field(..., ge=0.0, le=1.0)
    request_id: str
