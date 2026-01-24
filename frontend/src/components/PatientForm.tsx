import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { predictRisk, type PredictionInput, type PredictionResponse } from '../api/client';
import { Loader2, Activity, Cigarette } from 'lucide-react';

interface PatientFormProps {
    onPredictionSuccess: (data: PredictionResponse, inputData: PredictionInput) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onPredictionSuccess }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<PredictionInput>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: PredictionInput) => {
        setIsLoading(true);
        setError(null);
        try {
            // Convert types if necessary (hook form returns strings for number inputs sometimes)
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
            setError("Failed to get prediction. Ensure backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
    const errorClasses = "text-red-500 text-xs mt-1";

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700 w-full max-w-2xl mx-auto">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-full dark:bg-blue-900/30">
                    <Activity className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Patient Assessment</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enter clinical metrics for analysis</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Personal Info Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClasses}>Gender</label>
                        <select {...register("gender", { required: true })} className={inputClasses}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClasses}>Age</label>
                        <input
                            type="number"
                            step="1"
                            {...register("age", { required: true, min: 0, max: 120 })}
                            className={inputClasses}
                            placeholder="e.g. 45"
                        />
                        {errors.age && <p className={errorClasses}>Valid age required</p>}
                    </div>
                </div>

                {/* Habits & History */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className={labelClasses}>Smoking History</label>
                        <div className="relative">
                            <Cigarette className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
                            <select {...register("smoking_history", { required: true })} className={`${inputClasses} pl-10`}>
                                <option value="never">Never</option>
                                <option value="current">Current</option>
                                <option value="former">Former</option>
                                <option value="ever">Ever</option>
                                <option value="not current">Not Current</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>Hypertension</label>
                        <select {...register("hypertension")} className={inputClasses}>
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClasses}>Heart Disease</label>
                        <select {...register("heart_disease")} className={inputClasses}>
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>
                </div>

                {/* Clinical Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className={labelClasses}>BMI</label>
                        <input
                            type="number"
                            step="any"
                            {...register("bmi", { required: true, min: 10, max: 100 })}
                            className={inputClasses}
                            placeholder="24.5"
                        />
                        {errors.bmi && <p className={errorClasses}>Valid BMI required</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>HbA1c Level</label>
                        <input
                            type="number"
                            step="0.1"
                            {...register("HbA1c_level", { required: true, min: 2, max: 20 })}
                            className={inputClasses}
                            placeholder="5.7"
                        />
                        {errors.HbA1c_level && <p className={errorClasses}>Required</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Blood Glucose</label>
                        <input
                            type="number"
                            step="any"
                            {...register("blood_glucose_level", { required: true, min: 50, max: 500 })}
                            className={inputClasses}
                            placeholder="100"
                        />
                        {errors.blood_glucose_level && <p className={errorClasses}>Required</p>}
                    </div>
                </div>

                {error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-500/30"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Analyzing Patient Profile...
                        </>
                    ) : (
                        "Generate Risk Analysis"
                    )}
                </button>
            </form>
        </div>
    );
};

export default PatientForm;
