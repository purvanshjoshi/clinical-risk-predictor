# 📝 Project Tasks: Clinical Risk Predictor

## Phase 1: The Robust Core (ML & Backend)
- [x] **Data Pipeline**: Clean `diabetes_dataset.csv`, handle missing values, and split data.
- [x] **Model Training**: SOTA Stacking Ensemble (XGBoost/LightGBM/CatBoost).
- [x] **Explainability**: SHAP implementation for local interpretation.
- [x] **FastAPI Backend**:
    - [x] `POST /predict` (Risk Scoring)
    - [x] `POST /explain` (SHAP)
    - [x] `POST /simulate` (Type-2 Counterfactuals)
    - [x] `POST /report` (Embedded BioMistral LLM)

## Phase 2: The "Wow" Frontend (UX & Design)
- [x] **Design System**: Tailwind CSS + Framer Motion.
- [x] **Professional Polish (Framework)**:
    - [x] Refactor `AppShell` (Navbar/Layout).
    - [x] Refactor `PatientInputs` (Better Grid/Typography).
    - [x] Refactor `ClinicianDashboard` (Card-based Layout).
- [x] **Clinician Dashboard**:
    - [x] Clinician Dashboard UI.
    - [x] **Interactive "What-If" Simulation**: Sliders for BMI/Glucose.
    - [x] **AI Clinical Reports**: LLM-generated summaries.

## Phase 3: Longitudinal & Data
- [x] **Patient History**: JSON-based storage for longitudinal tracking.
- [x] **API Integration**: Automatic saving of predictions.

## Phase 4: Deployment & Polish
- [x] **Backend Port**: Fixed conflict (Moved to 8001).
- [x] **Dockerization**: `Dockerfile` and `docker-compose.yml` created.
- [x] **Documentation**: Updated `README.md` with new features and setup.
- [x] **Visual Polish**: Advanced animations (AI-Powered Simulation).

## Phase 5: Advanced Backend Features (Completed)
- [x] **Cohort Intelligence Engine**:
    - [x] `GET /cohort/analysis`: Population percentiles.
    - [x] "Digital Twin" Discovery: Nearest neighbor search for similar patients.
- [x] **Longitudinal Risk Velocity**:
    - [x] Calculate "Risk Velocity" (rate of change) in `HistoryEngine`.
    - [x] Alert flags for rapidly deteriorating health.
- [x] **Professional Clinical Reports**:
    - [x] PDF Generation Service (FPDF).
    - [x] Embed visualizations & QR codes in PDF.
- [x] **Expert Feedback Loop**:
    - [x] `POST /feedback`: Store clinician validation.
    - [x] Active Learning pipeline preparation.
- [x] **Interoperability Layer**:
    - [x] FHIR R4 Converters for Patient and RiskAssessment resources.
