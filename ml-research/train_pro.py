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
from sklearn.ensemble import VotingClassifier, RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import brier_score_loss, roc_auc_score
from sklearn.utils.class_weight import compute_class_weight
import xgboost as xgb
import shap
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline

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
    Advanced feature engineering for maximum performance.
    """
    df_clean = df.copy()
    
    # Interaction: BMI * Age
    if 'bmi' in df_clean.columns and 'age' in df_clean.columns:
        df_clean['BMI_Age_Interaction'] = df_clean['bmi'] * df_clean['age']
    
    # Interaction: Glucose * HbA1c
    if 'blood_glucose_level' in df_clean.columns and 'HbA1c_level' in df_clean.columns:
        df_clean['Glucose_HbA1c_Interaction'] = df_clean['blood_glucose_level'] * df_clean['HbA1c_level']
    
    # Age Categories (risk zones)
    if 'age' in df_clean.columns:
        df_clean['Age_Category'] = pd.cut(df_clean['age'], 
                                          bins=[0, 30, 45, 60, 100],
                                          labels=['Young', 'Middle', 'Senior', 'Elderly'])
    
    # BMI Categories (WHO classification)
    if 'bmi' in df_clean.columns:
        df_clean['BMI_Category'] = pd.cut(df_clean['bmi'],
                                          bins=[0, 18.5, 25, 30, 100],
                                          labels=['Underweight', 'Normal', 'Overweight', 'Obese'])
    
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
    
    # 3.5 Compute Class Weights
    print(f"\nClass Distribution:")
    print(f"  Training: {y_train.value_counts().to_dict()}")
    print(f"  Negative: {(y_train == 0).sum()} ({(y_train == 0).sum() / len(y_train) * 100:.2f}%)")
    print(f"  Positive: {(y_train == 1).sum()} ({(y_train == 1).sum() / len(y_train) * 100:.2f}%)")
    
    class_weights = compute_class_weight('balanced', classes=np.array([0, 1]), y=y_train)
    scale_pos_weight = class_weights[1] / class_weights[0]
    print(f"\nClass Weights: {class_weights}")
    print(f"Scale Pos Weight (for XGBoost): {scale_pos_weight:.2f}")
    
    # 4. Define Preprocessing Pipeline
    # Identify column types
    categorical_features = ['gender', 'smoking_history', 'Age_Category', 'BMI_Category']
    numeric_features = ['age', 'hypertension', 'heart_disease', 'bmi', 'HbA1c_level', 'blood_glucose_level', 'BMI_Age_Interaction', 'Glucose_HbA1c_Interaction']
    
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

    # 5. Define Models with Class Weights
    xgb_clf = xgb.XGBClassifier(
        n_estimators=200,  # Increased from 150
        max_depth=5,  # Increased from 4 for even more complex patterns
        learning_rate=0.08,  # Slightly reduced for better generalization
        min_child_weight=1,
        subsample=0.8,
        colsample_bytree=0.8,
        gamma=0.1,  # Add regularization
        scale_pos_weight=scale_pos_weight,
        use_label_encoder=False,
        eval_metric='logloss',
        random_state=RANDOM_SEED
    )
    
    lr_clf = LogisticRegression(
        C=0.8,  # Slightly more regularization
        class_weight='balanced',
        random_state=RANDOM_SEED, 
        max_iter=1000
    )
    
    # Add Random Forest for diversity
    rf_clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        class_weight='balanced',
        random_state=RANDOM_SEED,
        n_jobs=-1
    )
    
    voting_clf = VotingClassifier(
        estimators=[('xgb', xgb_clf), ('lr', lr_clf), ('rf', rf_clf)],
        voting='soft',
        weights=[2, 1, 1.5]  # Give more weight to XGBoost and RF
    )
    
    calibrated_clf = CalibratedClassifierCV(
        estimator=voting_clf,
        method='isotonic',
        cv=5
    )
    
    # 6. Create Pipeline with SMOTE
    print(f"\nApplying SMOTE to balance classes...")
    smote = SMOTE(sampling_strategy=0.9, random_state=RANDOM_SEED)  # Increase minority class to 90% of majority
    
    # Use imblearn Pipeline to include SMOTE
    pipeline = ImbPipeline(steps=[
        ('preprocessor', preprocessor),
        ('smote', smote),
        ('classifier', calibrated_clf)
    ])
    
    # 7. Train
    print("Training Ensemble Pipeline with SMOTE and Class Weights...")
    pipeline.fit(X_train_processed, y_train)
    
    # 7. Evaluate
    print("Evaluating...")
    y_prob = pipeline.predict_proba(X_test_processed)[:, 1]
    y_pred = pipeline.predict(X_test_processed)
    
    # Import additional metrics
    from sklearn.metrics import (
        accuracy_score, precision_score, recall_score, f1_score,
        confusion_matrix, classification_report
    )
    
    # Calculate metrics
    brier = brier_score_loss(y_test, y_prob)
    roc_auc = roc_auc_score(y_test, y_prob)
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)  # Same as Sensitivity
    f1 = f1_score(y_test, y_pred)
    
    # Confusion Matrix
    tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()
    specificity = tn / (tn + fp)
    sensitivity = recall  # Sensitivity = Recall = True Positive Rate
    
    # Print comprehensive metrics
    print(f"\n{'='*60}")
    print(f"{'COMPREHENSIVE MODEL EVALUATION METRICS':^60}")
    print(f"{'='*60}\n")
    
    print(f"📊 DISCRIMINATION METRICS")
    print(f"{'─'*60}")
    print(f"  ROC AUC Score:        {roc_auc:.4f} ({roc_auc*100:.2f}%)")
    print(f"  Accuracy:             {accuracy:.4f} ({accuracy*100:.2f}%)")
    print()
    
    print(f"🎯 CLASSIFICATION METRICS")
    print(f"{'─'*60}")
    print(f"  Precision:            {precision:.4f} ({precision*100:.2f}%)")
    print(f"  Recall/Sensitivity:   {recall:.4f} ({recall*100:.2f}%)")
    print(f"  Specificity:          {specificity:.4f} ({specificity*100:.2f}%)")
    print(f"  F1 Score:             {f1:.4f}")
    print()
    
    print(f"📈 CALIBRATION METRICS")
    print(f"{'─'*60}")
    print(f"  Brier Score:          {brier:.4f}")
    print()
    
    print(f"🔢 CONFUSION MATRIX")
    print(f"{'─'*60}")
    print(f"  True Negatives (TN):  {tn:,}")
    print(f"  False Positives (FP): {fp:,}")
    print(f"  False Negatives (FN): {fn:,}")
    print(f"  True Positives (TP):  {tp:,}")
    print()
    
    print(f"💡 INTERPRETATION")
    print(f"{'─'*60}")
    print(f"  Total Test Samples:   {len(y_test):,}")
    print(f"  Correct Predictions:  {tp + tn:,}")
    print(f"  Incorrect Predictions: {fp + fn:,}")
    print(f"{'='*60}\n")
    
    # Detailed classification report
    print("📋 DETAILED CLASSIFICATION REPORT")
    print(f"{'─'*60}")
    print(classification_report(y_test, y_pred, target_names=['No Diabetes', 'Diabetes'], digits=4))
    print(f"{'='*60}\n")
    
    # 8. Threshold Optimization
    print("🎯 THRESHOLD OPTIMIZATION")
    print(f"{'─'*60}")
    thresholds = np.arange(0.1, 0.9, 0.01)
    f1_scores = []
    sensitivities = []
    specificities = []
    
    for threshold in thresholds:
        y_pred_thresh = (y_prob >= threshold).astype(int)
        f1_scores.append(f1_score(y_test, y_pred_thresh))
        sensitivities.append(recall_score(y_test, y_pred_thresh))
        tn_t, fp_t, fn_t, tp_t = confusion_matrix(y_test, y_pred_thresh).ravel()
        specificities.append(tn_t / (tn_t + fp_t))
    
    optimal_idx = np.argmax(f1_scores)
    optimal_threshold = thresholds[optimal_idx]
    optimal_f1 = f1_scores[optimal_idx]
    optimal_sensitivity = sensitivities[optimal_idx]
    optimal_specificity = specificities[optimal_idx]
    
    print(f"  Default Threshold (0.5):  F1={f1:.4f}, Sensitivity={sensitivity:.4f}")
    print(f"  Optimal Threshold ({optimal_threshold:.2f}): F1={optimal_f1:.4f}, Sensitivity={optimal_sensitivity:.4f}")
    print(f"  Improvement: F1 +{(optimal_f1 - f1):.4f}, Sensitivity +{(optimal_sensitivity - sensitivity):.4f}")
    print(f"  Specificity at optimal: {optimal_specificity:.4f}")
    print(f"{'='*60}\n")
    
    # Use optimal threshold for final predictions
    y_pred_optimal = (y_prob >= optimal_threshold).astype(int)
    tn_opt, fp_opt, fn_opt, tp_opt = confusion_matrix(y_test, y_pred_optimal).ravel()
    
    print("📊 FINAL METRICS WITH OPTIMAL THRESHOLD")
    print(f"{'─'*60}")
    print(f"  Sensitivity: {optimal_sensitivity:.4f} ({optimal_sensitivity*100:.2f}%)")
    print(f"  Specificity: {optimal_specificity:.4f} ({optimal_specificity*100:.2f}%)")
    print(f"  F1 Score:    {optimal_f1:.4f}")
    print(f"  Precision:   {precision_score(y_test, y_pred_optimal):.4f}")
    print(f"  Accuracy:    {accuracy_score(y_test, y_pred_optimal):.4f}")
    print(f"\n  Confusion Matrix:")
    print(f"    TN: {tn_opt:,}  FP: {fp_opt:,}")
    print(f"    FN: {fn_opt:,}  TP: {tp_opt:,}")
    print(f"{'='*60}\n")
    
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
