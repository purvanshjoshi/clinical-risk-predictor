import requests
import json
import sys
import time

# Sample patient data
patient_data = {
    "gender": "Female",
    "age": 45,
    "hypertension": 0,
    "heart_disease": 0,
    "smoking_history": "never",
    "bmi": 24.5,
    "HbA1c_level": 5.5,
    "blood_glucose_level": 100
}

try:
    print("1. Making Prediction Request...")
    response = requests.post("http://localhost:8001/predict", json=patient_data)
    if response.status_code == 200:
        print("✅ Prediction Successful")
    else:
        print(f"❌ Prediction Failed: {response.text}")
        sys.exit(1)

    print("2. Verifying History Storage...")
    time.sleep(1) # Give it a moment to write
    
    # Check via API if implemented, or check file directly
    history_res = requests.get("http://localhost:8001/history")
    if history_res.status_code == 200:
        history = history_res.json()
        if len(history) > 0:
            print(f"✅ History retrieved successfully. Count: {len(history)}")
            latest = history[0] # HistoryEngine returns newest first? No, default was [-limit:][::-1] so yes.
            print(f"   Latest Record Timestamp: {latest.get('timestamp')}")
        else:
            print("❌ History is empty!")
            sys.exit(1)
    else:
        print(f"❌ Failed to get history: {history_res.text}")
        sys.exit(1)

except Exception as e:
    print(f"❌ Test Failed: {e}")
    sys.exit(1)
