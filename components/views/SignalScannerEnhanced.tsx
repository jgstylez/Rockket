// Enhanced Signal Scanner with 8-Dimension Validation Gating
// This replaces the simple validation with a comprehensive framework

import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { View } from '../../types';
import { useMission } from '../../context/MissionContext';
import {
    Radio, AlertTriangle, CheckCircle2, Loader2,
    ArrowRight, RefreshCw, TrendingUp, Target, Shield,
    Sparkles, Eye, X, ChevronRight, AlertCircle
} from 'lucide-react';
import {
    ValidationReport,
    validationPrompts,
    mockAIValidation,
    calculateViabilityScore,
    extractInsights,
    generateNextSteps,
} from '../../services/signalScanner';
import { generateLandingCopy } from '../../services/geminiService';

interface SignalScannerProps {
    onNavigate: (view: View) => void;
    onValidationComplete: () => void;
}

type ValidationStage =
    | 'input'           // Describe idea
    | 'confirm'         // Confirm AI summary
    | 'analyzing'       // Running 8-dimension analysis
    | 'results'         // Show validation results
    | 'threshold'       // Below threshold - must iterate
    | 'approved';       // Above threshold - can proceed

const MINIMUM_VIABLE_SCORE = 6; // Must score 6/10 or higher to proceed

const SignalScanner: React.FC<SignalScannerProps> = ({
    onNavigate,
    onValidationComplete
}) => {
    const { signalStrength, setSignalStrength, setMvpData } = useMission();

    // Validation state
    const [stage, setStage] = useState<ValidationStage>('input');
    const [ideaDescription, setIdeaDescription] = useState('');
    const [confirmedSummary, setConfirmedSummary] = useState('');
    const [currentDimension, setCurrentDimension] = useState(0);
    const [report, setReport] = useState<ValidationReport | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [generatedCopy, setGeneratedCopy] = useState<any>(null);
    const [showLandingPreview, setShowLandingPreview] = useState(false);

    const dimensions = Object.keys(validationPrompts) as Array<keyof typeof validationPrompts>;

    // Step 1: Start validation
    const handleStartValidation = () => {
        if (!ideaDescription.trim()) {
            alert('Please describe your startup idea');
            return;
        }

        // Generate AI summary
        const summary = `${ideaDescription.substring(0, 200)}...`;
        setConfirmedSummary(summary);
        setStage('confirm');
    };

    // Step 2: Run 8-dimension analysis
    const handleConfirmAndAnalyze = async () => {
        setStage('analyzing');
        setAnalyzing(true);
        setSignalStrength(0);

        // Run validation across all 8 dimensions
        const dimensionResults: any = {};

        for (let i = 0; i < dimensions.length; i++) {
            setCurrentDimension(i);
            const dimension = dimensions[i];

            // Update progress
            const progress = Math.round(((i + 1) / dimensions.length) * 100);
            setSignalStrength(progress);

            // Run AI validation
            const result = await mockAIValidation(ideaDescription, dimension);
            dimensionResults[dimension] = result;
        }

        // Build complete report
        const validationReport: ValidationReport = {
            ideaSummary: confirmedSummary,
            dimensions: {
                marketSize: dimensionResults.marketSize,
                competition: dimensionResults.competition,
                differentiation: dimensionResults.differentiation,
                targetCustomer: dimensionResults.targetCustomer,
                monetization: dimensionResults.monetization,
                execution: dimensionResults.execution,
                scalability: dimensionResults.scalability,
                risk: dimensionResults.risk,
            },
            overallScore: 0,
            strengths: [],
            concerns: [],
            pivots: [],
            nextSteps: [],
            timestamp: new Date().toISOString(),
        };

        // Calculate overall score
        validationReport.overallScore = calculateViabilityScore(validationReport.dimensions);

        // Extract insights
        const { strengths, concerns } = extractInsights(validationReport.dimensions);
        validationReport.strengths = strengths;
        validationReport.concerns = concerns;

        // Generate next steps
        validationReport.nextSteps = generateNextSteps(validationReport);

        setReport(validationReport);
        setAnalyzing(false);

        // Check if score meets threshold
        if (validationReport.overallScore >= MINIMUM_VIABLE_SCORE) {
            setStage('approved');
            setSignalStrength(validationReport.overallScore * 10);
        } else {
            setStage('threshold');
            setSignalStrength(validationReport.overallScore * 10);
        }
    };

    // Step 3: Generate landing page (only if approved)
    const handleGenerateLanding = async () => {
        if (!report) return;

        setAnalyzing(true);

        // Extract problem, solution, audience from idea description
        const copy = await generateLandingCopy(
            ideaDescription,
            report.dimensions.differentiation.reasoning,
            report.dimensions.targetCustomer.reasoning
        );

        setGeneratedCopy(copy);
        setAnalyzing(false);
        setShowLandingPreview(true);
    };

    // Step 4: Proceed to Ignition (only if approved AND landing page generated)
    const handleProceedToIgnition = () => {
        if (!report || !generatedCopy) return;

        // Save MVP data
        setMvpData({
            problem: ideaDescription,
            solution: report.dimensions.differentiation.reasoning,
            audience: report.dimensions.targetCustomer.reasoning,
            validationReport: report,
            generatedCopy: generatedCopy,
        });

        setSignalStrength(100);
        onValidationComplete();
    };

    // Restart validation
    const handleRestart = () => {
        setStage('input');
        setIdeaDescription('');
        setConfirmedSummary('');
        setReport(null);
        setGeneratedCopy(null);
        setSignalStrength(0);
    };

    const getVerdictColor = (verdict: string) => {
        switch (verdict) {
            case 'Strong':
                return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30';
            case 'Moderate':
                return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
            case 'Weak':
                return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
            default:
                return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 7) return 'text-emerald-500';
        if (score >= 5) return 'text-orange-500';
        return 'text-red-500';
    };

    // Render different stages
    return (
        <div className="h-full animate-fade-in flex flex-col gap-6">
            {/* Header with Signal Gauge */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-xl text-red-500 shadow-lg shadow-red-500/10">
                        <Radio size={24} className={analyzing ? "animate-ping" : ""} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Signal Scanner</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-mono text-sm uppercase">
                            8-Dimension Validation Suite
                        </p>
                    </div>
                </div>

                {/* Signal Gauge */}
                <div className="hidden md:flex items-center gap-4 bg-white dark:bg-slate-900 p-2 pr-4 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="relative w-12 h-12">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
                                strokeDasharray={126}
                                strokeDashoffset={126 - (126 * signalStrength) / 100}
                                className={`transition-all duration-1000 ease-out ${signalStrength >= 60 ? 'text-emerald-500' : signalStrength >= 40 ? 'text-orange-500' : 'text-red-500'
                                    }`} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
                            {signalStrength}%
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Signal Strength</div>
                        <div className={`text-sm font-bold ${signalStrength >= 60 ? 'text-emerald-600 dark:text-emerald-400' :
                                signalStrength >= 40 ? 'text-orange-600 dark:text-orange-400' :
                                    'text-red-600 dark:text-red-400'
                            }`}>
                            {signalStrength >= 60 ? 'Strong' : signalStrength >= 40 ? 'Moderate' : 'Weak'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content based on stage */}
            <div className="flex-1 overflow-y-auto">
                {/* STAGE 1: INPUT */}
                {stage === 'input' && (
                    <div className="max-w-3xl mx-auto">
                        <GlassCard className="p-8">
                            <div className="text-center mb-8">
                                <Sparkles size={48} className="mx-auto text-indigo-500 mb-4" />
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    Describe Your Startup Idea
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    We'll analyze it across 8 critical dimensions to validate viability
                                </p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                                    What are you building?
                                </label>
                                <textarea
                                    value={ideaDescription}
                                    onChange={(e) => setIdeaDescription(e.target.value)}
                                    placeholder="Example: A B2B SaaS platform that helps small businesses automate their customer onboarding using AI. We target companies with 10-50 employees who currently use manual spreadsheets..."
                                    className="w-full h-48 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                    Include: What it is • Who it serves • What problem it solves • How it works
                                </p>
                            </div>

                            <button
                                onClick={handleStartValidation}
                                disabled={!ideaDescription.trim()}
                                className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Radio size={20} />
                                Begin Validation Scan
                                <ChevronRight size={20} />
                            </button>
                        </GlassCard>
                    </div>
                )}

                {/* STAGE 2: CONFIRM */}
                {stage === 'confirm' && (
                    <div className="max-w-3xl mx-auto">
                        <GlassCard className="p-8">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                Confirm Your Idea Summary
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-6">
                                <p className="text-slate-700 dark:text-slate-300">{confirmedSummary}</p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">
                                            Validation Threshold: {MINIMUM_VIABLE_SCORE}/10
                                        </p>
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            Your idea must score at least {MINIMUM_VIABLE_SCORE}/10 across all dimensions to proceed to MVP creation.
                                            If below threshold, you'll receive specific guidance on how to improve.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                We'll analyze across 8 dimensions: Market Size, Competition, Differentiation,
                                Target Customer, Monetization, Execution, Scalability, and Risk.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleConfirmAndAnalyze}
                                    className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Sparkles size={16} />
                                    Run 8-Dimension Analysis
                                </button>
                                <button
                                    onClick={() => setStage('input')}
                                    className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
                                >
                                    Edit
                                </button>
                            </div>
                        </GlassCard>
                    </div>
                )}

                {/* STAGE 3: ANALYZING */}
                {stage === 'analyzing' && (
                    <div className="max-w-3xl mx-auto">
                        <GlassCard className="p-8">
                            <div className="text-center mb-8">
                                <Loader2 size={48} className="mx-auto text-indigo-500 animate-spin mb-4" />
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    Scanning Signal Strength...
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Analyzing: {validationPrompts[dimensions[currentDimension]].title}
                                </p>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    <span>Dimension {currentDimension + 1} of {dimensions.length}</span>
                                    <span>{signalStrength}%</span>
                                </div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                        style={{ width: `${signalStrength}%` }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                {dimensions.map((dim, index) => (
                                    <div
                                        key={dim}
                                        className={`flex items-center gap-2 text-sm ${index < currentDimension
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : index === currentDimension
                                                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                                                    : 'text-slate-400'
                                            }`}
                                    >
                                        {index < currentDimension ? (
                                            <CheckCircle2 size={16} />
                                        ) : index === currentDimension ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-current" />
                                        )}
                                        {validationPrompts[dim].title}
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                )}

                {/* Continue in next part due to length... */}
            </div>
        </div>
    );
};

export default SignalScanner;
