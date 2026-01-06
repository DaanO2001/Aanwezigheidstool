import React from 'react';
import { CheckCircle2, RefreshCw, LogOut } from 'lucide-react';

interface SuccessScreenProps {
  onReset: () => void;
  action?: 'Inchecken' | 'Uitchecken';
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ onReset, action = 'Inchecken' }) => {
  const isIn = action === 'Inchecken';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-md mx-auto text-center fade-in">
      <div className={`bg-white p-10 rounded-3xl shadow-2xl ${isIn ? 'shadow-emerald-500/10 border-emerald-50' : 'shadow-slate-500/10 border-slate-50'} border w-full`}>
        <div className="mb-8 flex justify-center">
          <div className={`rounded-full p-4 ring-8 animate-pulse-slow ${isIn ? 'bg-emerald-100 ring-emerald-50' : 'bg-slate-100 ring-slate-50'}`}>
            {isIn ? (
                <CheckCircle2 className="h-16 w-16 text-emerald-600" />
            ) : (
                <LogOut className="h-16 w-16 text-slate-600 ml-1" />
            )}
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          {isIn ? 'Gelukt!' : 'Tot ziens!'}
        </h2>
        
        <p className="text-slate-600 text-lg leading-relaxed mb-8">
          {isIn ? (
            <>Je bent succesvol ingecheckt. <br/><span className="font-semibold text-emerald-600">Werk ze vandaag!</span></>
          ) : (
            <>Je bent succesvol uitgecheckt. <br/><span className="font-semibold text-slate-600">Fijne avond!</span></>
          )}
        </p>

        <button
          onClick={onReset}
          className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-base font-medium rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 transition-colors w-full"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Terug naar start
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;