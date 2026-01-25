import React, { useState } from 'react';
import RiskGauge from './RiskGauge';
import ShapExplainer from './ShapExplainer';
import SimulationDashboard from './SimulationDashboard';
import CohortCard from './CohortCard';
import TrendAnalysis from './TrendAnalysis';
import { type PredictionResponse, type PredictionInput, generateReport, submitFeedback, getFHIRBundle } from '../api/client';
import SkeletonLoader from './SkeletonLoader';
import { FileText, Cpu, Loader2, Download, Code, CheckCircle, XCircle } from 'lucide-react';
import SectionCard from './ui/SectionCard';

interface ClinicianDashboardProps {
    prediction: PredictionResponse;
    patientInput: PredictionInput;
    onReset: () => void;
}

const ClinicianDashboard: React.FC<ClinicianDashboardProps> = ({ prediction, patientInput }) => {
    const [report, setReport] = useState<string | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loadingReport, setLoadingReport] = useState(false);
    const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'submitted'>('idle');
    const [fhirVisible, setFhirVisible] = useState(false);
    const [fhirBundle, setFhirBundle] = useState<any>(null);

    const handleGenerateReport = async () => {
        setLoadingReport(true);
        try {
            const result = await generateReport(patientInput);
            setReport(result.report);
            if (result.pdf_url) {
                setPdfUrl(`http://localhost:8001${result.pdf_url}`); // Ensure base URL is correct for dev
            }
        } catch (error) {
            console.error("Failed to generate report:", error);
            setReport("Error: Could not generate report.");
        } finally {
            setLoadingReport(false);
        }
    };

    const handleFeedback = async (agreed: boolean) => {
        try {
            await submitFeedback(patientInput, prediction.risk_score, agreed, "Quick feedback from dashboard");
            setFeedbackStatus('submitted');
        } catch (e) {
            console.error("Feedback failed", e);
        }
    };

    const handleDownloadFHIR = async () => {
        const bundle = await getFHIRBundle(patientInput);
        setFhirBundle(bundle);
        setFhirVisible(true);
    };

    // Determine risk color for badges
    const getRiskColor = (score: number) => {
        if (score < 0.3) return 'bg-green-100 text-green-800 border-green-200';
        if (score < 0.7) return 'bg-amber-100 text-amber-800 border-amber-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    return (
        <div className="space-y-6 pb-20 animate-fade-in-up">

            {/* 1. Risk Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Main Risk Gauge Card */}
                <SectionCard
                    title="Current Risk Profile"
                    subtitle="Ensemble model prediction based on current vitals."
                    action={
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(prediction.risk_score)}`}>
                            {prediction.risk_level} Risk
                        </span>
                    }
                >
                    <div className="flex flex-col items-center">
                        <RiskGauge riskScore={prediction.risk_score} />

                        {/* Feedback Widget within Risk Card */}
                        <div className="mt-6 w-full max-w-xs bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">Clinical Validation:</span>
                            {feedbackStatus === 'submitted' ? (
                                <span className="text-green-600 flex items-center text-xs font-medium"><CheckCircle size={14} className="mr-1" /> Logged</span>
                            ) : (
                                <div className="flex space-x-2">
                                    <button onClick={() => handleFeedback(true)} className="p-1 hover:bg-green-100 text-slate-400 hover:text-green-600 rounded transition" title="Agree">
                                        <CheckCircle size={18} />
                                    </button>
                                    <button onClick={() => handleFeedback(false)} className="p-1 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded transition" title="Disagree">
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </SectionCard>

                {/* Longitudinal Trends */}
                <SectionCard title="Longitudinal Velocity" subtitle="Historical risk trajectory analysis.">
                    <TrendAnalysis />
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                        <button
                            onClick={handleDownloadFHIR}
                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                            <Code size={14} /> View FHIR Record
                        </button>
                    </div>
                </SectionCard>
            </div>

            {/* 2. Population & AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Cohort Analysis (3/5 width) */}
                <div className="lg:col-span-3">
                    <SectionCard title="Cohort Intelligence" subtitle="Population comparison and nearest-neighbor Digital Twins." className="h-full">
                        <CohortCard patientData={patientInput} />
                    </SectionCard>
                </div>

                {/* AI Summary (2/5 width) */}
                <div className="lg:col-span-2 h-full">
                    <SectionCard
                        title="AI Clinical Summary"
                        subtitle="Generated by BioMistral-7B."
                        className="h-full flex flex-col"
                    >
                        <div className="flex-grow flex flex-col">
                            {loadingReport ? (
                                <div className="py-8"><SkeletonLoader /></div>
                            ) : report ? (
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-sm leading-relaxed text-slate-700 dark:text-slate-300 overflow-y-auto max-h-[300px]">
                                    {report}
                                </div>
                            ) : (
                                <div className="flex-grow flex flex-col justify-center items-center text-center p-6 text-slate-400">
                                    <Cpu size={40} className="mb-3 opacity-20" />
                                    <p className="text-sm">Generate a report to view AI insights.</p>
                                </div>
                            )}

                            <div className="mt-6 flex flex-col gap-3">
                                <button
                                    onClick={handleGenerateReport}
                                    disabled={loadingReport}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm font-medium shadow-sm shadow-indigo-500/20"
                                >
                                    {loadingReport ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
                                    <span>{report ? 'Regenerate Summary' : 'Generate Clinical Report'}</span>
                                </button>

                                {pdfUrl && (
                                    <a
                                        href={pdfUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <Download size={16} />
                                        <span>Download Official PDF</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </SectionCard>
                </div>
            </div>

            {/* 3. Interactive Simulation */}
            <SectionCard title="What-If Analysis" subtitle="Simulate health improvements and observe projected risk reduction using counterfactuals.">
                <SimulationDashboard originalData={patientInput} />
            </SectionCard>

            {/* 4. Explainability Details */}
            <SectionCard title="Model Explainability" subtitle="SHAP (SHapley Additive exPlanations) values indicating feature impact.">
                <ShapExplainer shapValues={prediction.shap_values || {}} />
            </SectionCard>

            {/* FHIR Modal Overlay */}
            {fhirVisible && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-[100] p-4" onClick={() => setFhirVisible(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                                <Code className="text-blue-500" size={20} /> HL7 FHIR R4 Bundle
                            </h3>
                            <button onClick={() => setFhirVisible(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <div className="p-0 overflow-auto bg-slate-950">
                            <pre className="p-6 text-xs font-mono text-emerald-400 leading-normal">
                                {JSON.stringify(fhirBundle, null, 2)}
                            </pre>
                        </div>
                        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-end gap-3">
                            <button onClick={() => setFhirVisible(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                Close
                            </button>
                            <button onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(fhirBundle, null, 2));
                                setFhirVisible(false);
                            }} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                Copy JSON
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClinicianDashboard;
