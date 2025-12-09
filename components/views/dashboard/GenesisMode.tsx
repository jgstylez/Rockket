import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Radio, ChevronRight, X, Save, Edit2, Trash2, CheckCircle2, Plus, Lightbulb, Map, Rocket, ArrowRight } from 'lucide-react';
import { useMission } from '../../../context/MissionContext';
import { View } from '../../../types';

interface GenesisModeProps {
    onNavigate?: (view: View) => void;
}

const GenesisMode: React.FC<GenesisModeProps> = ({ onNavigate }) => {
    const {
        missionRoadmap,
        signalStrength,
        updateMissionStep,
        addMissionStep,
        deleteMissionStep,
        setMissionRoadmap,
        mvpData,
        setStage
    } = useMission();

    // Local editing state
    const [editingStepId, setEditingStepId] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState({ title: '', desc: '' });

    const handleAddStep = () => {
        const newId = Math.max(...missionRoadmap.map(i => i.id), 0) + 1;
        addMissionStep({
            id: newId,
            title: 'New Objective',
            desc: 'Define mission parameters',
            status: 'pending'
        });
        setEditingStepId(newId);
        setEditFormData({ title: 'New Objective', desc: 'Define mission parameters' });
    };

    const handleEditClick = (step: any) => {
        setEditingStepId(step.id);
        setEditFormData({ title: step.title, desc: step.desc });
    };

    const handleSaveStep = (id: number) => {
        updateMissionStep(id, editFormData);
        setEditingStepId(null);
    };

    const cycleStatus = (id: number) => {
        const step = missionRoadmap.find(s => s.id === id);
        if (!step) return;

        const statuses: ('active' | 'pending' | 'locked' | 'complete')[] = ['pending', 'active', 'complete', 'locked'];
        const currentIndex = statuses.indexOf(step.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        updateMissionStep(id, { status: statuses[nextIndex] });
    };

    const handleEngage = (stepId: number) => {
        if (!onNavigate) return;
        switch (stepId) {
            case 1: onNavigate && onNavigate('signal_scanner'); break;
            case 2: onNavigate && onNavigate('missionkits'); break;
            case 4: onNavigate && onNavigate('mission_cockpit'); break;
            default: break;
        }
    };

    // Check if Genesis objectives are complete
    const isGenesisComplete = signalStrength >= 100 && mvpData;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left: Mission Roadmap */}
            <div className="lg:col-span-8 space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Ideation Phase</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Phase: <span className="text-indigo-500 font-bold">Ideation & Strategy</span></p>

                    {/* Ready for Next Phase Banner */}
                    {isGenesisComplete && (
                        <div className="mb-6 animate-fade-in">
                            <GlassCard className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 border-orange-200 dark:border-orange-500/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-orange-500 text-white rounded-xl animate-pulse">
                                            <Rocket size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-orange-700 dark:text-orange-400">Ideation Phase Complete! 🎉</h4>
                                            <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
                                                Your concept is validated. Ready to move to <span className="font-bold">Setup Phase</span> for system setup?
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setStage('setup')}
                                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                                    >
                                        Enter Setup Phase <ArrowRight size={18} />
                                    </button>
                                </div>
                            </GlassCard>
                        </div>
                    )}

                    {/* SIGNAL SCANNER CARD - Priority Mission */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className={`w-2 h-2 rounded-full ${signalStrength >= 100 ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Priority Task</h3>
                        </div>
                        <div onClick={() => onNavigate && onNavigate('signal_scanner')} className="cursor-pointer group relative">
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${signalStrength >= 100 ? 'from-emerald-500 to-cyan-600' : 'from-red-500 to-indigo-600'} rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500`}></div>
                            <GlassCard className="relative bg-white dark:bg-slate-900 !bg-opacity-95 hover:!bg-opacity-100 transition-all border-0">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-4 ${signalStrength >= 100 ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500' : 'bg-red-100 dark:bg-red-500/10 text-red-500'} rounded-2xl`}>
                                            <Radio size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Concept Validation</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                                {signalStrength >= 100 ? 'MVP Validated ✓' : 'Validate your MVP idea before building.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="flex-1 md:w-48">
                                            <div className="flex justify-between text-xs font-bold uppercase mb-2">
                                                <span className="text-slate-500">Validation</span>
                                                <span className={signalStrength >= 100 ? "text-emerald-500" : "text-red-500"}>{signalStrength}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-1000 ${signalStrength >= 100 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${signalStrength}%` }}></div>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>

                    {/* MVP DATA SUMMARY - Shows when validation is complete */}
                    {mvpData && signalStrength >= 100 && (
                        <div className="mb-8 animate-fade-in">
                            <GlassCard className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/30">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-500 text-white rounded-xl">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-3">Validated MVP Concept</h4>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <span className="font-bold text-slate-700 dark:text-slate-300">Problem:</span>
                                                <p className="text-slate-600 dark:text-slate-400 mt-1">{mvpData.problem}</p>
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-700 dark:text-slate-300">Solution:</span>
                                                <p className="text-slate-600 dark:text-slate-400 mt-1">{mvpData.solution}</p>
                                            </div>
                                            {mvpData.audience && (
                                                <div>
                                                    <span className="font-bold text-slate-700 dark:text-slate-300">Target Audience:</span>
                                                    <p className="text-slate-600 dark:text-slate-400 mt-1">{mvpData.audience}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    )}

                    <GlassCard className="relative overflow-visible min-h-[300px]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Project Roadmap</h3>
                            <span className="text-xs text-slate-400 italic">Click status to toggle • Hover to edit</span>
                        </div>

                        <div className="relative pl-4 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-10 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                            {missionRoadmap.map((item) => (
                                <div key={item.id} className="relative pl-6 group">
                                    <div
                                        onClick={() => cycleStatus(item.id)}
                                        className={`absolute left-[-21px] top-4 w-4 h-4 rounded-full border-2 cursor-pointer transition-all hover:scale-110 z-10 ${item.status === 'active' ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' :
                                            item.status === 'complete' ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                                item.status === 'locked' ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600' :
                                                    'bg-white dark:bg-slate-900 border-indigo-500'
                                            }`} title={`Status: ${item.status.toUpperCase()} (Click to change)`}></div>

                                    <div className={`p-4 rounded-xl border transition-all relative ${item.status === 'active'
                                        ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-500/30'
                                        : item.status === 'complete'
                                            ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/30'
                                            : 'bg-white/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50 opacity-80'
                                        }`}>
                                        {editingStepId === item.id ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={editFormData.title}
                                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                                                    autoFocus
                                                />
                                                <textarea
                                                    value={editFormData.desc}
                                                    onChange={(e) => setEditFormData({ ...editFormData, desc: e.target.value })}
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500 resize-none h-16"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingStepId(null)}
                                                        className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleSaveStep(item.id)}
                                                        className="p-1 text-emerald-500 hover:text-emerald-600"
                                                    >
                                                        <Save size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`font-bold text-lg ${item.status === 'active' ? 'text-indigo-700 dark:text-indigo-300' :
                                                        item.status === 'complete' ? 'text-emerald-700 dark:text-emerald-300 line-through decoration-emerald-500/50' :
                                                            'text-slate-700 dark:text-slate-300'
                                                        }`}>{item.title}</h4>

                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEditClick(item)} className="text-slate-400 hover:text-indigo-500 transition-colors">
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button onClick={() => deleteMissionStep(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>

                                                {item.status === 'active' && (
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEngage(item.id)}
                                                            className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold shadow-md hover:bg-indigo-500 transition-colors"
                                                        >
                                                            Start Task
                                                        </button>
                                                        <span className="text-[10px] font-mono text-indigo-500 uppercase animate-pulse">In Progress</span>
                                                    </div>
                                                )}
                                                {item.status === 'complete' && (
                                                    <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-500">
                                                        <CheckCircle2 size={14} /> Task Completed
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className="relative pl-6 pt-2">
                                <div className="absolute left-[-21px] top-5 w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"></div>
                                <button
                                    onClick={handleAddStep}
                                    className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                                >
                                    <Plus size={16} /> Add Task
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
                <GlassCard className="border-t-4 border-t-indigo-500">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Priority Actions</h3>
                    <div className="space-y-4">
                        <button
                            onClick={() => onNavigate && onNavigate('mission_cockpit')}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all group"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                    <Lightbulb size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Draft Business Plan</h4>
                                    <p className="text-xs text-slate-500 mt-1">AI-assisted structural drafting.</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => onNavigate && onNavigate('missionkits')}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all group"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg">
                                    <Map size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Generate Name</h4>
                                    <p className="text-xs text-slate-500 mt-1">Check availability & semantics.</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </GlassCard>

                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-bold mb-1">Advisor Note:</p>
                    <p className="opacity-80">"Don't worry about the logo yet. Focus on the problem you are solving."</p>
                </div>
            </div>
        </div>
    );
};

export default GenesisMode;
