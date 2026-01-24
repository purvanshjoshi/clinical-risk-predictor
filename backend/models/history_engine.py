import json
import os
from datetime import datetime
from typing import Dict, Any, List

class HistoryEngine:
    def __init__(self, storage_file="data/patient_history.json"):
        """
        Initialize the History Engine with a JSON storage file.
        """
        self.storage_file = storage_file
        self.history = self._load_history()

    def _load_history(self) -> List[Dict[str, Any]]:
        """
        Load history from the JSON file.
        """
        if not os.path.exists(self.storage_file):
            return []
        
        try:
            with open(self.storage_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []

    def _save_history(self):
        """
        Save current history to the JSON file.
        """
        # Ensure directory exists
        os.makedirs(os.path.dirname(self.storage_file), exist_ok=True)
        
        with open(self.storage_file, 'w') as f:
            json.dump(self.history, f, indent=4)

    def save_record(self, patient_data: Dict[str, Any], risk_score: float, risk_level: str):
        """
        Save a new prediction record.
        """
        record = {
            "timestamp": datetime.now().isoformat(),
            "patient_data": patient_data,
            "risk_assessment": {
                "score": risk_score,
                "level": risk_level
            }
        }
        self.history.append(record)
        self._save_history()
        return record

    def get_history(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get the most recent history records.
        """
        # Return last N records, reversed (newest first)
        return self.history[-limit:][::-1]
