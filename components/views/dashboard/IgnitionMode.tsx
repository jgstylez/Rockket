import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Shield, Globe, FileText, Palette, ArrowRight, CheckCircle2, Circle, Clock, Edit2, Plus, X, Settings } from 'lucide-react';
import { View } from '../../../types';
import { useMission } from '../../../context/MissionContext';

interface IgnitionModeProps {
    onNavigate?: (view: View) => void;
}

const IgnitionMode: React.FC<IgnitionModeProps> = ({ onNavigate }) => {
    const { ignitionProgress, brandIdentity, setupTasks, updateSetupTask, setStage } = useMission();
    const [editingTask, setEditingTask] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ name: '', description: '' });

    const checklistProgress = ignitionProgress;

    // Calculate overall completion
    const completedTasks = setupTasks.filter(t => t.status === 'complete').length;
    const totalTasks = setupTasks.length;
    const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

    const handleEditTask = (taskId: string) => {
        const task = setupTasks.find(t => t.id === taskId);
        if (task) {
            setEditingTask(taskId);
            setEditForm({ name: task.name, description: task.description });
        }
    };

    const handleSaveTask = (taskId: string) => {
        updateSetupTask(taskId, {
            name: editForm.name,
            description: editForm.description
        });
        setEditingTask(null);
    };

    const handleToggleStatus = (taskId: string) => {
        const task = setupTasks.find(t => t.id === taskId);
        if (!task) return;

        const statusCycle: Array<'pending' | 'in-progress' | 'complete'> = ['pending', 'in-progress', 'complete'];
        const currentIndex = statusCycle.indexOf(task.status);
        const nextIndex = (currentIndex + 1) % statusCycle.length;
        const nextStatus = statusCycle[nextIndex];

        updateSetupTask(taskId, {
            status: nextStatus,
            progress: nextStatus === 'complete' ? 100 : nextStatus === 'in-progress' ? 50 : 0
        });
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'identity': return Palette;
            case 'digital': return Globe;
            case 'legal': return FileText;
            case 'financial': return Shield;
            case 'operations': return Settings;
            default: return Circle;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'identity': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20';
            case 'digital': return 'text-cyan-500 bg-cyan-100 dark:bg-cyan-900/20';
            case 'legal': return 'text-orange-500 bg-orange-100 dark:bg-orange-900/20';
            case 'financial': return 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/20';
            case 'operations': return 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/20';
            default: return 'text-slate-500 bg-slate-100 dark:bg-slate-900/20';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'complete': return 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
            case 'in-progress': return 'bg-orange-500 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]';
            default: return 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600';
        }
    };

    // Check if Ignition objectives are complete
    const isIgnitionComplete = completionPercentage === 100 && brandIdentity;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-8 space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Setup Phase</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Phase: <span className="text-orange-500 font-bold">System Setup</span></p>

                    {/* Ready for Next Phase Banner */}
                    {isIgnitionComplete && (
                        <div className="mb-6 animate-fade-in">
                            <GlassCard className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/10 dark:to-cyan-900/10 border-emerald-200 dark:border-emerald-500/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-emerald-500 text-white rounded-xl animate-pulse">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">Setup Phase Complete! 🚀</h4>
                                            <p className="text-sm text-emerald-600 dark:text-emerald-300 mt-1">
                                                All systems online. Ready to move to <span className="font-bold">Growth Phase</span> for growth & optimization?
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setStage('growth')}
                                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                                    >
                                        Enter Growth Phase <ArrowRight size={18} />
                                    </button>
                                </div>
                            </GlassCard>
                        </div>
                    )}

                    {/* Readiness Gauge */}
                    <GlassCard className="relative overflow-hidden mb-8">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Setup Progress</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {completedTasks} of {totalTasks} tasks completed
                                </p>
                            </div>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${completionPercentage}%` }}
                            ></div>
                        </div>
                    </GlassCard>

                    {/* Brand Identity Summary - Shows when complete */}
                    {brandIdentity && (
                        <div className="mb-8 animate-fade-in">
                            <GlassCard className="bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-500/30">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-500 text-white rounded-xl">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-3">Brand Identity Saved</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-bold text-slate-700 dark:text-slate-300">Style:</span>
                                                <p className="text-slate-600 dark:text-slate-400">{brandIdentity.logoStyle}</p>
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-700 dark:text-slate-300">Primary Color:</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-6 h-6 rounded border border-slate-300 dark:border-slate-600" style={{ backgroundColor: brandIdentity.primaryColor }}></div>
                                                    <span className="text-slate-600 dark:text-slate-400 font-mono text-xs">{brandIdentity.primaryColor}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-700 dark:text-slate-300">Primary Font:</span>
                                                <p className="text-slate-600 dark:text-slate-400">{brandIdentity.fontPrimary}</p>
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-700 dark:text-slate-300">Palette:</span>
                                                <p className="text-slate-600 dark:text-slate-400">{brandIdentity.paletteName}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    )}

                    {/* PRIORITY MISSION (Brand Identity Lab) */}
                    {!brandIdentity && (
                        <div className="mb-4">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Priority Task</h3>
                            </div>

                            <div
                                onClick={() => onNavigate && onNavigate('brand_identity')}
                                className="group relative cursor-pointer"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500 animate-pulse-slow"></div>
                                <GlassCard className="relative border-0 bg-white dark:bg-slate-900 !bg-opacity-90 hover:!bg-opacity-100 transition-all">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-4 bg-orange-50 dark:bg-orange-500/10 rounded-xl text-orange-500 border border-orange-100 dark:border-orange-500/20">
                                                <Palette size={32} className="fill-current" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Establish Visual Identity</h3>
                                                <p className="text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
                                                    Use AI to generate your logo, define your color palette, and assemble your official brand kit.
                                                </p>
                                            </div>
                                        </div>
                                        <button className="flex-shrink-0 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                            Enter Brand Studio <ArrowRight size={18} className="ml-2" />
                                        </button>
                                    </div>
                                </GlassCard>
                            </div>
                        </div>
                    )}

                    {/* Setup Checklist */}
                    <GlassCard className="relative overflow-visible">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Setup Checklist</h3>
                            <span className="text-xs text-slate-400 italic">Click status to cycle • Hover to edit</span>
                        </div>

                        <div className="relative pl-4 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                            {setupTasks.map((task) => {
                                const CategoryIcon = getCategoryIcon(task.category);

                                return (
                                    <div key={task.id} className="relative pl-6 group">
                                        <div
                                            onClick={() => handleToggleStatus(task.id)}
                                            className={`absolute left-[-21px] top-4 w-4 h-4 rounded-full border-2 cursor-pointer transition-all hover:scale-110 z-10 ${getStatusColor(task.status)}`}
                                            title={`Status: ${task.status.toUpperCase()} (Click to change)`}
                                        ></div>

                                        <div className={`p-4 rounded-xl border transition-all relative ${task.status === 'complete'
                                            ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/30'
                                            : task.status === 'in-progress'
                                                ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-500/30'
                                                : 'bg-white/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50'
                                            }`}>
                                            {editingTask === task.id ? (
                                                <div className="space-y-3">
                                                    <input
                                                        type="text"
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-orange-500"
                                                        autoFocus
                                                    />
                                                    <textarea
                                                        value={editForm.description}
                                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-orange-500 resize-none h-16"
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => setEditingTask(null)}
                                                            className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveTask(task.id)}
                                                            className="p-1 text-emerald-500 hover:text-emerald-600"
                                                        >
                                                            <CheckCircle2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex items-start gap-3 flex-1">
                                                            <div className={`p-2 rounded-lg ${getCategoryColor(task.category)}`}>
                                                                <CategoryIcon size={18} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className={`font-bold text-base ${task.status === 'complete'
                                                                    ? 'text-emerald-700 dark:text-emerald-300 line-through decoration-emerald-500/50'
                                                                    : task.status === 'in-progress'
                                                                        ? 'text-orange-700 dark:text-orange-300'
                                                                        : 'text-slate-700 dark:text-slate-300'
                                                                    }`}>{task.name}</h4>
                                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{task.description}</p>

                                                                {task.status === 'in-progress' && (
                                                                    <div className="mt-3">
                                                                        <div className="flex justify-between text-xs mb-1">
                                                                            <span className="text-slate-500">Progress</span>
                                                                            <span className="text-orange-500 font-bold">{task.progress}%</span>
                                                                        </div>
                                                                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                                            <div
                                                                                className="h-full bg-orange-500 transition-all duration-500"
                                                                                style={{ width: `${task.progress}%` }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleEditTask(task.id)}
                                                                className="text-slate-400 hover:text-orange-500 transition-colors"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {task.status === 'complete' && (
                                                        <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-500">
                                                            <CheckCircle2 size={14} /> Task Complete
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </GlassCard>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
                {/* System Status */}
                <GlassCard className="h-full border-t-4 border-t-orange-500">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Task Status</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${completionPercentage === 100
                            ? 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/20'
                            : completionPercentage > 0
                                ? 'text-orange-500 bg-orange-100 dark:bg-orange-900/20'
                                : 'text-slate-500 bg-slate-100 dark:bg-slate-900/20'
                            }`}>
                            {completionPercentage === 100 ? 'Ready' : completionPercentage > 0 ? 'In Progress' : 'Standby'}
                        </span>
                    </div>
                    <div className="space-y-4">
                        {setupTasks.map((task) => {
                            const CategoryIcon = getCategoryIcon(task.category);
                            return (
                                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <CategoryIcon size={18} className={
                                            task.status === 'complete'
                                                ? 'text-emerald-500'
                                                : task.status === 'in-progress'
                                                    ? 'text-orange-500'
                                                    : 'text-slate-400'
                                        } />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{task.name}</span>
                                    </div>
                                    <div className="text-xs font-mono text-slate-400 capitalize">{task.status.replace('-', ' ')}</div>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default IgnitionMode;
