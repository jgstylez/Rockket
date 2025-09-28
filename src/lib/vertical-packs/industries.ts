export interface VerticalPack {
  id: string;
  name: string;
  description: string;
  industry: string;
  icon: string;
  color: string;
  features: string[];
  templates: string[];
  integrations: string[];
  pricing: {
    starter: number;
    professional: number;
    enterprise: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  category: string;
  features: string[];
  techStack: string[];
  estimatedTime: string;
  complexity: "beginner" | "intermediate" | "advanced";
  isPublic: boolean;
  createdBy: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Predefined vertical packs for different industries
export const VERTICAL_PACKS: VerticalPack[] = [
  {
    id: "healthcare",
    name: "Healthcare Pack",
    description:
      "Complete solution for healthcare providers, clinics, and medical practices",
    industry: "Healthcare",
    icon: "🏥",
    color: "#3B82F6",
    features: [
      "Patient management system",
      "Appointment scheduling",
      "Medical records management",
      "HIPAA compliance tools",
      "Telemedicine integration",
      "Prescription management",
      "Insurance verification",
      "Billing and invoicing",
    ],
    templates: [
      "patient-portal",
      "appointment-booking",
      "medical-records",
      "telemedicine-platform",
      "pharmacy-management",
    ],
    integrations: [
      "Epic",
      "Cerner",
      "Allscripts",
      "Stripe",
      "Twilio",
      "SendGrid",
    ],
    pricing: {
      starter: 299,
      professional: 599,
      enterprise: 1299,
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "education",
    name: "Education Pack",
    description:
      "Comprehensive learning management system for schools and universities",
    industry: "Education",
    icon: "🎓",
    color: "#10B981",
    features: [
      "Course management",
      "Student enrollment",
      "Grade tracking",
      "Assignment submission",
      "Video streaming",
      "Discussion forums",
      "Certificate generation",
      "Parent portal",
    ],
    templates: [
      "learning-management-system",
      "online-course-platform",
      "student-portal",
      "virtual-classroom",
      "certification-system",
    ],
    integrations: [
      "Zoom",
      "Google Classroom",
      "Canvas",
      "Blackboard",
      "Stripe",
      "Mailchimp",
    ],
    pricing: {
      starter: 199,
      professional: 399,
      enterprise: 899,
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "ecommerce",
    name: "E-commerce Pack",
    description:
      "Full-featured online store with advanced e-commerce capabilities",
    industry: "E-commerce",
    icon: "🛒",
    color: "#F59E0B",
    features: [
      "Product catalog",
      "Shopping cart",
      "Payment processing",
      "Order management",
      "Inventory tracking",
      "Customer accounts",
      "Reviews and ratings",
      "Multi-vendor support",
    ],
    templates: [
      "online-store",
      "marketplace",
      "subscription-service",
      "dropshipping-platform",
      "wholesale-portal",
    ],
    integrations: [
      "Shopify",
      "WooCommerce",
      "Stripe",
      "PayPal",
      "ShipStation",
      "QuickBooks",
    ],
    pricing: {
      starter: 149,
      professional: 299,
      enterprise: 699,
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "real-estate",
    name: "Real Estate Pack",
    description:
      "Property management and real estate platform for agents and brokers",
    industry: "Real Estate",
    icon: "🏠",
    color: "#EF4444",
    features: [
      "Property listings",
      "Lead management",
      "CRM integration",
      "Virtual tours",
      "Document management",
      "Commission tracking",
      "Market analysis",
      "Client portal",
    ],
    templates: [
      "property-listings",
      "agent-portal",
      "virtual-tours",
      "lead-management",
      "commission-tracking",
    ],
    integrations: [
      "Zillow",
      "Realtor.com",
      "Salesforce",
      "DocuSign",
      "Stripe",
      "Twilio",
    ],
    pricing: {
      starter: 249,
      professional: 499,
      enterprise: 999,
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "restaurant",
    name: "Restaurant Pack",
    description:
      "Complete restaurant management system with POS and delivery integration",
    industry: "Food & Beverage",
    icon: "🍽️",
    color: "#8B5CF6",
    features: [
      "Menu management",
      "Online ordering",
      "Table reservations",
      "POS integration",
      "Delivery tracking",
      "Staff management",
      "Inventory control",
      "Customer loyalty",
    ],
    templates: [
      "restaurant-website",
      "online-ordering",
      "table-reservations",
      "pos-system",
      "delivery-platform",
    ],
    integrations: [
      "Square",
      "Toast",
      "Uber Eats",
      "DoorDash",
      "Grubhub",
      "OpenTable",
    ],
    pricing: {
      starter: 199,
      professional: 399,
      enterprise: 799,
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fitness",
    name: "Fitness Pack",
    description:
      "Gym and fitness center management with member portal and class scheduling",
    industry: "Fitness",
    icon: "💪",
    color: "#EC4899",
    features: [
      "Member management",
      "Class scheduling",
      "Personal training",
      "Payment processing",
      "Equipment tracking",
      "Nutrition planning",
      "Progress tracking",
      "Social features",
    ],
    templates: [
      "gym-management",
      "fitness-app",
      "class-booking",
      "personal-training",
      "nutrition-tracker",
    ],
    integrations: [
      "Stripe",
      "Zoom",
      "Google Fit",
      "Apple Health",
      "Mailchimp",
      "Twilio",
    ],
    pricing: {
      starter: 179,
      professional: 359,
      enterprise: 749,
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Industry-specific templates
export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  // Healthcare Templates
  {
    id: "patient-portal",
    name: "Patient Portal",
    description:
      "Secure patient portal for accessing medical records and appointments",
    industry: "Healthcare",
    category: "Patient Management",
    features: [
      "Patient registration",
      "Medical history",
      "Appointment scheduling",
      "Prescription refills",
      "Test results",
      "Secure messaging",
    ],
    techStack: ["React", "Node.js", "PostgreSQL", "HIPAA-compliant"],
    estimatedTime: "2-3 weeks",
    complexity: "advanced",
    isPublic: true,
    createdBy: "system",
    tenantId: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "telemedicine-platform",
    name: "Telemedicine Platform",
    description: "Video consultation platform for remote healthcare delivery",
    industry: "Healthcare",
    category: "Telemedicine",
    features: [
      "Video consultations",
      "Screen sharing",
      "File sharing",
      "Appointment booking",
      "Payment processing",
      "Record keeping",
    ],
    techStack: ["React", "WebRTC", "Node.js", "MongoDB"],
    estimatedTime: "3-4 weeks",
    complexity: "advanced",
    isPublic: true,
    createdBy: "system",
    tenantId: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Education Templates
  {
    id: "learning-management-system",
    name: "Learning Management System",
    description: "Complete LMS for online education and course management",
    industry: "Education",
    category: "Learning Management",
    features: [
      "Course creation",
      "Student enrollment",
      "Video streaming",
      "Quizzes and tests",
      "Grade tracking",
      "Discussion forums",
    ],
    techStack: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
    estimatedTime: "4-6 weeks",
    complexity: "advanced",
    isPublic: true,
    createdBy: "system",
    tenantId: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "virtual-classroom",
    name: "Virtual Classroom",
    description: "Interactive virtual classroom with real-time collaboration",
    industry: "Education",
    category: "Virtual Learning",
    features: [
      "Live video streaming",
      "Screen sharing",
      "Whiteboard",
      "Chat functionality",
      "Breakout rooms",
      "Recording",
    ],
    techStack: ["React", "WebRTC", "Socket.io", "Node.js"],
    estimatedTime: "3-4 weeks",
    complexity: "advanced",
    isPublic: true,
    createdBy: "system",
    tenantId: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // E-commerce Templates
  {
    id: "online-store",
    name: "Online Store",
    description: "Full-featured e-commerce store with payment processing",
    industry: "E-commerce",
    category: "Online Store",
    features: [
      "Product catalog",
      "Shopping cart",
      "Payment processing",
      "Order management",
      "Customer accounts",
      "Inventory tracking",
    ],
    techStack: ["Next.js", "Stripe", "PostgreSQL", "Redis"],
    estimatedTime: "2-3 weeks",
    complexity: "intermediate",
    isPublic: true,
    createdBy: "system",
    tenantId: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "marketplace",
    name: "Multi-Vendor Marketplace",
    description: "Platform for multiple vendors to sell their products",
    industry: "E-commerce",
    category: "Marketplace",
    features: [
      "Vendor registration",
      "Product management",
      "Commission tracking",
      "Order fulfillment",
      "Vendor dashboard",
      "Dispute resolution",
    ],
    techStack: ["React", "Node.js", "PostgreSQL", "Stripe"],
    estimatedTime: "4-6 weeks",
    complexity: "advanced",
    isPublic: true,
    createdBy: "system",
    tenantId: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function getVerticalPacks(): VerticalPack[] {
  return VERTICAL_PACKS.filter((pack) => pack.isActive);
}

export function getVerticalPackById(id: string): VerticalPack | undefined {
  return VERTICAL_PACKS.find((pack) => pack.id === id);
}

export function getVerticalPacksByIndustry(industry: string): VerticalPack[] {
  return VERTICAL_PACKS.filter((pack) => pack.industry === industry);
}

export function getIndustryTemplates(industry: string): IndustryTemplate[] {
  return INDUSTRY_TEMPLATES.filter(
    (template) => template.industry === industry
  );
}

export function getIndustryTemplateById(
  id: string
): IndustryTemplate | undefined {
  return INDUSTRY_TEMPLATES.find((template) => template.id === id);
}

export function getIndustries(): string[] {
  return Array.from(new Set(VERTICAL_PACKS.map((pack) => pack.industry)));
}
