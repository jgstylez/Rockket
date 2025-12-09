import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ShoppingBag, Laptop, Coffee, Wrench, ArrowRight, ShieldCheck, Globe, X, Check, Terminal, Cpu, Box, Play, Video, PenTool } from 'lucide-react';
import { LaunchPadTemplate, View, Stage } from '../../types';
import { createPortal } from 'react-dom';

interface LaunchPadsProps {
  onDeploy: (template: LaunchPadTemplate) => void;
  templates: LaunchPadTemplate[];
  stage: Stage;
}

const LaunchPads: React.FC<LaunchPadsProps> = ({ onDeploy, templates, stage }) => {
  const [selectedPad, setSelectedPad] = useState<LaunchPadTemplate | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentLog, setDeploymentLog] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Filter templates based on stage
  const displayedTemplates = templates.filter(t => {
    if (stage === 'ideation') return t.id === 'genesis-01';
    return t.id !== 'genesis-01' && t.isAvailable;
  });

  const handleSelect = (template: LaunchPadTemplate) => {
    setSelectedPad(template);
  };

  const startDeployment = () => {
    setIsDeploying(true);
    setDeploymentLog(['> STARTING_SETUP...']);
  };

  // Terminal Log Simulation
  useEffect(() => {
    if (isDeploying && selectedPad) {
      const sequence = [
        { msg: `> TEMPLATE: ${selectedPad.name.toUpperCase()}`, delay: 500 },
        { msg: '> VERIFYING_USER_CREDENTIALS... [OK]', delay: 1000 },
        { msg: '> ALLOCATING_RESOURCES...', delay: 1500 },
        { msg: '> PROVISIONING_DATABASE...', delay: 2200 },
        { msg: `> CONFIGURING: ${selectedPad.features.join(', ')}`, delay: 3000 },
        { msg: '> ESTABLISHING_CONNECTION...', delay: 3800 },
        { msg: '> DEPLOYING_FRONTEND...', delay: 4200 },
        { msg: '> SYSTEM_CHECK_COMPLETE.', delay: 4800 },
        { msg: '> SETUP_COMPLETE.', delay: 5000 },
      ];

      let timeouts: ReturnType<typeof setTimeout>[] = [];

      sequence.forEach(({ msg, delay }) => {
        const timeout = setTimeout(() => {
          setDeploymentLog(prev => [...prev, msg]);
        }, delay);
        timeouts.push(timeout);
      });

      const finishTimeout = setTimeout(() => {
        onDeploy(selectedPad);
      }, 5500);
      timeouts.push(finishTimeout);

      return () => timeouts.forEach(clearTimeout);
    }
  }, [isDeploying, selectedPad, onDeploy]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [deploymentLog]);

  const getIcon = (name: string) => {
    switch (name) {
      case 'E-Commerce': return <ShoppingBag size={32} className="text-cyan-500" />;
      case 'SaaS Startup': return <Laptop size={32} className="text-purple-500" />;
      case 'Restaurant': return <Coffee size={32} className="text-orange-500" />;
      case 'Agency': return <Globe size={32} className="text-blue-500" />;
      case 'Contractor': return <Wrench size={32} className="text-yellow-500" />;
      case 'Healthcare': return <ShieldCheck size={32} className="text-emerald-500" />;
      case 'Creator': return <Video size={32} className="text-pink-500" />;
      case 'Blank Template': return <PenTool size={32} className="text-white" />;
      default: return <Box size={32} className="text-slate-500" />;
    }
  };

  // --- RENDER: DEPLOYMENT TERMINAL ---
  if (isDeploying) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] bg-black font-mono flex flex-col items-center justify-center p-8 animate-fade-in">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}>
        </div>

        <div className="relative z-10 w-full max-w-3xl border border-emerald-500/30 bg-black/80 backdrop-blur-md rounded-lg overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          {/* Header */}
          <div className="bg-emerald-900/20 border-b border-emerald-500/30 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-emerald-500" />
              <span className="text-emerald-500 font-bold text-sm tracking-widest">SETUP_CONSOLE_V2.4</span>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500/50 animate-pulse"></div>
            </div>
          </div>

          {/* Logs */}
          <div className="h-96 p-6 overflow-y-auto text-sm md:text-base space-y-2 custom-scroll">
            {deploymentLog.map((log, i) => (
              <div key={i} className="text-emerald-400 animate-fade-in">
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
            <div className="text-emerald-500 animate-pulse">_</div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-emerald-900/50 w-full">
            <div
              className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-[5000ms] ease-linear w-full"
              style={{ width: isDeploying ? '100%' : '0%' }}
            ></div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // --- RENDER: THE HANGAR (Selection View) ---
  return (
    <div className="min-h-full pb-10 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Cpu className="text-indigo-500" />
            Launch Pads
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl">
            {stage === 'ideation'
              ? 'Select a template to begin structuring your business concept.'
              : 'Select a pre-configured industry template to set up your workspace.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-4">
        {displayedTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleSelect(template)}
            className={`group relative cursor-pointer transition-all duration-500 perspective-1000 ${selectedPad?.id === template.id ? 'z-10' : 'z-0'}`}
          >
            {/* Hover Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-75 blur transition duration-500"></div>

            <GlassCard className={`relative h-full flex flex-col transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02] border-slate-200 dark:border-slate-700 ${selectedPad?.id === template.id
              ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 bg-white dark:bg-slate-900'
              : 'bg-white/80 dark:bg-slate-900/80'
              }`}>
              {/* Header Icon */}
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-xl transition-colors ${template.id === 'genesis-01'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                  }`}>
                  {getIcon(template.name)}
                </div>
                {selectedPad?.id === template.id && (
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center animate-bounce">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-500 transition-colors">
                {template.name}
              </h3>
              <p className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-4 tracking-widest">
                {template.industry}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 flex-1">
                {template.description}
              </p>

              {/* Feature Tags */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                {template.features.map((f, i) => (
                  <div key={i} className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></div>
                    {f}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        ))}
      </div>

      {/* Confirmation Overlay (Sticky Bottom) */}
      {selectedPad && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 animate-fade-in-up">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg hidden md:block">
                <Cpu size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Selection</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Start project with <span className="font-bold text-indigo-500">{selectedPad.name}</span> template?
                </p>
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={() => setSelectedPad(null)}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startDeployment}
                className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <Play size={18} className="fill-current" />
                CREATE PROJECT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaunchPads;