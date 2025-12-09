
import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import {
   MessageSquare, Phone, Mic, User, Bot, Send,
   Settings, Volume2, Shield, Zap, ToggleLeft, ToggleRight,
   MoreVertical, Search, Clock, CheckCircle2, X, Plus
} from 'lucide-react';

interface CommunicationDeckProps {
   activeTab?: 'inbox' | 'agents' | 'settings';
   onTabChange?: (tab: 'inbox' | 'agents' | 'settings') => void;
}

const CommunicationDeck: React.FC<CommunicationDeckProps> = ({ activeTab: externalActiveTab, onTabChange }) => {
   const [internalActiveTab, setInternalActiveTab] = useState<'inbox' | 'agents' | 'settings'>('inbox');

   // Use external tab if provided, otherwise use internal state
   const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;

   // Handle tab changes
   const handleTabChange = (tab: 'inbox' | 'agents' | 'settings') => {
      if (onTabChange) {
         onTabChange(tab);
      } else {
         setInternalActiveTab(tab);
      }
   };

   const [selectedConversation, setSelectedConversation] = useState<number>(1);
   const [inputText, setInputText] = useState('');
   const [showNewConversation, setShowNewConversation] = useState(false);
   const [conversationMenuId, setConversationMenuId] = useState<number | null>(null);

   // CRUD State
   const [conversations, setConversations] = useState([
      {
         id: 1,
         contact: 'Sarah Miller',
         source: 'SMS' as 'SMS' | 'Voice' | 'Web Chat',
         status: 'AI Handling',
         lastMsg: 'Yes, I am interested in the enterprise plan.',
         time: '2m ago',
         unread: true,
         avatarColor: 'bg-emerald-500'
      },
      {
         id: 2,
         contact: 'Tech Corp Inc.',
         source: 'Web Chat' as 'SMS' | 'Voice' | 'Web Chat',
         status: 'Needs Review',
         lastMsg: 'Can you integrate with Salesforce?',
         time: '1h ago',
         unread: false,
         avatarColor: 'bg-blue-500'
      },
      {
         id: 3,
         contact: '+1 (555) 019-2834',
         source: 'Voice' as 'SMS' | 'Voice' | 'Web Chat',
         status: 'Completed',
         lastMsg: '[Voice Transcript] Call duration: 4m 32s',
         time: '3h ago',
         unread: false,
         avatarColor: 'bg-orange-500'
      },
   ]);

   const [messages, setMessages] = useState([
      { id: 1, conversationId: 1, role: 'user' as 'user' | 'ai', text: 'Hi, I saw your pricing page but had a question.', time: '10:30 AM' },
      { id: 2, conversationId: 1, role: 'ai' as 'user' | 'ai', text: 'Hello! I\'m the AI assistant for Rockket. I\'d be happy to help clarify our pricing. What specific question did you have?', time: '10:30 AM', agent: 'Hunter Protocol' },
      { id: 3, conversationId: 1, role: 'user' as 'user' | 'ai', text: 'Do you offer custom enterprise plans?', time: '10:32 AM' },
      { id: 4, conversationId: 1, role: 'ai' as 'user' | 'ai', text: 'Yes, we absolutely do. Our Velocity tier is designed for scaling teams, but for larger enterprise needs, we can build a custom Flight Plan. Would you like me to have a specialist contact you?', time: '10:32 AM', agent: 'Hunter Protocol' },
      { id: 5, conversationId: 1, role: 'user' as 'user' | 'ai', text: 'Yes, I am interested in the enterprise plan.', time: '10:33 AM' },
   ]);

   // CREATE: Add new conversation
   const handleCreateConversation = (contact: string, source: 'SMS' | 'Voice' | 'Web Chat') => {
      const newConv = {
         id: Date.now(),
         contact,
         source,
         status: 'New',
         lastMsg: 'Conversation started',
         time: 'Just now',
         unread: true,
         avatarColor: source === 'SMS' ? 'bg-emerald-500' : source === 'Voice' ? 'bg-orange-500' : 'bg-blue-500'
      };
      setConversations([newConv, ...conversations]);
      setSelectedConversation(newConv.id);
      setShowNewConversation(false);
   };

   // UPDATE: Send message
   const handleSendMessage = () => {
      if (!inputText.trim()) return;

      const newMessage = {
         id: Date.now(),
         conversationId: selectedConversation,
         role: 'user' as 'user' | 'ai',
         text: inputText,
         time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };

      setMessages([...messages, newMessage]);

      // Update conversation last message
      setConversations(conversations.map(conv =>
         conv.id === selectedConversation
            ? { ...conv, lastMsg: inputText, time: 'Just now' }
            : conv
      ));

      setInputText('');
   };

   // UPDATE: Mark as read
   const handleMarkAsRead = (id: number) => {
      setConversations(conversations.map(conv =>
         conv.id === id ? { ...conv, unread: false } : conv
      ));
   };

   // DELETE: Remove conversation
   const handleDeleteConversation = (id: number) => {
      if (confirm('Are you sure you want to delete this conversation?')) {
         setConversations(conversations.filter(conv => conv.id !== id));
         setMessages(messages.filter(msg => msg.conversationId !== id));
         if (selectedConversation === id && conversations.length > 1) {
            setSelectedConversation(conversations[0].id);
         }
         setConversationMenuId(null);
      }
   };

   // Get messages for selected conversation
   const currentMessages = messages.filter(msg => msg.conversationId === selectedConversation);

   const renderInbox = () => (
      <>
         <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Conversation List */}
            <div className="lg:col-span-4 flex flex-col h-full">
               <GlassCard className="h-full p-0 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                     <div className="flex gap-2 mb-3">
                        <div className="relative flex-1">
                           <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                           <input
                              type="text"
                              placeholder="Search conversations..."
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                           />
                        </div>
                        <button
                           onClick={() => setShowNewConversation(true)}
                           className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap"
                        >
                           <Plus size={16} />
                           <span className="text-sm font-bold">New</span>
                        </button>
                     </div>
                     <div className="flex gap-2 overflow-x-auto">
                        {['All', 'SMS', 'Voice', 'Chat'].map(filter => (
                           <button key={filter} className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                              {filter}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scroll">
                     {conversations.map(conv => (
                        <div
                           key={conv.id}
                           onClick={() => {
                              setSelectedConversation(conv.id);
                              handleMarkAsRead(conv.id);
                           }}
                           className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 relative ${selectedConversation === conv.id ? 'bg-indigo-50 dark:bg-indigo-900/10 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
                        >
                           <div className="flex justify-between items-start mb-1">
                              <div className="font-bold text-slate-900 dark:text-white text-sm">{conv.contact}</div>
                              <div className="flex items-center gap-2">
                                 <span className="text-xs text-slate-400">{conv.time}</span>
                                 <button
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       setConversationMenuId(conversationMenuId === conv.id ? null : conv.id);
                                    }}
                                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                                 >
                                    <MoreVertical size={14} className="text-slate-400" />
                                 </button>
                              </div>
                           </div>
                           <div className="text-xs text-slate-500 dark:text-slate-400 truncate mb-2">
                              {conv.lastMsg}
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${conv.source === 'Voice' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' :
                                    conv.source === 'SMS' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600' :
                                       'bg-blue-100 dark:bg-blue-900/20 text-blue-600'
                                    }`}>
                                    {conv.source}
                                 </span>
                                 {conv.status === 'AI Handling' && (
                                    <span className="flex items-center gap-1 text-[10px] text-purple-500 font-bold">
                                       <Bot size={10} /> Auto-Pilot
                                    </span>
                                 )}
                              </div>
                              {conv.unread && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                           </div>

                           {/* Dropdown Menu */}
                           {conversationMenuId === conv.id && (
                              <div className="absolute right-4 top-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-10 min-w-[150px]">
                                 <button
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       handleMarkAsRead(conv.id);
                                       setConversationMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                 >
                                    Mark as {conv.unread ? 'Read' : 'Unread'}
                                 </button>
                                 <button
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       handleDeleteConversation(conv.id);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                 >
                                    Delete
                                 </button>
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </GlassCard>
            </div>

            {/* Center: Chat Interface */}
            <div className="lg:col-span-5 flex flex-col h-full">
               <GlassCard className="h-full p-0 flex flex-col overflow-hidden relative">
                  {/* Header */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-10">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                           SM
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-900 dark:text-white">Sarah Miller</h3>
                           <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Active on SMS
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <button className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                           <Zap size={14} className="fill-current" /> AI Takeover Active
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                           <MoreVertical size={18} />
                        </button>
                     </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-slate-900/20 custom-scroll">
                     {currentMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                           <div className={`max-w-[85%] ${msg.role === 'ai' ? 'order-2 ml-3' : 'order-1 mr-3'}`}>
                              {msg.role === 'ai' && (
                                 <div className="text-[10px] text-slate-400 mb-1 ml-1 flex items-center gap-1">
                                    <Bot size={10} /> {msg.agent}
                                 </div>
                              )}
                              <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'ai'
                                 ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                                 : 'bg-indigo-600 text-white rounded-tr-none'
                                 }`}>
                                 {msg.text}
                              </div>
                              <div className={`text-[10px] text-slate-400 mt-1 ${msg.role === 'ai' ? 'text-left' : 'text-right'}`}>
                                 {msg.time}
                              </div>
                           </div>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-4 ${msg.role === 'ai' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 order-1' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 order-2'
                              }`}>
                              {msg.role === 'ai' ? <Bot size={14} /> : <User size={14} />}
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                     <div className="relative">
                        <input
                           type="text"
                           value={inputText}
                           onChange={(e) => setInputText(e.target.value)}
                           onKeyPress={(e) => {
                              if (e.key === 'Enter') handleSendMessage();
                           }}
                           placeholder="Type a message or command..."
                           className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-4 pr-12 py-3.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="absolute right-2 top-2 flex items-center gap-1">
                           <button className="p-1.5 text-slate-400 hover:text-indigo-500 transition-colors">
                              <Mic size={18} />
                           </button>
                           <button
                              onClick={handleSendMessage}
                              className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30"
                           >
                              <Send size={16} />
                           </button>
                        </div>
                     </div>
                     <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-mono uppercase">
                        <span>Press Enter to send</span>
                        <span className="flex items-center gap-1 text-purple-500 cursor-pointer hover:underline">
                           <Bot size={10} /> Pause AI for 1 hour
                        </span>
                     </div>
                  </div>
               </GlassCard>
            </div>

            {/* Right: Lead Context */}
            <div className="lg:col-span-3 flex flex-col h-full">
               <GlassCard className="h-full overflow-y-auto">
                  <div className="text-center mb-6">
                     <div className="w-20 h-20 mx-auto bg-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-xl shadow-emerald-500/20">
                        SM
                     </div>
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sarah Miller</h3>
                     <p className="text-sm text-slate-500">CEO @ Miller Dynamics</p>
                  </div>

                  <div className="space-y-6">
                     <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Lead Status</h4>
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                           <span className="text-sm font-bold text-orange-500">Negotiation</span>
                           <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">High Value</span>
                        </div>
                     </div>

                     <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Deal Value</h4>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">$12,500<span className="text-sm text-slate-400 font-normal">/yr</span></div>
                     </div>

                     <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">AI Context Memory</h4>
                        <div className="space-y-2">
                           {['Interested in Enterprise', 'Budget approved', 'Needs Salesforce Integration'].map((tag, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                                 <CheckCircle2 size={12} className="mt-0.5 text-indigo-500" />
                                 {tag}
                              </div>
                           ))}
                        </div>
                     </div>

                     <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold transition-colors">
                        View Full CRM Profile
                     </button>
                  </div>
               </GlassCard>
            </div>
         </div>

         {/* New Conversation Modal */}
         {
            showNewConversation && (
               <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Start New Conversation</h3>
                        <button
                           onClick={() => setShowNewConversation(false)}
                           className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                           <X size={20} className="text-slate-400" />
                        </button>
                     </div>

                     <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                              Contact Name or Number
                           </label>
                           <input
                              type="text"
                              id="newConvContact"
                              placeholder="e.g., John Doe or +1 (555) 123-4567"
                              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                              Channel
                           </label>
                           <select
                              id="newConvSource"
                              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                           >
                              <option value="SMS">SMS</option>
                              <option value="Voice">Voice</option>
                              <option value="Web Chat">Web Chat</option>
                           </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                           <button
                              onClick={() => setShowNewConversation(false)}
                              className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-all"
                           >
                              Cancel
                           </button>
                           <button
                              onClick={() => {
                                 const contact = (document.getElementById('newConvContact') as HTMLInputElement).value;
                                 const source = (document.getElementById('newConvSource') as HTMLSelectElement).value as 'SMS' | 'Voice' | 'Web Chat';
                                 if (contact.trim()) {
                                    handleCreateConversation(contact, source);
                                 } else {
                                    alert('Please enter a contact name or number');
                                 }
                              }}
                              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all"
                           >
                              Start Conversation
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            )}
      </>
   );

   const renderAgents = () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
         {/* Agent 1: Sales */}
         <GlassCard className="flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>

            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-orange-100 dark:bg-orange-900/20 rounded-2xl text-orange-600 dark:text-orange-500">
                     <Zap size={32} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Hunter Protocol</h3>
                     <p className="text-sm text-slate-500">Sales & Lead Qualification Bot</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-500 uppercase">Active</span>
                  <ToggleRight size={32} className="text-emerald-500 cursor-pointer" />
               </div>
            </div>

            <div className="space-y-6 flex-1">
               <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Personality Calibration</label>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                     <div className="w-1/3 h-full bg-slate-300 dark:bg-slate-700"></div>
                     <div className="w-1/3 h-full bg-orange-500"></div>
                     <div className="w-1/3 h-full bg-slate-300 dark:bg-slate-700"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 uppercase font-mono">
                     <span>Helpful</span>
                     <span>Persuasive</span>
                     <span>Aggressive</span>
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Voice Synthesis</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-orange-500 transition-colors">
                     <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg">
                        <Volume2 size={16} className="text-slate-600 dark:text-slate-300" />
                     </div>
                     <div className="flex-1">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">Marcus (Confident)</div>
                        <div className="text-xs text-slate-500">US English • Male • Deep</div>
                     </div>
                     <div className="text-xs font-bold text-indigo-500">PREVIEW</div>
                  </div>
               </div>

               <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/20">
                  <h4 className="font-bold text-orange-800 dark:text-orange-400 text-sm mb-1">Knowledge Base Linked</h4>
                  <p className="text-xs text-orange-700 dark:text-orange-500/70">
                     Hunter has access to your Pricing Page, FAQ, and Case Studies.
                  </p>
               </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
               <button className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity">
                  Configure Logic
               </button>
            </div>
         </GlassCard>

         {/* Agent 2: Support */}
         <GlassCard className="flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-500">
                     <Shield size={32} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Guardian Protocol</h3>
                     <p className="text-sm text-slate-500">Support & Success Bot</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-500 uppercase">Active</span>
                  <ToggleRight size={32} className="text-emerald-500 cursor-pointer" />
               </div>
            </div>

            <div className="space-y-6 flex-1">
               <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Personality Calibration</label>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                     <div className="w-1/3 h-full bg-blue-500"></div>
                     <div className="w-1/3 h-full bg-slate-300 dark:bg-slate-700"></div>
                     <div className="w-1/3 h-full bg-slate-300 dark:bg-slate-700"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 uppercase font-mono">
                     <span>Empathetic</span>
                     <span>Direct</span>
                     <span>Technical</span>
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Voice Synthesis</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                     <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg">
                        <Volume2 size={16} className="text-slate-600 dark:text-slate-300" />
                     </div>
                     <div className="flex-1">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">Ava (Calm)</div>
                        <div className="text-xs text-slate-500">UK English • Female • Soft</div>
                     </div>
                     <div className="text-xs font-bold text-indigo-500">PREVIEW</div>
                  </div>
               </div>

               <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                  <h4 className="font-bold text-blue-800 dark:text-blue-400 text-sm mb-1">Knowledge Base Linked</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-500/70">
                     Guardian has access to your Documentation, API Refs, and Order History.
                  </p>
               </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
               <button className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity">
                  Configure Logic
               </button>
            </div>
         </GlassCard>
      </div>
   );

   return (
      <div className="h-full animate-fade-in flex flex-col">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
            <div>
               <div className="flex items-center gap-2 mb-1 text-indigo-500">
                  <MessageSquare size={18} />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">Communication Deck</span>
               </div>
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Subspace Array</h2>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mt-4 md:mt-0">
               <button
                  onClick={() => handleTabChange('inbox')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'inbox'
                     ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                     : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                     }`}
               >
                  <MessageSquare size={14} />
                  Unified Inbox
               </button>
               <button
                  onClick={() => handleTabChange('agents')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'agents'
                     ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                     : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                     }`}
               >
                  <Bot size={14} />
                  Synth-Agents
               </button>
               <button
                  onClick={() => handleTabChange('settings')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'settings'
                     ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                     : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                     }`}
               >
                  <Settings size={14} />
                  Settings
               </button>
            </div>
         </div>

         <div className="flex-1 min-h-0">
            {activeTab === 'inbox' ? renderInbox() : activeTab === 'agents' ? renderAgents() : (
               <div className="h-full flex items-center justify-center">
                  <GlassCard className="max-w-md text-center">
                     <Settings size={48} className="mx-auto mb-4 text-slate-400" />
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Communication Settings</h3>
                     <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Configure channels, notifications, and AI agent behavior.
                     </p>
                     <button className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition-all">
                        Configure Settings
                     </button>
                  </GlassCard>
               </div>
            )}
         </div>
      </div>
   );
};

export default CommunicationDeck;
