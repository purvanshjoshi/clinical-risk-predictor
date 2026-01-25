import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { predictRisk, type PredictionInput, type PredictionResponse } from '../api/client';
import { Loader2, Info } from 'lucide-react';
import SectionCard from "./ui/SectionCard";

interface PatientInputsProps {
    onPredictionSuccess: (data: PredictionResponse, inputData: PredictionInput) => void;
}

const PatientInputs: React.FC<PatientInputsProps> = ({ onPredictionSuccess }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<PredictionInput>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: PredictionInput) => {
        setIsLoading(true);
        setError(null);
        try {
            const payload: PredictionInput = {
                ...data,
                age: Number(data.age),
                hypertension: Number(data.hypertension),
                heart_disease: Number(data.heart_disease),
                bmi: Number(data.bmi),
                HbA1c_level: Number(data.HbA1c_level),
                blood_glucose_level: Number(data.blood_glucose_level),
            };

            const result = await predictRisk(payload);
            onPredictionSuccess(result, payload);
        } catch (err) {
            console.error(err);
            setError("Analysis service unavailable. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputWrapperClass = "space-y-1.5";
    const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300";
    const inputClass = "w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm";
    const helperClass = "text-xs text-slate-500 dark:text-slate-400";
    const errorClass = "text-xs text-red-600 font-medium";

    return (
        <SectionCard
            title="Patient Demographics & Vitals"
            subtitle="Enter clinical metrics for risk stratification."
            className="h-full sticky top-24"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* 1. Demographics */}
                <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-700 pb-2 mb-3">Core Demographics</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className={inputWrapperClass}>
                            <label className={labelClass}>Age</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    {...register("age", { required: true, min: 0, max: 120 })}
                                    className={inputClass}
                                    placeholder="e.g. 55"
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">yrs</span>
                            </div>
                            {errors.age && <p className={errorClass}>Required</p>}
                        </div>

                        <div className={inputWrapperClass}>
                            <label className={labelClass}>Gender</label>
                            <select {...register("gender", { required: true })} className={inputClass}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className={inputWrapperClass}>
                        <label className={labelClass}>Smoking History</label>
                        <select {...register("smoking_history", { required: true })} className={inputClass}>
                            <option value="never">Never</option>
                            <option value="current">Current Smoker</option>
                            <option value="former">Former Smoker</option>
                            <option value="ever">Ever</option>
                            <option value="not current">Not Current</option>
                        </select>
                    </div>
                </div>

                {/* 2. Medical History */}
                <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-700 pb-2 mb-3 mt-6">Medical History</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className={inputWrapperClass}>
                            <label className={labelClass}>Hypertension</label>
                            <select {...register("hypertension")} className={inputClass}>
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                            </select>
                        </div>

                        <div className={inputWrapperClass}>
                            <label className={labelClass}>Heart Disease</label>
                            <select {...register("heart_disease")} className={inputClass}>
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 3. Clinical Metrics */}
                <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-700 pb-2 mb-3 mt-6">Biometrics</h4>

                    <div className={inputWrapperClass}>
                        <label className={labelClass}>BMI (Body Mass Index)</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.1"
                                {...register("bmi", { required: true, min: 10, max: 100 })}
                                className={inputClass}
                                placeholder="e.g. 24.5"
                            />
                            <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">kg/m²</span>
                        </div>
                        <p className={helperClass}>Normal range: 18.5 – 24.9</p>
                        {errors.bmi && <p className={errorClass}>Valid BMI required</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className={inputWrapperClass}>
                            <label className={labelClass}>HbA1c</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.1"
                                    {...register("HbA1c_level", { required: true, min: 2, max: 20 })}
                                    className={inputClass}
                                    placeholder="5.7"
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">%</span>
                            </div>
                        </div>

                        <div className={inputWrapperClass}>
                            <label className={labelClass}>Glucose</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="1"
                                    {...register("blood_glucose_level", { required: true, min: 50, max: 500 })}
                                    className={inputClass}
                                    placeholder="100"
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">mg/dL</span>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 rounded-md text-sm flex items-start gap-2">
                        <Info size={16} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={18} />
                            Processing Clinical Data...
                        </>
                    ) : (
                        "Run Risk Analysis"
                    )}
                </button>
            </form>
        </SectionCard>
    );
};

export default PatientInputs;
