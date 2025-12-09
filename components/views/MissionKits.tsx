
import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { generateMissionStrategy } from '../../services/geminiService';
import { MissionInput, GeneratedStrategy, View } from '../../types';
import { Bot, FileText, CheckCircle2, Sparkles, AlertCircle, Copy, Loader2, ArrowRight } from 'lucide-react';

interface MissionKitsProps {
  onNavigate?: (view: View) => void;
}

const MissionKits: React.FC<MissionKitsProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<GeneratedStrategy | null>(null);
  const [input, setInput] = useState<MissionInput>({
    businessName: '',
    industry: '',
    targetAudience: '',
    keyDifferentiator: ''
  });

  const handleGenerate = async () => {
    if (!input.businessName || !input.industry) return;
    setLoading(true);
    try {
      const result = await generateMissionStrategy(input);
      setStrategy(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = input.businessName.length > 0 && input.industry.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in h-[calc(100vh-140px)]">
      {/* Left Panel: Input */}
      <div className="lg:col-span-5 flex flex-col h-full">
        <GlassCard className="flex-1 flex flex-col">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg mr-4">
              <Bot className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mission Strategist</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">AI-Powered Business Intelligence</p>
            </div>
          </div>

          <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scroll">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 text-xs font-mono uppercase mb-2">Vessel Name (Business)</label>
              <input
                type="text"
                value={input.businessName}
                onChange={(e) => setInput({ ...input, businessName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                placeholder="Ex: Galactic Coffee Co."
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 text-xs font-mono uppercase mb-2">Sector (Industry)</label>
              <select
                value={input.industry}
                onChange={(e) => setInput({ ...input, industry: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-indigo-500 outline-none appearance-none cursor-pointer"
              >
                <option value="">Select Sector...</option>
                <option value="E-commerce">E-commerce</option>
                <option value="SaaS">SaaS Technology</option>
                <option value="Consulting">Consulting & Agency</option>
                <option value="Health">Health & Wellness</option>
                <option value="Food">Food & Beverage</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 text-xs font-mono uppercase mb-2">Target Lifeforms (Audience)</label>
              <textarea
                value={input.targetAudience}
                onChange={(e) => setInput({ ...input, targetAudience: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-indigo-500 outline-none h-24 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-700"
                placeholder="Who are you serving?"
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 text-xs font-mono uppercase mb-2">Warp Drive (Differentiator)</label>
              <textarea
                value={input.keyDifferentiator}
                onChange={(e) => setInput({ ...input, keyDifferentiator: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-indigo-500 outline-none h-24 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-700"
                placeholder="What makes you unique?"
              />
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleGenerate}
              disabled={loading || !isFormValid}
              className={`w-full py-4 rounded-xl flex items-center justify-center font-bold tracking-wide transition-all ${loading || !isFormValid
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30 dark:shadow-indigo-900/50 hover:shadow-indigo-600/50'
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Computing Strategy...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" /> GENERATE MISSION KIT
                </>
              )}
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Right Panel: Output */}
      <div className="lg:col-span-7 h-full">
        <GlassCard className="h-full flex flex-col relative overflow-hidden">
          {!strategy ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-600">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6">
                <FileText size={40} className="text-slate-400 dark:text-slate-700" />
              </div>
              <p className="text-lg">Waiting for input data...</p>
              <p className="text-sm max-w-xs text-center mt-2 opacity-60">Complete the flight parameters on the left to generate your strategic documents.</p>
            </div>
          ) : (
            <div className="animate-fade-in flex-1 overflow-y-auto pr-2 custom-scroll space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                  <CheckCircle2 className="text-emerald-500 mr-2" />
                  Strategy Generated
                </h3>
                <div className="flex gap-2">
                  <button className="text-xs flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                    <Copy size={14} className="mr-1" /> Copy All
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate('mission_cockpit')}
                    className="text-xs flex items-center px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded font-bold hover:opacity-90 transition-opacity ml-2"
                  >
                    Open Editor <ArrowRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700/50 rounded-lg p-5">
                  <h4 className="text-indigo-600 dark:text-indigo-400 text-xs font-mono uppercase mb-2">Mission Statement</h4>
                  <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-light">"{strategy.missionStatement}"</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700/50 rounded-lg p-5">
                  <h4 className="text-purple-600 dark:text-purple-400 text-xs font-mono uppercase mb-2">Vision Trajectory</h4>
                  <p className="text-slate-700 dark:text-slate-300 italic">{strategy.vision}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700/50 rounded-lg p-5">
                    <h4 className="text-orange-600 dark:text-orange-400 text-xs font-mono uppercase mb-3">Core Engine Values</h4>
                    <ul className="space-y-2">
                      {strategy.coreValues.map((val, i) => (
                        <li key={i} className="flex items-start text-slate-700 dark:text-slate-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 mr-2" />
                          {val}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700/50 rounded-lg p-5">
                    <h4 className="text-cyan-600 dark:text-cyan-400 text-xs font-mono uppercase mb-3">Elevator Pitch</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {strategy.elevatorPitch}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg flex items-start mt-6">
                <AlertCircle className="text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5 mr-3" size={18} />
                <div>
                  <p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Next Recommended Action</p>
                  <p className="text-emerald-600/70 dark:text-emerald-400/70 text-xs mt-1">Export this to your "Flight Plans" to begin operationalizing this strategy.</p>
                </div>
                <button className="ml-auto text-xs bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded transition-colors">
                  Add to Plan
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default MissionKits;
