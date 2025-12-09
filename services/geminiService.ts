
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedStrategy, MissionInput } from '../types';

// Initialize Gemini Client
// We assume process.env.API_KEY is available as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_ID = "gemini-2.5-flash";

export const generateMissionStrategy = async (input: MissionInput): Promise<GeneratedStrategy> => {
  const prompt = `
    Act as a world-class business strategist for a startup called "${input.businessName}" in the "${input.industry}" industry.
    Target Audience: ${input.targetAudience}
    Key Differentiator: ${input.keyDifferentiator}

    Generate a "Mission Kit" strategy document containing:
    1. A powerful Mission Statement.
    2. A futuristic Vision Statement.
    3. 3-5 Core Values.
    4. A concise Elevator Pitch.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            missionStatement: { type: Type.STRING },
            vision: { type: Type.STRING },
            coreValues: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            elevatorPitch: { type: Type.STRING }
          },
          required: ["missionStatement", "vision", "coreValues", "elevatorPitch"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as GeneratedStrategy;

  } catch (error) {
    console.error("Gemini Mission Gen Error:", error);
    // Fallback mock data in case of API failure or missing key for demo purposes
    return {
      missionStatement: "To revolutionize the industry through innovation and determination.",
      vision: "A world where our solution is the standard.",
      coreValues: ["Innovation", "Integrity", "Velocity"],
      elevatorPitch: "We help businesses launch faster."
    };
  }
};

export const generateStrategyFromPlan = async (planContent: string): Promise<GeneratedStrategy> => {
  const prompt = `
    Act as a world-class business strategist. Analyze the following Business Plan and extract/generate a "Mission Kit" strategy document.
    
    BUSINESS PLAN CONTENT:
    ${planContent}

    Generate JSON with these exact fields:
    1. missionStatement: A powerful, concise mission statement derived from the plan.
    2. vision: A futuristic vision statement.
    3. coreValues: Array of 3-5 core values implied by the plan.
    4. elevatorPitch: A concise 2-sentence elevator pitch for the business.
    5. businessName: The likely name of the business (extract from plan or infer).
    6. industry: The industry sector.
    7. targetAudience: The primary target audience description.
    8. keyDifferentiator: The main unique selling proposition.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            missionStatement: { type: Type.STRING },
            vision: { type: Type.STRING },
            coreValues: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            elevatorPitch: { type: Type.STRING },
            businessName: { type: Type.STRING },
            industry: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            keyDifferentiator: { type: Type.STRING }
          },
          required: ["missionStatement", "vision", "coreValues", "elevatorPitch"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as GeneratedStrategy;

  } catch (error) {
    console.error("Gemini Strategy Extraction Error:", error);
    return {
      missionStatement: "To execute the business plan with precision and excellence.",
      vision: "A market leader in the defined sector.",
      coreValues: ["Execution", "Strategy", "Result-Oriented"],
      elevatorPitch: "We are building a solution based on a solid market entry strategy."
    };
  }
};

export const generateLandingCopy = async (problem: string, solution: string, audience: string) => {
  const prompt = `
    Act as a world-class direct-response copywriter specializing in high-converting landing pages.
    
    Create landing page copy for an MVP waitlist that follows these principles:
    - Benefit-driven, not feature-driven
    - Clear problem-solution fit
    - Focused on learning and validation
    - Transparent about early-stage status
    - Compelling but honest
    
    CONTEXT:
    Problem: ${problem}
    Solution: ${solution}
    Target Audience: ${audience}
    
    Generate JSON with these fields:
    1. headline: Punchy, benefit-driven headline (6-10 words) that states the core problem and solution
    2. subheadline: Clear value proposition (15-25 words) explaining who it's for and why it matters
    3. problem: Expanded problem statement (2-3 sentences) that resonates with the audience's pain
    4. solution: Clear explanation of how you solve it (2-3 sentences) focusing on benefits
    5. benefits: Array of 3 specific benefits early adopters get (each 10-15 words)
    6. cta: Action-oriented button text (2-4 words) like "Join Waitlist" or "Get Early Access"
    7. socialProof: Optional testimonial-style quote from a potential user (1-2 sentences)
    8. viralTweet: A short, engaging tweet to announce the waitlist (under 280 chars)
    
    Make it compelling but honest. Focus on the transformation, not just features.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            problem: { type: Type.STRING },
            solution: { type: Type.STRING },
            benefits: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            cta: { type: Type.STRING },
            socialProof: { type: Type.STRING },
            viralTweet: { type: Type.STRING }
          },
          required: ["headline", "subheadline", "problem", "solution", "benefits", "cta"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Landing Copy Error:", error);
    // Enhanced fallback with all required fields
    return {
      headline: "The Solution You've Been Waiting For",
      subheadline: "Join the waitlist to get early access and help shape the future of this product.",
      problem: "You're struggling with inefficient processes that waste time and money. Current solutions are either too complex, too expensive, or simply don't work for your needs.",
      solution: "We're building a simple, affordable solution designed specifically for people like you. Get the results you need without the complexity you don't.",
      benefits: [
        "50% off lifetime access for early members",
        "Direct input on features and roadmap",
        "Priority support and onboarding"
      ],
      cta: "Join Waitlist",
      socialProof: "This is exactly what I've been looking for. Can't wait to try it!",
      viralTweet: "Something big is coming. Join the waitlist to be first in line. #startup"
    };
  }
};

export const generateEmailDraft = async (instruction: string, context: string) => {
  const prompt = `
      Act as an email marketing expert. Write a short, engaging email body based on this instruction: "${instruction}".
      Business Context: ${context}.
      
      Keep it under 150 words. Use placeholders like {{First_Name}} where appropriate.
      Return raw text, no markdown code blocks.
    `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Email Gen Error:", error);
    return "Hey {{First_Name}},\n\nWe have some exciting news to share with you! [AI Generation Failed - Check Connection]";
  }
};

let chatSession: any = null;

export const streamMissionChat = async (message: string, onChunk: (text: string) => void) => {
  try {
    if (!chatSession) {
      chatSession = ai.chats.create({
        model: MODEL_ID,
        config: {
          systemInstruction: "You are a specialized business co-pilot named 'Mission Control'. You help users draft business documents. Keep responses concise, professional, and tactical. You are speaking to a startup founder.",
        }
      });
    }

    const result = await chatSession.sendMessageStream({ message });

    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error("Chat Stream Error:", error);
    onChunk(" ... [Connection Lost. Please check Flight Manual]");
  }
};