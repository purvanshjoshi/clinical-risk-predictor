# 📝 Project Tasks: Path to Winning Praxis 2.0

## Phase 1: The Robust Core (ML & Backend)
- [ ] **Data Pipeline**: Clean `diabetes_dataset.csv`, handle missing values, and split data.
- [ ] **Model Training**: Train XGBoost/Logistic Regression with probability calibration.
- [ ] **Explainability**: Implement SHAP (SHapley Additive exPlanations) for local interpretation.
- [ ] **FastAPI Backend**:
    - [ ] Setup `POST /predict` for real-time risk scoring.
    - [ ] Setup `POST /explain` for GenAI reasoning.
- [ ] **Unit Testing**: Add tests for model inference and API endpoints.

## Phase 2: The "Wow" Frontend (UX & Design)
- [ ] **Design System**: Initialize Tailwind CSS + Recharts/Tremor for visualizations.
- [ ] **Clinician Dashboard**:
    - [ ] Patient Search/List view.
    - [ ] Detailed Patient Risk View (Gauges, Feature contribution charts).
- [ ] **Interactive "Time Machine"**: Sliders to adjust modifiable factors (BMI, Glucose) and see live updates.
- [ ] **Patient Portal**: Simplified, non-alarmist UI for patients.

## Phase 3: GenAI Integration (The "Reasoning" Layer)
- [ ] **Contextual Prompts**: Develop prompts for "Clinician Summary" vs "Patient Explanation".
- [ ] **Localization**: Implement multi-language support (English/Hindi) via LLM.
- [ ] **Safety Layer**: Implement post-processing to flag unsafe LLM outputs.

## Phase 4: Polish & Demo Prep
- [ ] **Visual Polish**: Add `framer-motion` animations and loading states.
- [ ] **Documentation**: Finalize README, Architecture diagrams, and Demo script.
- [ ] **Video Production**: Record the walkthrough following the script.
