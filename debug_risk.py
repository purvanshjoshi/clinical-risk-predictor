import sys
import os
sys.path.append(os.getcwd())
import traceback

try:
    print("Attempting to import RiskEngine...")
    from backend.models.risk_engine import RiskEngine
    print("Import successful. Initializing...")
    engine = RiskEngine()
    print("RiskEngine initialized successfully!")
except Exception:
    print("CRITICAL CHECK FAILED:")
    traceback.print_exc()
