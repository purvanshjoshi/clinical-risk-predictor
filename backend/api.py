from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import sys
import os

# Ensure backend module can be imported
sys.path.append(os.getcwd())

from backend.models.risk_engine import RiskEngine
from backend.models.counterfactuals import Counterfactuals
from backend.models.llm_engine import LLMEngine

from backend.models.history_engine import HistoryEngine

# 1. Initialize App
app = FastAPI(title="Clinical Risk Predictor API", version="1.0")

# 2. CORS Setup (Allow All for Dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Load Model (Global State)
try:
    risk_engine = RiskEngine()
    print("Risk Engine loaded successfully.")
except Exception as e:
    print(f"Error loading Risk Engine: {e}")
    risk_engine = None

# Initialize LLM Engine
try:
    llm_engine = LLMEngine() # Defaults to localhost:11434
    print("LLM Engine initialized.")
except Exception as e:
    print(f"Error initializing LLM Engine: {e}")
    llm_engine = None

# Initialize History Engine
try:
    history_engine = HistoryEngine()
    print("History Engine initialized.")
except Exception as e:
    print(f"Error initializing History Engine: {e}")
    history_engine = None

# 4. Data Models
class PatientRequest(BaseModel):
    gender: str
    age: float
    hypertension: int
    heart_disease: int
    smoking_history: str
    bmi: float
    HbA1c_level: float
    blood_glucose_level: float
    
class RiskResponse(BaseModel):
    risk_score: float
    risk_level: str

class ExplanationResponse(BaseModel):
    explanations: List[Dict[str, Any]]

class ReportResponse(BaseModel):
    report: str

# 5. Helper Functions
def get_risk_level(score: float) -> str:
    if score < 0.2: return "Low"
    if score < 0.6: return "Moderate"
    return "High"

# 6. Endpoints
@app.get("/health")
def health_check():
    if risk_engine is None:
        raise HTTPException(status_code=503, detail="Risk Engine not initialized")
    return {"status": "healthy", "model_loaded": True}

@app.get("/")
def root():
    return {"message": "Clinical Risk Predictor API is running", "docs": "/docs"}

@app.post("/predict", response_model=RiskResponse)
def predict_risk(patient: PatientRequest):
    if risk_engine is None:
        raise HTTPException(status_code=503, detail="Risk Engine not ready")
    
    try:
        data = patient.dict()
        score = risk_engine.predict_risk(data)
        level = get_risk_level(score)
        
        # Save to history
        if history_engine:
            try:
                history_engine.save_record(data, score, level)
            except Exception as hist_e:
                print(f"Warning: Failed to save history: {hist_e}")

        return {"risk_score": score, "risk_level": level}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def get_history(limit: int = 10):
    if history_engine is None:
        raise HTTPException(status_code=503, detail="History Engine not ready")
    return history_engine.get_history(limit)


@app.post("/explain", response_model=ExplanationResponse)
def explain_risk(patient: PatientRequest):
    if risk_engine is None:
        raise HTTPException(status_code=503, detail="Risk Engine not ready")
    
    try:
        data = patient.dict()
        explanations = risk_engine.explain_risk(data)
        return {"explanations": explanations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class SimulationRequest(BaseModel):
    patient: PatientRequest
    modifications: Dict[str, Any]

class SimulationResponse(BaseModel):
    original_risk: float
    new_risk: float
    risk_reduction: float

@app.post("/simulate", response_model=SimulationResponse)
def simulate_risk(request: SimulationRequest):
    if risk_engine is None:
        raise HTTPException(status_code=503, detail="Risk Engine not ready")
    
    try:
        cf = Counterfactuals(risk_engine)
        result = cf.predict_simulation(request.patient.dict(), request.modifications)
        
        original_risk = risk_engine.predict_risk(request.patient.dict())
        new_risk = result['new_risk']
        
        return {
            "original_risk": original_risk,
            "new_risk": new_risk,
            "risk_reduction": original_risk - new_risk
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/report", response_model=ReportResponse)
def generate_report(patient: PatientRequest):
    if risk_engine is None or llm_engine is None:
        raise HTTPException(status_code=503, detail="Services not ready")
    
    try:
        data = patient.dict()
        score = risk_engine.predict_risk(data)
        level = get_risk_level(score)
        explanations = risk_engine.explain_risk(data)
        
        report = llm_engine.generate_report(data, score, level, explanations)
        return {"report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
