
import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import SmartClusters from './SmartClusters';
import SubscriptionUplink from './SubscriptionUplink';
import {
   Wifi, Shield, Zap, Radio, BarChart3, Calendar,
   Send, AlertTriangle, CheckCircle2, MoreHorizontal,
   Mail, Users, MousePointer2, ArrowUpRight, Layout,
   FileText, PieChart, TrendingUp, Copy, Eye, Clock,
   Search, Plus, Edit2, Filter, Trash2, X, Save
} from 'lucide-react';
import {
   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
   BarChart, Bar, Cell, PieChart as RePieChart, Pie
} from 'recharts';
import { View } from '../../types';

interface BroadcastDeckProps {
   onNavigate?: (view: View) => void;
   activeTab?: BroadcastTab;
   onTabChange?: (tab: BroadcastTab) => void;
}

type BroadcastTab = 'campaigns' | 'audience' | 'templates' | 'analytics' | 'uplink';

const BroadcastDeck: React.FC<BroadcastDeckProps> = ({ onNavigate, activeTab: externalActiveTab, onTabChange }) => {
   const [internalActiveTab, setInternalActiveTab] = useState<BroadcastTab>('campaigns');

   // Use external tab if provided, otherwise use internal state
   const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;

   // Handle tab changes
   const handleTabChange = (tab: BroadcastTab) => {
      if (onTabChange) {
         onTabChange(tab);
      } else {
         setInternalActiveTab(tab);
      }
   };

   // Template State
   const [templateSearch, setTemplateSearch] = useState('');
   const [templateFilter, setTemplateFilter] = useState('All');

   // Campaign State
   const [campaignsList, setCampaignsList] = useState([
      { id: 1, name: 'Alpha Launch Announcement', subject: 'The wait is over. Rockket is live.', status: 'Sending', type: 'Email Blast', audience: 'Waitlist (All)', total: 5000, sent: 1420, openRate: 42.5, clickRate: 12.4, scheduledFor: '' },
      { id: 2, name: 'Onboarding Nurture Seq.', subject: 'Day 1: Calibrating your engine', status: 'Active', type: 'Automation', audience: 'New Signups', total: 1240, sent: 1240, openRate: 68.2, clickRate: 24.1, scheduledFor: '' },
      { id: 3, name: 'Q4 Product Update', subject: 'New boosters available', status: 'Scheduled', type: 'Newsletter', audience: 'Pro Users', total: 850, sent: 0, openRate: 0, clickRate: 0, scheduledFor: '2023-11-24 09:00' },
      { id: 4, name: 'Unfinished Setup Poke', subject: 'Your mission is paused...', status: 'Drafting', type: 'Recovery', audience: 'Incomplete Setup', total: 0, sent: 0, openRate: 0, clickRate: 0, scheduledFor: '' }
   ]);

   // Scheduling Modal State
   const [schedulingId, setSchedulingId] = useState<number | null>(null);
   const [scheduleDate, setScheduleDate] = useState('');
   const [scheduleTime, setScheduleTime] = useState('');

   // Live Telemetry State for "Broadcasting" campaign
   // Update the specific campaign in the list instead of a separate state variable for count
   useEffect(() => {
      const interval = setInterval(() => {
         setCampaignsList(prev => prev.map(c => {
            if (c.status === 'Sending') {
               const newSent = Math.min(c.total, c.sent + Math.floor(Math.random() * 9) + 3);
               return { ...c, sent: newSent };
            }
            return c;
         }));
      }, 150);
      return () => clearInterval(interval);
   }, []);

   const templates = [
      { id: 1, name: 'The Weekly Pulse', type: 'Newsletter', category: 'Editorial', used: 124 },
      { id: 2, name: 'Flash Sale Alert', type: 'Promo', category: 'Sales', used: 85 },
      { id: 3, name: 'SaaS Welcome Sequence', type: 'Automation', category: 'Onboarding', used: 432 },
      { id: 4, name: 'Product Update Log', type: 'Update', category: 'Technical', used: 56 },
      { id: 5, name: 'Event Invitation', type: 'Invite', category: 'Events', used: 32 },
      { id: 6, name: 'User Re-engagement', type: 'Recovery', category: 'Retention', used: 89 },
   ];

   const analyticsData = [
      { name: 'Mon', opens: 4000, clicks: 2400 },
      { name: 'Tue', opens: 3000, clicks: 1398 },
      { name: 'Wed', opens: 2000, clicks: 9800 },
      { name: 'Thu', opens: 2780, clicks: 3908 },
      { name: 'Fri', opens: 1890, clicks: 4800 },
      { name: 'Sat', opens: 2390, clicks: 3800 },
      { name: 'Sun', opens: 3490, clicks: 4300 },
   ];

   const deviceData = [
      { name: 'Mobile', value: 400, color: '#6366f1' },
      { name: 'Desktop', value: 300, color: '#10b981' },
      { name: 'Tablet', value: 100, color: '#f97316' },
   ];

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'Sending': return 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10 animate-pulse';
         case 'Active': return 'text-blue-500 border-blue-500/50 bg-blue-500/10';
         case 'Scheduled': return 'text-orange-500 border-orange-500/50 bg-orange-500/10';
         default: return 'text-slate-500 border-slate-500/50 bg-slate-500/10';
      }
   };

   const openScheduler = (id: number, currentDateTime: string) => {
      setSchedulingId(id);
      if (currentDateTime) {
         const [date, time] = currentDateTime.split(' ');
         setScheduleDate(date);
         setScheduleTime(time);
      } else {
         const now = new Date();
         setScheduleDate(now.toISOString().split('T')[0]);
         setScheduleTime('09:00');
      }
   };

   const saveSchedule = () => {
      if (schedulingId) {
         const newDateTime = `${scheduleDate} ${scheduleTime}`;
         setCampaignsList(prev => prev.map(c =>
            c.id === schedulingId ? { ...c, scheduledFor: newDateTime } : c
         ));
         setSchedulingId(null);
      }
   };

   // --- RENDERERS ---

   const renderTransceiver = () => (
      <div className="space-y-6 animate-fade-in relative">
         {/* HUD & Spectrum (Existing Dashboard) */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="relative overflow-hidden group">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                     <Shield size={24} />
                  </div>
                  <span className="text-xs font-mono text-slate-400 uppercase">Email Deliverability</span>
               </div>
               <div className="relative">
                  <div className="flex items-end gap-2 mb-2">
                     <span className="text-4xl font-bold text-slate-900 dark:text-white">98%</span>
                     <span className="text-sm font-bold text-emerald-500 mb-1">Excellent</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_10px_#10b981]"></div>
                  </div>
               </div>
            </GlassCard>

            <GlassCard className="relative overflow-hidden group">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                     <Wifi size={24} />
                  </div>
                  <span className="text-xs font-mono text-slate-400 uppercase">Open Rate</span>
               </div>
               <div className="relative">
                  <div className="flex items-end gap-2 mb-2">
                     <span className="text-4xl font-bold text-slate-900 dark:text-white">42.5%</span>
                     <span className="text-sm font-bold text-blue-500 mb-1 flex items-center"><ArrowUpRight size={14} /> 2.1%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-[42.5%] shadow-[0_0_10px_#3b82f6]"></div>
                  </div>
               </div>
            </GlassCard>

            <GlassCard className="relative overflow-hidden group">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl text-orange-600 dark:text-orange-400">
                     <AlertTriangle size={24} />
                  </div>
                  <span className="text-xs font-mono text-slate-400 uppercase">Bounce Rate</span>
               </div>
               <div className="relative">
                  <div className="flex items-end gap-2 mb-2">
                     <span className="text-4xl font-bold text-slate-900 dark:text-white">0.8%</span>
                     <span className="text-sm font-bold text-emerald-500 mb-1">Stable</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                     <div className="h-full bg-orange-500 w-[0.8%]"></div>
                  </div>
               </div>
            </GlassCard>
         </div>

         <GlassCard className="p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
               <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
                  <Calendar size={18} className="mr-2 text-indigo-500" /> Send Schedule
               </h3>
               <div className="flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Best Time to Send</span>
               </div>
            </div>
            <div className="p-6 overflow-x-auto">
               <div className="min-w-[800px] flex justify-between relative pt-6 pb-2">
                  <div className="absolute top-8 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700"></div>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                     <div key={day} className="relative flex flex-col items-center group">
                        <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-800 z-10 group-hover:scale-125 transition-transform mb-3"></div>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{day}</span>
                        {(day === 'Tue' || day === 'Thu') && (
                           <div className="absolute top-[-30px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800/50 shadow-sm animate-float">
                              09:00 - 11:00
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         </GlassCard>

         <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
               <Radio size={18} className="mr-2 text-indigo-500" /> Active Campaigns
            </h3>
            <div className="space-y-4">
               {campaignsList.map((camp) => (
                  <GlassCard key={camp.id} className="p-0 overflow-hidden group transition-all hover:border-indigo-500/30">
                     <div className="p-5 flex flex-col md:flex-row items-center gap-6">
                        <div className="flex items-center gap-4 w-full md:w-1/4">
                           <div className={`p-3 rounded-xl border ${getStatusColor(camp.status)}`}>
                              {camp.status === 'Sending' ? <Send size={20} /> : camp.status === 'Scheduled' ? <Calendar size={20} /> : <CheckCircle2 size={20} />}
                           </div>
                           <div>
                              <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${camp.status === 'Sending' ? 'text-emerald-500' : 'text-slate-500'}`}>{camp.status}</div>
                              <div className="text-xs text-slate-400 font-mono">{camp.type}</div>
                           </div>
                        </div>
                        <div className="flex-1 w-full">
                           <h4 className="font-bold text-slate-900 dark:text-white text-lg">{camp.name}</h4>
                           <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-md">{camp.subject}</p>
                        </div>
                        <div className="w-full md:w-1/3">
                           {camp.status === 'Sending' ? (
                              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                                 <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs text-slate-500 uppercase font-bold">Progress</span>
                                    <span className="text-emerald-500 font-mono font-bold animate-pulse">{Math.round((camp.sent / camp.total) * 100)}%</span>
                                 </div>
                                 <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 transition-all duration-75" style={{ width: `${(camp.sent / camp.total) * 100}%` }}></div>
                                 </div>
                              </div>
                           ) : camp.status === 'Scheduled' ? (
                              <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 rounded-lg p-3 flex items-center justify-between">
                                 <div>
                                    <span className="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase block mb-0.5">Scheduled For</span>
                                    <div className="text-sm font-mono text-slate-800 dark:text-slate-200">{camp.scheduledFor || 'Pending...'}</div>
                                 </div>
                                 <button
                                    onClick={() => openScheduler(camp.id, camp.scheduledFor)}
                                    className="p-1.5 bg-white dark:bg-slate-800 rounded-md text-slate-400 hover:text-indigo-500 transition-colors shadow-sm"
                                    title="Reschedule"
                                 >
                                    <Edit2 size={14} />
                                 </button>
                              </div>
                           ) : (
                              <div className="flex gap-4">
                                 <div>
                                    <div className="text-xs text-slate-400 uppercase">Open Rate</div>
                                    <div className="font-bold text-slate-800 dark:text-white">{camp.openRate}%</div>
                                 </div>
                                 <div>
                                    <div className="text-xs text-slate-400 uppercase">Click Rate</div>
                                    <div className="font-bold text-slate-800 dark:text-white">{camp.clickRate}%</div>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  </GlassCard>
               ))}
            </div>
         </div>

         {/* Scheduling Modal */}
         {schedulingId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
               <GlassCard className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl relative">
                  <button
                     onClick={() => setSchedulingId(null)}
                     className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                     <X size={20} />
                  </button>

                  <div className="mb-6">
                     <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-500 flex items-center justify-center mb-4">
                        <Clock size={24} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white">Scheduler</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400">Set specific date and time for sending this campaign.</p>
                  </div>

                  <div className="space-y-4 mb-6">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Date</label>
                        <div className="relative">
                           <Calendar size={18} className="absolute left-3 top-3 text-slate-400" />
                           <input
                              type="date"
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                           />
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Send Time</label>
                        <div className="relative">
                           <Clock size={18} className="absolute left-3 top-3 text-slate-400" />
                           <input
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-3">
                     <button
                        onClick={() => setSchedulingId(null)}
                        className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={saveSchedule}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2"
                     >
                        <Save size={18} /> Confirm
                     </button>
                  </div>
               </GlassCard>
            </div>
         )}
      </div>
   );

   const filteredTemplates = templates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(templateSearch.toLowerCase());
      const matchesFilter = templateFilter === 'All' || t.type === templateFilter || t.category === templateFilter;
      return matchesSearch && matchesFilter;
   });

   const renderTemplates = () => (
      <div className="space-y-6 animate-fade-in">
         {/* Toolbar */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Campaign Templates</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">Manage your library of professional templates.</p>
            </div>
            <button
               onClick={() => onNavigate && onNavigate('message_builder')}
               className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg font-bold flex items-center shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
            >
               <Plus size={18} className="mr-2" /> Create Template
            </button>
         </div>

         {/* Filters & Search */}
         <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
               <input
                  type="text"
                  placeholder="Search templates..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-200"
               />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
               {['All', 'Newsletter', 'Promo', 'Automation', 'Retention'].map(cat => (
                  <button
                     key={cat}
                     onClick={() => setTemplateFilter(cat)}
                     className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${templateFilter === cat
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>

         {/* Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Blank Slate Card */}
            <button
               onClick={() => onNavigate && onNavigate('message_builder')}
               className="h-[280px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all gap-4 group"
            >
               <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-all">
                  <Layout size={28} className="group-hover:text-indigo-500" />
               </div>
               <div className="text-center px-4">
                  <span className="font-bold text-base block mb-1">Start from Blank Slate</span>
                  <span className="text-xs text-slate-400">Create a custom template from scratch</span>
               </div>
            </button>

            {filteredTemplates.map((template) => (
               <GlassCard key={template.id} className="p-0 overflow-hidden group hover:border-indigo-500/50 transition-all flex flex-col h-[280px]">
                  {/* Template Preview */}
                  <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-900/50 relative overflow-hidden flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
                     <Layout size={40} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500/50 transition-colors transform group-hover:scale-110 duration-500" />
                     <div className="absolute top-3 right-3 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-500 shadow-sm border border-slate-200 dark:border-slate-700">
                        {template.type}
                     </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-5 flex-1 flex flex-col">
                     <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors text-base">{template.name}</h4>
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                           <MoreHorizontal size={16} />
                        </button>
                     </div>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{template.category} Category</p>

                     {/* Actions Footer */}
                     <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 font-medium">{template.used} uses</span>
                        <div className="flex gap-2">
                           <button
                              title="Edit"
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-500 transition-colors"
                           >
                              <Edit2 size={14} />
                           </button>
                           <button
                              onClick={() => onNavigate && onNavigate('message_builder')}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md flex items-center gap-1 transition-all hover:scale-105 shadow-sm"
                           >
                              <Copy size={12} /> Load
                           </button>
                        </div>
                     </div>
                  </div>
               </GlassCard>
            ))}
         </div>
      </div>
   );

   const renderAnalytics = () => (
      <div className="space-y-6 animate-fade-in">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Performance Chart */}
            <GlassCard className="lg:col-span-2">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
                     <TrendingUp size={18} className="mr-2 text-indigo-500" /> Campaign Performance
                  </h3>
                  <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs font-bold px-3 py-1">
                     <option>Last 7 Days</option>
                     <option>Last 30 Days</option>
                  </select>
               </div>
               <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={analyticsData}>
                        <defs>
                           <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                           contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                           itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="opens" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorOpens)" />
                        <Area type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={3} fillOpacity={0} fill="transparent" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </GlassCard>

            {/* Device Breakdown */}
            <GlassCard>
               <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <PieChart size={18} className="mr-2 text-purple-500" /> Device Breakdown
               </h3>
               <div className="h-48 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                     <RePieChart>
                        <Pie
                           data={deviceData}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                           dataKey="value"
                        >
                           {deviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                        </Pie>
                     </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-2xl font-bold text-slate-800 dark:text-white">800</span>
                     <span className="text-[10px] text-slate-500 uppercase">Total Hits</span>
                  </div>
               </div>
               <div className="flex justify-center gap-4 mt-4">
                  {deviceData.map((d) => (
                     <div key={d.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                        <span className="text-xs text-slate-500">{d.name}</span>
                     </div>
                  ))}
               </div>
            </GlassCard>
         </div>

         {/* Engagement Heatmap */}
         <GlassCard>
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center">
               <MousePointer2 size={18} className="mr-2 text-orange-500" /> Engagement Heatmap
            </h3>
            <div className="grid grid-cols-7 gap-1">
               {Array.from({ length: 28 }).map((_, i) => {
                  const intensity = Math.random();
                  return (
                     <div
                        key={i}
                        className={`h-8 rounded-sm ${intensity > 0.8 ? 'bg-orange-500' :
                           intensity > 0.6 ? 'bg-orange-400' :
                              intensity > 0.4 ? 'bg-orange-300' :
                                 intensity > 0.2 ? 'bg-orange-200 dark:bg-orange-900/40' :
                                    'bg-slate-100 dark:bg-slate-800'
                           }`}
                        title={`Activity Level: ${Math.round(intensity * 100)}%`}
                     ></div>
                  )
               })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-400 font-mono uppercase">
               <span>Low Activity</span>
               <span>High Activity</span>
            </div>
         </GlassCard>
      </div>
   );

   return (
      <div className="h-full flex flex-col">
         {/* Deck Header */}
         <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
            <div>
               <div className="flex items-center gap-2 mb-1 text-indigo-500">
                  <Radio size={18} className="animate-pulse-slow" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">Broadcast Deck</span>
               </div>
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Command Center</h2>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mt-4 md:mt-0 overflow-x-auto max-w-full">
               {[
                  { id: 'campaigns', label: 'Campaigns', icon: Send },
                  { id: 'audience', label: 'Audience', icon: Users },
                  { id: 'templates', label: 'Templates', icon: Layout },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'uplink', label: 'Monetization', icon: Zap },
               ].map((tab) => (
                  <button
                     key={tab.id}
                     onClick={() => handleTabChange(tab.id as BroadcastTab)}
                     className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                  >
                     <tab.icon size={14} />
                     {tab.label}
                  </button>
               ))}
            </div>
         </div>

         <div className="flex-1 min-h-0 overflow-y-auto custom-scroll pr-2 pb-10">
            {activeTab === 'campaigns' && renderTransceiver()}
            {activeTab === 'audience' && <SmartClusters />}
            {activeTab === 'templates' && renderTemplates()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'uplink' && <SubscriptionUplink />}
         </div>
      </div>
   );
};

export default BroadcastDeck;
