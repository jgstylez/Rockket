export interface AppTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  techStack: string[];
  features: string[];
  complexity: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  prompt: string;
  preview?: string;
}

export const APP_TEMPLATES: AppTemplate[] = [
  {
    id: "todo-app",
    name: "Todo Application",
    description: "A simple todo application with CRUD operations",
    category: "Productivity",
    techStack: ["React", "Node.js", "PostgreSQL"],
    features: ["Add/Edit/Delete todos", "Mark as complete", "Filter todos"],
    complexity: "beginner",
    estimatedTime: "2-4 hours",
    prompt:
      "Create a todo application with the following features: add new todos, mark todos as complete, edit existing todos, delete todos, and filter todos by status (all, active, completed). Use React for the frontend, Node.js for the backend, and PostgreSQL for the database.",
  },
  {
    id: "blog-cms",
    name: "Blog CMS",
    description: "A content management system for blogging",
    category: "Content",
    techStack: ["Next.js", "Prisma", "PostgreSQL"],
    features: ["Create/Edit posts", "Categories", "Comments", "SEO"],
    complexity: "intermediate",
    estimatedTime: "1-2 days",
    prompt:
      "Create a blog content management system with the following features: create and edit blog posts, categorize posts, add comments, SEO optimization, and an admin dashboard. Use Next.js for the frontend, Prisma for the database ORM, and PostgreSQL for the database.",
  },
  {
    id: "ecommerce-store",
    name: "E-commerce Store",
    description: "A full-featured online store",
    category: "E-commerce",
    techStack: ["React", "Node.js", "Stripe", "PostgreSQL"],
    features: [
      "Product catalog",
      "Shopping cart",
      "Payment processing",
      "Order management",
    ],
    complexity: "advanced",
    estimatedTime: "1-2 weeks",
    prompt:
      "Create an e-commerce store with the following features: product catalog with search and filtering, shopping cart functionality, Stripe payment integration, user authentication, order management, and admin dashboard. Use React for the frontend, Node.js for the backend, Stripe for payments, and PostgreSQL for the database.",
  },
  {
    id: "social-media",
    name: "Social Media Platform",
    description: "A social networking platform",
    category: "Social",
    techStack: ["React", "Node.js", "Socket.io", "MongoDB"],
    features: ["User profiles", "Posts", "Comments", "Real-time chat"],
    complexity: "advanced",
    estimatedTime: "2-3 weeks",
    prompt:
      "Create a social media platform with the following features: user registration and profiles, create and share posts, comment on posts, like posts, follow other users, real-time chat, and notifications. Use React for the frontend, Node.js for the backend, Socket.io for real-time features, and MongoDB for the database.",
  },
  {
    id: "task-management",
    name: "Task Management System",
    description: "A project and task management tool",
    category: "Productivity",
    techStack: ["Vue.js", "Express", "PostgreSQL"],
    features: ["Projects", "Tasks", "Team collaboration", "Time tracking"],
    complexity: "intermediate",
    estimatedTime: "3-5 days",
    prompt:
      "Create a task management system with the following features: create and manage projects, assign tasks to team members, track task progress, time tracking, team collaboration features, and project analytics. Use Vue.js for the frontend, Express for the backend, and PostgreSQL for the database.",
  },
  {
    id: "learning-platform",
    name: "Online Learning Platform",
    description: "An educational platform for courses",
    category: "Education",
    techStack: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
    features: ["Course creation", "Video streaming", "Quizzes", "Certificates"],
    complexity: "advanced",
    estimatedTime: "2-3 weeks",
    prompt:
      "Create an online learning platform with the following features: course creation and management, video streaming, interactive quizzes, progress tracking, certificates, payment integration, and instructor dashboard. Use Next.js for the frontend, Prisma for the database ORM, PostgreSQL for the database, and Stripe for payments.",
  },
  {
    id: "restaurant-app",
    name: "Restaurant Management App",
    description: "A restaurant ordering and management system",
    category: "Food & Beverage",
    techStack: ["React Native", "Node.js", "PostgreSQL"],
    features: [
      "Menu management",
      "Online ordering",
      "Table reservations",
      "Kitchen display",
    ],
    complexity: "intermediate",
    estimatedTime: "1-2 weeks",
    prompt:
      "Create a restaurant management application with the following features: menu management, online ordering system, table reservation system, kitchen display system, order tracking, and payment processing. Use React Native for mobile apps, Node.js for the backend, and PostgreSQL for the database.",
  },
  {
    id: "fitness-tracker",
    name: "Fitness Tracking App",
    description: "A personal fitness and workout tracker",
    category: "Health & Fitness",
    techStack: ["React", "Node.js", "MongoDB"],
    features: [
      "Workout logging",
      "Progress tracking",
      "Nutrition tracking",
      "Social features",
    ],
    complexity: "intermediate",
    estimatedTime: "1-2 weeks",
    prompt:
      "Create a fitness tracking application with the following features: log workouts and exercises, track progress over time, nutrition tracking, set fitness goals, social features for sharing achievements, and workout recommendations. Use React for the frontend, Node.js for the backend, and MongoDB for the database.",
  },
];

export function getTemplatesByCategory(category: string): AppTemplate[] {
  return APP_TEMPLATES.filter((template) => template.category === category);
}

export function getTemplatesByComplexity(complexity: string): AppTemplate[] {
  return APP_TEMPLATES.filter((template) => template.complexity === complexity);
}

export function getTemplateById(id: string): AppTemplate | undefined {
  return APP_TEMPLATES.find((template) => template.id === id);
}

export function getCategories(): string[] {
  return [...new Set(APP_TEMPLATES.map((template) => template.category))];
}
