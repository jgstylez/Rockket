import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { View } from '../../types';
import {
    Palette, Box, Triangle, Hexagon, Circle,
    Sparkles, Check, ArrowLeft, Loader2, Save
} from 'lucide-react';

import { useMission } from '../../context/MissionContext';

interface BrandIdentityLabProps {
    onNavigate: (view: View) => void;
}

interface GeneratedLogo {
    id: string;
    icon: React.ElementType;
    style: string;
    color: string;
    fontPrimary: string;
    fontSecondary: string;
    paletteName: string;
}

const BrandIdentityLab: React.FC<BrandIdentityLabProps> = ({ onNavigate }) => {
    const { missionName, setIgnitionProgress, ignitionProgress, setBrandIdentity, updateSetupTask } = useMission();

    // State
    const [vibe, setVibe] = useState('Minimalist');
    const [palette, setPalette] = useState('Deep Space');
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [selectedLogo, setSelectedLogo] = useState<string | null>(null);

    // Mock Generation
    const handleSynthesize = () => {
        setIsGenerating(true);
        setHasGenerated(false);
        setSelectedLogo(null);

        // Simulate AI Latency
        setTimeout(() => {
            setIsGenerating(false);
            setHasGenerated(true);
        }, 2500);
    };

    const handleDeploy = () => {
        if (!selectedLogo) return;

        const selectedBrand = results.find(r => r.id === selectedLogo);
        if (!selectedBrand) return;

        // Save brand identity to context
        setBrandIdentity({
            logoId: selectedBrand.id,
            logoStyle: selectedBrand.style,
            primaryColor: selectedBrand.color,
            secondaryColor: '#0f172a', // Secondary from palette
            fontPrimary: selectedBrand.fontPrimary,
            fontSecondary: selectedBrand.fontSecondary,
            paletteName: selectedBrand.paletteName,
            deployedAt: new Date().toISOString()
        });

        // Update setup task
        updateSetupTask('brand-identity', {
            status: 'complete',
            progress: 100
        });

        // Increase ignition progress
        setIgnitionProgress(Math.min(ignitionProgress + 35, 100));

        onNavigate('dashboard');
    };

    // Mock Results based on Vibe
    const results: GeneratedLogo[] = [
        {
            id: '1', icon: Hexagon, style: 'Geometric', color: '#6366f1',
            fontPrimary: 'Space Grotesk', fontSecondary: 'Inter', paletteName: palette
        },
        {
            id: '2', icon: Circle, style: 'Minimalist', color: '#06b6d4',
            fontPrimary: 'Montserrat', fontSecondary: 'Roboto', paletteName: palette
        },
        {
            id: '3', icon: Triangle, style: 'Bold', color: '#f97316',
            fontPrimary: 'Oswald', fontSecondary: 'Open Sans', paletteName: palette
        },
        {
            id: '4', icon: Box, style: 'Abstract', color: '#a855f7',
            fontPrimary: 'Exo 2', fontSecondary: 'Lato', paletteName: palette
        },
    ];

    const activeSelection = results.find(r => r.id === selectedLogo);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6 animate-fade-in pb-4">

            {/* Left Panel: Synthesis Controls */}
            <GlassCard className="lg:w-1/3 flex flex-col p-6 space-y-8 relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                        <Palette size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Visual Synthesis</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">Brand Identity Lab</p>
                    </div>
                </div>

                {/* Context Fields */}
                <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 dark:text-slate-400 font-mono">Subject:</span>
                        <span className="font-bold text-slate-800 dark:text-white flex items-center">
                            {missionName} <Check size={14} className="ml-1 text-emerald-500" />
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 dark:text-slate-400 font-mono">Sector:</span>
                        <span className="font-bold text-slate-800 dark:text-white flex items-center">
                            Technology <Check size={14} className="ml-1 text-emerald-500" />
                        </span>
                    </div>
                </div>

                {/* Vibe Selectors */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Aesthetic Modulators</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Minimalist', 'Bold', 'Geometric', 'Retro'].map((v) => (
                            <button
                                key={v}
                                onClick={() => setVibe(v)}
                                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${vibe === v
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                                    }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chromatic Preference */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Chromatic Preference</label>
                    <div className="space-y-2">
                        {[
                            { name: 'Deep Space', colors: ['bg-slate-900', 'bg-indigo-500', 'bg-cyan-400'] },
                            { name: 'Nebula', colors: ['bg-purple-900', 'bg-fuchsia-500', 'bg-pink-400'] },
                            { name: 'Supernova', colors: ['bg-orange-900', 'bg-orange-500', 'bg-yellow-400'] },
                            { name: 'Starlight', colors: ['bg-slate-800', 'bg-slate-400', 'bg-white'] },
                        ].map((p) => (
                            <button
                                key={p.name}
                                onClick={() => setPalette(p.name)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${palette === p.name
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 ring-1 ring-indigo-500'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                                    }`}
                            >
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{p.name}</span>
                                <div className="flex -space-x-2">
                                    {p.colors.map((c, i) => (
                                        <div key={i} className={`w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 ${c}`} />
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-6">
                    <button
                        onClick={handleSynthesize}
                        disabled={isGenerating}
                        className={`w-full py-4 rounded-xl flex items-center justify-center font-bold tracking-wide transition-all ${isGenerating
                            ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                            }`}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="animate-spin mr-2" /> PROCESSING...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 fill-current" /> SYNTHESIZE INSIGNIA
                            </>
                        )}
                    </button>
                </div>
            </GlassCard>

            {/* Right Panel: Holographic Output */}
            <div className="flex-1 flex flex-col gap-6 h-full relative">
                <GlassCard className="flex-1 border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-900/80 backdrop-blur-3xl shadow-2xl relative overflow-hidden flex flex-col justify-center items-center">

                    {/* Background Grid Effect */}
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}>
                    </div>

                    {!isGenerating && !hasGenerated && (
                        <div className="text-center relative z-10 animate-fade-in">
                            <div className="w-32 h-32 mx-auto border-4 border-slate-300 dark:border-slate-700 border-dashed rounded-full flex items-center justify-center mb-6 animate-[spin_10s_linear_infinite]">
                                <Box size={48} className="text-slate-300 dark:text-slate-700" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Holographic Deck Online</h3>
                            <p className="text-slate-500 dark:text-slate-500 mt-2">Awaiting Input Data...</p>
                        </div>
                    )}

                    {isGenerating && (
                        <div className="relative z-10 text-center">
                            <div className="w-32 h-32 relative mx-auto mb-8">
                                <div className="absolute inset-0 rounded-full border-t-4 border-cyan-500 animate-spin"></div>
                                <div className="absolute inset-4 rounded-full border-r-4 border-purple-500 animate-[spin_1.5s_linear_infinite_reverse]"></div>
                                <div className="absolute inset-8 rounded-full bg-indigo-500/20 blur-xl animate-pulse"></div>
                            </div>
                            <div className="space-y-2 font-mono text-xs text-cyan-500">
                                <p className="animate-fade-in">Parsing Vibe Vectors...</p>
                                <p className="animate-fade-in delay-75">Constructing Geometry...</p>
                                <p className="animate-fade-in delay-150">Applying Chromatic Layer...</p>
                            </div>
                        </div>
                    )}

                    {hasGenerated && !isGenerating && (
                        <div className="w-full h-full p-8 flex flex-col">
                            <div className="grid grid-cols-2 gap-6 flex-1 mb-8">
                                {results.map((logo) => (
                                    <button
                                        key={logo.id}
                                        onClick={() => setSelectedLogo(logo.id)}
                                        className={`relative group rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${selectedLogo === logo.id
                                            ? 'bg-slate-900 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] scale-105 z-10'
                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:scale-102'
                                            }`}
                                    >
                                        <div className={`relative z-10 transform transition-transform duration-500 ${selectedLogo === logo.id ? 'scale-125' : ''}`}>
                                            <logo.icon
                                                size={64}
                                                color={selectedLogo === logo.id ? logo.color : 'currentColor'}
                                                className={selectedLogo === logo.id ? 'text-white' : 'text-slate-700 dark:text-slate-300'}
                                            />
                                        </div>
                                        {selectedLogo === logo.id && (
                                            <div className="absolute bottom-4 text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
                                                Selected
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Brand Kit Preview Panel (Bottom Overlay) */}
                            {activeSelection ? (
                                <div className="h-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center animate-fade-in">
                                    <div className="flex gap-8">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Primary Color</label>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg shadow-sm" style={{ backgroundColor: activeSelection.color }}></div>
                                                <div className="font-mono text-sm text-slate-700 dark:text-slate-200">{activeSelection.color}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Typography</label>
                                            <div className="space-y-1">
                                                <div className="text-xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'sans-serif' }}>{missionName}</div>
                                                <div className="text-xs text-slate-500 font-mono">Primary: {activeSelection.fontPrimary}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleDeploy}
                                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 flex items-center transition-transform hover:scale-105"
                                    >
                                        <Save size={18} className="mr-2" /> Deploy Brand Assets
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center pb-4 text-slate-400 text-sm">Select a concept to preview brand kit details.</div>
                            )}
                        </div>
                    )}
                </GlassCard>
            </div>
        </div>
    );
};

export default BrandIdentityLab;