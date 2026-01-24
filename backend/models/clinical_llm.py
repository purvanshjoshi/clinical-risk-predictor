import os
import sys
from typing import Dict, Any, List, Optional
try:
    from gpt4all import GPT4All
    from huggingface_hub import hf_hub_download
except ImportError:
    GPT4All = None
    hf_hub_download = None

class ClinicalLLM:
    def __init__(self, model_repo="MaziyarPanahi/BioMistral-7B-GGUF", model_file="BioMistral-7B.Q4_K_M.gguf"):
        """
        Initialize the Clinical LLM model using GPT4All.
        Automatically downloads the GGUF model if not present locally.
        
        Args:
            model_repo (str): HuggingFace repository ID.
            model_file (str): Specific GGUF file name to download.
        """
        self.model = None
        # Store models in backend/models/weights
        self.weights_dir = os.path.join(os.getcwd(), "backend", "models", "weights")
        self.model_path = os.path.join(self.weights_dir, model_file)
        self.repo_id = model_repo
        self.filename = model_file
        
        if GPT4All is None:
            print("❌ Error: gpt4all not installed. Cannot run ClinicalLLM.")
            return

        self._load_model()

    def _load_model(self):
        """Downloads (if needed) and loads the model into memory."""
        os.makedirs(self.weights_dir, exist_ok=True)

        if not os.path.exists(self.model_path):
            print(f"⬇️ Clinical Model not found. Downloading {self.filename} from {self.repo_id}...")
            print("This is a one-time download (~4-5GB). Please be patient.")
            try:
                # Download to the specific path
                downloaded_path = hf_hub_download(
                    repo_id=self.repo_id,
                    filename=self.filename,
                    local_dir=self.weights_dir,
                    local_dir_use_symlinks=False
                )
                print(f"✅ Download complete: {downloaded_path}")
            except Exception as e:
                print(f"❌ Failed to download model: {e}")
                return

        print(f"🧠 Loading Clinical Model: {self.filename}...")
        try:
            # Initialize GPT4All model
            # allow_download=False because we manually downloaded it
            self.model = GPT4All(model_name=self.filename, model_path=self.weights_dir, allow_download=False, device='cpu')
            print("✅ Clinical Model loaded successfully.")
        except Exception as e:
            print(f"❌ Failed to load model execution: {e}")
            self.model = None

    def generate_report(self, patient_data: Dict[str, Any], risk_score: float, risk_level: str, explanations: list) -> str:
        """
        Generates a clinical report for the patient.
        """
        if not self.model:
            return "⚠️ Clinical LLM is not active. Report cannot be generated."

        # 1. Prepare Features Text
        key_factors = []
        if explanations:
            sorted_exp = sorted(explanations, key=lambda x: abs(x.get('impact_score', 0)), reverse=True)
            for exp in sorted_exp[:3]:
                feature = exp.get('feature', 'Unknown')
                impact = "increases" if exp.get('impact_score', 0) > 0 else "decreases"
                key_factors.append(f"- {feature}: {impact} risk")
        
        factors_text = "\n".join(key_factors) if key_factors else "No specific key factors."

        # 2. Construct Prompt (BioMistral friendly)
        prompt = f"""
### Instruction:
You are an expert medical AI assistant. Generate a professional clinical risk assessment report for a doctor based on the following patient data.

**Patient Profile:**
- Age: {patient_data.get('age')} years
- Gender: {patient_data.get('gender')}
- BMI: {patient_data.get('bmi')}
- HbA1c: {patient_data.get('HbA1c_level')}%
- Glucose: {patient_data.get('blood_glucose_level')} mg/dL
- Hypertension: {'Yes' if patient_data.get('hypertension') else 'No'}
- Heart Disease: {'Yes' if patient_data.get('heart_disease') else 'No'}
- Smoking: {patient_data.get('smoking_history')}

**Risk Analysis:**
- Calculated Risk Score: {risk_score:.2f} (0-1 Scale)
- Risk Category: {risk_level.upper()}
- Top Contributing Factors:
{factors_text}

**Task:**
Write a concise 1-paragraph clinical summary.
- Start with the risk level.
- Mention the key driving factors.
- Provide specific, actionable medical recommendations.
- Maintain a professional, objective tone.

### Response:
"""

        # 3. Generate
        try:
            # GPT4All generate method
            output = self.model.generate(prompt, max_tokens=300, temp=0.7)
            return output.strip()
        except Exception as e:
            return f"Error during generation: {e}"
