
import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Send, Bot, FileText, Save, ArrowLeft, Mic, StopCircle, RefreshCw, Check } from 'lucide-react';
import { streamMissionChat, generateStrategyFromPlan } from '../../services/geminiService';
import { useMission } from '../../context/MissionContext';

import { View } from '../../types';

interface MissionCockpitProps {
  onNavigate: (view: View) => void;
}

const MissionCockpit: React.FC<MissionCockpitProps> = ({ onNavigate }) => {
  const { businessPlan, setBusinessPlan, setBusinessStrategy } = useMission();
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Systems ready. I am your Business Assistant. We are drafting the "Market Entry Strategy" today. Who is our primary target demographic?' }
  ]);
  const [input, setInput] = useState('');
  const [docContent, setDocContent] = useState<string>(
    businessPlan || "# BUSINESS PLAN: MARKET ENTRY\n\n## 1. Executive Summary\n[Pending Input]\n\n## 2. Target Demographics\n[Pending Input]\n\n## 3. Competitive Advantage\n[Pending Input]\n"
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsStreaming(true);

    try {
      // Stream response from Gemini
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: "" }]); // Placeholder

      await streamMissionChat(userMsg, (chunk) => {
        fullResponse += chunk;
        setMessages(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].text = fullResponse;
          return newHistory;
        });

        // Simple heuristic to update doc (Simulated AI Agent behavior updates doc based on context)
        // In a real app, we'd ask the LLM to output structured JSON or separate operations for doc updates.
        if (fullResponse.includes("update the document")) {
          // Mock update for visual effect
          setDocContent(prev => prev.replace("[Pending Input]", userMsg));
        }
      });

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Comms link unstable. Please retry." }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    // 1. Save locally to context
    setBusinessPlan(docContent);

    try {
      // 2. Generate Mission Kit Strategy from the Plan
      // We do this silently or with a "Generating..." indicator.
      // For now, we'll keep the "Saved" loader visible while this happens.
      const strategy = await generateStrategyFromPlan(docContent);

      // 3. Save Strategy to Context
      setBusinessStrategy(strategy);

    } catch (e) {
      console.error("Strategy generation failed", e);
    }

    setIsSaving(false);
    onNavigate('missionkits');
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6 animate-fade-in pb-4">
      {/* LEFT: Co-Pilot Chat */}
      <GlassCard className="lg:w-1/3 flex flex-col border-r border-slate-200 dark:border-slate-800 p-0 overflow-hidden bg-white/50 dark:bg-slate-900/50">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Assistant</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono uppercase">Online</span>
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${msg.role === 'user'
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                }`}>
                {msg.role === 'user' ? 'CP' : 'AI'}
              </div>
              <div className={`p-3 rounded-2xl text-sm max-w-[85%] leading-relaxed ${msg.role === 'user'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tr-none shadow-sm'
                : 'bg-indigo-600 text-white rounded-tl-none shadow-md shadow-indigo-500/10'
                }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isStreaming}
              className="absolute right-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* RIGHT: Blueprint Editor */}
      <div className="flex-1 flex flex-col h-full gap-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-500 rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Business Plan</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Market Entry Strategy.md</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden md:block mr-2">Last saved: Just now</span>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              {isSaving ? <Check size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
              {isSaving ? 'Saved' : 'Save Plan'}
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <GlassCard className="flex-1 p-0 overflow-hidden bg-slate-900 border-slate-700 shadow-2xl flex flex-col relative">
          {/* Editor Header */}
          <div className="h-8 bg-slate-950 flex items-center px-4 gap-2 border-b border-slate-800">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
          </div>

          <textarea
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            className="flex-1 w-full bg-[#1e1e1e] text-slate-300 font-mono text-sm p-6 resize-none outline-none leading-relaxed custom-scroll"
            spellCheck={false}
          />

          {/* AI Activity Indicator overlay */}
          {isStreaming && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-indigo-600/90 text-white text-xs rounded-full shadow-lg backdrop-blur animate-fade-in">
              <RefreshCw size={12} className="animate-spin" />
              <span>AI Writing...</span>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default MissionCockpit;
