
import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import {
   Users, Search, Filter, Plus, MoreHorizontal,
   ArrowRight, DollarSign, Calendar as CalendarIcon, MessageSquare,
   Magnet, Phone, Mail, Clock, CheckCircle2, MapPin
} from 'lucide-react';

type AcquisitionTab = 'pipeline' | 'contacts' | 'calendar';

interface AcquisitionDeckProps {
   activeTab?: AcquisitionTab;
   onTabChange?: (tab: AcquisitionTab) => void;
}

const AcquisitionDeck: React.FC<AcquisitionDeckProps> = ({ activeTab: externalActiveTab, onTabChange }) => {
   const [internalActiveTab, setInternalActiveTab] = useState<AcquisitionTab>('pipeline');

   // Use external tab if provided, otherwise use internal state
   const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;

   // Handle tab changes
   const handleTabChange = (tab: AcquisitionTab) => {
      if (onTabChange) {
         onTabChange(tab);
      } else {
         setInternalActiveTab(tab);
      }
   };

   // --- PIPELINE DATA ---
   const [columns, setColumns] = useState([
      { id: 'radar', title: 'New Lead', color: 'slate' },
      { id: 'hailing', title: 'Contacted', color: 'blue' },
      { id: 'docking', title: 'In Discussion', color: 'orange' },
      { id: 'secure', title: 'Deal Closed', color: 'emerald' },
   ]);

   const [leads, setLeads] = useState([
      { id: 1, name: 'Nebula Corp', value: '$12k', stage: 'radar', contact: 'John D.', age: '2d' },
      { id: 2, name: 'Alpha Centauri Logistics', value: '$45k', stage: 'hailing', contact: 'Sarah K.', age: '1d' },
      { id: 3, name: 'Orion Mining', value: '$8k', stage: 'docking', contact: 'Mike R.', age: '5d' },
      { id: 4, name: 'Void Walkers', value: '$22k', stage: 'secure', contact: 'Elena V.', age: '1w' },
      { id: 5, name: 'Starship Troopers', value: '$150k', stage: 'hailing', contact: 'Rico', age: '3h' },
   ]);

   // --- CONTACTS DATA ---
   const contacts = [
      { id: 1, name: 'John Doe', role: 'CEO', company: 'Nebula Corp', email: 'john@nebula.io', lastContact: '2 days ago', status: 'Active', value: 'High' },
      { id: 2, name: 'Sarah Kerrigan', role: 'Operations Manager', company: 'Alpha Centauri', email: 'sarah@alpha.com', lastContact: 'Yesterday', status: 'Active', value: 'Critical' },
      { id: 3, name: 'Mike Ross', role: 'Legal Counsel', company: 'Orion Mining', email: 'mike@orion.net', lastContact: '5 days ago', status: 'Cold', value: 'Medium' },
      { id: 4, name: 'Elena Vance', role: 'Project Manager', company: 'Void Walkers', email: 'elena@void.space', lastContact: '1 week ago', status: 'Closed', value: 'Low' },
      { id: 5, name: 'Johnny Rico', role: 'Team Lead', company: 'Starship Troopers', email: 'rico@fed.gov', lastContact: '3 hours ago', status: 'Active', value: 'Critical' },
   ];

   // --- CALENDAR DATA ---
   const events = [
      { id: 1, title: 'Demo with Nebula Corp', time: '09:00 AM', type: 'Meeting', lead: 'Nebula Corp', day: 12 },
      { id: 2, title: 'Contract Review', time: '02:00 PM', type: 'Task', lead: 'Orion Mining', day: 12 },
      { id: 3, title: 'Alpha Centauri Onboarding', time: '11:00 AM', type: 'Call', lead: 'Alpha Centauri', day: 14 },
      { id: 4, title: 'Discovery Call', time: '04:30 PM', type: 'Meeting', lead: 'New Lead', day: 16 },
   ];

   const getStageColor = (color: string) => {
      switch (color) {
         case 'blue': return 'bg-blue-500';
         case 'orange': return 'bg-orange-500';
         case 'emerald': return 'bg-emerald-500';
         default: return 'bg-slate-400';
      }
   };

   // --- RENDERERS ---

   const renderPipeline = () => (
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
         <div className="flex h-full min-w-[1000px] gap-6">
            {columns.map(col => (
               <div key={col.id} className="flex-1 flex flex-col h-full min-w-[250px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4 px-2">
                     <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStageColor(col.color)}`}></div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase">{col.title}</h3>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold px-2 py-0.5 rounded-full">
                           {leads.filter(l => l.stage === col.id).length}
                        </span>
                     </div>
                     <button
                        onClick={() => alert(`Add new lead to ${col.title}`)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                     >
                        <Plus size={16} />
                     </button>
                  </div>

                  {/* Column Track */}
                  <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl p-3 border border-slate-200 dark:border-slate-800/50 overflow-y-auto custom-scroll space-y-3">
                     {leads.filter(l => l.stage === col.id).map(lead => (
                        <GlassCard key={lead.id} className="p-4 cursor-pointer hover:border-indigo-500/50 group transition-all hover:-translate-y-1 hover:shadow-lg">
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-mono text-slate-400">{lead.age}</span>
                              <button className="text-slate-300 hover:text-slate-500 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <MoreHorizontal size={16} />
                              </button>
                           </div>
                           <h4 className="font-bold text-slate-900 dark:text-white mb-1">{lead.name}</h4>
                           <div className="flex items-center text-emerald-500 font-bold text-sm mb-3">
                              <DollarSign size={14} className="mr-0.5" /> {lead.value}
                           </div>

                           <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                    {lead.contact.charAt(0)}
                                 </div>
                                 <span className="text-xs text-slate-500">{lead.contact}</span>
                              </div>
                              <div className="flex gap-1 text-slate-400">
                                 <CalendarIcon size={14} className="hover:text-indigo-500" />
                                 <MessageSquare size={14} className="hover:text-indigo-500" />
                              </div>
                           </div>
                        </GlassCard>
                     ))}

                     {/* Drop Zone Placeholder */}
                     <div className="h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold opacity-0 hover:opacity-100 transition-opacity">
                        Drop Here
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );

   const renderContacts = () => (
      <div className="flex-1 overflow-hidden flex flex-col">
         <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-3 text-slate-400" size={18} />
               <input
                  type="text"
                  placeholder="Search contacts by name, company, or email..."
                  className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
               />
            </div>
            <button className="flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold border border-indigo-200 dark:border-indigo-500/30">
               <Filter size={16} className="mr-2" /> Segments
            </button>
         </div>

         <div className="flex-1 overflow-y-auto custom-scroll space-y-2">
            {contacts.map((contact) => (
               <GlassCard key={contact.id} className="p-4 flex items-center justify-between hover:border-indigo-500/30 group transition-all">
                  <div className="flex items-center gap-4 w-1/3">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {contact.name.charAt(0)}
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{contact.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{contact.role}</p>
                     </div>
                  </div>

                  <div className="w-1/4">
                     <div className="flex items-center text-slate-700 dark:text-slate-300 font-medium text-sm">
                        <MapPin size={14} className="mr-1.5 text-slate-400" />
                        {contact.company}
                     </div>
                     <div className="flex items-center text-xs text-slate-500 mt-0.5">
                        <Clock size={12} className="mr-1" /> Last signal: {contact.lastContact}
                     </div>
                  </div>

                  <div className="flex gap-2">
                     <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                        <Mail size={16} />
                     </button>
                     <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                        <Phone size={16} />
                     </button>
                  </div>

                  <div className="text-right w-24">
                     <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded mb-1 ${contact.value === 'Critical' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                        contact.value === 'High' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                           'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                        {contact.value} Val
                     </span>
                     <div className={`text-xs font-bold ${contact.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {contact.status}
                     </div>
                  </div>
               </GlassCard>
            ))}
         </div>
      </div>
   );

   const renderCalendar = () => (
      <div className="flex-1 overflow-y-auto custom-scroll">
         <div className="grid grid-cols-7 gap-4 mb-4 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
               <div key={day} className="text-xs font-bold text-slate-500 uppercase tracking-widest">{day}</div>
            ))}
         </div>

         <div className="grid grid-cols-7 gap-4 auto-rows-fr">
            {Array.from({ length: 35 }, (_, i) => {
               const day = i - 2; // Offset for starting day (Mock)
               const dayEvents = events.filter(e => e.day === day);

               return (
                  <div key={i} className={`min-h-[120px] rounded-xl border p-2 relative ${day > 0 && day <= 30
                     ? 'bg-white/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800'
                     : 'bg-slate-50/50 dark:bg-slate-900/10 border-transparent opacity-50'
                     }`}>
                     {day > 0 && day <= 30 && (
                        <>
                           <span className={`text-sm font-bold ${day === 12 ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-700 dark:text-slate-300'}`}>
                              {day}
                           </span>

                           <div className="space-y-1 mt-2">
                              {dayEvents.map(ev => (
                                 <div key={ev.id} className="p-1.5 rounded bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20 text-[10px] hover:scale-105 transition-transform cursor-pointer group">
                                    <div className="font-bold text-indigo-700 dark:text-indigo-300 truncate">{ev.title}</div>
                                    <div className="flex justify-between text-indigo-500/80">
                                       <span>{ev.time}</span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </>
                     )}
                  </div>
               );
            })}
         </div>
      </div>
   );

   return (
      <div className="h-full animate-fade-in flex flex-col">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
            <div>
               <div className="flex items-center gap-2 mb-1 text-indigo-500">
                  <Users size={18} />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">Acquisition Deck</span>
               </div>
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Pipeline Command</h2>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mt-4 md:mt-0">
               {[
                  { id: 'pipeline', label: 'Pipelines', icon: Magnet },
                  { id: 'contacts', label: 'Contacts', icon: Users },
                  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
               ].map((tab) => (
                  <button
                     key={tab.id}
                     onClick={() => handleTabChange(tab.id as AcquisitionTab)}
                     className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id
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

         <div className="flex-1 min-h-0 flex flex-col">
            {activeTab === 'pipeline' && renderPipeline()}
            {activeTab === 'contacts' && renderContacts()}
            {activeTab === 'calendar' && renderCalendar()}
         </div>
      </div>
   );
};

export default AcquisitionDeck;
