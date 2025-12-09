import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const MarketingLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                {/* Glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px]"></div>

                {/* Tech Decoration Lines */}
                <div className="absolute top-0 left-10 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-50"></div>
                <div className="absolute top-0 right-10 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-50"></div>
            </div>

            <header className="relative z-50 border-b border-white/5 backdrop-blur-md sticky top-0">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-all duration-300">
                            <Rocket className="text-white transform -rotate-45" size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-orange-500 transition-colors">ROCKKET</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group">
                            Mission Control
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link to="/features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group">
                            Modules
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link to="/pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group">
                            Manifest
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to="/platform" className="px-5 py-2 text-sm font-bold bg-white text-slate-950 rounded hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                            Launch Console
                        </Link>
                    </div>
                </div>
            </header>

            <main className="relative z-10 flex-grow">
                <Outlet />
            </main>

            <footer className="relative z-10 border-t border-white/10 mt-20 bg-slate-950">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Rocket size={16} className="text-orange-500" />
                                <span className="font-bold tracking-tight">ROCKKET</span>
                            </div>
                            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                                A holistic, start-to-finish business platform built for entrepreneurs and enterprises alike. Rockket gives you everything: setup, legal, sales, marketing, operations, and growth.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-orange-500 transition-colors">Startups</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition-colors">Enterprise</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition-colors">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-orange-500 transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition-colors">Legal</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-slate-600 font-mono">
                        &copy; {new Date().getFullYear()} Rockket Industries. All systems nominal.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MarketingLayout;
