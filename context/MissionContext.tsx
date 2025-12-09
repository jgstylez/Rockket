import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Stage, LaunchPadTemplate } from '../types';

// --- Types & Interfaces ---

export interface MissionStep {
    id: number;
    title: string;
    desc: string;
    status: 'active' | 'pending' | 'locked' | 'complete';
}

export interface MVPData {
    problem: string;
    solution: string;
    audience: string;
    generatedCopy?: {
        headline: string;
        subheadline: string;
        cta: string;
        viralTweet: string;
    };
}

export interface BusinessStrategy {
    missionStatement: string;
    vision: string;
    coreValues: string[];
    elevatorPitch: string;
}

export interface BrandIdentity {
    logoId: string;
    logoStyle: string;
    primaryColor: string;
    secondaryColor: string;
    fontPrimary: string;
    fontSecondary: string;
    paletteName: string;
    deployedAt?: string;
}

export interface SetupTask {
    id: string;
    name: string;
    description: string;
    status: 'pending' | 'in-progress' | 'complete';
    category: 'identity' | 'legal' | 'digital' | 'financial' | 'operations';
    progress: number;
}

export interface GrowthMetrics {
    revenue: number;
    revenueChange: number;
    traffic: number;
    trafficChange: number;
    conversions: number;
    conversionRate: number;
    activeUsers: number;
    churnRate: number;
    lastUpdated: string;
}

export interface Trajectory {
    id: string;
    name: string;
    type: 'automation' | 'marketing' | 'finance' | 'operations';
    description: string;
    status: 'running' | 'paused' | 'idle';
    activeNodes: number;
    efficiency: number;
    lastRun?: string;
}

export interface OptimizationGoal {
    id: string;
    name: string;
    metric: string;
    currentValue: number;
    targetValue: number;
    deadline: string;
    status: 'on-track' | 'at-risk' | 'achieved' | 'missed';
    priority: 'low' | 'medium' | 'high';
}

// New: Mission Data Structure for Persistence
export interface MissionData {
    id: string;
    createdAt: number;
    lastUpdated: number;
    name: string;
    stage: Stage;
    signalStrength: number;
    ignitionProgress: number;
    template: LaunchPadTemplate | null;
    selectedLaunchPad: string | null;
    roadmap: MissionStep[];
    setupTasks: SetupTask[];
    mvpData: MVPData | null;
    businessStrategy: BusinessStrategy | null;
    brandIdentity: BrandIdentity | null;
    growthMetrics: GrowthMetrics | null;
    trajectories: Trajectory[];
    optimizationGoals: OptimizationGoal[];
    onboardingCompleted: boolean;
    businessPlan: string;
}


// New: Metadata for the mission list
export interface MissionMetadata {
    id: string;
    name: string;
    lastAccessed: number;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface MissionContextType {
    // Current Mission State Accessors
    missionName: string;
    setMissionName: (name: string) => void;
    stage: Stage;
    setStage: (stage: Stage) => void;
    signalStrength: number;
    setSignalStrength: (strength: number) => void;
    ignitionProgress: number;
    setIgnitionProgress: (progress: number) => void;
    template: LaunchPadTemplate | null;
    setTemplate: (template: LaunchPadTemplate | null) => void;
    selectedLaunchPad: string | null;
    setSelectedLaunchPad: (launchPadId: string | null) => void;

    missionRoadmap: MissionStep[];
    setMissionRoadmap: React.Dispatch<React.SetStateAction<MissionStep[]>>;
    updateMissionStep: (id: number, updates: Partial<MissionStep>) => void;
    addMissionStep: (step: MissionStep) => void;
    deleteMissionStep: (id: number) => void;

    businessPlan: string;
    setBusinessPlan: (plan: string) => void;

    mvpData: MVPData | null;
    setMvpData: (data: MVPData | null) => void;
    businessStrategy: BusinessStrategy | null;
    setBusinessStrategy: (strategy: BusinessStrategy | null) => void;
    brandIdentity: BrandIdentity | null;
    setBrandIdentity: (identity: BrandIdentity | null) => void;

    setupTasks: SetupTask[];
    setSetupTasks: React.Dispatch<React.SetStateAction<SetupTask[]>>;
    updateSetupTask: (id: string, updates: Partial<SetupTask>) => void;

    growthMetrics: GrowthMetrics | null;
    setGrowthMetrics: (metrics: GrowthMetrics | null) => void;

    trajectories: Trajectory[];
    setTrajectories: React.Dispatch<React.SetStateAction<Trajectory[]>>;
    updateTrajectory: (id: string, updates: Partial<Trajectory>) => void;
    addTrajectory: (trajectory: Trajectory) => void;
    deleteTrajectory: (id: string) => void;

    optimizationGoals: OptimizationGoal[];
    setOptimizationGoals: React.Dispatch<React.SetStateAction<OptimizationGoal[]>>;
    updateOptimizationGoal: (id: string, updates: Partial<OptimizationGoal>) => void;
    addOptimizationGoal: (goal: OptimizationGoal) => void;
    deleteOptimizationGoal: (id: string) => void;

    onboardingCompleted: boolean;
    setOnboardingCompleted: (completed: boolean) => void;

    // Multi-Mission & Auth
    user: UserProfile | null;
    login: (name: string, email: string) => void;
    logout: () => void;

    missions: MissionMetadata[];
    currentMissionId: string;
    createMission: (name: string) => void;
    switchMission: (id: string) => void;
    deleteMission: (id: string) => void;
    exportCurrentMission: () => void;
}

// --- Initial Constants ---

const INITIAL_ROADMAP: MissionStep[] = [
    { id: 1, title: 'Concept Validation', desc: 'Define problem & solution', status: 'active' },
    { id: 2, title: 'Business Naming', desc: 'Generate unique identity', status: 'locked' },
    { id: 3, title: 'Market Research', desc: 'Analyze competitors', status: 'pending' },
    { id: 4, title: 'Business Plan Draft', desc: 'Structure your vision', status: 'locked' },
];

const INITIAL_SETUP_TASKS: SetupTask[] = [
    { id: 'brand-identity', name: 'Brand Identity', description: 'Create logo, colors, and visual identity', status: 'pending', category: 'identity', progress: 0 },
    { id: 'domain-setup', name: 'Domain & Hosting', description: 'Register domain and setup hosting', status: 'pending', category: 'digital', progress: 0 },
    { id: 'legal-formation', name: 'Legal Formation', description: 'Register business entity', status: 'pending', category: 'legal', progress: 0 },
    { id: 'bank-account', name: 'Business Banking', description: 'Open business bank account', status: 'pending', category: 'financial', progress: 0 },
];

const INITIAL_TRAJECTORIES: Trajectory[] = [
    { id: 'lead-nurture', name: 'Lead Nurture Flow', type: 'automation', description: 'Automated email sequences for lead conversion', status: 'running', activeNodes: 45, efficiency: 87, lastRun: new Date().toISOString() },
    { id: 'invoice-autopilot', name: 'Invoicing Autopilot', type: 'finance', description: 'Automated invoice generation and payment tracking', status: 'running', activeNodes: 12, efficiency: 95, lastRun: new Date().toISOString() },
    { id: 'content-distribution', name: 'Content Distribution', type: 'marketing', description: 'Multi-channel content publishing automation', status: 'idle', activeNodes: 0, efficiency: 0 },
];

const INITIAL_GOALS: OptimizationGoal[] = [
    { id: 'revenue-q1', name: 'Q1 Revenue Target', metric: 'Monthly Recurring Revenue', currentValue: 14240, targetValue: 25000, deadline: '2025-03-31', status: 'on-track', priority: 'high' },
    { id: 'conversion-rate', name: 'Improve Conversion Rate', metric: 'Conversion Rate', currentValue: 2.4, targetValue: 5.0, deadline: '2025-02-28', status: 'at-risk', priority: 'high' },
    { id: 'churn-reduction', name: 'Reduce Customer Churn', metric: 'Monthly Churn Rate', currentValue: 5.2, targetValue: 3.0, deadline: '2025-04-30', status: 'on-track', priority: 'medium' },
];

const createDefaultMission = (name: string = 'New Project'): MissionData => ({
    id: Date.now().toString(),
    createdAt: Date.now(),
    lastUpdated: Date.now(),
    name,
    stage: 'ideation',
    signalStrength: 0,
    ignitionProgress: 15,
    template: null,
    selectedLaunchPad: null,
    roadmap: INITIAL_ROADMAP,
    setupTasks: INITIAL_SETUP_TASKS,
    mvpData: null,
    businessStrategy: null,
    brandIdentity: null,
    growthMetrics: null,
    trajectories: INITIAL_TRAJECTORIES,
    optimizationGoals: INITIAL_GOALS,
    onboardingCompleted: false,
    businessPlan: '',
});

// --- Context ---

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Auth State
    const [user, setUser] = useState<UserProfile | null>(() => {
        const saved = localStorage.getItem('rockket_user');
        return saved ? JSON.parse(saved) : null;
    });

    // Mission State
    const [missions, setMissions] = useState<MissionMetadata[]>(() => {
        const saved = localStorage.getItem('rockket_missions_list');
        return saved ? JSON.parse(saved) : [];
    });

    // Initialize Current Mission
    const [currentMission, setCurrentMission] = useState<MissionData>(() => {
        const lastId = localStorage.getItem('rockket_current_mission_id');
        if (lastId) {
            const savedData = localStorage.getItem(`rockket_mission_${lastId}`);
            if (savedData) return JSON.parse(savedData);
        }

        // No saved mission, create default
        const newMission = createDefaultMission('My First Startup');
        return newMission;
    });

    // -- Persistence Effects --

    // Save User
    useEffect(() => {
        if (user) localStorage.setItem('rockket_user', JSON.stringify(user));
        else localStorage.removeItem('rockket_user');
    }, [user]);

    // Save Missions List
    useEffect(() => {
        localStorage.setItem('rockket_missions_list', JSON.stringify(missions));
    }, [missions]);

    // Save Current Mission Data
    useEffect(() => {
        localStorage.setItem(`rockket_mission_${currentMission.id}`, JSON.stringify(currentMission));
        localStorage.setItem('rockket_current_mission_id', currentMission.id);

        // Update metadata list timestamp
        setMissions(prev => {
            const exists = prev.find(m => m.id === currentMission.id);
            if (!exists) {
                return [...prev, { id: currentMission.id, name: currentMission.name, lastAccessed: Date.now() }];
            }
            return prev.map(m => m.id === currentMission.id ? { ...m, name: currentMission.name, lastAccessed: Date.now() } : m);
        });
    }, [currentMission]);


    // -- Helper to update current mission state --
    const updateMission = useCallback((updates: Partial<MissionData> | ((prev: MissionData) => Partial<MissionData>)) => {
        setCurrentMission(prev => {
            const newValues = typeof updates === 'function' ? updates(prev) : updates;
            return { ...prev, ...newValues, lastUpdated: Date.now() };
        });
    }, []);

    // -- Setters (Mapped to updateMission) --

    const setMissionName = (name: string) => updateMission({ name });
    const setStage = (stage: Stage) => updateMission({ stage });
    const setSignalStrength = (signalStrength: number) => updateMission({ signalStrength });
    const setIgnitionProgress = (ignitionProgress: number) => updateMission({ ignitionProgress });
    const setTemplate = (template: LaunchPadTemplate | null) => updateMission({ template });
    const setSelectedLaunchPad = (selectedLaunchPad: string | null) => updateMission({ selectedLaunchPad });
    const setMvpData = (mvpData: MVPData | null) => updateMission({ mvpData });
    const setBusinessStrategy = (businessStrategy: BusinessStrategy | null) => updateMission({ businessStrategy });
    const setBrandIdentity = (brandIdentity: BrandIdentity | null) => updateMission({ brandIdentity });
    const setGrowthMetrics = (growthMetrics: GrowthMetrics | null) => updateMission({ growthMetrics });
    const setOnboardingCompleted = (onboardingCompleted: boolean) => updateMission({ onboardingCompleted });
    const setBusinessPlan = (businessPlan: string) => updateMission({ businessPlan });

    const setMissionRoadmap = (action: React.SetStateAction<MissionStep[]>) => {
        setCurrentMission(prev => ({
            ...prev,
            roadmap: typeof action === 'function' ? (action as Function)(prev.roadmap) : action,
            lastUpdated: Date.now()
        }));
    };

    const updateMissionStep = (id: number, updates: Partial<MissionStep>) => {
        setCurrentMission(prev => ({
            ...prev,
            roadmap: prev.roadmap.map(s => s.id === id ? { ...s, ...updates } : s),
            lastUpdated: Date.now()
        }));
    };

    const addMissionStep = (step: MissionStep) => {
        setCurrentMission(prev => ({ ...prev, roadmap: [...prev.roadmap, step], lastUpdated: Date.now() }));
    };

    const deleteMissionStep = (id: number) => {
        setCurrentMission(prev => ({ ...prev, roadmap: prev.roadmap.filter(s => s.id !== id), lastUpdated: Date.now() }));
    };

    const setSetupTasks = (action: React.SetStateAction<SetupTask[]>) => {
        setCurrentMission(prev => ({
            ...prev,
            setupTasks: typeof action === 'function' ? (action as Function)(prev.setupTasks) : action,
            lastUpdated: Date.now()
        }));
    };

    const updateSetupTask = (id: string, updates: Partial<SetupTask>) => {
        setCurrentMission(prev => ({
            ...prev,
            setupTasks: prev.setupTasks.map(t => t.id === id ? { ...t, ...updates } : t),
            lastUpdated: Date.now()
        }));
    };

    const setTrajectories = (action: React.SetStateAction<Trajectory[]>) => {
        setCurrentMission(prev => ({
            ...prev,
            trajectories: typeof action === 'function' ? (action as Function)(prev.trajectories) : action,
            lastUpdated: Date.now()
        }));
    };

    const updateTrajectory = (id: string, updates: Partial<Trajectory>) => {
        setCurrentMission(prev => ({
            ...prev,
            trajectories: prev.trajectories.map(t => t.id === id ? { ...t, ...updates } : t),
            lastUpdated: Date.now()
        }));
    };

    const addTrajectory = (trajectory: Trajectory) => {
        setCurrentMission(prev => ({ ...prev, trajectories: [...prev.trajectories, trajectory], lastUpdated: Date.now() }));
    };

    const deleteTrajectory = (id: string) => {
        setCurrentMission(prev => ({ ...prev, trajectories: prev.trajectories.filter(t => t.id !== id), lastUpdated: Date.now() }));
    };

    const setOptimizationGoals = (action: React.SetStateAction<OptimizationGoal[]>) => {
        setCurrentMission(prev => ({
            ...prev,
            optimizationGoals: typeof action === 'function' ? (action as Function)(prev.optimizationGoals) : action,
            lastUpdated: Date.now()
        }));
    };

    const updateOptimizationGoal = (id: string, updates: Partial<OptimizationGoal>) => {
        setCurrentMission(prev => ({
            ...prev,
            optimizationGoals: prev.optimizationGoals.map(g => g.id === id ? { ...g, ...updates } : g),
            lastUpdated: Date.now()
        }));
    };

    const addOptimizationGoal = (goal: OptimizationGoal) => {
        setCurrentMission(prev => ({ ...prev, optimizationGoals: [...prev.optimizationGoals, goal], lastUpdated: Date.now() }));
    };

    const deleteOptimizationGoal = (id: string) => {
        setCurrentMission(prev => ({ ...prev, optimizationGoals: prev.optimizationGoals.filter(g => g.id !== id), lastUpdated: Date.now() }));
    };

    // -- Auth Actions --
    const login = (name: string, email: string) => {
        setUser({ id: Date.now().toString(), name, email, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + name });
    };

    const logout = () => {
        setUser(null);
    };

    // -- Global Mission Logic --

    const createMission = (name: string) => {
        const newMission = createDefaultMission(name);
        setMissions(prev => [...prev, { id: newMission.id, name, lastAccessed: Date.now() }]);
        setCurrentMission(newMission);
    };

    const switchMission = (id: string) => {
        const savedData = localStorage.getItem(`rockket_mission_${id}`);
        if (savedData) {
            setCurrentMission(JSON.parse(savedData));
        } else {
            console.error('Mission data not found');
        }
    };

    const deleteMission = (id: string) => {
        setMissions(prev => prev.filter(m => m.id !== id));
        localStorage.removeItem(`rockket_mission_${id}`);
        // If current mission is deleted, switch to another or create new
        if (currentMission.id === id) {
            const reloadedMissions = missions.filter(m => m.id !== id);
            if (reloadedMissions.length > 0) {
                switchMission(reloadedMissions[0].id);
            } else {
                createMission('New Project');
            }
        }
    };

    const exportCurrentMission = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentMission, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `rockket_mission_${currentMission.name.replace(/\s+/g, '_')}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // -- Existing Side Effects (Gamification/Logic) --

    useEffect(() => {
        setMissionRoadmap(prev => prev.map(step => {
            if (step.id === 1) return { ...step, status: currentMission.signalStrength >= 100 ? 'complete' : 'active' };
            if (step.id === 2 && currentMission.signalStrength >= 100) return { ...step, status: step.status === 'locked' ? 'active' : step.status };
            return step;
        }));
    }, [currentMission.signalStrength]);

    // ... other logic can go here ...

    return (
        <MissionContext.Provider value={{
            // State
            missionName: currentMission.name,
            stage: currentMission.stage,
            signalStrength: currentMission.signalStrength,
            ignitionProgress: currentMission.ignitionProgress,
            template: currentMission.template,
            selectedLaunchPad: currentMission.selectedLaunchPad,
            missionRoadmap: currentMission.roadmap,
            mvpData: currentMission.mvpData,
            businessStrategy: currentMission.businessStrategy,
            brandIdentity: currentMission.brandIdentity,
            setupTasks: currentMission.setupTasks,
            growthMetrics: currentMission.growthMetrics,
            trajectories: currentMission.trajectories,
            optimizationGoals: currentMission.optimizationGoals,
            onboardingCompleted: currentMission.onboardingCompleted,

            // Setters
            setMissionName,
            setStage,
            setSignalStrength,
            setIgnitionProgress,
            setTemplate,
            setSelectedLaunchPad,
            setMissionRoadmap,
            updateMissionStep,
            addMissionStep,
            deleteMissionStep,
            setMvpData,
            setBusinessStrategy,
            setBrandIdentity,
            setSetupTasks,
            updateSetupTask,
            setGrowthMetrics,
            setTrajectories,
            updateTrajectory,
            addTrajectory,
            deleteTrajectory,
            setOptimizationGoals,
            updateOptimizationGoal,
            addOptimizationGoal,
            deleteOptimizationGoal,
            setOnboardingCompleted,
            businessPlan: currentMission.businessPlan,
            setBusinessPlan,

            // New Features
            user,
            login,
            logout,
            missions,
            currentMissionId: currentMission.id,
            createMission,
            switchMission,
            deleteMission,
            exportCurrentMission
        }}>
            {children}
        </MissionContext.Provider>
    );
};

export const useMission = () => {
    const context = useContext(MissionContext);
    if (context === undefined) {
        throw new Error('useMission must be used within a MissionProvider');
    }
    return context;
};
