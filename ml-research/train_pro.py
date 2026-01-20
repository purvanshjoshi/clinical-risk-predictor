import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import VotingClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import brier_score_loss, roc_auc_score
import xgboost as xgb
import shap

# --- Configuration ---
DATA_PATH = os.path.join("data", "diabetes_dataset.csv")
MODEL_DIR = os.path.join("backend", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "risk_pipeline_v1.joblib")
RANDOM_SEED = 42

def load_data(path):
    print(f"Loading data from {path}...")
    df = pd.read_csv(path)
    return df

def preprocess_features(df):
    """
    Custom feature engineering.
    """
    df_clean = df.copy()
    
    # Feature Engineering: BMI * Age
    if 'bmi' in df_clean.columns and 'age' in df_clean.columns:
        df_clean['BMI_Age_Interaction'] = df_clean['bmi'] * df_clean['age']
    
    return df_clean

def train_model():
    # 1. Load Data
    try:
        df = load_data(DATA_PATH)
    except FileNotFoundError:
        alt_path = os.path.join("..", "data", "diabetes_dataset.csv")
        if os.path.exists(alt_path):
             df = load_data(alt_path)
        else:
            raise FileNotFoundError(f"Could not find diabetes_dataset.csv")

    # 2. Split Data
    target_col = 'diabetes'
    X = df.drop(target_col, axis=1)
    y = df[target_col]
    
    # Stratified split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_SEED, stratify=y
    )
    
    # 3. Feature Engineering (Manual)
    X_train_processed = preprocess_features(X_train)
    X_test_processed = preprocess_features(X_test)
    
    # 4. Define Preprocessing Pipeline
    # Identify column types
    categorical_features = ['gender', 'smoking_history']
    numeric_features = ['age', 'hypertension', 'heart_disease', 'bmi', 'HbA1c_level', 'blood_glucose_level', 'BMI_Age_Interaction']
    
    # Verify columns exist
    numeric_features = [c for c in numeric_features if c in X_train_processed.columns]
    
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])

    # 5. Define Models
    xgb_clf = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=3,
        learning_rate=0.1,
        use_label_encoder=False,
        eval_metric='logloss',
        random_state=RANDOM_SEED
    )
    
    lr_clf = LogisticRegression(C=1.0, random_state=RANDOM_SEED, max_iter=1000)
    
    voting_clf = VotingClassifier(
        estimators=[('xgb', xgb_clf), ('lr', lr_clf)],
        voting='soft'
    )
    
    calibrated_clf = CalibratedClassifierCV(
        estimator=voting_clf,
        method='isotonic',
        cv=5
    )
    
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', calibrated_clf)
    ])
    
    # 6. Train
    print("Training Ensemble Pipeline...")
    pipeline.fit(X_train_processed, y_train)
    
    # 7. Evaluate
    print("Evaluating...")
    y_prob = pipeline.predict_proba(X_test_processed)[:, 1]
    
    brier = brier_score_loss(y_test, y_prob)
    roc_auc = roc_auc_score(y_test, y_prob)
    
    print(f"\n--- Metrics ---")
    print(f"Brier Score: {brier:.4f}")
    print(f"ROC AUC:     {roc_auc:.4f}")
    
    # 8. Save
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Pipeline saved to {MODEL_PATH}")
    
    # Save background data for SHAP
    # We need transformed data for SHAP if we use KernelExplainer on the model,
    # OR we can pass raw data if we wrap the pipeline.
    # To keep RiskEngine simple, let's save a small raw sample (preprocessed manually but not pipeline-transformed).
    background_data = X_train_processed.iloc[:50] 
    joblib.dump(background_data, os.path.join(MODEL_DIR, "background_data.joblib"))

if __name__ == "__main__":
    train_model()
