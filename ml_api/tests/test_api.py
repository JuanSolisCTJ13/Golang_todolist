from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_live_health() -> None:
    response = client.get("/health/live")
    assert response.status_code == 200
    assert response.json()["status"] == "alive"


def test_ready_health() -> None:
    response = client.get("/health/ready")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ready"
    assert "model" in body


def test_predict_success() -> None:
    payload = {
        "age": 35,
        "annual_income": 62000,
        "credit_score": 710,
        "existing_loans": 1,
        "late_payments_12m": 0,
        "debt_to_income": 0.24,
    }

    response = client.post("/api/v1/predict", json=payload, headers={"X-Request-ID": "test-req-1"})

    assert response.status_code == 200
    body = response.json()
    assert body["model_name"] == "credit-risk-baseline"
    assert body["model_version"] == "1.0.0"
    assert 0 <= body["risk_score"] <= 1
    assert body["risk_label"] in {"low", "medium", "high"}
    assert body["request_id"] == "test-req-1"


def test_predict_validation_error() -> None:
    payload = {
        "age": 17,
        "annual_income": -10,
        "credit_score": 900,
        "existing_loans": -1,
        "late_payments_12m": 0,
        "debt_to_income": 2,
    }

    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422
