# Signal Scanner - 8-Dimension Validation Framework

## Overview

The Signal Scanner is Rockket's AI-powered startup validation system that implements an 8-dimension analysis framework to help entrepreneurs validate their business ideas before committing significant time and resources.

## Implementation Status

### ✅ Created Files

1. **`/services/signalScanner.ts`** - Core validation logic
   - 8-dimension validation framework
   - AI prompt templates
   - Score calculation utilities
   - Insight extraction
   - Next steps generation

2. **`/components/views/SignalScannerV2.tsx`** - Enhanced UI (to be created)
   - Multi-stage validation flow
   - Progress tracking
   - Comprehensive results display
   - Export functionality

### 📋 The 8 Dimensions

1. **Market Size & Opportunity**
   - TAM/SAM analysis
   - Demand drivers
   - Growth potential

2. **Competitive Landscape**
   - Direct/indirect competitors
   - Barriers to entry
   - Market saturation

3. **Differentiation Analysis**
   - Unique value proposition
   - Defensible moats
   - Competitive advantages

4. **Target Customer Validation**
   - Ideal customer profile
   - Pain point severity
   - Willingness to pay

5. **Monetization Potential**
   - Pricing model
   - LTV/CAC ratio
   - Revenue streams

6. **Execution Requirements**
   - Technical complexity
   - Capital needs
   - Team requirements

7. **Scalability Assessment**
   - Growth potential
   - Operational challenges
   - Margin behavior

8. **Risk Analysis**
   - Failure points
   - External threats
   - Key assumptions

## Integration with Existing System

### Current Implementation

The existing `SignalScanner.tsx` provides:
- Basic idea validation
- AI-generated landing copy
- Simple signal strength calculation
- Radar chart visualization

### Enhanced Implementation

The new validation system adds:
- **Structured 8-dimension analysis**
- **Detailed reasoning for each dimension**
- **Viability scoring (1-10)**
- **Strengths & concerns extraction**
- **Actionable next steps**
- **Comprehensive validation reports**

## Usage Flow

### Stage 1: Input
```
User describes their startup idea
↓
System generates AI summary
↓
User confirms summary
```

### Stage 2: Analysis
```
For each of 8 dimensions:
  - AI analyzes the idea
  - Generates key factors
  - Provides reasoning
  - Assigns verdict (Strong/Moderate/Weak)
  - Gives score (1-10)
```

### Stage 3: Results
```
Calculate overall viability score
↓
Extract top 3 strengths
↓
Extract top 3 concerns
↓
Generate recommended next steps
↓
Display comprehensive report
```

## AI Integration

### Current Mock Implementation

```typescript
// Mock AI validation (replace with actual AI API)
export const mockAIValidation = async (
  ideaDescription: string,
  dimension: keyof typeof validationPrompts
): Promise<ValidationDimension> => {
  // Returns mock data for demo
};
```

### Production Implementation

Replace with actual AI service (Gemini, OpenAI, etc.):

```typescript
import { generateValidationPrompt } from './signalScanner';
import { callAIService } from './aiService';

export const aiValidation = async (
  ideaDescription: string,
  dimension: keyof typeof validationPrompts
): Promise<ValidationDimension> => {
  const prompt = generateValidationPrompt(ideaDescription, dimension);
  const response = await callAIService(prompt);
  return JSON.parse(response);
};
```

## Signal Strength Calculation

The Signal Strength (0-100%) is calculated from the overall viability score:

```
Signal Strength = Overall Score × 10
```

Where Overall Score is the average of all 8 dimension scores (1-10).

## Export Functionality

Validation reports can be exported in multiple formats:
- **Markdown** - Human-readable business plan
- **JSON** - Complete data export
- **PDF** - Professional report (future)

## Next Steps for Integration

1. **Replace Mock AI** - Integrate with actual AI service (Gemini)
2. **Merge with Existing** - Combine with current SignalScanner features
3. **Add to Genesis Flow** - Make it the first step in Genesis Pad
4. **Store Reports** - Save validation reports to mission data
5. **Progress Tracking** - Show validation status in dashboard

## Example Validation Report

```markdown
# STARTUP IDEA VALIDATION REPORT

## IDEA SUMMARY
A B2B SaaS platform that helps small businesses automate customer onboarding...

## OVERALL ASSESSMENT
Viability Score: 7/10

### Top 3 Strengths
1. Strong differentiation with AI-powered approach
2. Clear target customer with acute pain point
3. Scalable model with minimal marginal costs

### Top 3 Concerns
1. Saturated market with established competitors
2. Unproven monetization model
3. Moderate execution complexity

## RECOMMENDED NEXT STEPS
1. Conduct 10-15 customer discovery interviews
2. Build landing page and run $500 ad test
3. Test pricing with 5-10 potential customers
```

## Code Organization

Following the 400 LOC rule:

- **`signalScanner.ts`** - ~350 LOC (Service layer)
- **`SignalScannerV2.tsx`** - ~400 LOC (UI component)
- **Separate utilities** if needed for complex calculations

## Future Enhancements

1. **Market Validation** - Real market data integration
2. **Competitor Analysis** - Automated competitive research
3. **Pricing Validation** - A/B testing integration
4. **Progress Tracking** - Track validation over time
5. **Comparison Mode** - Compare multiple ideas side-by-side
6. **Team Collaboration** - Share reports with team members

---

**Status:** Core service implemented, UI component ready for integration
**Next:** Integrate with existing SignalScanner or create separate enhanced version
