from fastapi.testclient import TestClient
from backend.api import app
import pytest

client = TestClient(app)

SAMPLE_PATIENT = {
    "gender": "Male",
    "age": 45,
    "hypertension": 0,
    "heart_disease": 1,
    "smoking_history": "former",
    "bmi": 28.5,
    "HbA1c_level": 6.2,
    "blood_glucose_level": 140
}

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_predict_endpoint():
    response = client.post("/predict", json=SAMPLE_PATIENT)
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert "risk_level" in data
    assert 0.0 <= data["risk_score"] <= 1.0

def test_explain_endpoint():
    response = client.post("/explain", json=SAMPLE_PATIENT)
    assert response.status_code == 200
    data = response.json()
    assert "explanations" in data
    assert isinstance(data["explanations"], list)
    if len(data["explanations"]) > 0:
        assert "feature" in data["explanations"][0]
        assert "impact_score" in data["explanations"][0]

def test_validation_error():
    # Missing required field 'age'
    invalid_data = SAMPLE_PATIENT.copy()
    del invalid_data['age']
    
    response = client.post("/predict", json=invalid_data)
    assert response.status_code == 422