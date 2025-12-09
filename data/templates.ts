import { LaunchPadTemplate } from '../types';

export const templates: LaunchPadTemplate[] = [
  // Genesis Mode Template
  { 
    id: 'genesis-01', 
    name: 'Genesis Blueprint', 
    industry: 'R&D / Ideation', 
    description: 'A blank canvas environment optimized for structural planning, market research, and business modeling.', 
    difficulty: 'Low', 
    features: ['Market Research Module', 'Business Plan Architect', 'Name Generator'], 
    isAvailable: true 
  },
  // Ignition / Velocity Mode Templates
  { id: '1', name: 'E-Commerce', industry: 'Retail & Digital Goods', description: 'High-velocity storefront chassis with integrated inventory command.', difficulty: 'Low', features: ['Global Payments', 'Auto-Logistics', 'AI Support'], isAvailable: true },
  { id: '2', name: 'SaaS Startup', industry: 'Software & Technology', description: 'Scalable subscription architecture for digital products and platforms.', difficulty: 'High', features: ['Recurring Billing', 'API Gateway', 'User Roles'], isAvailable: true },
  { id: '3', name: 'Restaurant', industry: 'Food & Beverage', description: 'Local presence booster with reservation subsystem and menu management.', difficulty: 'Medium', features: ['Menu Management', 'Local SEO', 'QR Ordering'], isAvailable: true },
  { id: '4', name: 'Agency', industry: 'Professional Services', description: 'Client acquisition pipeline and booking trajectory for consultants.', difficulty: 'Low', features: ['Appointment Setter', 'CRM', 'Portfolio'], isAvailable: true },
  { id: '5', name: 'Contractor', industry: 'Trades & Construction', description: 'Project bidding, resource tracking, and fleet management module.', difficulty: 'Medium', features: ['Quote Generator', 'Fleet Tracking', 'Safety Logs'], isAvailable: true },
  { id: '6', name: 'Healthcare', industry: 'Wellness & Medical', description: 'Patient management system with secure data orbital compliance.', difficulty: 'High', features: ['HIPAA Compliant', 'Tele-health', 'Records'], isAvailable: true },
  { id: '7', name: 'Creator', industry: 'Content & Media', description: 'Audience monetization engine with integrated newsletter and asset store.', difficulty: 'Low', features: ['Asset Store', 'Newsletter Ops', 'Social Sync'], isAvailable: true },
];