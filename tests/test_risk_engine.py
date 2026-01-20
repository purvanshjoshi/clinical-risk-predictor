import pytest
import pandas as pd
import numpy as np
import os
import sys

# Ensure backend module can be imported
sys.path.append(os.getcwd())

from backend.models.risk_engine import RiskEngine

# Sample data (Diabetes Prediction Dataset format)
SAMPLE_DATA = {
    'gender': 'Male',
    'age': 45,
    'hypertension': 0,
    'heart_disease': 1,
    'smoking_history': 'former',
    'bmi': 28.5,
    'HbA1c_level': 6.2,
    'blood_glucose_level': 140
}

@pytest.fixture
def risk_engine():
    model_path = os.path.join("backend", "models", "risk_pipeline_v1.joblib")
    if not os.path.exists(model_path):
        pytest.skip(f"Model not found at {model_path}. Run train_pro.py first.")
    return RiskEngine()

def test_predict_risk(risk_engine):
    risk = risk_engine.predict_risk(SAMPLE_DATA)
    print(f"Predicted Risk: {risk}")
    assert 0.0 <= risk <= 1.0, "Risk probability must be between 0 and 1"
    assert isinstance(risk, float), "Risk must be a float"

def test_interaction_feature(risk_engine):
    """Verify feature engineering logic."""
    df = risk_engine._preprocess(SAMPLE_DATA)
    assert 'BMI_Age_Interaction' in df.columns
    expected_interaction = SAMPLE_DATA['bmi'] * SAMPLE_DATA['age']
    assert abs(df.iloc[0]['BMI_Age_Interaction'] - expected_interaction) < 1e-6

def test_explain_risk_structure(risk_engine):
    """Verify SHAP explanation format."""
    explanations = risk_engine.explain_risk(SAMPLE_DATA)
    
    if risk_engine.explainer:
        assert isinstance(explanations, list)
        assert len(explanations) > 0
        
        top_feature = explanations[0]
        assert "feature" in top_feature
        assert "impact_score" in top_feature
        assert "impact_description" in top_feature
    else:
        pytest.skip("SHAP explainer not initialized")

def test_categorical_handling(risk_engine):
    """Test that unseen categorical values don't crash the pipeline."""
    # 'Alien' is not in training data for gender, etc.
    # Pipeline handles unknown categories via handle_unknown='ignore'
    bad_data = SAMPLE_DATA.copy()
    bad_data['gender'] = 'Alien'
    bad_data['smoking_history'] = 'ChainSmoker'
    
    risk = risk_engine.predict_risk(bad_data)
    assert 0.0 <= risk <= 1.0
