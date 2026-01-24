# 📝 Project Tasks: Clinical Risk Predictor

## Phase 1: The Robust Core (ML & Backend)
- [x] **Data Pipeline**: Clean `diabetes_dataset.csv`, handle missing values, and split data.
- [x] **Model Training**: SOTA Stacking Ensemble (XGBoost/LightGBM/CatBoost).
- [x] **Explainability**: SHAP implementation for local interpretation.
- [x] **FastAPI Backend**:
    - [x] `POST /predict` (Risk Scoring)
    - [x] `POST /explain` (SHAP)
    - [x] `POST /simulate` (Type-2 Counterfactuals)
    - [x] `POST /simulate` (Type-2 Counterfactuals)
    - [x] `POST /report` (Embedded BioMistral LLM)

## Phase 2: The "Wow" Frontend (UX & Design)
- [x] **Design System**: Tailwind CSS + Framer Motion.
- [x] **Clinician Dashboard**:
    - [x] Risk Gauge & SHAP Plots.
    - [x] **Interactive "What-If" Simulation**: Sliders for BMI/Glucose.
    - [x] **AI Clinical Reports**: LLM-generated summaries.

## Phase 3: Longitudinal & Data
- [x] **Patient History**: JSON-based storage for longitudinal tracking.
- [x] **API Integration**: Automatic saving of predictions.

## Phase 4: Deployment & Polish
- [x] **Backend Port**: Fixed conflict (Moved to 8001).
- [x] **Dockerization**: `Dockerfile` and `docker-compose.yml` created.
- [x] **Documentation**: Updated `README.md` with new features and setup.
- [ ] **Visual Polish**: Advanced animations (optional).
