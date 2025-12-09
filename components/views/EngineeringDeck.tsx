
import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import FlightPlans from './FlightPlans';
import {
   Workflow, GitBranch, Cpu, Play, Settings,
   Activity, Zap, Box, ArrowRight, Link, FileCode
} from 'lucide-react';

interface EngineeringDeckProps {
   activeTab?: 'workflows' | 'integrations' | 'logs';
   onTabChange?: (tab: 'workflows' | 'integrations' | 'logs') => void;
}

const EngineeringDeck: React.FC<EngineeringDeckProps> = ({ onNavigate, activeTab: externalActiveTab, onTabChange }) => {
   const [internalActiveTab, setInternalActiveTab] = useState<'workflows' | 'integrations' | 'logs'>('workflows');

   // Use external tab if provided, otherwise use internal state
   const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;

   // Handle tab changes
   const handleTabChange = (tab: 'workflows' | 'integrations' | 'logs') => {
      if (onTabChange) {
         onTabChange(tab);
      } else {
         setInternalActiveTab(tab);
      }
   };

   return (
      <div className="h-full animate-fade-in flex flex-col">
         {/* Header */}
         <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
            <div>
               <div className="flex items-center gap-2 mb-1 text-indigo-500">
                  <Workflow size={18} />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">Engineering Deck</span>
               </div>
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Operations Core</h2>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
               <button
                  onClick={() => handleTabChange('workflows')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'workflows'
                     ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                     : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                     }`}
               >
                  Workflows
               </button>
               <button
                  onClick={() => handleTabChange('integrations')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'integrations'
                     ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                     : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                     }`}
               >
                  Integrations
               </button>
               <button
                  onClick={() => handleTabChange('logs')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'logs'
                     ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                     : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                     }`}
               >
                  Logs
               </button>
            </div>
         </div>

         <div className="flex-1 min-h-0">
            {activeTab === 'workflows' ? (
               <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Sidebar Controls */}
                  <div className="lg:col-span-1 space-y-6">
                     <GlassCard>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                           <Cpu size={18} className="mr-2 text-indigo-500" /> System Load
                        </h3>
                        <div className="space-y-4">
                           <div>
                              <div className="flex justify-between text-xs text-slate-500 mb-1">
                                 <span>CPU Usage</span>
                                 <span>32%</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                 <div className="h-full bg-indigo-500 w-[32%]"></div>
                              </div>
                           </div>
                           <div>
                              <div className="flex justify-between text-xs text-slate-500 mb-1">
                                 <span>Memory</span>
                                 <span>54%</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                 <div className="h-full bg-purple-500 w-[54%]"></div>
                              </div>
                           </div>
                        </div>
                     </GlassCard>

                     <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase px-2">Automation Steps</p>
                        {[
                           { name: 'Lead Intake', type: 'Trigger', status: 'Active', color: 'text-orange-500' },
                           { name: 'Email Parser', type: 'Processor', status: 'Active', color: 'text-blue-500' },
                           { name: 'CRM Sync', type: 'Action', status: 'Idle', color: 'text-emerald-500' },
                        ].map((node, i) => (
                           <GlassCard key={i} className="p-3 flex items-center justify-between cursor-move hover:border-indigo-500/50 transition-colors">
                              <div className="flex items-center gap-3">
                                 <Box size={16} className={node.color} />
                                 <div>
                                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{node.name}</div>
                                    <div className="text-[10px] text-slate-500 uppercase">{node.type}</div>
                                 </div>
                              </div>
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                           </GlassCard>
                        ))}

                        <button className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 font-bold text-xs flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                           <Plus size={16} className="mr-2" /> ADD STEP
                        </button>
                     </div>
                  </div>

                  {/* Node Graph Visualizer (Mock) */}
                  <div className="lg:col-span-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center">
                     {/* Background Grid */}
                     <div className="absolute inset-0 opacity-20"
                        style={{
                           backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
                           backgroundSize: '20px 20px'
                        }}>
                     </div>

                     {/* Mock Flow */}
                     <div className="relative z-10 flex items-center gap-8">
                        {/* Node 1 */}
                        <div className="w-48 bg-white dark:bg-slate-800 border border-orange-500 shadow-lg shadow-orange-500/20 rounded-xl p-4 relative">
                           <div className="absolute -top-3 left-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">TRIGGER</div>
                           <div className="flex items-center gap-3 mb-2">
                              <Zap className="text-orange-500" size={20} />
                              <span className="font-bold text-slate-800 dark:text-white">New Lead</span>
                           </div>
                           <div className="text-xs text-slate-500">Source: Landing Page</div>
                           <div className="absolute -right-2 top-1/2 w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded-full border-2 border-white dark:border-slate-800"></div>
                        </div>

                        <ArrowRight className="text-slate-400" />

                        {/* Node 2 */}
                        <div className="w-48 bg-white dark:bg-slate-800 border border-blue-500 shadow-lg shadow-blue-500/20 rounded-xl p-4 relative">
                           <div className="absolute -top-3 left-4 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">LOGIC</div>
                           <div className="flex items-center gap-3 mb-2">
                              <GitBranch className="text-blue-500" size={20} />
                              <span className="font-bold text-slate-800 dark:text-white">Qualify</span>
                           </div>
                           <div className="text-xs text-slate-500">If budget {'>'} $5k</div>
                           <div className="absolute -left-2 top-1/2 w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded-full border-2 border-white dark:border-slate-800"></div>
                           <div className="absolute -right-2 top-1/2 w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded-full border-2 border-white dark:border-slate-800"></div>
                        </div>

                        <ArrowRight className="text-slate-400" />

                        {/* Node 3 */}
                        <div className="w-48 bg-white dark:bg-slate-800 border border-emerald-500 shadow-lg shadow-emerald-500/20 rounded-xl p-4 relative">
                           <div className="absolute -top-3 left-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ACTION</div>
                           <div className="flex items-center gap-3 mb-2">
                              <Play className="text-emerald-500" size={20} />
                              <span className="font-bold text-slate-800 dark:text-white">Send Email</span>
                           </div>
                           <div className="text-xs text-slate-500">Template: Welcome_v2</div>
                           <div className="absolute -left-2 top-1/2 w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded-full border-2 border-white dark:border-slate-800"></div>
                        </div>
                     </div>

                     <div className="absolute bottom-6 right-6 flex gap-2">
                        <button className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 hover:text-indigo-500">
                           <Settings size={20} />
                        </button>
                        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-colors">
                           <Play size={16} className="mr-2" /> Test Run
                        </button>
                     </div>
                  </div>
               </div>
            ) : activeTab === 'integrations' ? (
               <div className="h-full flex items-center justify-center">
                  <GlassCard className="max-w-md text-center">
                     <Link size={48} className="mx-auto mb-4 text-indigo-500" />
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Integrations Hub</h3>
                     <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Connect your favorite tools and services to automate workflows.
                     </p>
                     <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all">
                        Browse Integrations
                     </button>
                  </GlassCard>
               </div>
            ) : (
               <div className="h-full flex items-center justify-center">
                  <GlassCard className="max-w-md text-center">
                     <FileCode size={48} className="mx-auto mb-4 text-slate-400" />
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">System Logs</h3>
                     <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Monitor system activity, errors, and performance metrics.
                     </p>
                     <button className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition-all">
                        View Logs
                     </button>
                  </GlassCard>
               </div>
            )}
         </div>
      </div>
   );
};

// Helper Icon
const Plus = ({ size, className }: { size: number, className?: string }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default EngineeringDeck;
