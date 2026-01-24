import React from 'react';
import RiskGauge from './RiskGauge';
import ShapExplainer from './ShapExplainer';
import SimulationDashboard from './SimulationDashboard';
import { type PredictionResponse, type PredictionInput, generateReport } from '../api/client';
import { RefreshCcw, FileText, Cpu, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ClinicianDashboardProps {
    prediction: PredictionResponse;
    patientInput: PredictionInput;
    onReset: () => void;
}

const ClinicianDashboard: React.FC<ClinicianDashboardProps> = ({ prediction, patientInput, onReset }) => {
    const [report, setReport] = useState<string | null>(null);
    const [loadingReport, setLoadingReport] = useState(false);

    const handleGenerateReport = async () => {
        setLoadingReport(true);
        try {
            // Use the authoritative patient input data for the report
            const result = await generateReport(patientInput);
            setReport(result.report);
        } catch (error) {
            console.error("Failed to generate report:", error);
            setReport("Error: Could not generate report. Please ensure local LLM is running.");
        } finally {
            setLoadingReport(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Clinical Assessment Results</h2>
                <button
                    onClick={onReset}
                    className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                    <RefreshCcw size={16} />
                    <span>New Assessment</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risk Gauge Section */}
                <div className="space-y-4">
                    <RiskGauge riskScore={prediction.risk_score} />

                </div>

                {/* SHAP Explainer Section */}
                <div>
                    <ShapExplainer shapValues={prediction.shap_values || {}} />
                </div>
            </div>

            {/* Clinical Report Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <FileText className="text-purple-600 dark:text-purple-400" size={24} />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">AI Clinical Summary</h3>
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        disabled={loadingReport}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingReport ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                <span>Generating with BioMistral...</span>
                            </>
                        ) : (
                            <>
                                <Cpu size={16} />
                                <span>Generate Report</span>
                            </>
                        )}
                    </button>
                </div>

                {report ? (
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{report}</p>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                        Click "Generate Report" to get an AI-powered analysis of this patient's risk profile.
                    </div>
                )}
            </div>

            {/* Simulation Section */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <SimulationDashboard originalData={prediction as any} />
            </div>
        </div>
    );
};

export default ClinicianDashboard;
