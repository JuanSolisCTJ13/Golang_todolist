# FastAPI ML API

API de machine learning construida con FastAPI con enfoque en buenas prácticas de software engineering y AI engineering.

## Principios aplicados

- **Arquitectura por capas**: separación de rutas, esquemas, servicios y configuración.
- **Validación estricta**: `pydantic` para contratos de entrada/salida.
- **Modelo versionado**: metadata explícita (nombre, versión, timestamp).
- **Observabilidad**: logging estructurado + `request_id` por request.
- **Health checks**: endpoints `/health/live` y `/health/ready`.
- **Testeabilidad**: pruebas con `pytest` + `TestClient`.

## Estructura

```
ml_api/
  app/
    main.py
    schemas.py
    api/routes.py
    core/settings.py
    core/logging.py
    services/risk_model.py
  tests/test_api.py
  requirements.txt
```

## Ejecutar localmente

```bash
cd ml_api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## Endpoints

- `GET /health/live`
- `GET /health/ready`
- `POST /api/v1/predict`

### Ejemplo request

```json
{
  "age": 35,
  "annual_income": 62000,
  "credit_score": 710,
  "existing_loans": 1,
  "late_payments_12m": 0,
  "debt_to_income": 0.24
}
```

### Ejemplo response

```json
{
  "model_name": "credit-risk-baseline",
  "model_version": "1.0.0",
  "risk_score": 0.083,
  "risk_label": "low",
  "threshold": 0.5,
  "request_id": "..."
}
```
