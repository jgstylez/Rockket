// Authentication Service for Rockket Platform
// Handles user authentication, registration, and session management

import { storageService, User } from './storage';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    error?: string;
}

class AuthService {
    private readonly USERS_KEY = 'rockket_users';
    private readonly SESSION_KEY = 'rockket_session';

    /**
     * Register a new user
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            // Check if user already exists
            const existingUsers = this.getAllUsers();
            const userExists = existingUsers.some(u => u.email === data.email);

            if (userExists) {
                return {
                    success: false,
                    error: 'User with this email already exists',
                };
            }

            // Create new user
            const newUser: User = {
                id: this.generateId(),
                email: data.email,
                name: data.name,
                createdAt: new Date().toISOString(),
                currentMissionId: null,
            };

            // Save user credentials (in production, this would be hashed)
            const users = existingUsers;
            users.push({
                ...newUser,
                passwordHash: this.hashPassword(data.password), // Simple hash for demo
            });

            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

            // Save user to storage service
            storageService.saveUser(newUser);

            // Create session
            this.createSession(newUser);

            return {
                success: true,
                user: newUser,
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: 'Registration failed',
            };
        }
    }

    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const users = this.getAllUsers();
            const user = users.find(u => u.email === credentials.email);

            if (!user) {
                return {
                    success: false,
                    error: 'Invalid email or password',
                };
            }

            // Verify password
            const passwordHash = this.hashPassword(credentials.password);
            if ((user as any).passwordHash !== passwordHash) {
                return {
                    success: false,
                    error: 'Invalid email or password',
                };
            }

            // Remove password hash before returning
            const { passwordHash: _, ...userWithoutPassword } = user as any;

            // Create session
            this.createSession(userWithoutPassword);

            // Save to storage service
            storageService.saveUser(userWithoutPassword);

            return {
                success: true,
                user: userWithoutPassword,
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Login failed',
            };
        }
    }

    /**
     * Logout user
     */
    logout(): void {
        localStorage.removeItem(this.SESSION_KEY);
        console.log('🔓 User logged out');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        const session = this.getSession();
        return session !== null;
    }

    /**
     * Get current session
     */
    getSession(): User | null {
        try {
            const session = localStorage.getItem(this.SESSION_KEY);
            if (!session) return null;

            const parsed = JSON.parse(session);

            // Check if session is expired (24 hours)
            const sessionTime = new Date(parsed.timestamp).getTime();
            const now = new Date().getTime();
            const hoursPassed = (now - sessionTime) / (1000 * 60 * 60);

            if (hoursPassed > 24) {
                this.logout();
                return null;
            }

            return parsed.user;
        } catch (error) {
            console.error('Session error:', error);
            return null;
        }
    }

    /**
     * Create a new session
     */
    private createSession(user: User): void {
        const session = {
            user,
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }

    /**
     * Get all users (for demo purposes)
     */
    private getAllUsers(): any[] {
        try {
            const users = localStorage.getItem(this.USERS_KEY);
            return users ? JSON.parse(users) : [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Simple password hashing (for demo - use bcrypt in production)
     */
    private hashPassword(password: string): string {
        // This is NOT secure - just for demo purposes
        // In production, use bcrypt or similar
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    /**
     * Generate unique ID
     */
    private generateId(): string {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Demo login (for testing without registration)
     */
    async demoLogin(): Promise<AuthResponse> {
        const demoUser: User = {
            id: 'demo_user',
            email: 'demo@rockket.io',
            name: 'Demo User',
            createdAt: new Date().toISOString(),
            currentMissionId: null,
        };

        this.createSession(demoUser);
        storageService.saveUser(demoUser);

        return {
            success: true,
            user: demoUser,
        };
    }
}

// Export singleton instance
export const authService = new AuthService();
