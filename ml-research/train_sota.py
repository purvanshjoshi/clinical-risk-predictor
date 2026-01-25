import pandas as pd
import numpy as np
import os
import joblib
import optuna
import logging
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder, PolynomialFeatures
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import StackingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, roc_auc_score, accuracy_score
import xgboost as xgb
import lightgbm as lgb
from catboost import CatBoostClassifier

# --- Configuration ---
DATA_PATH = os.path.join("data", "diabetes_dataset.csv")
MODEL_DIR = os.path.join("backend", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "risk_pipeline_v1.joblib")
RANDOM_SEED = 42
N_TRIALS = 20  # Reduced for speed in this context, use 100+ for real SOTA

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_data(path):
    logging.info(f"Loading data from {path}...")
    return pd.read_csv(path)

def preprocess_features(df):
    """
    Advanced Feature Engineering: Interaction terms and domain knowledge.
    """
    df_clean = df.copy()
    
    # Domain Knowledge: BMI Categories
    if 'bmi' in df_clean.columns:
        df_clean['BMI_Category'] = pd.cut(df_clean['bmi'], 
                                          bins=[0, 18.5, 24.9, 29.9, 100], 
                                          labels=['Underweight', 'Normal', 'Overweight', 'Obese'])

    # Interaction: BMI * Age (Risk aggravator)
    if 'bmi' in df_clean.columns and 'age' in df_clean.columns:
        df_clean['BMI_Age_Interaction'] = df_clean['bmi'] * df_clean['age']
        
    # Interaction: Glucose * HbA1c (Metabolic load)
    if 'blood_glucose_level' in df_clean.columns and 'HbA1c_level' in df_clean.columns:
        df_clean['Glucose_HbA1c_Interaction'] = df_clean['blood_glucose_level'] * df_clean['HbA1c_level']

    return df_clean

def objective(trial, X, y):
    """
    Optuna objective for XGBoost (example of HPO)
    """
    param = {
        'objective': 'binary:logistic',
        'eval_metric': 'logloss',
        'tree_method': 'hist',
        'booster': 'gbtree',
        'lambda': trial.suggest_float('lambda', 1e-8, 1.0, log=True),
        'alpha': trial.suggest_float('alpha', 1e-8, 1.0, log=True),
        'max_depth': trial.suggest_int('max_depth', 1, 9),
        'eta': trial.suggest_float('eta', 0.01, 1.0, log=True),
        'gamma': trial.suggest_float('gamma', 1e-8, 1.0, log=True),
        'grow_policy': trial.suggest_categorical('grow_policy', ['depthwise', 'lossguide'])
    }

    clf = xgb.XGBClassifier(**param, random_state=RANDOM_SEED)
    
    cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=RANDOM_SEED)
    scores = cross_val_score(clf, X, y, cv=cv, scoring='f1')
    return scores.mean()

def train_sota_model():
    # 1. Load Data
    try:
        df = load_data(DATA_PATH)
    except FileNotFoundError:
        logging.error("Dataset not found!")
        return

    # 2. Advanced Feature Engineering
    logging.info("Applying advanced feature engineering...")
    df_processed = preprocess_features(df)
    
    target_col = 'diabetes'
    X = df_processed.drop(target_col, axis=1)
    y = df_processed[target_col]
    
    # 3. Preprocessing Pipeline
    categorical_features = ['gender', 'smoking_history', 'BMI_Category']
    numeric_features = ['age', 'hypertension', 'heart_disease', 'bmi', 'HbA1c_level', 'blood_glucose_level', 'BMI_Age_Interaction', 'Glucose_HbA1c_Interaction']
    
    # Verify cols exist
    numeric_features = [c for c in numeric_features if c in X.columns]
    categorical_features = [c for c in categorical_features if c in X.columns]

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

    # 4. HPO (Simplified for this run, normally would tune all 3)
    # logging.info("Running Optuna for XGBoost...")
    # X_transformed = preprocessor.fit_transform(X) # Needs simplified transformer for raw optuna
    # study = optuna.create_study(direction="maximize")
    # study.optimize(lambda trial: objective(trial, X_transformed, y), n_trials=N_TRIALS)
    # best_xgb_params = study.best_params
    # logging.info(f"Best XGB Params: {best_xgb_params}")
    
    # Using 'good' defaults for speed/stability in this context
    xgb_clf = xgb.XGBClassifier(n_estimators=200, learning_rate=0.05, max_depth=6, random_state=RANDOM_SEED, eval_metric='logloss')
    lgb_clf = lgb.LGBMClassifier(n_estimators=200, learning_rate=0.05, random_state=RANDOM_SEED, verbose=-1)
    cat_clf = CatBoostClassifier(iterations=200, learning_rate=0.05, depth=6, random_seed=RANDOM_SEED, verbose=False)

    # 5. Single Robust Model (XGBoost) - Simplified for stability
    logging.info("Training Robust XGBoost Model...")
    
    # Use the best single model instead of Stacking for now to avoid sklearn/mixin errors
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', xgb_clf)
    ])
    
    # 6. Evaluation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)
    scores = cross_val_score(pipeline, X, y, cv=cv, scoring='roc_auc')
    logging.info(f"Cross-Validation ROC AUC: {scores.mean():.4f} (+/- {scores.std() * 2:.4f})")
    
    # 7. Final Fit & Save
    pipeline.fit(X, y)
    
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    logging.info(f"SOTA Pipeline saved to {MODEL_PATH}")
    
    # Save background data for SHAP (Raw, but preprocessed features manually added)
    # Note: SHAP with stacking is complex. We usually explain the strongest single model or use KernelExplainer on the pipeline.
    # For consistent frontend experience, we'll save a sample.
    background_data = X.sample(50, random_state=RANDOM_SEED)
    joblib.dump(background_data, os.path.join(MODEL_DIR, "background_data.joblib"))

if __name__ == "__main__":
    train_sota_model()
