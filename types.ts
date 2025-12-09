
import React from 'react';

export type View = 'dashboard' | 'launchpads' | 'missionkits' | 'flightplans' | 'settings' | 'mission_cockpit' | 'admin' | 'brand_identity' | 'signal_scanner' | 'acquisition' | 'broadcast' | 'engineering' | 'message_builder' | 'communication';

export type Stage = 'ideation' | 'setup' | 'growth';

export interface StatMetric {
  label: string;
  value: string | number;
  change?: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}

export interface LaunchPadTemplate {
  id: string;
  name: string;
  industry: string;
  description: string;
  difficulty: 'Low' | 'Medium' | 'High';
  features: string[];
  isAvailable?: boolean;
}

export interface FlightTask {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'complete';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

export interface GeneratedStrategy {
  missionStatement: string;
  vision: string;
  coreValues: string[];
  elevatorPitch: string;
}

export interface MissionInput {
  businessName: string;
  industry: string;
  targetAudience: string;
  keyDifferentiator: string;
}

export type Role = 'Commander' | 'Pilot' | 'Specialist';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Pending' | 'Offline';
  avatarUrl?: string;
  lastActive: string;
}

export interface MissionProgress {
    signalValidated: boolean;
    legalShieldsActive: boolean;
}
