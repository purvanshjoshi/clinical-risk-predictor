import React, { useState, useEffect, useCallback } from 'react';
import { simulateRisk, generateSimulationReport, type PredictionInput, type SimulationResponse } from '../api/client';
import SkeletonLoader from './SkeletonLoader';
import { RefreshCcw, ArrowRight, Sparkles } from 'lucide-react';
import { debounce } from 'lodash';

interface SimulationDashboardProps {
    originalData: PredictionInput;
}

const SimulationDashboard: React.FC<SimulationDashboardProps> = ({ originalData }) => {
    // Current state of sliders
    const [modifications, setModifications] = useState({
        bmi: 0,        // delta
        HbA1c_level: 0, // delta
        blood_glucose_level: 0 // delta
    });

    const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    // AI Report State
    const [aiReport, setAiReport] = useState<string | null>(null);
    const [loadingAi, setLoadingAi] = useState(false);

    const handleAnalyzeScenario = async () => {
        if (!simulationResult) return;
        setLoadingAi(true);
        try {
            const backendMods: Record<string, any> = {};
            if (modifications.bmi !== 0) backendMods.bmi = originalData.bmi + modifications.bmi;
            if (modifications.HbA1c_level !== 0) backendMods.HbA1c_level = originalData.HbA1c_level + modifications.HbA1c_level;
            if (modifications.blood_glucose_level !== 0) backendMods.blood_glucose_level = originalData.blood_glucose_level + modifications.blood_glucose_level;

            const result = await generateSimulationReport(originalData, backendMods);
            setAiReport(result.report);
        } catch (error) {
            console.error("AI Analysis failed", error);
        } finally {
            setLoadingAi(false);
        }
    };

    // Debounced simulation call
    const runSimulation = useCallback(
        debounce(async (mods: typeof modifications) => {
            setIsSimulating(true);
            try {
                // Construct absolute modification for backend
                const backendMods: Record<string, any> = {};
                if (mods.bmi !== 0) backendMods.bmi = originalData.bmi + mods.bmi;
                if (mods.HbA1c_level !== 0) backendMods.HbA1c_level = originalData.HbA1c_level + mods.HbA1c_level;
                if (mods.blood_glucose_level !== 0) backendMods.blood_glucose_level = originalData.blood_glucose_level + mods.blood_glucose_level;

                if (Object.keys(backendMods).length === 0) {
                    setSimulationResult(null);
                    setIsSimulating(false);
                    return;
                }

                const result = await simulateRisk(originalData, backendMods);
                setSimulationResult(result);
            } catch (err) {
                console.error("Simulation failed", err);
            } finally {
                setIsSimulating(false);
            }
        }, 500),
        [originalData]
    );

    useEffect(() => {
        setAiReport(null); // Clear old report on change
        runSimulation(modifications);
    }, [modifications, runSimulation]);

    const handleSliderChange = (field: keyof typeof modifications, value: number) => {
        setModifications(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sliders */}
                <div className="space-y-6">
                    {/* BMI Slider */}
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <label className="font-medium text-gray-700 dark:text-gray-300">Reduce BMI</label>
                            <span className="text-blue-600 font-bold">{modifications.bmi.toFixed(1)} points</span>
                        </div>
                        <input
                            type="range"
                            min="-10"
                            max="0"
                            step="0.5"
                            value={modifications.bmi}
                            onChange={(e) => handleSliderChange('bmi', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                        />
                        <div className="text-xs text-gray-400 mt-1">Current: {originalData.bmi} → Target: {(originalData.bmi + modifications.bmi).toFixed(1)}</div>
                    </div>

                    {/* HbA1c Slider */}
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <label className="font-medium text-gray-700 dark:text-gray-300">Lower HbA1c</label>
                            <span className="text-teal-600 font-bold">{modifications.HbA1c_level.toFixed(1)} %</span>
                        </div>
                        <input
                            type="range"
                            min="-3"
                            max="0"
                            step="0.1"
                            value={modifications.HbA1c_level}
                            onChange={(e) => handleSliderChange('HbA1c_level', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-teal-600"
                        />
                        <div className="text-xs text-gray-400 mt-1">Current: {originalData.HbA1c_level} → Target: {(originalData.HbA1c_level + modifications.HbA1c_level).toFixed(1)}</div>
                    </div>

                    {/* Glucose Slider */}
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <label className="font-medium text-gray-700 dark:text-gray-300">Lower Blood Glucose</label>
                            <span className="text-rose-600 font-bold">{modifications.blood_glucose_level} mg/dL</span>
                        </div>
                        <input
                            type="range"
                            min="-50"
                            max="0"
                            step="5"
                            value={modifications.blood_glucose_level}
                            onChange={(e) => handleSliderChange('blood_glucose_level', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-rose-600"
                        />
                        <div className="text-xs text-gray-400 mt-1">Current: {originalData.blood_glucose_level} → Target: {originalData.blood_glucose_level + modifications.blood_glucose_level}</div>
                    </div>
                </div>

                {/* Results Visualization */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                    {/* Loading Overlay */}
                    {isSimulating && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center backdrop-blur-sm">
                            <RefreshCcw className="animate-spin text-blue-600" />
                        </div>
                    )}

                    {!simulationResult ? (
                        <div className="text-center text-gray-400">
                            <p className="mb-2">Adjust sliders to simulate health improvements.</p>
                            <div className="text-xs">Changes are real-time via SOTA Model inference.</div>
                        </div>
                    ) : (
                        <div className="w-full space-y-4">
                            <div className="flex justify-between items-center w-full">
                                <div className="text-center px-4">
                                    <div className="text-sm text-gray-500">Original Risk</div>
                                    <div className="text-2xl font-bold text-gray-800 dark:text-white">{(simulationResult.original_risk * 100).toFixed(1)}%</div>
                                </div>
                                <ArrowRight className="text-gray-400" />
                                <div className="text-center px-4">
                                    <div className="text-sm text-gray-500">New Proposed Risk</div>
                                    <div className="text-3xl font-bold text-green-600">{(simulationResult.new_risk * 100).toFixed(1)}%</div>
                                </div>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4 relative">
                                <div
                                    className="bg-gray-400 h-2.5 rounded-full absolute top-0 left-0"
                                    style={{ width: `${simulationResult.original_risk * 100}%` }}
                                ></div>
                                <div
                                    className="bg-green-500 h-2.5 rounded-full absolute top-0 left-0 transition-all duration-500"
                                    style={{ width: `${simulationResult.new_risk * 100}%` }}
                                ></div>
                            </div>

                            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-center text-sm font-medium border border-green-200">
                                Projected Risk Reduction: {(simulationResult.risk_reduction * 100).toFixed(1)}%
                            </div>

                            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                {loadingAi ? (
                                    <div className="p-2">
                                        <SkeletonLoader />
                                    </div>
                                ) : !aiReport ? (
                                    <button
                                        onClick={handleAnalyzeScenario}
                                        disabled={loadingAi}
                                        className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                                    >
                                        <Sparkles size={16} />
                                        <span>Analyze with BioMistral</span>
                                    </button>
                                ) : (
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-800">
                                        <div className="flex items-center space-x-2 mb-1 text-purple-700 dark:text-purple-300 font-semibold text-xs uppercase tracking-wide">
                                            <Sparkles size={12} />
                                            <span>AI Insight</span>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {aiReport}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SimulationDashboard;
