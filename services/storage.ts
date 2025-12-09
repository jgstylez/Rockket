// Local Storage Service for Rockket Platform
// Handles persistence of user data, missions, and application state

export interface Mission {
    id: string;
    name: string;
    industry: string;
    stage: 'ideation' | 'setup' | 'growth';
    createdAt: string;
    updatedAt: string;
    data: {
        // Genesis Pad Data
        signalStrength: number;
        mvpData: any | null;

        // Ignition Pad Data
        setupTasks: any[];
        brandIdentity: any | null;

        // Velocity Pad Data
        metrics: any[];
        trajectories: any[];
        goals: any[];

        // Launch Pad Selection
        selectedLaunchPad: string | null;
    };
}

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    currentMissionId: string | null;
}

export interface AppState {
    user: User | null;
    missions: Mission[];
    theme: 'light' | 'dark';
    lastSync: string;
}

class StorageService {
    private readonly STORAGE_KEY = 'rockket_app_state';
    private readonly VERSION = '1.0.0';

    /**
     * Save the entire app state to local storage
     */
    saveState(state: AppState): void {
        try {
            const dataToSave = {
                version: this.VERSION,
                timestamp: new Date().toISOString(),
                state,
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
            console.log('✅ App state saved to local storage');
        } catch (error) {
            console.error('❌ Failed to save app state:', error);
            throw new Error('Failed to save data to local storage');
        }
    }

    /**
     * Load the app state from local storage
     */
    loadState(): AppState | null {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored) {
                console.log('ℹ️ No saved state found');
                return null;
            }

            const parsed = JSON.parse(stored);

            // Version check (for future migrations)
            if (parsed.version !== this.VERSION) {
                console.warn('⚠️ Version mismatch, may need migration');
            }

            console.log('✅ App state loaded from local storage');
            return parsed.state;
        } catch (error) {
            console.error('❌ Failed to load app state:', error);
            return null;
        }
    }

    /**
     * Save a specific mission
     */
    saveMission(mission: Mission): void {
        const state = this.loadState();
        if (!state) {
            throw new Error('No app state found');
        }

        const missionIndex = state.missions.findIndex(m => m.id === mission.id);

        if (missionIndex >= 0) {
            // Update existing mission
            state.missions[missionIndex] = {
                ...mission,
                updatedAt: new Date().toISOString(),
            };
        } else {
            // Add new mission
            state.missions.push(mission);
        }

        this.saveState(state);
    }

    /**
     * Get a specific mission by ID
     */
    getMission(missionId: string): Mission | null {
        const state = this.loadState();
        if (!state) return null;

        return state.missions.find(m => m.id === missionId) || null;
    }

    /**
     * Get all missions for the current user
     */
    getAllMissions(): Mission[] {
        const state = this.loadState();
        if (!state) return [];

        return state.missions;
    }

    /**
     * Delete a mission
     */
    deleteMission(missionId: string): void {
        const state = this.loadState();
        if (!state) return;

        state.missions = state.missions.filter(m => m.id !== missionId);

        // If deleted mission was current, clear current mission
        if (state.user?.currentMissionId === missionId) {
            state.user.currentMissionId = null;
        }

        this.saveState(state);
    }

    /**
     * Set the current active mission
     */
    setCurrentMission(missionId: string): void {
        const state = this.loadState();
        if (!state || !state.user) return;

        state.user.currentMissionId = missionId;
        this.saveState(state);
    }

    /**
     * Save user data
     */
    saveUser(user: User): void {
        const state = this.loadState() || {
            user: null,
            missions: [],
            theme: 'light' as const,
            lastSync: new Date().toISOString(),
        };

        state.user = user;
        this.saveState(state);
    }

    /**
     * Get current user
     */
    getUser(): User | null {
        const state = this.loadState();
        return state?.user || null;
    }

    /**
     * Clear all data (logout)
     */
    clearAll(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('🗑️ All data cleared from local storage');
    }

    /**
     * Export all data as JSON
     */
    exportData(): string {
        const state = this.loadState();
        if (!state) {
            throw new Error('No data to export');
        }

        return JSON.stringify(state, null, 2);
    }

    /**
     * Import data from JSON
     */
    importData(jsonData: string): void {
        try {
            const parsed = JSON.parse(jsonData);
            this.saveState(parsed);
            console.log('✅ Data imported successfully');
        } catch (error) {
            console.error('❌ Failed to import data:', error);
            throw new Error('Invalid import data');
        }
    }
}

// Export singleton instance
export const storageService = new StorageService();
