
import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Search, Users, Filter, Trash2, Crosshair, Sparkles, UserMinus, UserCheck } from 'lucide-react';

const SmartClusters: React.FC = () => {
   const [query, setQuery] = useState('');

   // Mock Clusters
   const clusters = [
      { id: 'vip', name: 'Highly Engaged', count: 142, color: 'bg-emerald-500', desc: 'High open rate + purchases' },
      { id: 'risk', name: 'At Risk', count: 89, color: 'bg-orange-500', desc: 'Inactive > 30 days' },
      { id: 'new', name: 'New Subscribers', count: 34, color: 'bg-cyan-500', desc: 'Joined < 7 days ago' },
   ];

   // Mock Contacts for Visualization
   const dots = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: i % 3 === 0 ? 'bg-emerald-400' : i % 3 === 1 ? 'bg-orange-400' : 'bg-cyan-400',
      size: Math.random() > 0.8 ? 'w-3 h-3' : 'w-1.5 h-1.5'
   }));

   return (
      <div className="h-full flex flex-col gap-6 animate-fade-in">
         {/* Top: Query Beam */}
         <GlassCard className="p-0 overflow-hidden bg-slate-900 border-slate-700 shadow-xl shrink-0">
            <div className="p-4 bg-indigo-900/20 border-b border-indigo-500/30 flex items-center gap-3">
               <Sparkles className="text-indigo-400" size={18} />
               <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Smart Audience Filter</span>
            </div>
            <div className="p-6 flex gap-4">
               <div className="flex-1 relative">
                  <Search className="absolute left-4 top-3.5 text-slate-500" size={20} />
                  <input
                     type="text"
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     placeholder="Ex: Show me everyone who clicked pricing but didn't buy..."
                     className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none font-sans text-sm"
                  />
               </div>
               <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-600/20 transition-all">
                  <Crosshair size={18} className="mr-2" />
                  Apply Filter
               </button>
            </div>
         </GlassCard>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
            {/* Left: Auto-Clusters */}
            <div className="space-y-4">
               <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
                  <Filter size={18} className="mr-2 text-indigo-500" /> Smart Segments
               </h3>
               {clusters.map((cluster) => (
                  <GlassCard key={cluster.id} className="group cursor-pointer hover:border-indigo-500/50 transition-all">
                     <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-slate-800 dark:text-white">{cluster.name}</div>
                        <div className={`w-2 h-2 rounded-full ${cluster.color} shadow-[0_0_8px_currentColor]`}></div>
                     </div>
                     <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{cluster.count}</div>
                     <p className="text-xs text-slate-500">{cluster.desc}</p>
                  </GlassCard>
               ))}

               <GlassCard className="border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 mt-6">
                  <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400 font-bold">
                     <Trash2 size={16} /> List Hygiene
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                     Identify and archive 12 inactive contacts to improve sender reputation.
                  </p>
                  <button className="w-full py-2 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/30 text-red-500 rounded-lg text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                     Clean Up Inactive
                  </button>
               </GlassCard>
            </div>

            {/* Right: The Nebula */}
            <GlassCard className="lg:col-span-2 bg-slate-950 border-slate-800 relative overflow-hidden flex flex-col">
               <div className="absolute inset-0 opacity-20"
                  style={{
                     backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                     backgroundSize: '30px 30px'
                  }}>
               </div>

               <div className="relative z-10 flex-1">
                  <div className="absolute top-4 left-4">
                     <h3 className="text-white font-bold flex items-center">
                        <Users size={18} className="mr-2 text-cyan-400" /> Subscriber Map
                     </h3>
                     <p className="text-xs text-slate-500 font-mono mt-1">Real-time activity view</p>
                  </div>

                  {/* Visualization Dots */}
                  <div className="w-full h-full relative mt-12">
                     {dots.map((dot) => (
                        <div
                           key={dot.id}
                           className={`absolute rounded-full ${dot.color} ${dot.size} shadow-[0_0_10px_currentColor] transition-all duration-1000`}
                           style={{ left: `${dot.x}%`, top: `${dot.y}%`, opacity: Math.random() * 0.5 + 0.5 }}
                        ></div>
                     ))}
                  </div>
               </div>

               {/* Legend */}
               <div className="relative z-10 pt-4 border-t border-slate-800 flex gap-4 text-xs font-mono">
                  <div className="flex items-center text-slate-400">
                     <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></div> Engaged
                  </div>
                  <div className="flex items-center text-slate-400">
                     <div className="w-2 h-2 rounded-full bg-orange-400 mr-2"></div> At Risk
                  </div>
                  <div className="flex items-center text-slate-400">
                     <div className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></div> New
                  </div>
               </div>
            </GlassCard>
         </div>
      </div>
   );
};

export default SmartClusters;
