import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Activity, Users, TrendingUp, Workflow, CreditCard, Globe, Target, Plus, Edit2, Trash2, X, CheckCircle2, AlertCircle, Clock, Play, Pause, Circle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useMission } from '../../../context/MissionContext';

// Mock Data for Charts
const revenueData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 5000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 6890 },
    { name: 'Sat', value: 8390 },
    { name: 'Sun', value: 10490 },
];

const trafficData = [
    { name: '00:00', value: 120 },
    { name: '04:00', value: 80 },
    { name: '08:00', value: 450 },
    { name: '12:00', value: 980 },
    { name: '16:00', value: 850 },
    { name: '20:00', value: 600 },
    { name: '23:59', value: 320 },
];

const VelocityMode: React.FC = () => {
    const {
        trajectories,
        updateTrajectory,
        addTrajectory,
        deleteTrajectory,
        optimizationGoals,
        updateOptimizationGoal,
        addOptimizationGoal,
        deleteOptimizationGoal,
        growthMetrics,
        setGrowthMetrics
    } = useMission();

    const [editingTrajectory, setEditingTrajectory] = useState<string | null>(null);
    const [editingGoal, setEditingGoal] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ name: '', description: '' });
    const [goalForm, setGoalForm] = useState({ name: '', metric: '', targetValue: 0, deadline: '' });
    const [showAddTrajectory, setShowAddTrajectory] = useState(false);
    const [showAddGoal, setShowAddGoal] = useState(false);

    // Initialize growth metrics if not set
    useEffect(() => {
        if (!growthMetrics) {
            setGrowthMetrics({
                revenue: 14240,
                revenueChange: 12,
                traffic: 8450,
                trafficChange: 5,
                conversions: 342,
                conversionRate: 2.4,
                activeUsers: 1247,
                churnRate: 5.2,
                lastUpdated: new Date().toISOString()
            });
        }
    }, [growthMetrics, setGrowthMetrics]);

    const handleToggleTrajectoryStatus = (id: string) => {
        const trajectory = trajectories.find(t => t.id === id);
        if (!trajectory) return;

        const statusCycle: Array<'running' | 'paused' | 'idle'> = ['running', 'paused', 'idle'];
        const currentIndex = statusCycle.indexOf(trajectory.status);
        const nextIndex = (currentIndex + 1) % statusCycle.length;
        const nextStatus = statusCycle[nextIndex];

        updateTrajectory(id, {
            status: nextStatus,
            lastRun: nextStatus === 'running' ? new Date().toISOString() : trajectory.lastRun
        });
    };

    const handleEditTrajectory = (id: string) => {
        const trajectory = trajectories.find(t => t.id === id);
        if (trajectory) {
            setEditingTrajectory(id);
            setEditForm({ name: trajectory.name, description: trajectory.description });
        }
    };

    const handleSaveTrajectory = (id: string) => {
        updateTrajectory(id, {
            name: editForm.name,
            description: editForm.description
        });
        setEditingTrajectory(null);
    };

    const handleAddTrajectory = () => {
        if (!editForm.name) return;

        const newTrajectory = {
            id: `traj-${Date.now()}`,
            name: editForm.name,
            type: 'automation' as const,
            description: editForm.description,
            status: 'idle' as const,
            activeNodes: 0,
            efficiency: 0
        };

        addTrajectory(newTrajectory);
        setEditForm({ name: '', description: '' });
        setShowAddTrajectory(false);
    };

    const handleEditGoal = (id: string) => {
        const goal = optimizationGoals.find(g => g.id === id);
        if (goal) {
            setEditingGoal(id);
            setGoalForm({
                name: goal.name,
                metric: goal.metric,
                targetValue: goal.targetValue,
                deadline: goal.deadline
            });
        }
    };

    const handleSaveGoal = (id: string) => {
        updateOptimizationGoal(id, {
            name: goalForm.name,
            metric: goalForm.metric,
            targetValue: goalForm.targetValue,
            deadline: goalForm.deadline
        });
        setEditingGoal(null);
    };

    const handleAddGoal = () => {
        if (!goalForm.name || !goalForm.metric) return;

        const newGoal = {
            id: `goal-${Date.now()}`,
            name: goalForm.name,
            metric: goalForm.metric,
            currentValue: 0,
            targetValue: goalForm.targetValue,
            deadline: goalForm.deadline,
            status: 'on-track' as const,
            priority: 'medium' as const
        };

        addOptimizationGoal(newGoal);
        setGoalForm({ name: '', metric: '', targetValue: 0, deadline: '' });
        setShowAddGoal(false);
    };

    const getTrajectoryIcon = (type: string) => {
        switch (type) {
            case 'automation': return Workflow;
            case 'marketing': return Globe;
            case 'finance': return CreditCard;
            default: return Activity;
        }
    };

    const getTrajectoryColor = (type: string) => {
        switch (type) {
            case 'automation': return 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/20';
            case 'marketing': return 'text-cyan-500 bg-cyan-100 dark:bg-cyan-900/20';
            case 'finance': return 'text-orange-500 bg-orange-100 dark:bg-orange-900/20';
            default: return 'text-slate-500 bg-slate-100 dark:bg-slate-900/20';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running': return 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
            case 'paused': return 'bg-orange-500 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]';
            default: return 'bg-slate-300 dark:bg-slate-600 border-slate-300 dark:border-slate-600';
        }
    };

    const getGoalStatusColor = (status: string) => {
        switch (status) {
            case 'achieved': return 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300';
            case 'on-track': return 'bg-cyan-50 dark:bg-cyan-900/10 border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300';
            case 'at-risk': return 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-500/30 text-orange-700 dark:text-orange-300';
            case 'missed': return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300';
            default: return 'bg-slate-50 dark:bg-slate-900/10 border-slate-200 dark:border-slate-700/30 text-slate-700 dark:text-slate-300';
        }
    };

    const calculateProgress = (current: number, target: number) => {
        return Math.min(Math.round((current / target) * 100), 100);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Growth Phase</h2>
                <p className="text-slate-500 dark:text-slate-400">Phase: <span className="text-emerald-500 font-bold">Growth & Optimization</span></p>
            </div>

            {/* Growth Metrics (Charts) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-0 overflow-hidden group">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-mono uppercase tracking-wider">
                                <Activity size={14} className="mr-2 text-emerald-500" /> Revenue
                            </div>
                            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                +{growthMetrics?.revenueChange || 12}%
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">${growthMetrics?.revenue.toLocaleString() || '14,240'}</div>
                    </div>
                    <div className="h-24 w-full bg-white dark:bg-slate-900 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <GlassCard className="p-0 overflow-hidden group">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-mono uppercase tracking-wider">
                                <Users size={14} className="mr-2 text-cyan-500" /> Traffic
                            </div>
                            <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                +{growthMetrics?.trafficChange || 5}%
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{growthMetrics?.traffic.toLocaleString() || '8,450'}</div>
                    </div>
                    <div className="h-24 w-full bg-white dark:bg-slate-900 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <GlassCard className="p-0 overflow-hidden group">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-mono uppercase tracking-wider">
                                <TrendingUp size={14} className="mr-2 text-orange-500" /> Conversion
                            </div>
                            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {growthMetrics?.conversionRate || 2.4}%
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{growthMetrics?.conversions || 342}</div>
                    </div>
                    <div className="h-24 w-full bg-white dark:bg-slate-900 relative">
                        <div className="flex items-end justify-between px-6 pt-4 h-full pb-2">
                            {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                                <div key={i} className="w-2 bg-orange-500/20 rounded-t-sm relative group-hover:bg-orange-500/40 transition-colors">
                                    <div className="absolute bottom-0 w-full bg-orange-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    {/* Active Workflows */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center">
                                <Workflow size={16} className="mr-2" /> Active Workflows
                            </h3>
                            <button
                                onClick={() => setShowAddTrajectory(true)}
                                className="flex items-center gap-1 text-xs font-bold text-emerald-500 hover:text-emerald-600 transition-colors"
                            >
                                <Plus size={14} /> Add Workflow
                            </button>
                        </div>

                        {showAddTrajectory && (
                            <GlassCard className="mb-4 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/30">
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Workflow name..."
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                                        autoFocus
                                    />
                                    <textarea
                                        placeholder="Description..."
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-emerald-500 resize-none h-20"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setShowAddTrajectory(false);
                                                setEditForm({ name: '', description: '' });
                                            }}
                                            className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddTrajectory}
                                            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded transition-colors"
                                        >
                                            Add Workflow
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        )}

                        <div className="space-y-3">
                            {trajectories.map((traj) => {
                                const TrajIcon = getTrajectoryIcon(traj.type);

                                return (
                                    <GlassCard key={traj.id} className="group hover:border-emerald-500/50 transition-colors">
                                        {editingTrajectory === traj.id ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                                                    autoFocus
                                                />
                                                <textarea
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-emerald-500 resize-none h-16"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingTrajectory(null)}
                                                        className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleSaveTrajectory(traj.id)}
                                                        className="p-1 text-emerald-500 hover:text-emerald-600"
                                                    >
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div
                                                        onClick={() => handleToggleTrajectoryStatus(traj.id)}
                                                        className={`w-3 h-3 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${getStatusColor(traj.status)}`}
                                                        title={`Status: ${traj.status.toUpperCase()} (Click to change)`}
                                                    ></div>
                                                    <div className={`p-3 rounded-lg ${getTrajectoryColor(traj.type)}`}>
                                                        <TrajIcon size={20} className={traj.status === 'running' ? 'animate-pulse-slow' : ''} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-slate-800 dark:text-white">{traj.name}</h4>
                                                        <div className="flex items-center text-xs text-slate-500 gap-2 mt-1">
                                                            <span>{traj.type.charAt(0).toUpperCase() + traj.type.slice(1)} Protocol</span>
                                                            <span className={`flex items-center font-medium ${traj.status === 'running' ? 'text-emerald-500' :
                                                                traj.status === 'paused' ? 'text-orange-500' :
                                                                    'text-slate-400'
                                                                }`}>
                                                                {traj.status === 'running' ? <Play size={12} className="mr-1" /> :
                                                                    traj.status === 'paused' ? <Pause size={12} className="mr-1" /> :
                                                                        <Circle size={12} className="mr-1" />}
                                                                {traj.status.charAt(0).toUpperCase() + traj.status.slice(1)}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{traj.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-slate-800 dark:text-white">{traj.activeNodes}</div>
                                                        <div className="text-xs text-slate-500 uppercase font-mono">Steps</div>
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEditTrajectory(traj.id)}
                                                            className="text-slate-400 hover:text-emerald-500 transition-colors"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteTrajectory(traj.id)}
                                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </GlassCard>
                                );
                            })}
                        </div>
                    </div>

                    {/* Optimization Goals */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center">
                                <Target size={16} className="mr-2" /> Optimization Goals
                            </h3>
                            <button
                                onClick={() => setShowAddGoal(true)}
                                className="flex items-center gap-1 text-xs font-bold text-cyan-500 hover:text-cyan-600 transition-colors"
                            >
                                <Plus size={14} /> Add Goal
                            </button>
                        </div>

                        {showAddGoal && (
                            <GlassCard className="mb-4 bg-cyan-50 dark:bg-cyan-900/10 border-cyan-200 dark:border-cyan-500/30">
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Goal name..."
                                        value={goalForm.name}
                                        onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                                        autoFocus
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Metric (e.g., Revenue)"
                                            value={goalForm.metric}
                                            onChange={(e) => setGoalForm({ ...goalForm, metric: e.target.value })}
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-cyan-500"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Target value"
                                            value={goalForm.targetValue || ''}
                                            onChange={(e) => setGoalForm({ ...goalForm, targetValue: Number(e.target.value) })}
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-cyan-500"
                                        />
                                    </div>
                                    <input
                                        type="date"
                                        value={goalForm.deadline}
                                        onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-cyan-500"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setShowAddGoal(false);
                                                setGoalForm({ name: '', metric: '', targetValue: 0, deadline: '' });
                                            }}
                                            className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddGoal}
                                            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold rounded transition-colors"
                                        >
                                            Add Goal
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        )}

                        <div className="space-y-3">
                            {optimizationGoals.map((goal) => {
                                const progress = calculateProgress(goal.currentValue, goal.targetValue);

                                return (
                                    <GlassCard key={goal.id} className={`group ${getGoalStatusColor(goal.status)}`}>
                                        {editingGoal === goal.id ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={goalForm.name}
                                                    onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                                                    autoFocus
                                                />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="text"
                                                        value={goalForm.metric}
                                                        onChange={(e) => setGoalForm({ ...goalForm, metric: e.target.value })}
                                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-cyan-500"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={goalForm.targetValue}
                                                        onChange={(e) => setGoalForm({ ...goalForm, targetValue: Number(e.target.value) })}
                                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-cyan-500"
                                                    />
                                                </div>
                                                <input
                                                    type="date"
                                                    value={goalForm.deadline}
                                                    onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs text-slate-600 dark:text-slate-300 outline-none focus:border-cyan-500"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingGoal(null)}
                                                        className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleSaveGoal(goal.id)}
                                                        className="p-1 text-cyan-500 hover:text-cyan-600"
                                                    >
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-base">{goal.name}</h4>
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${goal.priority === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                                                                goal.priority === 'medium' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                                                                    'bg-slate-100 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400'
                                                                }`}>
                                                                {goal.priority}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs opacity-75">{goal.metric}</p>
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEditGoal(goal.id)}
                                                            className="text-slate-400 hover:text-cyan-500 transition-colors"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteOptimizationGoal(goal.id)}
                                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-end justify-between text-xs mb-2">
                                                    <div className="flex items-center gap-1 opacity-75">
                                                        <Clock size={12} />
                                                        <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="font-bold">
                                                        {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="w-full h-2 bg-white/50 dark:bg-slate-900/50 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-500 ${goal.status === 'achieved' ? 'bg-emerald-500' :
                                                            goal.status === 'on-track' ? 'bg-cyan-500' :
                                                                goal.status === 'at-risk' ? 'bg-orange-500' :
                                                                    'bg-red-500'
                                                            }`}
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </>
                                        )}
                                    </GlassCard>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    {/* System Health */}
                    <GlassCard className="h-full border-t-4 border-t-emerald-500">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Platform Health</h3>
                            <span className="text-xs font-bold text-emerald-500">Optimal</span>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>API Latency</span>
                                    <span>24ms</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                                    <div className="h-full bg-emerald-500 w-[15%] rounded-full"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>Server Load</span>
                                    <span>42%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                                    <div className="h-full bg-indigo-500 w-[42%] rounded-full"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>Active Users</span>
                                    <span>{growthMetrics?.activeUsers.toLocaleString() || '1,247'}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                                    <div className="h-full bg-cyan-500 w-[78%] rounded-full"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>Churn Rate</span>
                                    <span>{growthMetrics?.churnRate || 5.2}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                                    <div className="h-full bg-orange-500 w-[52%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default VelocityMode;
