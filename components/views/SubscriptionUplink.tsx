
import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Zap, Lock, DollarSign, TrendingUp, Calendar, Play } from 'lucide-react';

const SubscriptionUplink: React.FC = () => {
  const products = [
    { id: 1, name: 'The Inner Circle', type: 'Newsletter', price: '$9/mo', subscribers: 124, revenue: '$1,116' },
    { id: 2, name: 'FounderOS Course', type: 'Content Series', price: '$49', subscribers: 45, revenue: '$2,205' },
  ];

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none">
             <div className="flex items-center gap-3 mb-4 opacity-80">
                <div className="p-2 bg-white/10 rounded-lg"><DollarSign size={20} /></div>
                <span className="text-sm font-bold uppercase tracking-widest">MRR</span>
             </div>
             <div className="text-4xl font-bold mb-2">$3,321</div>
             <div className="text-sm opacity-70 flex items-center">
                <TrendingUp size={14} className="mr-1" /> +12% vs last month
             </div>
          </GlassCard>
          
          <GlassCard>
             <div className="flex items-center gap-3 mb-4 text-slate-500 dark:text-slate-400">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Zap size={20} /></div>
                <span className="text-sm font-bold uppercase tracking-widest">Active Subs</span>
             </div>
             <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">169</div>
             <div className="text-sm text-emerald-500 font-bold">
                8 new today
             </div>
          </GlassCard>

          <GlassCard className="border-orange-200 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-900/10">
             <div className="flex items-center gap-3 mb-4 text-orange-600 dark:text-orange-400">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg"><Lock size={20} /></div>
                <span className="text-sm font-bold uppercase tracking-widest">Paywall Hits</span>
             </div>
             <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">420</div>
             <div className="text-sm text-slate-500">
                2.4% conversion rate
             </div>
          </GlassCard>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[300px]">
          <div className="lg:col-span-2 space-y-6">
             <h3 className="font-bold text-slate-900 dark:text-white text-lg">Digital Products</h3>
             {products.map((product) => (
                <GlassCard key={product.id} className="flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-500">
                         {product.type === 'Newsletter' ? <Calendar size={24} /> : <Play size={24} />}
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-900 dark:text-white text-lg">{product.name}</h4>
                         <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold uppercase">{product.type}</span>
                            <span>{product.price}</span>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="font-bold text-slate-900 dark:text-white text-xl">{product.revenue}</div>
                      <div className="text-xs text-slate-500">{product.subscribers} active</div>
                   </div>
                </GlassCard>
             ))}
             
             <button className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 font-bold flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-500 hover:border-indigo-300 transition-all">
                <PlusIcon size={20} className="mr-2" /> Launch New Product
             </button>
          </div>

          <div>
             <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6">Series Flight Plan</h3>
             <GlassCard className="h-full bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                <div className="space-y-8 relative">
                   {[
                      { day: 'Day 0', title: 'Welcome & Freebie', status: 'Sent' },
                      { day: 'Day 2', title: 'Value Add #1', status: 'Sent' },
                      { day: 'Day 5', title: 'Soft Sell (Premium)', status: 'Active', active: true },
                      { day: 'Day 7', title: 'Discount Offer', status: 'Pending' },
                   ].map((step, i) => (
                      <div key={i} className="flex items-center gap-4 ml-1">
                         <div className={`w-3 h-3 rounded-full border-2 z-10 ${step.active ? 'bg-indigo-500 border-indigo-500 ring-4 ring-indigo-500/20' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}></div>
                         <div className={`flex-1 p-3 rounded-lg border ${step.active ? 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-500/30 shadow-sm' : 'border-transparent opacity-70'}`}>
                            <div className="text-xs font-mono text-slate-400 uppercase mb-0.5">{step.day}</div>
                            <div className="font-bold text-slate-800 dark:text-white text-sm">{step.title}</div>
                         </div>
                      </div>
                   ))}
                </div>
             </GlassCard>
          </div>
       </div>
    </div>
  );
};

const PlusIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default SubscriptionUplink;
