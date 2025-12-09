import React from 'react';

const Pricing: React.FC = () => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold mb-8">Flight Manifest</h1>
            <p className="text-slate-400 text-xl mb-12">Choose your trajectory.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-8 border border-white/10 rounded-2xl bg-slate-900/50">
                        <h3 className="text-xl font-bold mb-4">Tier {i}</h3>
                        <div className="text-3xl font-bold mb-6">$XX<span className="text-sm font-normal text-slate-500">/mo</span></div>
                        <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded font-medium transition-colors">Select</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Pricing;
