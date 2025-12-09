// Signal Scanner - AI-Powered Startup Validation System
// Implements the 8-Dimension Validation Framework

export interface ValidationDimension {
    name: string;
    keyFactors: string[];
    reasoning: string;
    verdict: 'Strong' | 'Moderate' | 'Weak';
    score: number; // 1-10
}

export interface ValidationReport {
    ideaSummary: string;
    dimensions: {
        marketSize: ValidationDimension;
        competition: ValidationDimension;
        differentiation: ValidationDimension;
        targetCustomer: ValidationDimension;
        monetization: ValidationDimension;
        execution: ValidationDimension;
        scalability: ValidationDimension;
        risk: ValidationDimension;
    };
    overallScore: number; // 1-10
    strengths: string[];
    concerns: string[];
    pivots: string[];
    nextSteps: string[];
    timestamp: string;
}

export interface SignalScannerState {
    stage: 'input' | 'analyzing' | 'results';
    currentDimension: number;
    ideaDescription: string;
    confirmedSummary: string;
    report: ValidationReport | null;
}

// Validation prompts for each dimension
export const validationPrompts = {
    marketSize: {
        title: 'Market Size & Opportunity',
        questions: [
            'What is the total addressable market (TAM)?',
            'What is the serviceable addressable market (SAM)?',
            'What is your realistic entry segment?',
            'What are the key demand drivers?',
            'Is the market growing, stable, or declining?',
        ],
    },
    competition: {
        title: 'Competitive Landscape',
        questions: [
            'Who are the direct competitors?',
            'What indirect solutions exist?',
            'What are the barriers to entry?',
            'How saturated is the market?',
            'What switching costs exist for customers?',
        ],
    },
    differentiation: {
        title: 'Differentiation Analysis',
        questions: [
            'What is your unique value proposition?',
            'What moats can you build?',
            'How defensible is your position?',
            'Can competitors easily copy you?',
            'What gives you an unfair advantage?',
        ],
    },
    targetCustomer: {
        title: 'Target Customer Validation',
        questions: [
            'Who is your ideal customer?',
            'What is their core pain point?',
            'Why would they pay for this?',
            'How easy are they to reach?',
            'What alternatives do they use now?',
        ],
    },
    monetization: {
        title: 'Monetization Potential',
        questions: [
            'What is your pricing model?',
            'What is the expected revenue per customer?',
            'What is the customer acquisition cost?',
            'What is the lifetime value?',
            'How will you retain customers?',
        ],
    },
    execution: {
        title: 'Execution Requirements',
        questions: [
            'What is the technical complexity?',
            'What capital is required?',
            'What team skills are needed?',
            'Are there regulatory hurdles?',
            'What partnerships are required?',
        ],
    },
    scalability: {
        title: 'Scalability Assessment',
        questions: [
            'Can this scale without linear cost increases?',
            'Can you expand to new markets?',
            'What are the operational challenges at scale?',
            'How do margins behave at scale?',
            'What bottlenecks might emerge?',
        ],
    },
    risk: {
        title: 'Risk Analysis',
        questions: [
            'What could cause this to fail?',
            'What external threats exist?',
            'What assumptions must be true?',
            'What are the early warning signs?',
            'What backup plans exist?',
        ],
    },
};

// AI Prompt template for validation
export const generateValidationPrompt = (
    ideaDescription: string,
    dimension: keyof typeof validationPrompts
): string => {
    const prompt = validationPrompts[dimension];

    return `
You are a venture-caliber startup validation expert. Analyze this startup idea across the "${prompt.title}" dimension.

STARTUP IDEA:
${ideaDescription}

ANALYSIS FRAMEWORK:
${prompt.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Provide your analysis in this exact JSON format:
{
  "keyFactors": ["factor 1", "factor 2", "factor 3"],
  "reasoning": "Your detailed reasoning here (2-3 paragraphs)",
  "verdict": "Strong" | "Moderate" | "Weak",
  "score": 1-10
}

Be constructively critical. Separate facts from assumptions. Be specific to this idea.
`;
};

// Calculate overall viability score
export const calculateViabilityScore = (dimensions: ValidationReport['dimensions']): number => {
    const scores = [
        dimensions.marketSize.score,
        dimensions.competition.score,
        dimensions.differentiation.score,
        dimensions.targetCustomer.score,
        dimensions.monetization.score,
        dimensions.execution.score,
        dimensions.scalability.score,
        dimensions.risk.score,
    ];

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

// Extract top strengths and concerns
export const extractInsights = (
    dimensions: ValidationReport['dimensions']
): { strengths: string[]; concerns: string[] } => {
    const dimensionArray = Object.entries(dimensions).map(([key, value]) => ({
        name: key,
        ...value,
    }));

    // Sort by score
    const sorted = [...dimensionArray].sort((a, b) => b.score - a.score);

    const strengths = sorted
        .slice(0, 3)
        .filter(d => d.verdict === 'Strong')
        .map(d => `${d.name}: ${d.reasoning.split('.')[0]}`);

    const concerns = sorted
        .slice(-3)
        .filter(d => d.verdict === 'Weak')
        .map(d => `${d.name}: ${d.reasoning.split('.')[0]}`);

    return { strengths, concerns };
};

// Generate recommended next steps based on analysis
export const generateNextSteps = (report: ValidationReport): string[] => {
    const steps: string[] = [];
    const { dimensions } = report;

    // Market validation
    if (dimensions.targetCustomer.score < 7) {
        steps.push(
            'Conduct 10-15 customer discovery interviews to validate the problem and willingness to pay'
        );
    }

    // Competition research
    if (dimensions.competition.score < 6) {
        steps.push(
            'Perform competitive analysis: map all direct/indirect competitors and their positioning'
        );
    }

    // MVP testing
    if (dimensions.differentiation.score >= 7 && dimensions.execution.score >= 6) {
        steps.push(
            'Build a landing page with value proposition and run a small paid ad test ($100-500)'
        );
    }

    // Pricing validation
    if (dimensions.monetization.score < 7) {
        steps.push(
            'Test pricing with 5-10 potential customers using a tiered pricing survey'
        );
    }

    // Risk mitigation
    if (dimensions.risk.score < 6) {
        steps.push(
            'Identify and validate your top 3 riskiest assumptions with small experiments'
        );
    }

    return steps.slice(0, 5); // Return top 5 steps
};

// Mock AI validation function (replace with actual AI API call)
export const mockAIValidation = async (
    ideaDescription: string,
    dimension: keyof typeof validationPrompts
): Promise<ValidationDimension> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock responses (replace with actual AI API)
    const mockResponses: Record<string, Partial<ValidationDimension>> = {
        marketSize: {
            verdict: 'Moderate',
            score: 6,
            reasoning: 'The market shows moderate potential with estimated TAM of $5-10B. Growth is steady at 8-12% annually. Entry segment is well-defined but competitive.',
        },
        competition: {
            verdict: 'Weak',
            score: 4,
            reasoning: 'Market is saturated with 5+ established players. High switching costs favor incumbents. Differentiation will be challenging without significant innovation.',
        },
        differentiation: {
            verdict: 'Strong',
            score: 8,
            reasoning: 'Unique AI-powered approach creates defensible moat. Network effects possible. Difficult for competitors to replicate without similar data.',
        },
        targetCustomer: {
            verdict: 'Strong',
            score: 8,
            reasoning: 'Clear ideal customer profile. Pain point is acute and well-documented. High willingness to pay demonstrated in adjacent markets.',
        },
        monetization: {
            verdict: 'Moderate',
            score: 6,
            reasoning: 'Pricing model is viable but unproven. LTV/CAC ratio needs validation. Retention strategy requires more development.',
        },
        execution: {
            verdict: 'Moderate',
            score: 5,
            reasoning: 'Technical complexity is manageable but requires specialized skills. Capital requirements are moderate ($50-100K). Regulatory landscape is clear.',
        },
        scalability: {
            verdict: 'Strong',
            score: 7,
            reasoning: 'Model scales well with minimal marginal costs. Expansion to adjacent markets is straightforward. Operational complexity is manageable.',
        },
        risk: {
            verdict: 'Moderate',
            score: 6,
            reasoning: 'Primary risk is market adoption speed. Dependency on third-party APIs is manageable. Competitive response is the main threat.',
        },
    };

    const response = mockResponses[dimension] || {
        verdict: 'Moderate',
        score: 5,
        reasoning: 'Analysis pending.',
    };

    return {
        name: validationPrompts[dimension].title,
        keyFactors: validationPrompts[dimension].questions.slice(0, 3),
        reasoning: response.reasoning || '',
        verdict: response.verdict as 'Strong' | 'Moderate' | 'Weak',
        score: response.score || 5,
    };
};
