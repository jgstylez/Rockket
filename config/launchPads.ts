// Industry-specific Launch Pad configurations
// Each Launch Pad customizes Genesis, Ignition, and Velocity for different business types

export interface LaunchPadConfig {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'product' | 'service' | 'digital' | 'retail';
    genesis: {
        signalScannerPrompts: {
            problemPlaceholder: string;
            solutionPlaceholder: string;
            audiencePlaceholder: string;
        };
        roadmapSteps: Array<{
            id: number;
            title: string;
            desc: string;
            status: 'active' | 'pending' | 'locked' | 'complete';
        }>;
    };
    ignition: {
        setupTasks: Array<{
            id: string;
            name: string;
            description: string;
            status: 'pending' | 'in-progress' | 'complete';
            category: 'identity' | 'legal' | 'digital' | 'financial' | 'operations';
            progress: number;
        }>;
    };
    velocity: {
        defaultMetrics: {
            primaryKPI: string;
            secondaryKPI: string;
            tertiaryKPI: string;
        };
        trajectories: Array<{
            id: string;
            name: string;
            type: 'automation' | 'marketing' | 'finance' | 'operations';
            description: string;
        }>;
        goals: Array<{
            id: string;
            name: string;
            metric: string;
            targetValue: number;
        }>;
    };
}

export const launchPads: Record<string, LaunchPadConfig> = {
    // 1. E-COMMERCE
    ecommerce: {
        id: 'ecommerce',
        name: 'E-Commerce Store',
        description: 'Sell physical or digital products online',
        icon: '🛍️',
        category: 'retail',
        genesis: {
            signalScannerPrompts: {
                problemPlaceholder: 'e.g., Hard to find eco-friendly home products',
                solutionPlaceholder: 'e.g., Curated marketplace for sustainable living',
                audiencePlaceholder: 'e.g., Environmentally conscious millennials'
            },
            roadmapSteps: [
                { id: 1, title: 'Product Validation', desc: 'Test product-market fit', status: 'active' },
                { id: 2, title: 'Supplier Sourcing', desc: 'Find reliable suppliers', status: 'locked' },
                { id: 3, title: 'Pricing Strategy', desc: 'Set competitive prices', status: 'pending' },
                { id: 4, title: 'Store Setup', desc: 'Launch online store', status: 'locked' },
            ]
        },
        ignition: {
            setupTasks: [
                { id: 'brand-identity', name: 'Brand Identity', description: 'Logo, colors, packaging design', status: 'pending', category: 'identity', progress: 0 },
                { id: 'ecommerce-platform', name: 'E-Commerce Platform', description: 'Shopify, WooCommerce, or custom store', status: 'pending', category: 'digital', progress: 0 },
                { id: 'payment-gateway', name: 'Payment Processing', description: 'Stripe, PayPal, Square setup', status: 'pending', category: 'financial', progress: 0 },
                { id: 'shipping-logistics', name: 'Shipping & Fulfillment', description: 'Carrier accounts and fulfillment process', status: 'pending', category: 'operations', progress: 0 },
                { id: 'inventory-system', name: 'Inventory Management', description: 'SKU tracking and stock management', status: 'pending', category: 'operations', progress: 0 },
            ]
        },
        velocity: {
            defaultMetrics: {
                primaryKPI: 'Revenue',
                secondaryKPI: 'Conversion Rate',
                tertiaryKPI: 'Average Order Value'
            },
            trajectories: [
                { id: 'abandoned-cart', name: 'Abandoned Cart Recovery', type: 'automation', description: 'Email sequences for cart abandonment' },
                { id: 'product-recommendations', name: 'Product Recommendations', type: 'marketing', description: 'Smart upsell and cross-sell' },
                { id: 'inventory-alerts', name: 'Inventory Alerts', type: 'operations', description: 'Low stock notifications and reordering' },
            ],
            goals: [
                { id: 'revenue-target', name: 'Monthly Revenue Goal', metric: 'Monthly Revenue', targetValue: 50000 },
                { id: 'conversion-rate', name: 'Improve Conversion Rate', metric: 'Conversion Rate', targetValue: 3.5 },
                { id: 'aov-increase', name: 'Increase Average Order Value', metric: 'AOV', targetValue: 85 },
            ]
        }
    },

    // 2. SAAS
    saas: {
        id: 'saas',
        name: 'SaaS Product',
        description: 'Software as a Service platform',
        icon: '💻',
        category: 'digital',
        genesis: {
            signalScannerPrompts: {
                problemPlaceholder: 'e.g., Project management tools are too complex',
                solutionPlaceholder: 'e.g., Simple, visual project tracker for small teams',
                audiencePlaceholder: 'e.g., Freelancers and agencies under 10 people'
            },
            roadmapSteps: [
                { id: 1, title: 'Problem Validation', desc: 'Interview potential users', status: 'active' },
                { id: 2, title: 'MVP Scope', desc: 'Define core features', status: 'locked' },
                { id: 3, title: 'Tech Stack', desc: 'Choose development tools', status: 'pending' },
                { id: 4, title: 'Beta Launch', desc: 'Release to early adopters', status: 'locked' },
            ]
        },
        ignition: {
            setupTasks: [
                { id: 'brand-identity', name: 'Brand Identity', description: 'Logo, UI design system, brand guidelines', status: 'pending', category: 'identity', progress: 0 },
                { id: 'product-development', name: 'MVP Development', description: 'Build core product features', status: 'pending', category: 'digital', progress: 0 },
                { id: 'payment-billing', name: 'Subscription Billing', description: 'Stripe subscriptions and billing portal', status: 'pending', category: 'financial', progress: 0 },
                { id: 'hosting-infrastructure', name: 'Cloud Infrastructure', description: 'AWS, Vercel, or similar hosting', status: 'pending', category: 'digital', progress: 0 },
                { id: 'analytics-tracking', name: 'Analytics Setup', description: 'User tracking and product analytics', status: 'pending', category: 'digital', progress: 0 },
            ]
        },
        velocity: {
            defaultMetrics: {
                primaryKPI: 'MRR',
                secondaryKPI: 'Churn Rate',
                tertiaryKPI: 'Active Users'
            },
            trajectories: [
                { id: 'onboarding-flow', name: 'User Onboarding', type: 'automation', description: 'Automated welcome emails and product tours' },
                { id: 'feature-adoption', name: 'Feature Adoption Campaigns', type: 'marketing', description: 'In-app messaging for new features' },
                { id: 'churn-prevention', name: 'Churn Prevention', type: 'automation', description: 'Identify and re-engage at-risk users' },
            ],
            goals: [
                { id: 'mrr-growth', name: 'MRR Growth Target', metric: 'Monthly Recurring Revenue', targetValue: 25000 },
                { id: 'reduce-churn', name: 'Reduce Churn Rate', metric: 'Monthly Churn', targetValue: 3.0 },
                { id: 'user-activation', name: 'Increase User Activation', metric: 'Activation Rate', targetValue: 60 },
            ]
        }
    },

    // 3. CONSULTING / AGENCY
    consulting: {
        id: 'consulting',
        name: 'Consulting / Agency',
        description: 'Professional services business',
        icon: '💼',
        category: 'service',
        genesis: {
            signalScannerPrompts: {
                problemPlaceholder: 'e.g., Small businesses struggle with digital marketing',
                solutionPlaceholder: 'e.g., Done-for-you social media management',
                audiencePlaceholder: 'e.g., Local service businesses with $100K-$1M revenue'
            },
            roadmapSteps: [
                { id: 1, title: 'Service Validation', desc: 'Validate service offering', status: 'active' },
                { id: 2, title: 'Pricing Model', desc: 'Define packages and pricing', status: 'locked' },
                { id: 3, title: 'Portfolio Building', desc: 'Create case studies', status: 'pending' },
                { id: 4, title: 'Client Acquisition', desc: 'Outreach strategy', status: 'locked' },
            ]
        },
        ignition: {
            setupTasks: [
                { id: 'brand-identity', name: 'Brand Identity', description: 'Professional brand and positioning', status: 'pending', category: 'identity', progress: 0 },
                { id: 'service-packages', name: 'Service Packages', description: 'Define offerings and pricing tiers', status: 'pending', category: 'operations', progress: 0 },
                { id: 'contracts-templates', name: 'Contract Templates', description: 'Client agreements and SOWs', status: 'pending', category: 'legal', progress: 0 },
                { id: 'project-management', name: 'Project Management System', description: 'Client portal and task tracking', status: 'pending', category: 'digital', progress: 0 },
                { id: 'invoicing-system', name: 'Invoicing & Payments', description: 'Proposal and invoice automation', status: 'pending', category: 'financial', progress: 0 },
            ]
        },
        velocity: {
            defaultMetrics: {
                primaryKPI: 'Revenue',
                secondaryKPI: 'Client Retention',
                tertiaryKPI: 'Project Margin'
            },
            trajectories: [
                { id: 'lead-qualification', name: 'Lead Qualification', type: 'automation', description: 'Automated discovery calls and proposals' },
                { id: 'client-reporting', name: 'Client Reporting', type: 'automation', description: 'Automated monthly performance reports' },
                { id: 'referral-program', name: 'Referral Program', type: 'marketing', description: 'Client referral incentives and tracking' },
            ],
            goals: [
                { id: 'revenue-target', name: 'Monthly Revenue Target', metric: 'Monthly Revenue', targetValue: 40000 },
                { id: 'client-retention', name: 'Improve Client Retention', metric: 'Retention Rate', targetValue: 85 },
                { id: 'profit-margin', name: 'Increase Profit Margin', metric: 'Net Margin', targetValue: 40 },
            ]
        }
    },

    // 4. CONTENT CREATOR / INFLUENCER
    creator: {
        id: 'creator',
        name: 'Content Creator',
        description: 'Build and monetize your audience',
        icon: '🎥',
        category: 'digital',
        genesis: {
            signalScannerPrompts: {
                problemPlaceholder: 'e.g., People want authentic fitness advice, not gym bros',
                solutionPlaceholder: 'e.g., Real-world fitness content for busy professionals',
                audiencePlaceholder: 'e.g., Working professionals 25-40 who want to stay fit'
            },
            roadmapSteps: [
                { id: 1, title: 'Niche Validation', desc: 'Test content themes', status: 'active' },
                { id: 2, title: 'Content Strategy', desc: 'Define content pillars', status: 'locked' },
                { id: 3, title: 'Platform Selection', desc: 'Choose primary platforms', status: 'pending' },
                { id: 4, title: 'Monetization Plan', desc: 'Revenue streams strategy', status: 'locked' },
            ]
        },
        ignition: {
            setupTasks: [
                { id: 'brand-identity', name: 'Personal Brand', description: 'Visual identity and brand voice', status: 'pending', category: 'identity', progress: 0 },
                { id: 'content-calendar', name: 'Content Calendar', description: 'Publishing schedule and themes', status: 'pending', category: 'operations', progress: 0 },
                { id: 'monetization-setup', name: 'Monetization Channels', description: 'Patreon, sponsorships, digital products', status: 'pending', category: 'financial', progress: 0 },
                { id: 'email-list', name: 'Email List Setup', description: 'Newsletter platform and lead magnets', status: 'pending', category: 'digital', progress: 0 },
                { id: 'analytics-tracking', name: 'Analytics & Tracking', description: 'Track engagement and growth metrics', status: 'pending', category: 'digital', progress: 0 },
            ]
        },
        velocity: {
            defaultMetrics: {
                primaryKPI: 'Revenue',
                secondaryKPI: 'Followers',
                tertiaryKPI: 'Engagement Rate'
            },
            trajectories: [
                { id: 'content-repurposing', name: 'Content Repurposing', type: 'automation', description: 'Auto-distribute content across platforms' },
                { id: 'sponsor-outreach', name: 'Sponsor Outreach', type: 'marketing', description: 'Automated media kit and pitch emails' },
                { id: 'community-engagement', name: 'Community Engagement', type: 'automation', description: 'Auto-responses and engagement tracking' },
            ],
            goals: [
                { id: 'revenue-target', name: 'Monthly Revenue Goal', metric: 'Monthly Revenue', targetValue: 10000 },
                { id: 'follower-growth', name: 'Grow Audience', metric: 'Total Followers', targetValue: 50000 },
                { id: 'engagement-rate', name: 'Improve Engagement', metric: 'Engagement Rate', targetValue: 8.5 },
            ]
        }
    },

    // 5. RESTAURANT / FOOD SERVICE
    restaurant: {
        id: 'restaurant',
        name: 'Restaurant / Food Service',
        description: 'Dining, catering, or food delivery',
        icon: '🍽️',
        category: 'retail',
        genesis: {
            signalScannerPrompts: {
                problemPlaceholder: 'e.g., No healthy fast-casual options in downtown',
                solutionPlaceholder: 'e.g., Mediterranean bowl concept with 15-min service',
                audiencePlaceholder: 'e.g., Office workers looking for quick, healthy lunch'
            },
            roadmapSteps: [
                { id: 1, title: 'Concept Validation', desc: 'Test menu and pricing', status: 'active' },
                { id: 2, title: 'Location Scouting', desc: 'Find ideal location', status: 'locked' },
                { id: 3, title: 'Menu Development', desc: 'Finalize menu and recipes', status: 'pending' },
                { id: 4, title: 'Permits & Licenses', desc: 'Health dept and business licenses', status: 'locked' },
            ]
        },
        ignition: {
            setupTasks: [
                { id: 'brand-identity', name: 'Brand Identity', description: 'Logo, menu design, interior branding', status: 'pending', category: 'identity', progress: 0 },
                { id: 'pos-system', name: 'POS System', description: 'Square, Toast, or Clover setup', status: 'pending', category: 'digital', progress: 0 },
                { id: 'food-permits', name: 'Food Service Permits', description: 'Health permits and inspections', status: 'pending', category: 'legal', progress: 0 },
                { id: 'supplier-contracts', name: 'Supplier Relationships', description: 'Food and beverage suppliers', status: 'pending', category: 'operations', progress: 0 },
                { id: 'online-ordering', name: 'Online Ordering', description: 'Website ordering and delivery apps', status: 'pending', category: 'digital', progress: 0 },
            ]
        },
        velocity: {
            defaultMetrics: {
                primaryKPI: 'Revenue',
                secondaryKPI: 'Table Turnover',
                tertiaryKPI: 'Customer Satisfaction'
            },
            trajectories: [
                { id: 'reservation-system', name: 'Reservation Management', type: 'automation', description: 'Automated booking and reminders' },
                { id: 'loyalty-program', name: 'Loyalty Program', type: 'marketing', description: 'Points and rewards for repeat customers' },
                { id: 'inventory-management', name: 'Inventory Tracking', type: 'operations', description: 'Food cost and waste management' },
            ],
            goals: [
                { id: 'revenue-target', name: 'Monthly Revenue Goal', metric: 'Monthly Revenue', targetValue: 75000 },
                { id: 'table-turnover', name: 'Improve Table Turnover', metric: 'Turns per Day', targetValue: 4.5 },
                { id: 'customer-satisfaction', name: 'Customer Satisfaction', metric: 'Review Rating', targetValue: 4.7 },
            ]
        }
    },

    // 6. COACHING / EDUCATION
    coaching: {
        id: 'coaching',
        name: 'Coaching / Online Course',
        description: 'Teach and mentor others',
        icon: '🎓',
        category: 'service',
        genesis: {
            signalScannerPrompts: {
                problemPlaceholder: 'e.g., New managers lack leadership training',
                solutionPlaceholder: 'e.g., 12-week leadership coaching program',
                audiencePlaceholder: 'e.g., First-time managers in tech companies'
            },
            roadmapSteps: [
                { id: 1, title: 'Expertise Validation', desc: 'Validate your unique approach', status: 'active' },
                { id: 2, title: 'Program Design', desc: 'Create curriculum outline', status: 'locked' },
                { id: 3, title: 'Pricing Strategy', desc: 'Set coaching rates', status: 'pending' },
                { id: 4, title: 'Beta Cohort', desc: 'Run pilot program', status: 'locked' },
            ]
        },
        ignition: {
            setupTasks: [
                { id: 'brand-identity', name: 'Brand Identity', description: 'Professional brand and positioning', status: 'pending', category: 'identity', progress: 0 },
                { id: 'course-platform', name: 'Course Platform', description: 'Teachable, Kajabi, or custom LMS', status: 'pending', category: 'digital', progress: 0 },
                { id: 'payment-processing', name: 'Payment Processing', description: 'Accept payments and manage subscriptions', status: 'pending', category: 'financial', progress: 0 },
                { id: 'scheduling-system', name: 'Scheduling System', description: 'Calendly or similar booking tool', status: 'pending', category: 'digital', progress: 0 },
                { id: 'content-creation', name: 'Content Creation', description: 'Record and edit course materials', status: 'pending', category: 'operations', progress: 0 },
            ]
        },
        velocity: {
            defaultMetrics: {
                primaryKPI: 'Revenue',
                secondaryKPI: 'Student Completion',
                tertiaryKPI: 'Testimonials'
            },
            trajectories: [
                { id: 'student-onboarding', name: 'Student Onboarding', type: 'automation', description: 'Welcome sequence and course access' },
                { id: 'engagement-tracking', name: 'Engagement Tracking', type: 'automation', description: 'Monitor progress and send nudges' },
                { id: 'referral-program', name: 'Referral Program', type: 'marketing', description: 'Student referral incentives' },
            ],
            goals: [
                { id: 'revenue-target', name: 'Monthly Revenue Goal', metric: 'Monthly Revenue', targetValue: 20000 },
                { id: 'completion-rate', name: 'Improve Completion Rate', metric: 'Completion Rate', targetValue: 75 },
                { id: 'testimonials', name: 'Collect Testimonials', metric: 'Total Testimonials', targetValue: 50 },
            ]
        }
    },

    // 7. MOBILE APP
    mobileapp: {
        id: 'mobileapp',
        name: 'Mobile App',
        description: 'iOS and Android application',
        icon: '📱',
        category: 'digital',
        genesis: {
            signalScannerPrompts: {
                problemPlaceholder: 'e.g., Hard to track daily water intake',
                solutionPlaceholder: 'e.g., Gamified hydration tracker with reminders',
                audiencePlaceholder: 'e.g., Health-conscious adults 25-45'
            },
            roadmapSteps: [
                { id: 1, title: 'App Concept Validation', desc: 'Test core value proposition', status: 'active' },
                { id: 2, title: 'Feature Prioritization', desc: 'Define MVP features', status: 'locked' },
                { id: 3, title: 'Tech Stack Selection', desc: 'Native vs React Native vs Flutter', status: 'pending' },
                { id: 4, title: 'Beta Testing', desc: 'TestFlight and early access', status: 'locked' },
            ]
        },
        ignition: {
            setupTasks: [
                { id: 'brand-identity', name: 'Brand & UI Design', description: 'App icon, UI/UX design system', status: 'pending', category: 'identity', progress: 0 },
                { id: 'app-development', name: 'App Development', description: 'Build core app functionality', status: 'pending', category: 'digital', progress: 0 },
                { id: 'app-store-setup', name: 'App Store Accounts', description: 'Apple and Google developer accounts', status: 'pending', category: 'digital', progress: 0 },
                { id: 'backend-infrastructure', name: 'Backend & Database', description: 'Firebase, AWS, or custom backend', status: 'pending', category: 'digital', progress: 0 },
                { id: 'monetization-setup', name: 'Monetization Setup', description: 'In-app purchases or subscriptions', status: 'pending', category: 'financial', progress: 0 },
            ]
        },
        velocity: {
            defaultMetrics: {
                primaryKPI: 'Downloads',
                secondaryKPI: 'DAU',
                tertiaryKPI: 'Retention Rate'
            },
            trajectories: [
                { id: 'push-notifications', name: 'Push Notification Campaigns', type: 'marketing', description: 'Re-engagement and feature announcements' },
                { id: 'user-feedback', name: 'User Feedback Loop', type: 'automation', description: 'In-app surveys and review prompts' },
                { id: 'crash-monitoring', name: 'Crash Monitoring', type: 'operations', description: 'Automated error tracking and alerts' },
            ],
            goals: [
                { id: 'download-target', name: 'Download Goal', metric: 'Total Downloads', targetValue: 100000 },
                { id: 'dau-growth', name: 'Grow Daily Active Users', metric: 'DAU', targetValue: 15000 },
                { id: 'retention-rate', name: 'Improve 30-Day Retention', metric: 'D30 Retention', targetValue: 40 },
            ]
        }
    },

    // 8. REAL ESTATE
    realestate: {
        id: 'realestate',
        name: 'Real Estate',
        description: 'Property sales, rentals, or management',
        icon: '🏠',
        category: 'service',
        genesis: {
            signalScannerPrompts: {
                problemPlaceholder: 'e.g., First-time buyers overwhelmed by the process',
                solutionPlaceholder: 'e.g., White-glove buyer representation with education',
                audiencePlaceholder: 'e.g., Millennials buying their first home'
            },
            roadmapSteps: [
                { id: 1, title: 'Market Validation', desc: 'Identify target market', status: 'active' },
                { id: 2, title: 'Licensing', desc: 'Get real estate license', status: 'locked' },
                { id: 3, title: 'Brokerage Selection', desc: 'Choose brokerage to join', status: 'pending' },
                { id: 4, title: 'Lead Generation', desc: 'Marketing and lead strategy', status: 'locked' },
            ]
        },
        ignition: {
            setupTasks: [
                { id: 'brand-identity', name: 'Brand Identity', description: 'Professional brand and headshots', status: 'pending', category: 'identity', progress: 0 },
                { id: 'website-idx', name: 'Website & IDX', description: 'Property search website', status: 'pending', category: 'digital', progress: 0 },
                { id: 'crm-setup', name: 'Real Estate CRM', description: 'Follow Up Boss, kvCORE, or similar', status: 'pending', category: 'digital', progress: 0 },
                { id: 'mls-access', name: 'MLS Access', description: 'Multiple listing service membership', status: 'pending', category: 'legal', progress: 0 },
                { id: 'transaction-management', name: 'Transaction Management', description: 'Dotloop, Skyslope, or similar', status: 'pending', category: 'operations', progress: 0 },
            ]
        },
        velocity: {
            defaultMetrics: {
                primaryKPI: 'Closed Deals',
                secondaryKPI: 'Commission Revenue',
                tertiaryKPI: 'Pipeline Value'
            },
            trajectories: [
                { id: 'lead-nurture', name: 'Lead Nurture Drip', type: 'automation', description: 'Automated email sequences for leads' },
                { id: 'market-reports', name: 'Market Reports', type: 'marketing', description: 'Monthly market updates to database' },
                { id: 'transaction-updates', name: 'Transaction Updates', type: 'automation', description: 'Automated client status updates' },
            ],
            goals: [
                { id: 'closed-deals', name: 'Monthly Closed Deals', metric: 'Deals Closed', targetValue: 3 },
                { id: 'commission-revenue', name: 'Monthly Commission Goal', metric: 'Commission Revenue', targetValue: 15000 },
                { id: 'pipeline-value', name: 'Pipeline Value', metric: 'Total Pipeline', targetValue: 500000 },
            ]
        }
    },

    // 9. SUBSCRIPTION BOX
    subscriptionbox: {
        id: 'subscriptionbox',
        name: 'Subscription Box',
        description: 'Curated monthly subscription service',
        icon: '📦',
        category: 'retail',
        genesis: {
            signalScannerPrompts: {
                problemPlaceholder: 'e.g., Hard to discover new craft coffee brands',
                solutionPlaceholder: 'e.g., Monthly craft coffee subscription with tasting notes',
                audiencePlaceholder: 'e.g., Coffee enthusiasts who want variety'
            },
            roadmapSteps: [
                { id: 1, title: 'Box Concept Validation', desc: 'Test product curation', status: 'active' },
                { id: 2, title: 'Supplier Partnerships', desc: 'Source products and negotiate', status: 'locked' },
                { id: 3, title: 'Pricing & Margins', desc: 'Calculate profitable pricing', status: 'pending' },
                { id: 4, title: 'Pilot Launch', desc: 'First 100 subscribers', status: 'locked' },
            ]
        },
        ignition: {
            setupTasks: [
                { id: 'brand-identity', name: 'Brand Identity', description: 'Logo, packaging, unboxing experience', status: 'pending', category: 'identity', progress: 0 },
                { id: 'subscription-platform', name: 'Subscription Platform', description: 'Cratejoy, Subbly, or custom', status: 'pending', category: 'digital', progress: 0 },
                { id: 'fulfillment-setup', name: 'Fulfillment Process', description: 'Warehouse and shipping workflow', status: 'pending', category: 'operations', progress: 0 },
                { id: 'payment-processing', name: 'Recurring Billing', description: 'Stripe subscriptions setup', status: 'pending', category: 'financial', progress: 0 },
                { id: 'inventory-management', name: 'Inventory System', description: 'Track products and box contents', status: 'pending', category: 'operations', progress: 0 },
            ]
        },
        velocity: {
            defaultMetrics: {
                primaryKPI: 'Active Subscribers',
                secondaryKPI: 'Churn Rate',
                tertiaryKPI: 'LTV'
            },
            trajectories: [
                { id: 'subscription-reminders', name: 'Renewal Reminders', type: 'automation', description: 'Payment reminder emails' },
                { id: 'churn-prevention', name: 'Churn Prevention', type: 'automation', description: 'Win-back campaigns for cancellations' },
                { id: 'referral-program', name: 'Referral Program', type: 'marketing', description: 'Subscriber referral incentives' },
            ],
            goals: [
                { id: 'subscriber-growth', name: 'Active Subscriber Goal', metric: 'Active Subscribers', targetValue: 1000 },
                { id: 'reduce-churn', name: 'Reduce Churn Rate', metric: 'Monthly Churn', targetValue: 5.0 },
                { id: 'increase-ltv', name: 'Increase Lifetime Value', metric: 'LTV', targetValue: 450 },
            ]
        }
    },

    // 10. MARKETPLACE
    marketplace: {
        id: 'marketplace',
        name: 'Marketplace Platform',
        description: 'Connect buyers and sellers',
        icon: '🏪',
        category: 'digital',
        genesis: {
            signalScannerPrompts: {
                problemPlaceholder: 'e.g., Hard to find local handmade goods',
                solutionPlaceholder: 'e.g., Marketplace for local artisans and makers',
                audiencePlaceholder: 'e.g., Shoppers who value local and handmade'
            },
            roadmapSteps: [
                { id: 1, title: 'Marketplace Validation', desc: 'Validate supply and demand', status: 'active' },
                { id: 2, title: 'Seller Recruitment', desc: 'Onboard initial sellers', status: 'locked' },
                { id: 3, title: 'Platform Features', desc: 'Define core marketplace features', status: 'pending' },
                { id: 4, title: 'Beta Launch', desc: 'Launch with first sellers', status: 'locked' },
            ]
        },
        ignition: {
            setupTasks: [
                { id: 'brand-identity', name: 'Brand Identity', description: 'Platform brand and UI design', status: 'pending', category: 'identity', progress: 0 },
                { id: 'platform-development', name: 'Marketplace Platform', description: 'Build buyer and seller interfaces', status: 'pending', category: 'digital', progress: 0 },
                { id: 'payment-processing', name: 'Payment Processing', description: 'Stripe Connect for marketplace payments', status: 'pending', category: 'financial', progress: 0 },
                { id: 'seller-onboarding', name: 'Seller Onboarding', description: 'Seller application and verification', status: 'pending', category: 'operations', progress: 0 },
                { id: 'trust-safety', name: 'Trust & Safety', description: 'Reviews, ratings, dispute resolution', status: 'pending', category: 'operations', progress: 0 },
            ]
        },
        velocity: {
            defaultMetrics: {
                primaryKPI: 'GMV',
                secondaryKPI: 'Active Sellers',
                tertiaryKPI: 'Take Rate'
            },
            trajectories: [
                { id: 'seller-growth', name: 'Seller Recruitment', type: 'marketing', description: 'Automated seller outreach campaigns' },
                { id: 'buyer-acquisition', name: 'Buyer Acquisition', type: 'marketing', description: 'Performance marketing for buyers' },
                { id: 'transaction-monitoring', name: 'Transaction Monitoring', type: 'operations', description: 'Fraud detection and prevention' },
            ],
            goals: [
                { id: 'gmv-target', name: 'Monthly GMV Goal', metric: 'Gross Merchandise Value', targetValue: 250000 },
                { id: 'seller-growth', name: 'Active Seller Growth', metric: 'Active Sellers', targetValue: 500 },
                { id: 'take-rate', name: 'Platform Take Rate', metric: 'Take Rate %', targetValue: 12 },
            ]
        }
    },
};

// Helper function to get Launch Pad by ID
export const getLaunchPad = (id: string): LaunchPadConfig | undefined => {
    return launchPads[id];
};

// Get all Launch Pads as array
export const getAllLaunchPads = (): LaunchPadConfig[] => {
    return Object.values(launchPads);
};

// Get Launch Pads by category
export const getLaunchPadsByCategory = (category: LaunchPadConfig['category']): LaunchPadConfig[] => {
    return Object.values(launchPads).filter(lp => lp.category === category);
};
