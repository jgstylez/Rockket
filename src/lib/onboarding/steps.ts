export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  type: "info" | "action" | "tutorial" | "setup";
  component: string;
  props: Record<string, any>;
  prerequisites: string[];
  nextSteps: string[];
  completed: boolean;
  order: number;
}

export interface OnboardingFlow {
  id: string;
  name: string;
  description: string;
  steps: OnboardingStep[];
  targetRole: string[];
  isActive: boolean;
}

export interface UserOnboardingProgress {
  userId: string;
  tenantId: string;
  currentStep: string;
  completedSteps: string[];
  skippedSteps: string[];
  startedAt: Date;
  completedAt?: Date;
}

// Predefined onboarding flows
export const ONBOARDING_FLOWS: OnboardingFlow[] = [
  {
    id: "welcome",
    name: "Welcome to Rockket",
    description: "Get started with your new account",
    targetRole: ["owner", "admin", "member"],
    isActive: true,
    steps: [
      {
        id: "welcome-intro",
        title: "Welcome to Rockket!",
        description:
          "Let's get you set up and ready to build amazing applications.",
        type: "info",
        component: "WelcomeStep",
        props: {
          message:
            "Welcome to Rockket! We're excited to help you turn your ideas into reality.",
          features: [
            "AI-powered app generation",
            "Visual drag-and-drop builder",
            "Multi-tenant architecture",
            "Advanced analytics",
          ],
        },
        prerequisites: [],
        nextSteps: ["profile-setup"],
        completed: false,
        order: 1,
      },
      {
        id: "profile-setup",
        title: "Complete Your Profile",
        description:
          "Set up your profile information to personalize your experience.",
        type: "setup",
        component: "ProfileSetupStep",
        props: {
          fields: ["name", "avatar", "bio", "company"],
          required: ["name"],
        },
        prerequisites: ["welcome-intro"],
        nextSteps: ["team-setup"],
        completed: false,
        order: 2,
      },
      {
        id: "team-setup",
        title: "Invite Your Team",
        description: "Add team members to collaborate on your projects.",
        type: "action",
        component: "TeamSetupStep",
        props: {
          maxInvites: 5,
          roles: ["admin", "member"],
        },
        prerequisites: ["profile-setup"],
        nextSteps: ["first-project"],
        completed: false,
        order: 3,
      },
      {
        id: "first-project",
        title: "Create Your First Project",
        description:
          "Let's create your first application using our AI generator.",
        type: "tutorial",
        component: "FirstProjectStep",
        props: {
          templates: ["todo-app", "blog-cms", "ecommerce-store"],
          aiProvider: "openai",
        },
        prerequisites: ["team-setup"],
        nextSteps: ["explore-features"],
        completed: false,
        order: 4,
      },
      {
        id: "explore-features",
        title: "Explore Features",
        description: "Discover the powerful features available in Rockket.",
        type: "tutorial",
        component: "FeatureExplorationStep",
        props: {
          features: [
            {
              name: "AI Generator",
              description: "Generate complete applications with AI",
              icon: "🤖",
              path: "/dashboard/generator",
            },
            {
              name: "Visual Builder",
              description: "Drag-and-drop interface builder",
              icon: "🎨",
              path: "/dashboard/builder",
            },
            {
              name: "Analytics",
              description: "Track user behavior and performance",
              icon: "📊",
              path: "/dashboard/analytics",
            },
            {
              name: "Team Management",
              description: "Manage your team and permissions",
              icon: "👥",
              path: "/dashboard/team",
            },
          ],
        },
        prerequisites: ["first-project"],
        nextSteps: ["onboarding-complete"],
        completed: false,
        order: 5,
      },
      {
        id: "onboarding-complete",
        title: "You're All Set!",
        description:
          "Congratulations! You're ready to start building amazing applications.",
        type: "info",
        component: "OnboardingCompleteStep",
        props: {
          message: "You've successfully completed the onboarding process!",
          nextActions: [
            {
              title: "Create Your First App",
              description:
                "Use our AI generator to create your first application",
              action: "navigate",
              path: "/dashboard/generator",
            },
            {
              title: "Explore the Builder",
              description: "Try our visual drag-and-drop builder",
              action: "navigate",
              path: "/dashboard/builder",
            },
            {
              title: "View Analytics",
              description: "Check out your analytics dashboard",
              action: "navigate",
              path: "/dashboard/analytics",
            },
          ],
        },
        prerequisites: ["explore-features"],
        nextSteps: [],
        completed: false,
        order: 6,
      },
    ],
  },
  {
    id: "advanced-user",
    name: "Advanced User Setup",
    description: "For users who want to dive deeper into advanced features",
    targetRole: ["admin", "owner"],
    isActive: true,
    steps: [
      {
        id: "advanced-features",
        title: "Advanced Features",
        description: "Explore advanced features and configurations.",
        type: "tutorial",
        component: "AdvancedFeaturesStep",
        props: {
          features: [
            "Feature flags and A/B testing",
            "Custom integrations",
            "API management",
            "Security settings",
            "Compliance tools",
          ],
        },
        prerequisites: [],
        nextSteps: ["integration-setup"],
        completed: false,
        order: 1,
      },
      {
        id: "integration-setup",
        title: "Set Up Integrations",
        description: "Connect your favorite tools and services.",
        type: "setup",
        component: "IntegrationSetupStep",
        props: {
          integrations: [
            "Stripe for payments",
            "SendGrid for email",
            "Slack for notifications",
            "GitHub for version control",
          ],
        },
        prerequisites: ["advanced-features"],
        nextSteps: ["security-setup"],
        completed: false,
        order: 2,
      },
      {
        id: "security-setup",
        title: "Security Configuration",
        description: "Configure security settings and compliance options.",
        type: "setup",
        component: "SecuritySetupStep",
        props: {
          settings: [
            "Two-factor authentication",
            "SSO configuration",
            "Data encryption",
            "Audit logging",
          ],
        },
        prerequisites: ["integration-setup"],
        nextSteps: ["advanced-complete"],
        completed: false,
        order: 3,
      },
      {
        id: "advanced-complete",
        title: "Advanced Setup Complete",
        description: "You've configured all advanced features!",
        type: "info",
        component: "AdvancedCompleteStep",
        props: {
          message: "Advanced setup complete! You're ready to use all features.",
        },
        prerequisites: ["security-setup"],
        nextSteps: [],
        completed: false,
        order: 4,
      },
    ],
  },
];

export function getOnboardingFlow(flowId: string): OnboardingFlow | undefined {
  return ONBOARDING_FLOWS.find((flow) => flow.id === flowId);
}

export function getOnboardingFlowsByRole(role: string): OnboardingFlow[] {
  return ONBOARDING_FLOWS.filter(
    (flow) => flow.targetRole.includes(role) && flow.isActive
  );
}

export function getOnboardingStep(
  flowId: string,
  stepId: string
): OnboardingStep | undefined {
  const flow = getOnboardingFlow(flowId);
  if (!flow) return undefined;

  return flow.steps.find((step) => step.id === stepId);
}

export function getNextOnboardingStep(
  flowId: string,
  currentStepId: string
): OnboardingStep | undefined {
  const flow = getOnboardingFlow(flowId);
  if (!flow) return undefined;

  const currentStep = flow.steps.find((step) => step.id === currentStepId);
  if (!currentStep) return undefined;

  const nextStepId = currentStep.nextSteps[0];
  if (!nextStepId) return undefined;

  return flow.steps.find((step) => step.id === nextStepId);
}

export function getPreviousOnboardingStep(
  flowId: string,
  currentStepId: string
): OnboardingStep | undefined {
  const flow = getOnboardingFlow(flowId);
  if (!flow) return undefined;

  const currentStepIndex = flow.steps.findIndex(
    (step) => step.id === currentStepId
  );
  if (currentStepIndex <= 0) return undefined;

  return flow.steps[currentStepIndex - 1];
}
