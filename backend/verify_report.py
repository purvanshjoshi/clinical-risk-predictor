import requests
import json
import sys

# Sample high-risk patient data
patient_data = {
    "gender": "Male",
    "age": 65,
    "hypertension": 1,
    "heart_disease": 1,
    "smoking_history": "current",
    "bmi": 32.5,
    "HbA1c_level": 8.5,
    "blood_glucose_level": 220
}

try:
    response = requests.post("http://localhost:8001/report", json=patient_data)
    if response.status_code == 200:
        print("✅ Report Generated Successfully:")
        print("-" * 50)
        print(response.json()['report'])
        print("-" * 50)
    else:
        print(f"❌ Error {response.status_code}: {response.text}")
        sys.exit(1)
except Exception as e:
    print(f"❌ Connection Failed: {e}")
    sys.exit(1)
