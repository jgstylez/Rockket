
import React, { useState } from 'react';
import { X, Check, Users, Zap, Shield, ArrowRight, Sparkles } from 'lucide-react';

interface LandingPagePreviewProps {
    generatedCopy: {
        headline: string;
        subheadline: string;
        problem: string;
        solution: string;
        benefits: string[];
        cta: string;
        socialProof?: string;
    };
    onClose: () => void;
    onProceed: () => void;
}

const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({
    generatedCopy,
    onClose,
    onProceed,
}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [waitlistCount] = useState(Math.floor(Math.random() * 500) + 100);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            // In production, this would save to database
            setTimeout(() => {
                setSubmitted(false);
                setEmail('');
            }, 3000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Landing Page Preview
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            This is how your MVP waitlist page will look
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Actual Landing Page Design */}
                    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/20">
                        {/* Hero Section */}
                        <div className="max-w-5xl mx-auto px-6 py-16">
                            {/* Beta Badge */}
                            <div className="flex justify-center mb-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-full">
                                    <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                        Early Access • Limited Spots
                                    </span>
                                </div>
                            </div>

                            {/* Headline */}
                            <h1 className="text-5xl md:text-6xl font-bold text-center text-slate-900 dark:text-white mb-6 leading-tight">
                                {generatedCopy.headline}
                            </h1>

                            {/* Subheadline */}
                            <p className="text-xl md:text-2xl text-center text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto">
                                {generatedCopy.subheadline}
                            </p>

                            {/* Email Capture Form */}
                            <div className="max-w-xl mx-auto mb-8">
                                {!submitted ? (
                                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            className="flex-1 px-6 py-4 text-lg border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        />
                                        <button
                                            type="submit"
                                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 whitespace-nowrap"
                                        >
                                            {generatedCopy.cta}
                                            <ArrowRight size={20} />
                                        </button>
                                    </form>
                                ) : (
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-6 text-center">
                                        <Check size={48} className="mx-auto text-emerald-600 dark:text-emerald-400 mb-3" />
                                        <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                                            You're on the list!
                                        </h3>
                                        <p className="text-emerald-700 dark:text-emerald-300">
                                            We'll send you early access details soon.
                                        </p>
                                    </div>
                                )}

                                {/* Trust Indicators */}
                                <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Check size={16} className="text-emerald-500" />
                                        No spam, ever
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Check size={16} className="text-emerald-500" />
                                        Unsubscribe anytime
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users size={16} className="text-indigo-500" />
                                        {waitlistCount}+ joined
                                    </div>
                                </div>
                            </div>

                            {/* Problem Statement */}
                            <div className="max-w-3xl mx-auto mb-16">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                        The Problem
                                    </h2>
                                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {generatedCopy.problem}
                                    </p>
                                </div>
                            </div>

                            {/* Solution */}
                            <div className="max-w-3xl mx-auto mb-16">
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-800">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                        The Solution
                                    </h2>
                                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {generatedCopy.solution}
                                    </p>
                                </div>
                            </div>

                            {/* Benefits Grid */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">
                                    Why Join Early?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {generatedCopy.benefits.map((benefit, index) => (
                                        <div
                                            key={index}
                                            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all hover:-translate-y-1"
                                        >
                                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
                                                {index === 0 ? (
                                                    <Zap size={24} className="text-indigo-600 dark:text-indigo-400" />
                                                ) : index === 1 ? (
                                                    <Shield size={24} className="text-indigo-600 dark:text-indigo-400" />
                                                ) : (
                                                    <Users size={24} className="text-indigo-600 dark:text-indigo-400" />
                                                )}
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {benefit}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Proof */}
                            {generatedCopy.socialProof && (
                                <div className="max-w-3xl mx-auto mb-16">
                                    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-8 border-l-4 border-indigo-500">
                                        <p className="text-lg italic text-slate-700 dark:text-slate-300">
                                            "{generatedCopy.socialProof}"
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                                            — Early Beta Tester
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Final CTA */}
                            <div className="text-center">
                                <div className="inline-block bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                        Ready to Get Started?
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                                        Join {waitlistCount}+ people waiting for early access
                                    </p>
                                    <button
                                        onClick={() => document.querySelector('input[type="email"]')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-600/30"
                                    >
                                        Join the Waitlist
                                    </button>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                                        🎁 Early members get 50% off lifetime • No credit card required
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
                                <p>
                                    We're building in public. Product launching Q1 2025.
                                </p>
                                <p className="mt-2">
                                    Questions? Email us at hello@yourproduct.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        <p className="font-bold mb-1">This is a preview</p>
                        <p>Your actual landing page will be live and collecting emails</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
                        >
                            Edit Copy
                        </button>
                        <button
                            onClick={onProceed}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                        >
                            Looks Good, Proceed
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPagePreview;
