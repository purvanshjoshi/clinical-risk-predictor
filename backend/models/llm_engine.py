from openai import OpenAI
import os
from typing import Dict, Any

class LLMEngine:
    def __init__(self, base_url="http://localhost:11434/v1", api_key="ollama"):
        """
        Initialize the LLM Engine with a local OpenAI-compatible provider (e.g., Ollama).
        """
        self.client = OpenAI(
            base_url=base_url,
            api_key=api_key, 
        )
        self.model = "llama3" # Default model, can be made configurable

    def generate_report(self, patient_data: Dict[str, Any], risk_score: float, risk_level: str, explanations: list) -> str:
        """
        Generate a natural language clinical report based on patient data and risk assessment.
        """
        
        # Format key factors from explanations
        key_factors = []
        if explanations:
            # Sort by absolute impact to get most significant
            sorted_exp = sorted(explanations, key=lambda x: abs(x.get('impact_score', 0)), reverse=True)
            for exp in sorted_exp[:3]: # Top 3 factors
                feature = exp.get('feature', 'Unknown')
                impact = "increases" if exp.get('impact_score', 0) > 0 else "decreases"
                key_factors.append(f"- {feature} ({impact} risk)")
        
        factors_text = "\n".join(key_factors) if key_factors else "No specific key factors identified."

        prompt = f"""
        You are an expert AI medical assistant. Generate a concise, professional clinical summary for a doctor based on the following patient risk assessment.
        
        **Patient Profile:**
        - Age: {patient_data.get('age')}
        - Gender: {patient_data.get('gender')}
        - BMI: {patient_data.get('bmi')}
        - HbA1c: {patient_data.get('HbA1c_level')}
        - Glucose: {patient_data.get('blood_glucose_level')}
        - Hypertension: {'Yes' if patient_data.get('hypertension') else 'No'}
        - Heart Disease: {'Yes' if patient_data.get('heart_disease') else 'No'}
        - Smoking: {patient_data.get('smoking_history')}

        **Risk Assessment:**
        - Risk Score: {risk_score:.2f} (Scale 0-1)
        - Risk Level: {risk_level}

        **Key Contributing Factors:**
        {factors_text}

        **Instructions:**
        - Write a 1-paragraph summary for the clinician.
        - Highlight the most critical risk factors.
        - Suggest immediate areas of focus (e.g., "Monitor HbA1c").
        - Tone should be objective and clinical.
        """

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful clinical assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=250
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Error generating report: {str(e)}. Please ensure local LLM is running."
