
import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { View } from '../../types';
import { useMission } from '../../context/MissionContext';
import {
   Radar, Target, Zap, Activity, Radio, ArrowRight,
   CheckCircle2, Loader2, BarChart2, Share2, Rocket, Eye, X
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Radar as RechartsRadar } from 'recharts';
import { generateLandingCopy } from '../../services/geminiService';
import LandingPagePreview from './LandingPagePreview';

interface SignalScannerProps {
   onNavigate: (view: View) => void;
   onValidationComplete: () => void;
}

const SignalScanner: React.FC<SignalScannerProps> = ({ onNavigate, onValidationComplete }) => {
   const { signalStrength, setSignalStrength, setMvpData } = useMission();
   const [step, setStep] = useState(1); // 1: Input, 2: Scanning, 3: Results
   const [formData, setFormData] = useState({ problem: '', solution: '', audience: '' });
   const [generatedCopy, setGeneratedCopy] = useState<any>(null);
   const [isSimulating, setIsSimulating] = useState(false);
   const [showPreviewModal, setShowPreviewModal] = useState(false);

   // Mock Radar Data
   const radarData = [
      { subject: 'Demand', A: 120, fullMark: 150 },
      { subject: 'Competition', A: 98, fullMark: 150 },
      { subject: 'Virality', A: 86, fullMark: 150 },
      { subject: 'Viability', A: 99, fullMark: 150 },
      { subject: 'Passion', A: 130, fullMark: 150 },
      { subject: 'Cost', A: 65, fullMark: 150 },
   ];

   const handleScan = async () => {
      if (!formData.problem || !formData.solution) return;
      setIsSimulating(true);
      setStep(2);

      // Generate Copy via AI
      const copy = await generateLandingCopy(formData.problem, formData.solution, formData.audience);
      setGeneratedCopy(copy);

      // Simulate Scanning Progress
      let progress = signalStrength;
      const interval = setInterval(() => {
         progress += 5;
         setSignalStrength(Math.min(progress, 95));
         if (progress >= 100) clearInterval(interval);
      }, 200);

      setTimeout(() => {
         clearInterval(interval);
         setSignalStrength(100);
         setIsSimulating(false);
         setStep(3);

         // Save MVP data to context
         setMvpData({
            problem: formData.problem,
            solution: formData.solution,
            audience: formData.audience,
            generatedCopy: copy
         });

         onValidationComplete();
      }, 4000);
   };

   return (
      <div className="h-full animate-fade-in flex flex-col gap-6 relative">
         {/* Header */}
         <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-xl text-red-500 shadow-lg shadow-red-500/10">
                  <Radio size={24} className={isSimulating ? "animate-ping" : ""} />
               </div>
               <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Signal Scanner</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-mono text-sm uppercase">MVP Validation Suite</p>
               </div>
            </div>

            {/* Signal Gauge */}
            <div className="hidden md:flex items-center gap-4 bg-white dark:bg-slate-900 p-2 pr-4 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
               <div className="relative w-12 h-12">
                  <svg className="w-full h-full transform -rotate-90">
                     <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                     <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
                        strokeDasharray={126}
                        strokeDashoffset={126 - (126 * signalStrength) / 100}
                        className={`transition-all duration-1000 ease-out ${signalStrength === 100 ? 'text-emerald-500' : 'text-red-500'}`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
                     {signalStrength}%
                  </div>
               </div>
               <div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Signal Strength</div>
                  <div className={`text-sm font-bold ${signalStrength === 100 ? 'text-emerald-500' : 'text-red-500'}`}>
                     {signalStrength === 100 ? 'VALIDATED' : 'WEAK SIGNAL'}
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">

            {/* LEFT PANEL: INPUT / RESULTS */}
            <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto custom-scroll pr-2">

               {step === 1 && (
                  <GlassCard className="space-y-6">
                     <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Define Mission Parameters</h3>
                        <div className="space-y-4">
                           <div>
                              <label className="block text-xs font-mono uppercase text-slate-500 mb-2">The Problem (Friction)</label>
                              <textarea
                                 value={formData.problem}
                                 onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                                 placeholder="e.g. Freelancers struggle to track expenses and always miss tax deductions."
                                 className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-mono uppercase text-slate-500 mb-2">The Solution (Payload)</label>
                              <textarea
                                 value={formData.solution}
                                 onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                                 placeholder="e.g. An AI-powered debit card that auto-categorizes every swipe instantly."
                                 className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-mono uppercase text-slate-500 mb-2">Target Sector (Audience)</label>
                              <input
                                 type="text"
                                 value={formData.audience}
                                 onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                                 placeholder="e.g. US-based Freelance Designers"
                                 className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white outline-none focus:border-red-500"
                              />
                           </div>
                        </div>
                     </div>
                     <button
                        onClick={handleScan}
                        disabled={!formData.problem || !formData.solution}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <Radar className="mr-2" /> INITIATE SMOKE TEST
                     </button>
                  </GlassCard>
               )}

               {step === 2 && (
                  <GlassCard className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                     <div className="relative w-32 h-32">
                        <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                        <div className="absolute inset-0 border-t-4 border-red-500 rounded-full animate-spin"></div>
                        <Radar size={48} className="absolute inset-0 m-auto text-red-500 animate-pulse" />
                     </div>
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Scanning Frequencies...</h3>
                        <p className="text-slate-500 mt-2 font-mono">Simulating market response for "{formData.audience}"</p>
                     </div>
                     <div className="w-full max-w-md bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${signalStrength}%` }}></div>
                     </div>
                  </GlassCard>
               )}

               {step === 3 && generatedCopy && (
                  <div className="space-y-6 animate-fade-in">
                     <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl flex items-center gap-4">
                        <div className="p-2 bg-emerald-500 rounded-full text-white">
                           <CheckCircle2 size={24} />
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-900 dark:text-white">Validation Complete</h3>
                           <p className="text-sm text-slate-600 dark:text-slate-300">Signal strength is strong enough to proceed to launch.</p>
                        </div>
                     </div>

                     <GlassCard>
                        <div className="flex justify-between items-center mb-4">
                           <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                              <Zap className="mr-2 text-yellow-500" /> Generated Landing Page
                           </h3>
                           <button
                              onClick={() => setShowPreviewModal(true)}
                              className="flex items-center gap-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded text-indigo-600 dark:text-indigo-400 font-bold transition-colors"
                           >
                              <Eye size={14} /> Preview Live Site
                           </button>
                        </div>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                           {/* Fake Browser Bar */}
                           <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-400"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                              <div className="w-3 h-3 rounded-full bg-green-400"></div>
                           </div>
                           {/* Preview Content */}
                           <div className="p-8 bg-white dark:bg-slate-950 text-center space-y-6">
                              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                 {generatedCopy.headline}
                              </h1>
                              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                                 {generatedCopy.subheadline}
                              </p>
                              <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-indigo-500 shadow-xl shadow-indigo-500/20">
                                 {generatedCopy.cta}
                              </button>
                              <p className="text-xs text-slate-400 mt-4">Join 420+ others on the waitlist</p>
                           </div>
                        </div>
                     </GlassCard>

                     <GlassCard>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                           <Share2 className="mr-2 text-blue-500" /> Viral Hook
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 font-medium text-slate-800 dark:text-slate-200 italic">
                           "{generatedCopy.viralTweet}"
                        </div>
                     </GlassCard>

                     <div className="pt-4 pb-8">
                        <button
                           onClick={() => onNavigate('dashboard')}
                           className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 animate-pulse-slow"
                        >
                           <Rocket size={20} />
                           UNLOCK LAUNCH PAD
                        </button>
                     </div>
                  </div>
               )}
            </div>

            {/* RIGHT PANEL: RADAR */}
            <div className="lg:col-span-5 h-full min-h-[400px]">
               <GlassCard className="h-full flex flex-col items-center justify-center bg-slate-900 border-slate-700 relative overflow-hidden">
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-20"
                     style={{
                        backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                     }}>
                  </div>

                  {step === 1 && (
                     <div className="text-center space-y-4 max-w-xs relative z-10">
                        <Activity size={64} className="mx-auto text-slate-700" />
                        <h3 className="text-xl font-bold text-slate-500">Awaiting Signal Data</h3>
                        <p className="text-sm text-slate-600">Enter mission parameters to begin holographic analysis.</p>
                     </div>
                  )}

                  {(step === 2 || step === 3) && (
                     <div className="w-full h-full relative z-10 animate-fade-in">
                        <h3 className="absolute top-0 left-0 text-xs font-mono text-red-500 uppercase font-bold tracking-widest flex items-center">
                           <Target size={14} className="mr-1" /> Market Resonance
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                           <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                              <PolarGrid stroke="#334155" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                              <RechartsRadar
                                 name="Signal"
                                 dataKey="A"
                                 stroke="#ef4444"
                                 strokeWidth={3}
                                 fill="#ef4444"
                                 fillOpacity={0.3}
                              />
                           </RadarChart>
                        </ResponsiveContainer>

                        <div className="absolute bottom-0 right-0 text-right">
                           <div className="text-3xl font-bold text-white">89<span className="text-sm text-slate-500">/100</span></div>
                           <div className="text-xs text-red-400 uppercase font-bold">Demand Score</div>
                        </div>
                     </div>
                  )}
               </GlassCard>
            </div>
         </div>

         {/* Full Screen Preview Modal */}
         {showPreviewModal && generatedCopy && (
            <LandingPagePreview
               generatedCopy={generatedCopy}
               onClose={() => setShowPreviewModal(false)}
               onProceed={() => {
                  setShowPreviewModal(false);
                  // User can now proceed since they've reviewed the landing page
               }}
            />
         )}

      </div>
   );
};

export default SignalScanner;
