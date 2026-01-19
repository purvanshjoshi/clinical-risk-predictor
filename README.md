# 🏥 Clinical Risk Predictor

**An AI-driven preventive care decision support system for diabetes and chronic disease risk stratification.**

*Built for Praxis Hackathon 2025 - Submission Deadline: Feb 10, 2025*

---

## 📋 Problem Statement

### Theme
Healthcare | Preventive Medicine | Human-AI Collaboration

### Context
Chronic diseases such as diabetes often develop silently. By the time symptoms appear, interventions become costly and outcomes worsen. Clinicians operate under time pressure, limited historical data, and uncertainty—while patients struggle to understand probabilistic health risks.

### Problem
Design a clinical decision support workflow that helps surface early risk signals from routine patient data and supports informed, timely interventions—without overwhelming doctors or misleading patients.

### What the Solution Should Enable
- ✅ Transform structured patient data into risk estimates with uncertainty
- ✅ Identify key contributing factors and modifiable drivers
- ✅ Communicate findings differently for clinicians and patients
- ✅ Suggest next-step actions (tests, lifestyle changes, follow-ups)

---

## 🎯 Project Overview

Clinical Risk Predictor is a full-stack AI/ML application designed for real-world clinic workflows:

- **Clinician Dashboard**: High-density risk scores, key drivers, explanations, and actionable recommendations
- **Patient Portal**: Simple risk gauges, plain-language summaries, and personalized lifestyle guidance
- **Risk Model**: Explainable ML-based risk scoring with uncertainty quantification
- **Safety & Guardrails**: Bias detection, model transparency, and clinical validation checks

---

## 📁 Project Structure

```
clinical-risk-predictor/
├── backend/                    # FastAPI server
│   ├── app.py                  # Main FastAPI app
│   ├── models/                 # ML risk model & inference
│   │   ├── risk_model.py       # Risk scoring logic
│   │   ├── counterfactuals.py  # "What-if" analysis
│   │   └── explainability.py   # Feature importance, SHAP
│   ├── routes/                 # API endpoints
│   │   ├── patient.py          # Patient data endpoints
│   │   ├── risk.py             # Risk computation endpoints
│   │   └── cohort.py           # Cohort analysis endpoints
│   ├── schemas/                # Pydantic models
│   ├── requirements.txt        # Python dependencies
│   └── README.md               # Backend documentation
│
├── frontend/                   # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Clinician/      # Clinician dashboard views
│   │   │   │   ├── RiskDashboard.tsx
│   │   │   │   ├── PatientList.tsx
│   │   │   │   ├── RiskDetail.tsx
│   │   │   │   └── CohortAnalysis.tsx
│   │   │   ├── Patient/        # Patient portal views
│   │   │   │   ├── RiskGauge.tsx
│   │   │   │   ├── SimpleReport.tsx
│   │   │   │   ├── ActionPlan.tsx
│   │   │   │   └── Progress.tsx
│   │   │   └── Common/         # Shared components
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── README.md               # Frontend documentation
│
├── ml-research/                # ML model development
│   ├── notebooks/              # Jupyter notebooks for EDA & modeling
│   ├── data/                   # Training data
│   ├── train.py                # Model training script
│   ├── evaluate.py             # Model evaluation & metrics
│   └── README.md               # ML documentation
│
├── docs/                       # Project documentation
│   ├── ARCHITECTURE.md         # System design
│   ├── API_SPEC.md             # API documentation
│   ├── TEAM_ROLES.md           # Team responsibilities
│   ├── TIMELINE.md             # Development timeline
│   └── DEPLOYMENT.md           # Deployment guide
│
├── data/                       # Datasets
│   ├── diabetes_dataset.csv    # Training data
│   └── synthetic_patients.csv  # Test data
│
├── .github/
│   └── workflows/              # CI/CD pipelines (optional)
│
├── README.md                   # This file
├── .gitignore
└── CONTRIBUTING.md
```

---

## 👥 Team Roles (4 Members)

### 1. **ML Engineer** - Model Development & Explainability
- Dataset cleaning and EDA
- Risk model development (logistic regression, tree-based models)
- Uncertainty quantification
- Feature importance & SHAP explanations
- Counterfactual reasoning ("if BMI −2, risk ↓X%")
- Model evaluation and bias detection

**Deliverables:**
- `ml_research/train.py` - Model training pipeline
- `backend/models/risk_model.py` - Risk computation
- `backend/models/explainability.py` - Explainability logic

### 2. **Backend Engineer** - FastAPI Services
- API architecture & design
- Patient data ingestion endpoints
- Risk computation API
- Cohort analysis endpoints
- Authentication & logging
- Database schema (if using)
- Deployment setup (Render/Railway)

**Deliverables:**
- `backend/app.py` - FastAPI application
- `backend/routes/` - All endpoints
- `backend/requirements.txt` - Dependencies

### 3. **Frontend Engineer (Clinician View)**
- Clinician dashboard UI/UX
- Patient search & filtering
- Risk score visualization (cards, charts)
- Key driver display
- Explanation panels
- Action recommendation buttons

**Deliverables:**
- `frontend/src/components/Clinician/` - All clinician components
- Clinical workflow integration

### 4. **Frontend Engineer (Patient View) + UX/Docs**
- Patient portal UI/UX
- Simple risk gauge (traffic light)
- Plain-language explanations
- Lifestyle recommendation page
- Progress tracking
- Pitch deck & documentation

**Deliverables:**
- `frontend/src/components/Patient/` - All patient components
- `docs/` - Documentation
- Presentation slides

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI, Python, scikit-learn / XGBoost |
| Frontend | React, TypeScript, Tailwind CSS / Material-UI |
| ML | pandas, scikit-learn, SHAP, matplotlib |
| Database | Optional (mock data initially) |
| Deployment | Render (backend), Vercel (frontend) |
| Version Control | GitHub |

---

## 📅 Development Timeline (Till Feb 10)

### Week 1: Design & Core Model (by Jan 24)
- [ ] Finalize disease scope & inputs
- [ ] Set up GitHub repo & boilerplate
- [ ] ML: Dataset exploration & preprocessing
- [ ] Backend: API skeleton & schema design
- [ ] Frontend: Wireframes & component structure

### Week 2: Full Stack Development (by Jan 31)
- [ ] ML: Working risk model with feature importance
- [ ] Backend: Risk API returning scores + drivers
- [ ] Frontend: Basic clinician & patient views working
- [ ] End-to-end integration test

### Week 3: Polish & Submission (by Feb 9)
- [ ] Add counterfactuals & cohort analysis
- [ ] Finish pitch deck
- [ ] Bug fixes & UI refinement
- [ ] Full demo rehearsal
- [ ] Submit code + presentation

---

## 🛠️ Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
# Server runs on http://localhost:8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

### ML Model Training
```bash
cd ml-research
python train.py
# Outputs model to backend/models/
```

---

## 📊 Key Features

### 1. Risk Scoring
- Patient risk stratification (low/medium/high)
- Confidence intervals for uncertainty
- Longitudinal risk tracking

### 2. Explainability
- Top contributing factors ranked
- SHAP force plots
- Feature importance charts

### 3. Counterfactuals
- "If you reduce BMI by 5%, your risk drops from 45% to 32%"
- Interactive "what-if" scenarios
- Modifiable vs. non-modifiable factors

### 4. Personalization
- Clinician view: Technical, detailed, filtereable
- Patient view: Simple, visual, non-alarming
- Suggested actions based on risk tier

### 5. Safety & Guardrails
- Bias detection by demographic groups
- Model uncertainty estimates
- Clinical validation checks
- Limitations & disclaimers

---

## 🎓 Evaluation Criteria

- **Clinical Relevance**: Insights align with real-world preventive care workflows
- **Explainability**: Clear, trustworthy explanations for doctors & patients
- **Usability**: Dashboard is intuitive & fits OPD workflow
- **Code Quality**: Well-organized, documented, tested
- **Completeness**: Working end-to-end demo

---

## 📚 Documentation

See [docs/](./docs/) for:
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System design
- [API_SPEC.md](./docs/API_SPEC.md) - API details
- [TEAM_ROLES.md](./docs/TEAM_ROLES.md) - Detailed role breakdown
- [TIMELINE.md](./docs/TIMELINE.md) - Sprint planning

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Git workflow
- PR requirements
- Code style guide
- Testing guidelines

---

## 📝 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for Praxis Hackathon 2025**
