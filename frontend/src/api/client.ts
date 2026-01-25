import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface PredictionInput {
    gender: string;
    age: number;
    hypertension: number;
    heart_disease: number;
    smoking_history: string;
    bmi: number;
    HbA1c_level: number;
    blood_glucose_level: number;
}

export interface PredictionResponse {
    risk_score: number;
    risk_level: string;
    shap_values?: Record<string, number>; // Optional as it comes from a separate call or merged
    explanations?: Array<{
        feature: string;
        impact_score: number;
        impact_description: string;
    }>;
}

export const predictRisk = async (data: PredictionInput): Promise<PredictionResponse> => {
    // 1. Get Prediction
    const predictionRes = await apiClient.post<{ risk_score: number; risk_level: string }>('/predict', data);

    // 2. Get Explanations (Parallel or sequential depending on need, sequential for simplicity here)
    // Note: In a real app, you might want into a single endpoint or handle failures gracefully
    let explanations: PredictionResponse['explanations'] = [];
    try {
        const explainRes = await apiClient.post<{ explanations: PredictionResponse['explanations'] }>('/explain', data);
        explanations = explainRes.data.explanations;
    } catch (error) {
        console.warn("Could not fetch explanations:", error);
    }

    // 3. Merge results
    // Mapping definitions to shap_values format if needed by legacy components, 
    // or just pass explanations directly. 
    // The existing components use 'shap_values: Record<string, number>'.
    const shap_values: Record<string, number> = {};
    explanations?.forEach(exp => {
        shap_values[exp.feature] = exp.impact_score;
    });

    return {
        ...predictionRes.data,
        explanations,
        shap_values
    };
};

export interface SimulationResponse {
    original_risk: number;
    new_risk: number;
    risk_reduction: number;
}

export const simulateRisk = async (
    patient: PredictionInput,
    modifications: Record<string, any>
): Promise<SimulationResponse> => {
    const response = await apiClient.post<SimulationResponse>('/simulate', {
        patient,
        modifications
    });
    return response.data;
};
export interface ReportResponse {
    report: string;
}

export const generateReport = async (patient: PredictionInput): Promise<ReportResponse> => {
    const response = await apiClient.post<ReportResponse>('/report', patient);
    return response.data;
};

export const generateSimulationReport = async (
    patient: PredictionInput,
    modifications: Record<string, any>
): Promise<ReportResponse> => {
    const response = await apiClient.post<ReportResponse>('/simulate/report', {
        patient,
        modifications
    });
    return response.data;
};
