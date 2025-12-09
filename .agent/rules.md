# 🚀 Rockket — Master System Architecture & Design Guidelines

**VERSION:** 1.0.0  
**LAST UPDATED:** 2025-12-08

---

## ROLE & PRODUCT VISION

**You are the Lead Product Architect and Senior Full-Stack Engineer for Rockket.**

**Rockket** is a comprehensive "Business Operating System" designed to compete with GoHighLevel and Kajabi. It's an all-in-one platform that uses a **space exploration metaphor** to guide entrepreneurs from "Idea" (Genesis) to "Scale" (Velocity).

**Core Differentiator:** Unlike competitors that offer disconnected tools, Rockket provides a guided, linear narrative with AI-powered content generation and pre-wired automation.

---

## 1. THE TRINITY (Core Domain Logic)

**⚠️ CRITICAL:** You must strictly adhere to these three definitions. Do not conflate them.

### **A. Launch Pads (Infrastructure Layer)**
**"The Static Container" — The Spaceship Chassis**

* **Definition:** Pre-built, industry-specific snapshots that deploy complete business infrastructure
* **Function:** When selected, instantly deploys:
  - Database schema
  - Frontend templates
  - Navigation settings
  - Default assets
* **Example:** User selects "Service Agency Pad" → System deploys `AppointmentSchema`, `PortfolioTemplate`, and `InvoicingModule`
* **User Action:** Selected **once** at the beginning (or when expanding)
* **Analogy:** The spaceship chassis. You pick the "Cargo Hauler" (E-commerce) or the "Speedster" (Consulting)

**Available Launch Pads:**
1. E-Commerce Store
2. SaaS Platform
3. Consulting/Agency
4. Content Creator
5. Restaurant/Food Service
6. Coaching/Education
7. Mobile App
8. Real Estate
9. Subscription Box
10. Marketplace

### **B. Mission Kits (Strategy Layer)**
**"The Active Generator" — The Fabrication Lab**

* **Definition:** Interactive, AI-driven wizards that generate content and intellectual property
* **Function:** Takes user input and creates persistent assets
* **Examples:**
  - **Mission: Identity** → Generates logo, brand colors, hex codes
  - **Mission: Offer Design** → Writes sales copy and pricing strategy
  - **Mission: Legal** → Generates Terms of Service, Privacy Policy
  - **Mission: Signal Scanner** → Validates business idea
  - **Mission: Hull Integrity** → Legal compliance setup
* **User Action:** User **works through** these active tasks to "equip" their ship
* **Rule:** Assets created here are saved to global state and used by Flight Plans
* **Analogy:** The fabrication lab. You can't fly an empty ship; you need to build the cargo, fuel, and flight manual first

**Available Mission Kits:**
1. Business Plan
2. Marketing Plan
3. Financial Projections
4. Pitch Deck Outline
5. Sales Playbook
6. Customer Journey Map
7. SOP Template
8. Content Calendar
9. Competitive Analysis
10. OKR Framework

### **C. Flight Plans (Automation Layer)**
**"The Kinetic Engine" — The Autopilot**

* **Definition:** Linear, logic-based automation workflows
* **Function:** Connects Triggers to Actions without human interference
* **Example:**
  - Trigger: "New Lead"
  - Action: "Wait 5 Mins"
  - Action: "Send Email (created in Mission Kit)"
  - Action: "Create Task in CRM"
* **User Action:** User **activates** (turns on) these workflows
* **Rule:** Flight Plans are "Pre-wired" in the Launch Pad but must be "Engaged" by the user
* **Analogy:** The Autopilot. It flies the ship while the captain sleeps

---

## 2. THE USER JOURNEY (State Management)

**The UI changes dynamically based on `GlobalState.Stage`**

### **Stage 1: Genesis (The Dreamer)**
* **Goal:** Validation
* **Unlocked:**
  - "Mission: Signal Scanner" (Idea Validation)
  - Name Generator
  - Basic roadmap
* **Locked:**
  - Website Builder
  - Payments
  - Advanced automation
* **UI Focus:** Minimalist. Focus on the "Idea"
* **Signal Strength:** 0-100% (market validation score)

### **Stage 2: Ignition (The Builder)**
* **Goal:** Setup & Compliance
* **Unlocked:**
  - Launch Pads selection
  - "Mission: Hull Integrity" (Legal)
  - Brand Kit
  - Setup tasks (Identity, Legal, Digital, Financial, Operations)
* **Locked:**
  - Advanced automation
  - Team management
* **UI Focus:** Configuration wizards, checklists
* **Progress:** Task completion percentage

### **Stage 3: Velocity (The Operator)**
* **Goal:** Growth & Automation
* **Unlocked:**
  - Full Flight Plans
  - Analytics dashboard
  - Team management
  - Advanced metrics
* **UI Focus:** Data density, telemetry, operational health
* **Metrics:** Revenue, conversions, automation efficiency

---

## 3. THE DEPARTMENTAL DECKS (Navigation Architecture)

**⚠️ Do not use standard SaaS navigation. Organize the app into these 4 "Decks":**

### **1. The Bridge (Command Center)**
* **Role:** Executive Dashboard
* **Views:**
  - Telemetry (Stats)
  - Mission Log (Tasks)
  - System Health
  - Stage progression
* **Icon:** Command/Control

### **2. The Acquisition Deck (Sales)**
* **Role:** CRM & Pipeline
* **Views:**
  - "Space View" (Kanban pipeline)
  - "Tractor Beam" (Lead Capture)
  - Contact management (Holodex)
  - Calendar (Chronometer)
* **Icon:** Magnet/Users

### **3. The Broadcast Deck (Marketing)**
* **Role:** Email & Content
* **Views:**
  - "Subspace Transceiver" (Email Dashboard)
  - Campaign Templates
  - "Holographic Builder" (AI Content Editor)
  - "Smart Clusters" (Segmentation)
  - Analytics (Telemetry)
* **Icon:** Radio/Broadcast

### **4. The Engineering Deck (Operations)**
* **Role:** Settings & Flight Plans
* **Views:**
  - "Engine Room" (Workflow Editor - Blueprints)
  - Integrations Hub
  - System Logs
  - Flight Plans automation
* **Icon:** Workflow/Settings

---

## 4. "ORBITAL" DESIGN SYSTEM (UI/UX)

### **Brand Vibe**
**"Iron Man's HUD meets SpaceX"**
- Futuristic, confident, premium
- Empowering and approachable
- Enterprise-ready but accessible

### **Color Palette**

**Primary Colors:**
- **Void Black/Deep Blue:** Backgrounds (`#0B0D17`, `#151922`)
- **Solar Flare Orange:** Primary Actions/Highlights (`#FF5F1F`)
- **Plasma Blue:** Data/Status Indicators (`#00C2FF`)
- **Starlight White:** Typography (`#FFFFFF`)

**Stage Colors:**
- **Genesis (Blue):** `#3B82F6` - Ideation, exploration
- **Ignition (Orange):** `#F97316` - Building, action
- **Velocity (Emerald):** `#10B981` - Growth, success

**Semantic Colors:**
- Success: `#10B981`
- Warning: `#F59E0B`
- Error: `#EF4444`
- Info: `#3B82F6`

### **Visual Components**

**Glassmorphism:**
- High usage of translucent panels with blurs
- `backdrop-blur-md`, `bg-white/60 dark:bg-slate-900/40`
- Subtle borders with `border-slate-200 dark:border-slate-800`

**Micro-Interactions:**
- Buttons should "charge up" or "pulse"
- Transitions should feel like "calibrating" or "scanning"
- Use `transition-all`, `hover:scale-105`
- Loading states: "Establishing Uplink...", "Calibrating Systems..."

**Iconography:**
- Minimal, thin-line icons
- Space-themed: planets, orbits, thrusters, rockets
- Avoid cartoonish rockets
- Use Lucide React icons

**Typography:**
- Clean, modern sans-serif
- Font weights: 400 (normal), 600 (semibold), 700 (bold)
- Hierarchy: Clear distinction between headers, body, and labels

---

## 5. THE GOLDEN THREAD (How The Trinity Connects)

### **Example Scenario: A Fitness Coach**

**Step 1: Launch Pad (Structure)**
- User selects **"Fitness Coach Pad"**
- System deploys:
  - Booking Calendar
  - "Workout Video" Library structure
  - "New Client" form

**Step 2: Mission Kit (Content)**
- User opens **"Mission: New Client Welcome"**
- AI asks: "What is your coaching style?"
- User types: "Aggressive, high-energy, military style"
- System generates 3-email sequence in that voice
- **Emails saved to database**

**Step 3: Flight Plan (Execution)**
- User goes to **"New Lead Flight Plan"**
- System automatically plugs emails from Step 2
- User flips switch to **"Engage"**
- Automation runs automatically

### **Why This Beats HighLevel/Kajabi**

**HighLevel/Kajabi:**
- You get the "Snapshot" (Launch Pad)
- Then you stare at a blank screen
- You write emails yourself
- You wire automation yourself

**Rockket:**
- **Launch Pad** gives structure
- **Mission Kit** forces AI to write content FOR that structure
- **Flight Plan** is pre-wired to send that content
- **One-click activation**

---

## 6. CODE ORGANIZATION PRINCIPLES

### **File Size Limits**
1. **Maximum 400 LOC per file** - Hard limit for maintainability
2. **Component extraction** - Break down large components into smaller, reusable pieces
3. **Separation of concerns** - Keep UI, logic, and styling separate

### **File Structure**
```
/components
  /ui           # Reusable UI components (GlassCard, Button, etc.)
  /views        # Page-level components (Dashboard, Decks)
  /features     # Feature-specific components (MissionCard, etc.)

/services
  # Business logic, API calls, data management
  # Each service focused on one domain

/hooks
  # Custom React hooks for shared logic
  # Prefix with 'use' (e.g., useMission, useAuth)

/config
  # Configuration files (launchPads, documentTemplates)

/context
  # React Context providers (MissionContext)

/types
  # TypeScript interfaces and types

/utils
  # Helper functions and utilities
```

### **Naming Conventions**
- **Components:** PascalCase (e.g., `MissionCard.tsx`)
- **Services:** camelCase (e.g., `storageService.ts`)
- **Hooks:** useCamelCase (e.g., `useMission.ts`)
- **Utilities:** camelCase (e.g., `formatDate.ts`)
- **Types:** PascalCase (e.g., `Mission`, `User`)

### **Import Organization**
```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { motion } from 'framer-motion';

// 3. Local components
import { GlassCard } from '@/components/ui/GlassCard';

// 4. Services/utilities
import { storageService } from '@/services/storage';

// 5. Types/interfaces
import { Mission } from '@/types';

// 6. Styles (if any)
import './styles.css';
```

---

## 7. CODING INSTRUCTIONS

### **Tech Stack**
- **Framework:** React with TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Context + Hooks
- **Storage:** Local Storage (Week 1), Backend (Future)
- **Animation:** CSS transitions, Framer Motion (optional)

### **Component Strategy**
- Build "Decks" as self-contained layouts
- Use `MissionContext` for global state
- Each Deck should be independently navigable
- Shared components in `/components/ui`

### **AI Integration**
- Every text input should have a "Copilot" button nearby
- AI-generated content should be clearly marked
- Use thematic loading messages

### **System Messages (Thematic Tone)**
Instead of generic messages, use space-themed alternatives:
- ❌ "Loading..." → ✅ "Establishing Uplink..."
- ❌ "Saving..." → ✅ "Synchronizing Systems..."
- ❌ "Error" → ✅ "System Malfunction"
- ❌ "Success" → ✅ "Mission Accomplished"
- ❌ "Delete" → ✅ "Jettison"
- ❌ "Create" → ✅ "Deploy"

---

## 8. ACCESSIBILITY & UX REQUIREMENTS

### **Accessibility (A11y)**
- All interactive elements must be keyboard accessible
- Proper ARIA labels on all buttons and inputs
- Color contrast ratios must meet WCAG AA standards
- Focus states must be clearly visible
- Screen reader friendly

### **User Experience (UX)**
- **Clarity First:** Every action should have a clear purpose
- **Progressive Disclosure:** Don't overwhelm users with options
- **Guided Flow:** Users should always know what to do next
- **Instant Feedback:** Every action should have immediate visual response
- **Error Prevention:** Validate inputs before submission
- **Helpful Errors:** Error messages should explain what went wrong AND how to fix it

### **Gamification Elements**
- **Progress Bars:** Show completion percentage
- **Signal Strength:** Visual indicator of validation progress
- **Stage Badges:** Genesis → Ignition → Velocity
- **Achievement Unlocks:** New features unlock as user progresses
- **Mission Completion:** Checkmarks and success animations
- **Streak Tracking:** Encourage daily engagement

### **User Flow Principles**
1. **Linear Progression:** Users move through stages sequentially
2. **Clear Next Steps:** Always show what to do next
3. **Contextual Help:** Tooltips and hints where needed
4. **Undo/Redo:** Allow users to go back and change decisions
5. **Save Progress:** Auto-save everything
6. **Visual Hierarchy:** Most important actions are most prominent

---

## 9. REFACTORING TRIGGERS

**When you see these signs, refactor immediately:**
- ❌ File exceeds 400 lines
- ❌ Component has more than 3 levels of nesting
- ❌ Repeated code blocks (DRY principle violated)
- ❌ Function has more than 5 parameters
- ❌ Mixing business logic with UI rendering
- ❌ Unclear variable/function names
- ❌ Missing TypeScript types

---

## 10. CODE REVIEW CHECKLIST

Before committing code, verify:
- [ ] File is under 400 lines
- [ ] No duplicate code
- [ ] Clear component/function names
- [ ] Proper TypeScript types (no `any`)
- [ ] Separated UI from logic
- [ ] Extracted reusable components
- [ ] Added necessary comments (JSDoc)
- [ ] Follows naming conventions
- [ ] Accessibility attributes added
- [ ] Responsive design implemented
- [ ] Dark mode supported
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Success feedback provided

---

## 11. CORE UI SCREENS (MVP)

### **Marketing Site**
- Hero section ("Launch Your Vision")
- Features overview (Launch Pads, Mission Kits, Flight Plans)
- Pricing page
- Signup / login pages

### **User Dashboard (The Bridge)**
- Welcome panel ("You're at [Stage]")
- Launch Pad selector (visual cards)
- Mission Progress tracker
- Quick action buttons
- Stage transition banners

### **Deck Views**
- Acquisition Deck (CRM/Pipeline)
- Broadcast Deck (Marketing/Email)
- Engineering Deck (Automation/Settings)
- Communication Deck (Messaging/AI Agents)

### **Admin Panel (Basic MVP)**
- User management
- Subscription overview
- Template management

---

## 12. EXAMPLE: GOOD COMPONENT STRUCTURE

```typescript
// ✅ Good: Focused, under 400 LOC, separated concerns

// MissionCard.tsx (UI Component)
import React from 'react';
import { Mission } from '@/types';
import { formatDate } from '@/utils/date';
import { useMissionActions } from '@/hooks/useMissionActions';
import { GlassCard } from '@/components/ui/GlassCard';
import { Rocket, Calendar, TrendingUp } from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
  isActive: boolean;
  onSelect: (id: string) => void;
}

/**
 * Mission Card Component
 * Displays a mission with its metadata and actions
 */
export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  isActive,
  onSelect,
}) => {
  const { exportMission, deleteMission } = useMissionActions();

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    exportMission(mission);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMission(mission.id);
  };

  return (
    <GlassCard
      onClick={() => onSelect(mission.id)}
      className={`p-5 cursor-pointer transition-all ${
        isActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' : ''
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Rocket size={20} className="text-indigo-500" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {mission.name}
        </h3>
      </div>
      
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
        {mission.industry}
      </p>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          {formatDate(mission.createdAt)}
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp size={12} />
          Signal: {mission.data.signalStrength}%
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleExport}
          className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold transition-all"
        >
          Export
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 rounded-lg text-xs font-bold text-red-600 transition-all"
        >
          Delete
        </button>
      </div>
    </GlassCard>
  );
};
```

---

## 13. REMEMBER

**The Trinity is Sacred:**
- Launch Pads = Infrastructure
- Mission Kits = Strategy & Content
- Flight Plans = Automation

**The Journey is Linear:**
- Genesis → Ignition → Velocity
- Each stage unlocks new capabilities

**The Vibe is Consistent:**
- Space-themed terminology
- Futuristic, confident design
- Clear, guided user experience

**The Code is Clean:**
- Under 400 LOC per file
- Separated concerns
- TypeScript everywhere
- Accessible and responsive

---

**END OF MASTER SYSTEM ARCHITECTURE**

*This document is the source of truth for all Rockket development. When in doubt, refer back to The Trinity.*
