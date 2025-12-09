// Mission Kit Document Templates
// Comprehensive business document templates for various business needs

export interface DocumentTemplate {
    id: string;
    name: string;
    description: string;
    category: 'strategy' | 'marketing' | 'financial' | 'legal' | 'operations';
    icon: string;
    sections: DocumentSection[];
    aiPromptTemplate: string;
}

export interface DocumentSection {
    id: string;
    title: string;
    description: string;
    placeholder: string;
    required: boolean;
}

export const documentTemplates: Record<string, DocumentTemplate> = {
    // 1. BUSINESS PLAN
    businessPlan: {
        id: 'business-plan',
        name: 'Business Plan',
        description: 'Comprehensive business plan with financial projections',
        category: 'strategy',
        icon: '📋',
        sections: [
            {
                id: 'executive-summary',
                title: 'Executive Summary',
                description: 'High-level overview of your business',
                placeholder: 'Summarize your business concept, market opportunity, and financial highlights...',
                required: true
            },
            {
                id: 'company-description',
                title: 'Company Description',
                description: 'Detailed information about your company',
                placeholder: 'Describe your company structure, mission, and unique value proposition...',
                required: true
            },
            {
                id: 'market-analysis',
                title: 'Market Analysis',
                description: 'Industry and competitive landscape',
                placeholder: 'Analyze your target market, industry trends, and competitive advantages...',
                required: true
            },
            {
                id: 'organization-management',
                title: 'Organization & Management',
                description: 'Team structure and key personnel',
                placeholder: 'Outline your organizational structure and management team...',
                required: false
            },
            {
                id: 'products-services',
                title: 'Products & Services',
                description: 'What you sell and how you deliver value',
                placeholder: 'Detail your product/service offerings and pricing strategy...',
                required: true
            },
            {
                id: 'marketing-sales',
                title: 'Marketing & Sales Strategy',
                description: 'How you attract and retain customers',
                placeholder: 'Describe your marketing channels, sales process, and customer acquisition strategy...',
                required: true
            },
            {
                id: 'financial-projections',
                title: 'Financial Projections',
                description: '3-5 year financial forecasts',
                placeholder: 'Include revenue projections, expense budgets, and cash flow forecasts...',
                required: true
            },
            {
                id: 'funding-request',
                title: 'Funding Request',
                description: 'Capital needs and use of funds',
                placeholder: 'Specify funding requirements and how funds will be allocated...',
                required: false
            }
        ],
        aiPromptTemplate: `Generate a comprehensive business plan for {businessName} in the {industry} industry. 
        
Business Concept: {concept}
Target Market: {targetMarket}
Unique Value Proposition: {valueProposition}

Create detailed sections for: Executive Summary, Company Description, Market Analysis, Organization & Management, Products & Services, Marketing & Sales Strategy, Financial Projections, and Funding Request.`
    },

    // 2. MARKETING PLAN
    marketingPlan: {
        id: 'marketing-plan',
        name: 'Marketing Plan',
        description: 'Strategic marketing roadmap and campaign planning',
        category: 'marketing',
        icon: '📢',
        sections: [
            {
                id: 'situation-analysis',
                title: 'Situation Analysis',
                description: 'Current market position and SWOT',
                placeholder: 'Analyze your current market position, strengths, weaknesses, opportunities, and threats...',
                required: true
            },
            {
                id: 'target-audience',
                title: 'Target Audience',
                description: 'Detailed customer personas',
                placeholder: 'Define your ideal customer segments with demographics, psychographics, and behaviors...',
                required: true
            },
            {
                id: 'marketing-objectives',
                title: 'Marketing Objectives',
                description: 'SMART goals for marketing efforts',
                placeholder: 'Set specific, measurable, achievable, relevant, and time-bound marketing goals...',
                required: true
            },
            {
                id: 'positioning-messaging',
                title: 'Positioning & Messaging',
                description: 'Brand positioning and key messages',
                placeholder: 'Define your brand positioning statement and core messaging pillars...',
                required: true
            },
            {
                id: 'marketing-mix',
                title: 'Marketing Mix (4 Ps)',
                description: 'Product, Price, Place, Promotion strategy',
                placeholder: 'Detail your product strategy, pricing model, distribution channels, and promotional tactics...',
                required: true
            },
            {
                id: 'channels-tactics',
                title: 'Channels & Tactics',
                description: 'Specific marketing channels and campaigns',
                placeholder: 'List marketing channels (social, email, content, paid ads) and specific tactics for each...',
                required: true
            },
            {
                id: 'budget-allocation',
                title: 'Budget & Resource Allocation',
                description: 'Marketing spend and team resources',
                placeholder: 'Break down marketing budget by channel and allocate team resources...',
                required: true
            },
            {
                id: 'metrics-kpis',
                title: 'Metrics & KPIs',
                description: 'How you measure success',
                placeholder: 'Define key performance indicators and tracking methods for each marketing initiative...',
                required: true
            }
        ],
        aiPromptTemplate: `Create a comprehensive marketing plan for {businessName} targeting {targetAudience}.

Product/Service: {productService}
Marketing Budget: {budget}
Primary Goals: {goals}

Include: Situation Analysis, Target Audience Personas, Marketing Objectives, Positioning & Messaging, Marketing Mix, Channel Strategy, Budget Allocation, and Success Metrics.`
    },

    // 3. FINANCIAL PROJECTIONS
    financialProjections: {
        id: 'financial-projections',
        name: 'Financial Projections',
        description: '3-year revenue, expense, and cash flow forecasts',
        category: 'financial',
        icon: '💰',
        sections: [
            {
                id: 'revenue-model',
                title: 'Revenue Model',
                description: 'How your business generates income',
                placeholder: 'Describe your revenue streams, pricing strategy, and unit economics...',
                required: true
            },
            {
                id: 'revenue-forecast',
                title: 'Revenue Forecast',
                description: 'Monthly/annual revenue projections',
                placeholder: 'Project revenue for the next 36 months with growth assumptions...',
                required: true
            },
            {
                id: 'cost-structure',
                title: 'Cost Structure',
                description: 'Fixed and variable costs',
                placeholder: 'List all operating expenses including COGS, salaries, rent, marketing, etc...',
                required: true
            },
            {
                id: 'profit-loss',
                title: 'Profit & Loss Statement',
                description: 'Projected P&L for 3 years',
                placeholder: 'Create monthly P&L for Year 1, quarterly for Years 2-3...',
                required: true
            },
            {
                id: 'cash-flow',
                title: 'Cash Flow Projection',
                description: 'Cash in and out over time',
                placeholder: 'Project cash flow to identify funding needs and runway...',
                required: true
            },
            {
                id: 'balance-sheet',
                title: 'Balance Sheet',
                description: 'Assets, liabilities, and equity',
                placeholder: 'Project balance sheet showing financial position over time...',
                required: false
            },
            {
                id: 'break-even-analysis',
                title: 'Break-Even Analysis',
                description: 'When you become profitable',
                placeholder: 'Calculate break-even point in units and revenue...',
                required: true
            },
            {
                id: 'key-assumptions',
                title: 'Key Assumptions',
                description: 'Assumptions behind your projections',
                placeholder: 'Document all assumptions for growth rates, pricing, costs, etc...',
                required: true
            }
        ],
        aiPromptTemplate: `Generate detailed financial projections for {businessName}.

Business Model: {businessModel}
Starting Capital: {startingCapital}
Revenue Streams: {revenueStreams}
Major Expenses: {majorExpenses}

Create: Revenue Model, 36-month Revenue Forecast, Cost Structure, P&L Statement, Cash Flow Projection, Break-Even Analysis, and Key Assumptions.`
    },

    // 4. PITCH DECK
    pitchDeck: {
        id: 'pitch-deck',
        name: 'Pitch Deck Outline',
        description: 'Investor presentation structure and talking points',
        category: 'strategy',
        icon: '🎯',
        sections: [
            {
                id: 'problem',
                title: 'Problem (Slide 1-2)',
                description: 'The pain point you solve',
                placeholder: 'Clearly articulate the problem your target market faces...',
                required: true
            },
            {
                id: 'solution',
                title: 'Solution (Slide 3-4)',
                description: 'Your unique solution',
                placeholder: 'Explain how your product/service solves the problem...',
                required: true
            },
            {
                id: 'market-opportunity',
                title: 'Market Opportunity (Slide 5)',
                description: 'TAM, SAM, SOM analysis',
                placeholder: 'Show the size of the market opportunity (Total, Serviceable, Obtainable)...',
                required: true
            },
            {
                id: 'product-demo',
                title: 'Product/Demo (Slide 6-7)',
                description: 'Show your product in action',
                placeholder: 'Include screenshots, demo video, or product walkthrough...',
                required: true
            },
            {
                id: 'business-model',
                title: 'Business Model (Slide 8)',
                description: 'How you make money',
                placeholder: 'Explain your revenue model, pricing, and unit economics...',
                required: true
            },
            {
                id: 'traction',
                title: 'Traction (Slide 9)',
                description: 'Proof of progress',
                placeholder: 'Share key metrics, customer testimonials, revenue, growth rate...',
                required: true
            },
            {
                id: 'competitive-landscape',
                title: 'Competitive Landscape (Slide 10)',
                description: 'Market positioning',
                placeholder: 'Show competitive matrix highlighting your unique advantages...',
                required: true
            },
            {
                id: 'go-to-market',
                title: 'Go-to-Market Strategy (Slide 11)',
                description: 'Customer acquisition plan',
                placeholder: 'Outline your marketing and sales strategy...',
                required: true
            },
            {
                id: 'team',
                title: 'Team (Slide 12)',
                description: 'Why you can execute',
                placeholder: 'Highlight founder backgrounds and key team members...',
                required: true
            },
            {
                id: 'financials',
                title: 'Financials (Slide 13)',
                description: 'Revenue projections',
                placeholder: 'Show 3-5 year revenue forecast and path to profitability...',
                required: true
            },
            {
                id: 'ask',
                title: 'The Ask (Slide 14)',
                description: 'Funding request and use of funds',
                placeholder: 'Specify how much you are raising and how funds will be used...',
                required: true
            }
        ],
        aiPromptTemplate: `Create a compelling pitch deck outline for {businessName}.

Problem: {problem}
Solution: {solution}
Market Size: {marketSize}
Traction: {traction}
Funding Ask: {fundingAsk}

Generate talking points for: Problem, Solution, Market Opportunity, Product Demo, Business Model, Traction, Competition, GTM Strategy, Team, Financials, and The Ask.`
    },

    // 5. SALES PLAYBOOK
    salesPlaybook: {
        id: 'sales-playbook',
        name: 'Sales Playbook',
        description: 'Sales process, scripts, and best practices',
        category: 'operations',
        icon: '📞',
        sections: [
            {
                id: 'ideal-customer-profile',
                title: 'Ideal Customer Profile',
                description: 'Who you sell to',
                placeholder: 'Define firmographics, demographics, and buying signals of ideal customers...',
                required: true
            },
            {
                id: 'value-proposition',
                title: 'Value Proposition',
                description: 'Why customers buy from you',
                placeholder: 'Articulate your unique value and differentiation...',
                required: true
            },
            {
                id: 'sales-process',
                title: 'Sales Process',
                description: 'Step-by-step sales methodology',
                placeholder: 'Map out each stage: Prospecting → Qualification → Demo → Proposal → Close...',
                required: true
            },
            {
                id: 'prospecting-tactics',
                title: 'Prospecting Tactics',
                description: 'How to find and engage leads',
                placeholder: 'List prospecting channels, outreach templates, and lead generation strategies...',
                required: true
            },
            {
                id: 'qualification-framework',
                title: 'Qualification Framework',
                description: 'BANT or similar qualification criteria',
                placeholder: 'Define qualification questions for Budget, Authority, Need, Timeline...',
                required: true
            },
            {
                id: 'demo-script',
                title: 'Demo/Presentation Script',
                description: 'Product demo flow and talking points',
                placeholder: 'Create demo script with discovery questions and feature highlights...',
                required: true
            },
            {
                id: 'objection-handling',
                title: 'Objection Handling',
                description: 'Common objections and responses',
                placeholder: 'List common objections (price, timing, competition) and proven responses...',
                required: true
            },
            {
                id: 'closing-techniques',
                title: 'Closing Techniques',
                description: 'How to ask for the sale',
                placeholder: 'Document closing strategies and trial close questions...',
                required: true
            },
            {
                id: 'sales-tools',
                title: 'Sales Tools & Resources',
                description: 'CRM, templates, collateral',
                placeholder: 'List all sales tools, email templates, case studies, and resources...',
                required: false
            }
        ],
        aiPromptTemplate: `Build a sales playbook for {businessName} selling {productService}.

Target Customer: {targetCustomer}
Sales Cycle Length: {salesCycle}
Average Deal Size: {dealSize}
Main Objections: {objections}

Include: ICP, Value Proposition, Sales Process, Prospecting Tactics, Qualification Framework, Demo Script, Objection Handling, Closing Techniques, and Sales Tools.`
    },

    // 6. CUSTOMER JOURNEY MAP
    customerJourneyMap: {
        id: 'customer-journey-map',
        name: 'Customer Journey Map',
        description: 'End-to-end customer experience mapping',
        category: 'marketing',
        icon: '🗺️',
        sections: [
            {
                id: 'persona-definition',
                title: 'Customer Persona',
                description: 'Who is this journey for',
                placeholder: 'Define the specific customer persona this journey represents...',
                required: true
            },
            {
                id: 'awareness-stage',
                title: 'Awareness Stage',
                description: 'How customers discover you',
                placeholder: 'Map touchpoints, channels, emotions, and pain points in awareness phase...',
                required: true
            },
            {
                id: 'consideration-stage',
                title: 'Consideration Stage',
                description: 'Research and evaluation',
                placeholder: 'Detail how customers evaluate options and what influences their decision...',
                required: true
            },
            {
                id: 'decision-stage',
                title: 'Decision/Purchase Stage',
                description: 'The buying moment',
                placeholder: 'Map the purchase experience and any friction points...',
                required: true
            },
            {
                id: 'onboarding-stage',
                title: 'Onboarding/Activation',
                description: 'First-time user experience',
                placeholder: 'Document onboarding flow and activation milestones...',
                required: true
            },
            {
                id: 'retention-stage',
                title: 'Retention/Engagement',
                description: 'Ongoing customer relationship',
                placeholder: 'Map touchpoints that drive continued engagement and value...',
                required: true
            },
            {
                id: 'advocacy-stage',
                title: 'Advocacy/Referral',
                description: 'Turning customers into promoters',
                placeholder: 'Identify opportunities for referrals, reviews, and word-of-mouth...',
                required: false
            },
            {
                id: 'pain-points',
                title: 'Pain Points & Opportunities',
                description: 'Where to improve the experience',
                placeholder: 'List all friction points and opportunities to enhance the journey...',
                required: true
            }
        ],
        aiPromptTemplate: `Create a customer journey map for {businessName}.

Customer Persona: {persona}
Product/Service: {productService}
Primary Channels: {channels}

Map the complete journey across: Awareness, Consideration, Decision, Onboarding, Retention, and Advocacy stages. Include touchpoints, emotions, pain points, and opportunities at each stage.`
    },

    // 7. SOP TEMPLATE
    sopTemplate: {
        id: 'sop-template',
        name: 'Standard Operating Procedure',
        description: 'Process documentation template',
        category: 'operations',
        icon: '📝',
        sections: [
            {
                id: 'sop-overview',
                title: 'Procedure Overview',
                description: 'What this SOP covers',
                placeholder: 'Describe the purpose and scope of this procedure...',
                required: true
            },
            {
                id: 'responsible-parties',
                title: 'Responsible Parties',
                description: 'Who owns this process',
                placeholder: 'List roles and responsibilities for this procedure...',
                required: true
            },
            {
                id: 'prerequisites',
                title: 'Prerequisites',
                description: 'What is needed before starting',
                placeholder: 'List required tools, access, training, or conditions...',
                required: false
            },
            {
                id: 'step-by-step',
                title: 'Step-by-Step Instructions',
                description: 'Detailed procedure steps',
                placeholder: 'Number each step with clear, actionable instructions...',
                required: true
            },
            {
                id: 'quality-checks',
                title: 'Quality Checks',
                description: 'How to verify correct execution',
                placeholder: 'Define checkpoints and validation criteria...',
                required: true
            },
            {
                id: 'troubleshooting',
                title: 'Troubleshooting',
                description: 'Common issues and solutions',
                placeholder: 'Document common problems and how to resolve them...',
                required: false
            },
            {
                id: 'related-documents',
                title: 'Related Documents',
                description: 'Links to other SOPs or resources',
                placeholder: 'List related procedures, templates, or reference materials...',
                required: false
            }
        ],
        aiPromptTemplate: `Create a Standard Operating Procedure for {processName} at {businessName}.

Process Purpose: {purpose}
Frequency: {frequency}
Owner: {owner}

Generate: Overview, Responsible Parties, Prerequisites, Step-by-Step Instructions, Quality Checks, Troubleshooting Guide, and Related Documents.`
    },

    // 8. CONTENT CALENDAR
    contentCalendar: {
        id: 'content-calendar',
        name: 'Content Calendar',
        description: '90-day content planning template',
        category: 'marketing',
        icon: '📅',
        sections: [
            {
                id: 'content-pillars',
                title: 'Content Pillars',
                description: 'Core themes and topics',
                placeholder: 'Define 3-5 content pillars that align with your brand and audience interests...',
                required: true
            },
            {
                id: 'platform-strategy',
                title: 'Platform Strategy',
                description: 'Where you publish',
                placeholder: 'List platforms (blog, social, email, video) and posting frequency for each...',
                required: true
            },
            {
                id: 'content-types',
                title: 'Content Types',
                description: 'Format mix',
                placeholder: 'Define content formats: blog posts, videos, infographics, podcasts, etc...',
                required: true
            },
            {
                id: 'monthly-themes',
                title: 'Monthly Themes',
                description: 'Thematic planning',
                placeholder: 'Assign themes or campaigns for each month...',
                required: true
            },
            {
                id: 'content-schedule',
                title: 'Content Schedule',
                description: 'Day-by-day calendar',
                placeholder: 'Map out specific content pieces with publish dates, platforms, and owners...',
                required: true
            },
            {
                id: 'promotion-plan',
                title: 'Promotion Plan',
                description: 'How you distribute content',
                placeholder: 'Plan content distribution and amplification tactics...',
                required: true
            },
            {
                id: 'performance-metrics',
                title: 'Performance Metrics',
                description: 'How you measure success',
                placeholder: 'Define KPIs for each content type and platform...',
                required: true
            }
        ],
        aiPromptTemplate: `Create a 90-day content calendar for {businessName}.

Target Audience: {targetAudience}
Content Pillars: {contentPillars}
Primary Platforms: {platforms}
Publishing Frequency: {frequency}

Generate: Content Pillars, Platform Strategy, Content Types, Monthly Themes, Detailed Schedule, Promotion Plan, and Success Metrics.`
    },

    // 9. COMPETITIVE ANALYSIS
    competitiveAnalysis: {
        id: 'competitive-analysis',
        name: 'Competitive Analysis',
        description: 'Market and competitor research framework',
        category: 'strategy',
        icon: '🔍',
        sections: [
            {
                id: 'market-overview',
                title: 'Market Overview',
                description: 'Industry landscape',
                placeholder: 'Describe the overall market size, trends, and dynamics...',
                required: true
            },
            {
                id: 'competitor-identification',
                title: 'Competitor Identification',
                description: 'Who you compete with',
                placeholder: 'List direct and indirect competitors...',
                required: true
            },
            {
                id: 'competitor-profiles',
                title: 'Competitor Profiles',
                description: 'Deep dive on each competitor',
                placeholder: 'For each competitor, analyze: offerings, pricing, positioning, strengths, weaknesses...',
                required: true
            },
            {
                id: 'feature-comparison',
                title: 'Feature Comparison Matrix',
                description: 'Side-by-side feature comparison',
                placeholder: 'Create a matrix comparing key features across competitors...',
                required: true
            },
            {
                id: 'pricing-analysis',
                title: 'Pricing Analysis',
                description: 'Competitive pricing landscape',
                placeholder: 'Compare pricing models, tiers, and value propositions...',
                required: true
            },
            {
                id: 'market-positioning',
                title: 'Market Positioning',
                description: 'Where you fit in the landscape',
                placeholder: 'Create a positioning map showing your differentiation...',
                required: true
            },
            {
                id: 'swot-analysis',
                title: 'SWOT Analysis',
                description: 'Your competitive position',
                placeholder: 'Analyze your Strengths, Weaknesses, Opportunities, and Threats...',
                required: true
            },
            {
                id: 'strategic-recommendations',
                title: 'Strategic Recommendations',
                description: 'How to compete and win',
                placeholder: 'Based on analysis, recommend strategic moves and positioning...',
                required: true
            }
        ],
        aiPromptTemplate: `Conduct a competitive analysis for {businessName} in the {industry} market.

Your Product: {productService}
Main Competitors: {competitors}
Target Market: {targetMarket}

Analyze: Market Overview, Competitor Identification, Detailed Profiles, Feature Comparison, Pricing Analysis, Market Positioning, SWOT, and Strategic Recommendations.`
    },

    // 10. OKR FRAMEWORK
    okrFramework: {
        id: 'okr-framework',
        name: 'OKR Framework',
        description: 'Objectives and Key Results planning',
        category: 'strategy',
        icon: '🎯',
        sections: [
            {
                id: 'company-mission',
                title: 'Company Mission & Vision',
                description: 'North star for OKRs',
                placeholder: 'State your company mission and long-term vision...',
                required: true
            },
            {
                id: 'annual-objectives',
                title: 'Annual Objectives',
                description: 'Top 3-5 objectives for the year',
                placeholder: 'Define ambitious, qualitative objectives for the year...',
                required: true
            },
            {
                id: 'quarterly-okrs',
                title: 'Quarterly OKRs',
                description: 'Q1-Q4 objectives and key results',
                placeholder: 'For each quarter, set 3-5 objectives with 3-5 measurable key results each...',
                required: true
            },
            {
                id: 'team-okrs',
                title: 'Team/Department OKRs',
                description: 'Cascaded OKRs by team',
                placeholder: 'Break down company OKRs into team-specific objectives...',
                required: false
            },
            {
                id: 'tracking-cadence',
                title: 'Tracking & Review Cadence',
                description: 'How often you review progress',
                placeholder: 'Define weekly check-ins, monthly reviews, and quarterly retrospectives...',
                required: true
            },
            {
                id: 'scoring-methodology',
                title: 'Scoring Methodology',
                description: 'How you grade OKRs',
                placeholder: 'Explain your scoring system (e.g., 0.0-1.0 scale, target 0.7)...',
                required: true
            }
        ],
        aiPromptTemplate: `Create an OKR framework for {businessName}.

Company Mission: {mission}
Annual Goals: {annualGoals}
Key Focus Areas: {focusAreas}

Generate: Mission & Vision, Annual Objectives, Quarterly OKRs, Team OKRs, Tracking Cadence, and Scoring Methodology.`
    }
};

// Helper functions
export const getDocumentTemplate = (id: string): DocumentTemplate | undefined => {
    return documentTemplates[id];
};

export const getAllDocumentTemplates = (): DocumentTemplate[] => {
    return Object.values(documentTemplates);
};

export const getDocumentTemplatesByCategory = (category: DocumentTemplate['category']): DocumentTemplate[] => {
    return Object.values(documentTemplates).filter(dt => dt.category === category);
};

// Generate AI prompt from template
export const generateAIPrompt = (template: DocumentTemplate, variables: Record<string, string>): string => {
    let prompt = template.aiPromptTemplate;

    // Replace all {variable} placeholders with actual values
    Object.entries(variables).forEach(([key, value]) => {
        prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
    });

    return prompt;
};
