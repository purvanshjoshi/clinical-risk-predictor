import React, { useEffect, useState } from 'react';
import { getDigitalTwins, getCohortAnalysis, type DigitalTwin, type CohortAnalysis, type PredictionInput } from '../api/client';
import { Users, UserPlus } from 'lucide-react';

interface CohortCardProps {
    patientData: PredictionInput;
}

const CohortCard: React.FC<CohortCardProps> = ({ patientData }) => {
    const [twins, setTwins] = useState<DigitalTwin[]>([]);
    const [analysis, setAnalysis] = useState<CohortAnalysis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCohortContext = async () => {
            setLoading(true);
            try {
                const [t, a] = await Promise.all([
                    getDigitalTwins(patientData),
                    getCohortAnalysis(patientData)
                ]);
                setTwins(t);
                setAnalysis(a);
            } catch (e) {
                console.error("Cohort fetch failed", e);
            } finally {
                setLoading(false);
            }
        };

        if (patientData) fetchCohortContext();
    }, [patientData]);

    if (loading) return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 h-full flex justify-center items-center">
            <div className="animate-pulse flex flex-col items-center">
                <Users className="text-gray-300 mb-2" size={32} />
                <span className="text-gray-400 text-sm">Searching Population Database...</span>
            </div>
        </div>
    );

    return (
        <div className="h-full">
            <div className="space-y-6">
                {/* Percentiles */}
                {analysis && (
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                            <span className="block text-xs text-gray-500 uppercase">Age Rank</span>
                            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                {analysis.percentiles['age_percentile']}%
                            </span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                            <span className="block text-xs text-gray-500 uppercase">BMI Rank</span>
                            <span className="text-lg font-bold text-blue-600">
                                {analysis.percentiles['bmi_percentile']}%
                            </span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                            <span className="block text-xs text-gray-500 uppercase">HbA1c Rank</span>
                            <span className="text-lg font-bold text-purple-600">
                                {analysis.percentiles['HbA1c_level_percentile']}%
                            </span>
                        </div>
                    </div>
                )}

                {/* Digital Twins */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <UserPlus size={14} className="mr-1" /> Similar Patients (Digital Twins)
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-2 py-1">Age</th>
                                    <th className="px-2 py-1">BMI</th>
                                    <th className="px-2 py-1">HbA1c</th>
                                    <th className="px-2 py-1">Outcome</th>
                                </tr>
                            </thead>
                            <tbody>
                                {twins.map((twin, i) => (
                                    <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-2 py-1">{twin.age}</td>
                                        <td className="px-2 py-1">{twin.bmi.toFixed(1)}</td>
                                        <td className="px-2 py-1">{twin.HbA1c_level}</td>
                                        <td className="px-2 py-1 font-medium">
                                            {twin.diabetes === 1
                                                ? <span className="text-red-500">Diabetic</span>
                                                : <span className="text-green-500">Healthy</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        * Outcomes of patients with closest vector similarity.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CohortCard;
