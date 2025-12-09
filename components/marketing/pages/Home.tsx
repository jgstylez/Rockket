import React, { useState } from 'react';
import { ArrowRight, Rocket, Zap, Layers, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const [activeTab, setActiveTab] = useState('minimalist');

    return (
        <div className="flex flex-col">
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotateX(10deg); }
                    50% { transform: translateY(-20px) rotateX(10deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-40 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-mono mb-8 animate-pulse">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        SYSTEMS ONLINE // READY FOR LAUNCH
                    </div>

                    <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500">
                        The Command Center <br /> For Your Business
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Rockket brings together every tool, workflow, and department your business needs.
                        No more stitching tools together. One platform that scales as you do.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link to="/platform" className="w-full md:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2">
                            Initialize Launch <ArrowRight size={18} />
                        </Link>
                        <button className="w-full md:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2">
                            View Flight Simulation
                        </button>
                    </div>
                </div>

                {/* Hero Visual - Dashboard Mockup Hint */}
                <div className="max-w-4xl mx-auto mt-20 relative z-10 perspective-1000">
                    <div className="relative rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl h-64 md:h-96 flex items-center justify-center animate-float overflow-hidden group hover:border-orange-500/30 transition-colors">

                        {/* Fake Interface Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                        {/* Interactive Overlay Elements */}
                        <div className="text-center z-20">
                            <div className="w-20 h-20 mx-auto bg-slate-950 rounded-full flex items-center justify-center border border-orange-500/50 mb-6 shadow-[0_0_30px_rgba(249,115,22,0.2)] group-hover:scale-110 transition-transform duration-500">
                                <Rocket className="text-orange-500" size={32} />
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-32 bg-slate-800 rounded-full mx-auto overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-2/3 animate-[pulse_2s_infinite]"></div>
                                </div>
                                <div className="text-xs font-mono text-orange-400">INITIATING SEQUENCE...</div>
                            </div>
                        </div>

                        {/* Decor elements */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURE GRID */}
            <section className="py-32 bg-slate-950 relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Holistic Platform', desc: 'Setup, legal, sales, marketing, operations, and growth — all in one simple, guided system.', icon: Layers },
                            { title: 'Guided Journey', desc: 'From day one to year ten. Rockket guides new founders through setup and empowers growing teams.', icon: Globe },
                            { title: 'Unified Interface', desc: 'No more overwhelm. All your business tools in one clean, intuitive interface.', icon: Zap },
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/30 hover:bg-white/10 transition-all duration-300">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center border border-white/10 mb-6 group-hover:border-orange-500/50 group-hover:text-orange-500 transition-colors shadow-lg">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>

                                {/* Progress Indicator Visual */}
                                <div className="mt-8 flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                                    </div>
                                    <span className="text-[10px] font-mono text-emerald-500">COMPLETE</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* VIBE SELECTOR / DEMO SECTION */}
            <section className="py-32 relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for Every Signal</h2>
                            <p className="text-slate-400 text-lg">
                                Whether you're a minimalist startup or a bold enterprise, Rockket adapts to your style.
                            </p>
                        </div>
                        <div className="flex gap-1 p-1 bg-slate-950 border border-white/10 rounded-lg overflow-x-auto">
                            {['Minimalist', 'Bold', 'Geometric', 'Retro', 'Luxury'].map(vibe => (
                                <button
                                    key={vibe}
                                    onClick={() => setActiveTab(vibe.toLowerCase())}
                                    className={`px-4 py-2 rounded text-sm font-medium transition-all whitespace-nowrap ${activeTab === vibe.toLowerCase() ? 'bg-white text-slate-950 shadow-lg font-bold' : 'text-slate-400 hover:text-white'}`}
                                >
                                    {vibe}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Visual representation of vibes */}
                    <div className="w-full h-96 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 opacity-40"></div>

                        <div className={`transition-all duration-500 transform ${activeTab === 'minimalist' ? 'opacity-100 scale-100' : 'opacity-0 scale-90 absolute'}`}>
                            {/* Minimalist Visual */}
                            <div className="text-center">
                                <div className="w-32 h-32 rounded-full border border-slate-700 mx-auto flex items-center justify-center mb-4 bg-slate-900">
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                </div>
                                <p className="font-mono text-xs tracking-[0.5em] text-slate-500 uppercase">Minimal</p>
                            </div>
                        </div>
                        <div className={`transition-all duration-500 transform ${activeTab === 'bold' ? 'opacity-100 scale-100' : 'opacity-0 scale-90 absolute'}`}>
                            {/* Bold Visual */}
                            <div className="text-center relative">
                                <div className="absolute inset-0 bg-orange-500 blur-[100px] opacity-20"></div>
                                <div className="w-40 h-40 bg-gradient-to-tr from-orange-600 to-red-600 mx-auto mb-4 shadow-[0_0_50px_rgba(234,88,12,0.5)] flex items-center justify-center text-6xl font-black italic rounded-xl rotate-3">
                                    <span className="text-white">B</span>
                                </div>
                                <p className="font-black text-4xl text-white italic uppercase tracking-tighter relative z-10">BOLD</p>
                            </div>
                        </div>
                        <div className={`transition-all duration-500 transform ${activeTab === 'geometric' ? 'opacity-100 scale-100' : 'opacity-0 scale-90 absolute'}`}>
                            {/* Geometric Visual */}
                            <div className="grid grid-cols-2 gap-4 w-40 mx-auto mb-4 rotate-45">
                                <div className="w-full h-20 bg-emerald-500 rounded-lg opacity-80 backdrop-blur"></div>
                                <div className="w-full h-20 bg-purple-500 rounded-lg opacity-80 backdrop-blur"></div>
                                <div className="w-full h-20 bg-blue-500 rounded-lg opacity-80 backdrop-blur"></div>
                                <div className="w-full h-20 bg-rose-500 rounded-lg opacity-80 backdrop-blur"></div>
                            </div>
                        </div>
                        <div className={`transition-all duration-500 transform ${activeTab === 'retro' ? 'opacity-100 scale-100' : 'opacity-0 scale-90 absolute'}`}>
                            {/* Retro Visual */}
                            <div className="text-center">
                                <div className="w-64 h-32 border-4 border-b-0 border-pink-500 rounded-t-full mx-auto shadow-[0_-10px_30px_rgba(236,72,153,0.3)] bg-[linear-gradient(to_bottom,transparent_50%,#ec4899_50%)] bg-[size:100%_4px]"></div>
                                <div className="w-full h-px bg-pink-500 shadow-[0_0_20px_#ec4899]"></div>
                                <div className="mt-4 font-mono text-pink-400 tracking-widest text-xl drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]">NEON GRID</div>
                            </div>
                        </div>
                        <div className={`transition-all duration-500 transform ${activeTab === 'luxury' ? 'opacity-100 scale-100' : 'opacity-0 scale-90 absolute'}`}>
                            {/* Luxury Visual */}
                            <div className="text-center relative">
                                <div className="w-40 h-40 border border-amber-200/20 bg-gradient-to-br from-slate-900 to-black mx-auto mb-4 rotate-45 flex items-center justify-center shadow-2xl">
                                    <div className="w-32 h-32 border border-amber-500/50 -rotate-45 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-amber-500/10 rounded-full blur-md"></div>
                                    </div>
                                </div>
                                <p className="font-serif italic text-amber-500 text-2xl tracking-wide">Elegance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-40 text-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-orange-600/5"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Liftoff?</h2>
                    <p className="text-slate-400 mb-10 text-lg">
                        Join the next generation of founders using Rockket to build their empire.
                    </p>
                    <Link to="/platform" className="inline-block px-10 py-5 bg-white text-slate-950 font-bold rounded-lg hover:bg-slate-200 transition-colors text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        Launch Platform
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
