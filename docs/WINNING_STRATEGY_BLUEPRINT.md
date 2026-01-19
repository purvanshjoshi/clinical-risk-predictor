# 🏆 The Winning Blueprint: Praxis 2.0 Detailed Execution Plan
**Project**: Clinical Risk Predictor (CRP)
**Goal**: Win by combining *clinical rigor* with *GenAI empathy*.

---

## 💎 The Core Innovation: "Risk-Reason-Reassure"
We are not just predicting risk; we are managing it.
1.  **Risk**: Calibrated probabilities + Uncertainty Bounds.
2.  **Reason**: Counterfactuals ("What if I lose weight?") + SHAP explanations.
3.  **Reassure**: Empathetic, culturally aware patient communication.

---

## 📅 Phase 1: The Robust ML Core (Days 1-2)
*Goal: A production-grade API serving calibrated risk scores and explanations.*

### Step 1.1: Advanced Data Pipeline
**File**: `ml-research/train.py`
1.  **Ingestion**: Load `diabetes_dataset.csv`.
2.  **Cleaning**:
    *   Replace `0` values in columns like `Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, `BMI` with `NaN`.
    *   Impute `NaN` using `SimpleImputer(strategy='median')` (robust to outliers).
3.  **Feature Engineering**:
    *   Create `BMI_Age_Interaction = BMI * Age` (common clinical risk multiplier).
    *   Standardize features using `StandardScaler` for linear models (keep original for Trees).
4.  **Splitting**: 80/20 stratified split (`stratify=y` is crucial for medical data).

### Step 1.2: Model Training & Calibration
**File**: `backend/models/risk_model.py`
1.  **Algorithm**: XGBoost (`XGBClassifier`) - proven winner for tabular data.
2.  **Calibration**: Wrap the model in `CalibratedClassifierCV(method='isotonic')`.
    *   *Why?* The hackathon judges will check if "70% risk" actually means 70% probability.
3.  **Persistence**: Save the pipeline (Scaler + Imputer + Model) using `joblib` to `backend/models/pipeline.pkl`.

### Step 1.3: Explainability Engine (SHAP)
**File**: `backend/models/explainability.py`
1.  **KernelExplainer**: Since we use a pipeline, use `shap.KernelExplainer` or `shap.TreeExplainer` on the inner model.
2.  **Output Format**: Return a list of `{"feature": "BMI", "impact": +12.5, "description": "Increases risk"}`.
3.  **Optimization**: Calculate SHAP values for the test set *once* and cache the base value.

### Step 1.4: FastAPI Backend Construction
**File**: `backend/app.py`, `backend/routes/predict.py`
1.  **Pydantic Schema**: Define `PatientData` with validation (e.g., `age: int = Field(..., gt=0, lt=120)`).
2.  **Endpoint**: `POST /api/v1/predict`
    *   **Input**: JSON Patient Data.
    *   **Output JSON**:
        ```json
        {
          "risk_score": 0.76,
          "risk_tier": "High",
          "uncertainty_range": [0.71, 0.81],
          "top_drivers": [{"factor": "BMI", "value": 32.1, "contribution": "high"}]
        }
        ```

---

## 🎨 Phase 2: The "Wow" Frontend (Days 3-5)
*Goal: A dashboard that looks like a Series-A startup product.*

### Step 2.1: Project Setup
1.  **Stack**: React + TypeScript + Vite.
2.  **Styling**: Tailwind CSS.
3.  **Components**: Use **Radix UI** or **ShadCN/UI** for accessible, unstyled primitives (Dialogs, Sliders).

### Step 2.2: The "Time Machine" Interface (The Killer Feature)
**Component**: `frontend/src/components/Clinician/RiskScenario.tsx`
1.  **The Concept**: A sidebar with sliders for Modifiable Factors (Weight, Glucose, Activity).
2.  **Interaction**:
    *   User drags "Weight" slider from 95kg -> 90kg.
    *   Frontend *debounces* input (wait 300ms).
    *   Sends new values to `POST /predict`.
    *   **Visual**: A Line Chart shows the "Current Risk" dot moving down to a "Projected Risk" dot.
    *   **Animation**: Use `framer-motion` to animate the transition smoothly.

### Step 2.3: The Clinician Dashboard
**Component**: `frontend/src/components/Clinician/RiskDashboard.tsx`
1.  **Layout**: Bento Grid layout (CSS Grid).
2.  **Key Cards**:
    *   **Patient Vitals**: Big, bold numbers.
    *   **Risk Gauge**: A semi-circle gauge (Red/Yellow/Green). Use `recharts`.
    *   **Driver Analysis**: Horizontal bar chart sorted by SHAP impact.

### Step 2.4: The Patient Portal
**Component**: `frontend/src/components/Patient/SimpleReport.tsx`
1.  **Design Philosophy**: "No scary numbers".
2.  **UI**:
    *   Use Assessment scales: "Good", "Needs Attention", "Action Required".
    *   Use Icons: 🍎 (Food), 🏃 (Activity), 💊 (Meds).
    *   **Language Toggle**: A simple switch for English/Hindi.

---

## 🧠 Phase 3: GenAI Integration (Days 6-7)
*Goal: Turning data into empathy and logic.*

### Step 3.1: The "Dual-Persona" Prompt Engineering
**File**: `backend/models/genai.py`
1.  **System Prompt (Doctor)**:
    *   *"You are an expert Endocrinologist. Analyze the provided risk drivers. Suggest 3 specific clinical interventions based on ADA guidelines. Be concise. Use medical terminology."*
2.  **System Prompt (Patient)**:
    *   *"You are a compassionate health coach. The patient has {risk_level} risk. Explain their risk using a simple analogy (e.g., a car engine). Suggest 2 easy lifestyle changes. Tone: Encouraging, non-judgmental. Language: {selected_language}."*

### Step 3.2: Retrieval Augmented Generation (Mini-RAG)
*   **Context**: embed a small text chunk of "ADA Standards of Care" into the prompt context so the AI doesn't hallucinate treatments.

### Step 3.3: The "Explain" Endpoint
**Endpoint**: `POST /api/v1/explain`
*   Input: `{"patient_data": ..., "risk_score": ..., "persona": "patient"}`.
*   Output: Streaming text response (for real-time typing effect).

---

## �️ Phase 4: Polish, Safety & Demo (Days 8-10)
*Goal: Winning the judges' trust.*

### Step 4.1: Fairness & Ethics Check
1.  **Bias Check Script**: Run the model on subsets (e.g., Age > 60 vs Age < 30) and report False Positive Rate parity.
2.  **Disclaimer UI**: Add a persistent footer: *"AI Support Tool - Not a Diagnosis. Physician validation required."*

### Step 4.2: Performance Optimization
1.  **Frontend**: Use `React.memo` to prevent re-renders of the heavy charts.
2.  **Backend**: Cache SHAP explanations using `@lru_cache` or Redis if needed (likely overkill, simple memory cache is fine).

### Step 4.3: The Demo Script Rehearsal
1.  **Narrative**: "Meet Rahul. He's 45..." (Storytelling).
2.  **The "Ah-ha" Moment**: Drag the slider. "See? If Rahul walks 20 mins a day, his risk drops 15%."
3.  **The GenAI Flex**: "Rahul speaks Hindi." -> Click 'Translate'. -> Show Hindi output.

---

## ✅ Implementation Checklist (The "Cheat Sheet")

**Backend**
- [ ] `pandas` cleanup script
- [ ] `XGBoost` + `CalibratedClassifierCV`
- [ ] `SHAP` explainer setup
- [ ] `FastAPI` routes
- [ ] `Gemini` API key integration

**Frontend**
- [ ] Tailwind Config (Colors: Emerald-500 for good, Rose-500 for bad)
- [ ] `Recharts` Radar Chart for risk factors
- [ ] `Framer Motion` for page transitions
- [ ] `Axios` wrapper for API calls

**Docs**
- [ ] Screenshots of "Before/After" slider
- [ ] Diagram of the "Risk-Reason" pipeline

Let's execute this. Precision wins.
