import { useState } from 'react';
import PatientInputs from './components/PatientInputs';
import ClinicianDashboard from './components/ClinicianDashboard';
import AppShell from './components/layout/AppShell';
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
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Input Form */}
        <div className="lg:col-span-4 xl:col-span-4">
          <PatientInputs onPredictionSuccess={handlePredictionSuccess} />
        </div>

        {/* Right Column: Dashboard */}
        <div className="lg:col-span-8 xl:col-span-8">
          {predictionData ? (
            <ClinicianDashboard
              prediction={predictionData}
              patientInput={patientData!}
              onReset={() => { setPredictionData(null); setPatientData(null); }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[600px] bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center transition-all animate-fade-in">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-full mb-6">
                <Activity className="text-slate-300 dark:text-slate-600" size={64} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Ready for Assessment
              </h3>
              <p className="text-slate-500 max-w-sm leading-relaxed">
                Enter patient clinical metrics on the left to generate an AI-powered risk profile and treatment plan.
              </p>
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}

export default App;
