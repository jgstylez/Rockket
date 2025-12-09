import React, { useState, useEffect } from 'react';
import { Rocket, FileText, Globe, Zap, Check, ChevronRight, Layout, BarChart3 } from 'lucide-react';
import { LaunchPadTemplate, Stage } from '../../types';

interface OnboardingProps {
  onComplete: (data: { stage: Stage }) => void;
  templates?: LaunchPadTemplate[]; // Kept for type compatibility but unused in new flow
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0); // 0: Welcome, 1: Telemetry Check, 2: Calibration
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  
  // Calibration State
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [systemLog, setSystemLog] = useState<string>('Initializing Telemetry...');

  useEffect(() => {
    if (step === 2 && selectedStage) {
      const interval = setInterval(() => {
        setCalibrationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete({ stage: selectedStage });
            }, 800);
            return 100;
          }
          
          // Simulation logic based on stage
          if (prev === 10) setSystemLog('Analyzing Mission Parameters...');
          
          if (selectedStage === 'ideation') {
             if (prev === 30) setSystemLog('Deploying Genesis Pad...');
             if (prev === 60) setSystemLog('Initializing Name Generator...');
             if (prev === 85) setSystemLog('Loading Blueprint Engine...');
          } else if (selectedStage === 'setup') {
             if (prev === 30) setSystemLog('Deploying Ignition Pad...');
             if (prev === 60) setSystemLog('Calibrating Brand Matrix...');
             if (prev === 85) setSystemLog('Checking Domain Availability...');
          } else {
             if (prev === 30) setSystemLog('Deploying Velocity Pad...');
             if (prev === 60) setSystemLog('Connecting Telemetry Streams...');
             if (prev === 85) setSystemLog('Optimizing Automation Flows...');
          }
          
          return prev + 2; // Fast load
        });
      }, 40); // 2 seconds total roughly
      return () => clearInterval(interval);
    }
  }, [step, selectedStage, onComplete]);

  // Step 0: Welcome
  if (step === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 text-center animate-fade-in bg-slate-50 dark:bg-space-950">
        <div className="w-24 h-24 bg-gradient-to-tr from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.4)] mb-8 animate-float">
          <Rocket className="text-white transform -rotate-45" size={48} />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
          Rockket
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-12">
          Business Launch OS.
          <br/>
          Identify your trajectory. We'll handle the rest.
        </p>
        <button 
          onClick={() => setStep(1)}
          className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all transform hover:scale-105"
        >
          Begin Telemetry Check
          <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-orange-500/50 transition-all animate-pulse-slow"></div>
        </button>
      </div>
    );
  }

  // Step 1: Telemetry Check (Diagnostic)
  if (step === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 py-8 animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Calibrating Mission Parameters...</h2>
          <p className="text-slate-500 dark:text-slate-400">Report your current status to initialize the correct systems.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
          
          {/* Card 1: Ideation */}
          <button 
            onClick={() => { setSelectedStage('ideation'); setStep(2); }}
            className="group text-left relative bg-white/50 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col h-96"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
            <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
               <FileText size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Just a Vision</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 flex-1">
              "I have an idea, but I need a name, a business plan, and a structure."
            </p>
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 w-full">
               <div className="flex items-center text-xs font-bold text-indigo-500 uppercase tracking-widest">
                  Deploying Genesis Pad <ChevronRight size={14} className="ml-1" />
               </div>
            </div>
          </button>

          {/* Card 2: Setup */}
          <button 
            onClick={() => { setSelectedStage('setup'); setStep(2); }}
            className="group text-left relative bg-white/50 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-400 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col h-96"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
            <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-600 dark:text-orange-400 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
               <Rocket size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Ready for Ignition</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 flex-1">
              "I have the basics. I need a brand identity, a website, and legal formation."
            </p>
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 w-full">
               <div className="flex items-center text-xs font-bold text-orange-500 uppercase tracking-widest">
                  Deploying Ignition Pad <ChevronRight size={14} className="ml-1" />
               </div>
            </div>
          </button>

          {/* Card 3: Growth */}
          <button 
            onClick={() => { setSelectedStage('growth'); setStep(2); }}
            className="group text-left relative bg-white/50 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col h-96"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
               <Globe size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Stabilize & Scale</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 flex-1">
              "I have revenue. I need automation, team hiring, and analytics optimization."
            </p>
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 w-full">
               <div className="flex items-center text-xs font-bold text-emerald-500 uppercase tracking-widest">
                  Deploying Velocity Pad <ChevronRight size={14} className="ml-1" />
               </div>
            </div>
          </button>

        </div>
      </div>
    );
  }

  // Step 2: System Calibration (Animation)
  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 animate-fade-in bg-black">
         {/* Grid Background */}
         <div className="absolute inset-0 opacity-20" 
             style={{ 
                 backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
             }}>
         </div>

         <div className="relative z-10 w-full max-w-lg">
            <div className="flex justify-between items-end mb-4 font-mono">
               <span className="text-emerald-500 animate-pulse text-sm">System_Check_Override</span>
               <span className="text-emerald-500 text-xl font-bold">{calibrationProgress}%</span>
            </div>

            {/* HUD Bar */}
            <div className="h-12 w-full border border-slate-700 bg-slate-900/80 rounded p-1 mb-6 relative overflow-hidden">
               {/* Scanline */}
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent w-20 h-full animate-[spin_2s_linear_infinite] translate-x-[-100%]"></div>
               
               <div 
                  className="h-full bg-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-75 ease-out"
                  style={{ width: `${calibrationProgress}%` }}
               ></div>
            </div>

            {/* Log Output */}
            <div className="font-mono text-sm space-y-2 h-24">
               <div className="text-slate-400 flex items-center">
                  <Check size={14} className="mr-2 text-emerald-500" /> User Credentials Verified
               </div>
               {calibrationProgress > 20 && (
                  <div className="text-slate-400 flex items-center animate-fade-in">
                     <Check size={14} className="mr-2 text-emerald-500" /> Database Connection Established
                  </div>
               )}
               {calibrationProgress > 40 && (
                  <div className="text-white font-bold flex items-center animate-fade-in">
                     <ChevronRight size={14} className="mr-2 text-emerald-500" /> {systemLog}
                  </div>
               )}
            </div>
         </div>
      </div>
    );
  }

  return null;
};

export default Onboarding;