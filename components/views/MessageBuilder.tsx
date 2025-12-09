
import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { View } from '../../types';
import {
    Sparkles, Zap, Layout, Mic, Tag, Send, ArrowLeft,
    Bot, Box, ShoppingBag, MessageSquare, Plus, Loader2
} from 'lucide-react';
import { generateEmailDraft } from '../../services/geminiService';

interface MessageBuilderProps {
    onNavigate: (view: View) => void;
    missionContext?: { name: string; industry: string };
}

const MessageBuilder: React.FC<MessageBuilderProps> = ({ onNavigate, missionContext }) => {
    // State
    const [content, setContent] = useState('');
    const [aiInstruction, setAiInstruction] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [smartBlocks, setSmartBlocks] = useState<string[]>([]);
    const [isQuantumPersonalized, setIsQuantumPersonalized] = useState(false);

    // Handlers
    const handleAiGenerate = async () => {
        if (!aiInstruction.trim()) return;
        setIsGenerating(true);
        const context = missionContext ? `${missionContext.name} (${missionContext.industry})` : 'Startup';
        const draft = await generateEmailDraft(aiInstruction, context);
        if (draft) setContent(draft);
        setIsGenerating(false);
    };

    const insertVariable = (variable: string) => {
        setContent(prev => prev + ` {{${variable}}} `);
    };

    const addSmartBlock = (type: string) => {
        setSmartBlocks(prev => [...prev, type]);
    };

    const removeBlock = (index: number) => {
        setSmartBlocks(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6 animate-fade-in pb-4">

            {/* LEFT PANEL: THE CORE */}
            <div className="lg:w-5/12 flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                    <button
                        onClick={() => onNavigate('broadcast')}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-500" />
                    </button>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Message Core</h2>
                </div>

                {/* AI Command Center */}
                <GlassCard className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-500/30">
                    <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 flex items-center">
                        <Sparkles size={14} className="mr-1" /> AI Command Uplink
                    </label>
                    <div className="relative">
                        <textarea
                            value={aiInstruction}
                            onChange={(e) => setAiInstruction(e.target.value)}
                            placeholder="Ex: Write a promo for our Black Friday sale, casual tone..."
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 pr-12 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAiGenerate())}
                        />
                        <button
                            onClick={handleAiGenerate}
                            disabled={isGenerating || !aiInstruction}
                            className="absolute right-2 bottom-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} />}
                        </button>
                    </div>
                </GlassCard>

                {/* Manual Editor */}
                <GlassCard className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold text-slate-500 uppercase">Message Body</label>

                        {/* Variable Injector */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded hover:text-indigo-500 transition-colors">
                                <Tag size={12} /> Variables
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl overflow-hidden hidden group-hover:block z-20">
                                {['First_Name', 'Loyalty_Tier', 'Last_Item_Viewed', 'Company'].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => insertVariable(v)}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                    >
                                        {`{{${v}}}`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1 w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 resize-none font-sans leading-relaxed p-2"
                        placeholder="Start typing or use AI to generate draft..."
                    />
                </GlassCard>
            </div>

            {/* RIGHT PANEL: THE PROJECTION */}
            <div className="lg:w-7/12 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Layout size={20} className="text-cyan-500" />
                        Holographic Projection
                    </h2>

                    {/* Quantum Personalization Toggle */}
                    <div
                        onClick={() => setIsQuantumPersonalized(!isQuantumPersonalized)}
                        className={`cursor-pointer flex items-center gap-3 px-4 py-2 rounded-full border transition-all select-none ${isQuantumPersonalized
                                ? 'bg-purple-900/20 border-purple-500 text-purple-600 dark:text-purple-300'
                                : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                            }`}
                    >
                        <div className="relative">
                            <Zap size={16} className={isQuantumPersonalized ? "fill-current" : ""} />
                            {isQuantumPersonalized && <div className="absolute inset-0 blur-sm bg-purple-500 opacity-50"></div>}
                        </div>
                        <span className="text-xs font-bold uppercase">Quantum Personalization</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${isQuantumPersonalized ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isQuantumPersonalized ? 'left-4.5' : 'left-0.5'}`} style={{ left: isQuantumPersonalized ? '18px' : '2px' }}></div>
                        </div>
                    </div>
                </div>

                {/* Email Preview Container */}
                <GlassCard className="flex-1 bg-white dark:bg-black border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col p-0">
                    {/* Fake Email Header */}
                    <div className="bg-slate-100 dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                            {missionContext ? missionContext.name.charAt(0) : 'R'}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-slate-900 dark:text-white text-sm">
                                {missionContext?.name || 'Rockket HQ'}
                                <span className="font-normal text-slate-500 ml-2">&lt;hello@rockket.app&gt;</span>
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                                To: <span className="text-indigo-500">{'{{First_Name}}'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Email Body */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scroll bg-white dark:bg-[#0a0a0a]">
                        {/* Dynamic Greeting Visualizer */}
                        {isQuantumPersonalized ? (
                            <div className="mb-6 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-500/20 relative group">
                                <div className="absolute -top-2.5 left-4 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                                    <Bot size={10} /> Segment: VIP
                                </div>
                                <p className="text-slate-800 dark:text-slate-200 italic font-medium">
                                    "Hey {'{{First_Name}}'}, since you've been a loyal Pilot with us for over a year..."
                                </p>
                            </div>
                        ) : (
                            <p className="mb-6 text-slate-800 dark:text-slate-200">
                                Hello {'{{First_Name}}'},
                            </p>
                        )}

                        {/* Main Content */}
                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {content || <span className="text-slate-400 italic">Content projection awaiting input...</span>}
                        </div>

                        {/* Smart Blocks */}
                        <div className="space-y-6 mt-8">
                            {smartBlocks.map((block, idx) => (
                                <div key={idx} className="relative group animate-fade-in">
                                    <button
                                        onClick={() => removeBlock(idx)}
                                        className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                        <Plus size={12} className="rotate-45" />
                                    </button>

                                    {block === 'Offer' && (
                                        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center shadow-lg">
                                            <h3 className="text-2xl font-bold mb-2">Exclusive Offer</h3>
                                            <p className="mb-4 opacity-90">Get 20% off your next orbital launch.</p>
                                            <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">
                                                Claim Rewards
                                            </button>
                                        </div>
                                    )}

                                    {block === 'Testimonial' && (
                                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                                            <div className="flex justify-center mb-3">
                                                {[1, 2, 3, 4, 5].map(s => <div key={s} className="text-orange-400 text-sm">★</div>)}
                                            </div>
                                            <p className="italic text-slate-600 dark:text-slate-400 mb-4">"Rockket changed the way we do business. Absolutely stellar!"</p>
                                            <div className="font-bold text-slate-900 dark:text-white text-sm">- Sarah Connor, CEO</div>
                                        </div>
                                    )}

                                    {block === 'Button' && (
                                        <div className="text-center py-4">
                                            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-lg font-bold shadow-lg hover:opacity-90 transition-opacity">
                                                Call To Action
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Smart Block Injector Bar (Floating) */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 shadow-2xl flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mr-2">Smart Blocks</span>

                        <button onClick={() => addSmartBlock('Offer')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-indigo-500 tooltip" title="Offer Block">
                            <ShoppingBag size={20} />
                        </button>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>

                        <button onClick={() => addSmartBlock('Testimonial')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-orange-500" title="Testimonial">
                            <MessageSquare size={20} />
                        </button>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>

                        <button onClick={() => addSmartBlock('Button')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-emerald-500" title="CTA Button">
                            <Box size={20} />
                        </button>
                    </div>
                </GlassCard>

                <div className="mt-4 flex justify-end">
                    <button className="flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-transform hover:scale-105">
                        <Send size={18} className="mr-2" />
                        Prepare Launch
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageBuilder;
