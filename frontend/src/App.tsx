import { useState } from 'react';
import PatientForm from './components/PatientForm';
import ClinicianDashboard from './components/ClinicianDashboard';
import { type PredictionResponse, type PredictionInput } from './api/client';
import { Activity } from 'lucide-react';

function App() {
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [patientData, setPatientData] = useState<PredictionInput | null>(null);

  const handlePredictionSuccess = (data: PredictionResponse, input: PredictionInput) => {
    setPredictionData(data);
    setPatientData(input);
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Clinical Risk Predictor <span className="text-purple-600 text-sm font-bold ml-2 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">SOTA Ensemble v1</span>
            </h1>
          </div>
          {/* Theme Toggle could go here */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Input Form */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24">
              <PatientForm onPredictionSuccess={handlePredictionSuccess} />
            </div>
          </div>

          {/* Right Column: Dashboard */}
          <div className="lg:col-span-8 xl:col-span-9">
            {predictionData ? (
              <ClinicianDashboard
                prediction={predictionData}
                patientInput={patientData!}
                onReset={() => { setPredictionData(null); setPatientData(null); }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[600px] bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-full mb-4">
                  <Activity className="text-slate-400" size={48} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No Assessment Data
                </h3>
                <p className="text-slate-500 max-w-sm">
                  Complete the patient form on the left to generate a risk analysis and AI-powered treatment plan.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
