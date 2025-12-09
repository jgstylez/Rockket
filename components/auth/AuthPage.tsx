import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, ShieldCheck, Key, UserPlus, Fingerprint } from 'lucide-react';
import { useMission } from '../../context/MissionContext';

type AuthMode = 'login' | 'signup';

const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useMission();
    const [mode, setMode] = useState<AuthMode>('signup');
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate Network Request / Auth Delay
        setTimeout(() => {
            // Mock Login
            login(name || (email.split('@')[0]), email);

            // Navigate
            if (mode === 'signup') {
                navigate('/onboarding');
            } else {
                // Check if they need onboarding? For now assume login goes to platform unless mission data says otherwise.
                // But since we just logged in, we might not have mission data loaded yet in a real app.
                // For this demo, let's assume returning users go to platform.
                navigate('/platform');
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-900/20 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }}></div>
            </div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.4)] mx-auto mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Rocket className="text-white transform -rotate-45" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {mode === 'signup' ? 'Initialize Credentials' : 'Identify Officer'}
                    </h1>
                    <p className="text-slate-400 text-sm">
                        {mode === 'signup' ? 'Create your profile to begin mission setup.' : 'Enter your keycode to access the command deck.'}
                    </p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative">
                    {/* Tech Corners */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-orange-500 rounded-tl opacity-50"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-orange-500 rounded-tr opacity-50"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-orange-500 rounded-bl opacity-50"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-orange-500 rounded-br opacity-50"></div>

                    <div className="flex bg-slate-950/50 p-1 rounded-lg mb-8 border border-white/5">
                        <button
                            onClick={() => setMode('signup')}
                            className={`flex-1 flex items-center justify-center p-2 rounded text-sm font-medium transition-all ${mode === 'signup' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-400'}`}
                        >
                            <UserPlus size={14} className="mr-2" /> New Account
                        </button>
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 flex items-center justify-center p-2 rounded text-sm font-medium transition-all ${mode === 'login' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-400'}`}
                        >
                            <Key size={14} className="mr-2" /> Login
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === 'signup' && (
                            <div className="space-y-1">
                                <label className="text-xs font-mono text-slate-500 uppercase">Comm. ID (Name)</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-4 py-3 text-white outline-none transition-colors"
                                    placeholder="e.g. Cmdr. Shepard"
                                    required={mode === 'signup'}
                                />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-mono text-slate-500 uppercase">Signal Frequency (Email)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-4 py-3 text-white outline-none transition-colors"
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-mono text-slate-500 uppercase">Security Key</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-lg px-4 py-3 text-white outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <Fingerprint className="animate-pulse" size={18} /> Verifying...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={18} /> {mode === 'signup' ? 'Establish Link' : 'Access System'}
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-xs text-slate-600 font-mono">
                    SECURE CONNECTION // ENCRYPTED VIA QUANTUM LINK
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
