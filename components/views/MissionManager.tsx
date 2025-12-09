
import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import {
    Plus, Rocket, Trash2, Edit2, Download, Upload,
    Calendar, TrendingUp, Settings, X, Check
} from 'lucide-react';
import { storageService, Mission } from '../../services/storage';
import { exportService } from '../../services/export';

interface MissionManagerProps {
    currentMissionId: string | null;
    onSelectMission: (missionId: string) => void;
    onCreateMission: (mission: Mission) => void;
    onClose: () => void;
}

const MissionManager: React.FC<MissionManagerProps> = ({
    currentMissionId,
    onSelectMission,
    onCreateMission,
    onClose,
}) => {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newMissionName, setNewMissionName] = useState('');
    const [newMissionIndustry, setNewMissionIndustry] = useState('');

    useEffect(() => {
        loadMissions();
    }, []);

    const loadMissions = () => {
        const allMissions = storageService.getAllMissions();
        setMissions(allMissions);
    };

    const handleCreateMission = () => {
        if (!newMissionName.trim() || !newMissionIndustry.trim()) {
            alert('Please fill in all fields');
            return;
        }

        const newMission: Mission = {
            id: `mission_${Date.now()}`,
            name: newMissionName,
            industry: newMissionIndustry,
            stage: 'ideation',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            data: {
                signalStrength: 0,
                mvpData: null,
                setupTasks: [],
                brandIdentity: null,
                metrics: [],
                trajectories: [],
                goals: [],
                selectedLaunchPad: null,
            },
        };

        storageService.saveMission(newMission);
        onCreateMission(newMission);

        setNewMissionName('');
        setNewMissionIndustry('');
        setShowCreateForm(false);
        loadMissions();
    };

    const handleDeleteMission = (missionId: string) => {
        if (confirm('Are you sure you want to delete this mission? This action cannot be undone.')) {
            storageService.deleteMission(missionId);
            loadMissions();
        }
    };

    const handleExportMission = (mission: Mission) => {
        exportService.exportMission(mission, {
            format: 'markdown',
            includeMetadata: true,
        });
    };

    const handleExportRoadmap = (mission: Mission) => {
        exportService.exportRoadmap(mission);
    };

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'ideation':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
            case 'setup':
                return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
            case 'growth':
                return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
            default:
                return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
        }
    };

    const getStageLabel = (stage: string) => {
        switch (stage) {
            case 'ideation':
                return 'Ideation';
            case 'setup':
                return 'Setup';
            case 'growth':
                return 'Growth';
            default:
                return stage;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Rocket size={24} className="text-indigo-500" />
                            Project Manager
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manage your projects
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Create New Mission Button */}
                    {!showCreateForm && (
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="w-full mb-6 p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold"
                        >
                            <Plus size={20} />
                            Create New Project
                        </button>
                    )}

                    {/* Create Mission Form */}
                    {showCreateForm && (
                        <GlassCard className="mb-6 p-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                New Project
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newMissionName}
                                        onChange={(e) => setNewMissionName(e.target.value)}
                                        placeholder="e.g., My SaaS Startup"
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Industry
                                    </label>
                                    <input
                                        type="text"
                                        value={newMissionIndustry}
                                        onChange={(e) => setNewMissionIndustry(e.target.value)}
                                        placeholder="e.g., Technology, E-commerce, Consulting"
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCreateMission}
                                        className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <Check size={16} />
                                        Create Project
                                    </button>
                                    <button
                                        onClick={() => setShowCreateForm(false)}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    )}

                    {/* Missions List */}
                    {missions.length === 0 ? (
                        <div className="text-center py-12">
                            <Rocket size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                            <p className="text-slate-500 dark:text-slate-400">
                                No projects yet. Create your first project to get started!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {missions.map((mission) => (
                                <GlassCard
                                    key={mission.id}
                                    className={`p-5 transition-all cursor-pointer ${currentMissionId === mission.id
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10'
                                        : 'hover:border-indigo-300'
                                        }`}
                                    onClick={() => onSelectMission(mission.id)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                    {mission.name}
                                                </h3>
                                                {currentMissionId === mission.id && (
                                                    <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full">
                                                        ACTIVE
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {mission.industry}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${getStageColor(
                                                mission.stage
                                            )}`}
                                        >
                                            {getStageLabel(mission.stage)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            Created {new Date(mission.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp size={12} />
                                            Validation: {mission.data.signalStrength}%
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleExportMission(mission);
                                            }}
                                            className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                                        >
                                            <Download size={12} />
                                            Export Plan
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleExportRoadmap(mission);
                                            }}
                                            className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                                        >
                                            <Upload size={12} />
                                            Export Roadmap
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteMission(mission.id);
                                            }}
                                            className="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-all"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MissionManager;
