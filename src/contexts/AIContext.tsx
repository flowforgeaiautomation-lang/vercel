import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';

// Type definitions for AI Systems
interface AIState {
  copilotOpen: boolean;
  copilotMessages: Array<{ id: string; role: 'user' | 'assistant'; content: string }>;
  recommendations: {
    startups: any[];
    investors: any[];
    explorers: any[];
    communities: any[];
  };
  smartFeedItems: any[];
  searchResults: any[];
  feedbackAnalysis: any;
  reviewAnalysis: any;
  profileScores: {
    trvScore: number;
    credibility: number;
    contribution: number;
    trust: number;
    prestige: number;
  };
}

interface AIContextType {
  aiState: AIState;
  // Copilot functions
  toggleCopilot: () => void;
  sendCopilotMessage: (message: string) => Promise<void>;
  // AI Systems functions
  analyzeStartup: (startupData: any) => Promise<any>;
  generateRecommendations: () => Promise<void>;
  analyzeFeedback: (feedback: any[]) => Promise<any>;
  analyzeReviews: (reviews: any[]) => Promise<any>;
  updateProfileScores: () => Promise<void>;
  // Helper functions
  getAIExplanation: (topic: string) => Promise<string>;
}

const initialAIState: AIState = {
  copilotOpen: false,
  copilotMessages: [],
  recommendations: {
    startups: [],
    investors: [],
    explorers: [],
    communities: [],
  },
  smartFeedItems: [],
  searchResults: [],
  feedbackAnalysis: null,
  reviewAnalysis: null,
  profileScores: {
    trvScore: 0,
    credibility: 0,
    contribution: 0,
    trust: 0,
    prestige: 0,
  },
};

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const [aiState, setAIState] = useState<AIState>(initialAIState);

  const toggleCopilot = () => {
    setAIState(prev => ({ ...prev, copilotOpen: !prev.copilotOpen }));
  };

  const sendCopilotMessage = async (message: string) => {
    const userMessage = { id: Date.now().toString(), role: 'user' as const, content: message };
    setAIState(prev => ({
      ...prev,
      copilotMessages: [...prev.copilotMessages, userMessage],
    }));

    // AI Response logic would go here
    let response = "I'm here to help! Ask me about anything in the TRIVEON ecosystem.";
    if (message.toLowerCase().includes('startup')) {
      response = "I'd be happy to help with startup analysis! Tell me more about the startup you're interested in.";
    } else if (message.toLowerCase().includes('investor') || message.toLowerCase().includes('funding')) {
      response = "Need help with funding or investors? I can help analyze investment opportunities and create fundraising strategies!";
    } else if (message.toLowerCase().includes('review')) {
      response = "Let me assist you with writing a helpful review! Tell me which startup you're reviewing.";
    } else if (message.toLowerCase().includes('feedback')) {
      response = "I can help you structure constructive feedback! What startup is this for?";
    }

    const assistantMessage = { id: (Date.now() + 1).toString(), role: 'assistant' as const, content: response };
    setAIState(prev => ({
      ...prev,
      copilotMessages: [...prev.copilotMessages, assistantMessage],
    }));
  };

  const analyzeStartup = async (startupData: any) => {
    console.log('Analyzing startup:', startupData);
    return {
      strengths: ['Strong team', 'Innovative product'],
      weaknesses: ['Needs better UX', 'Slow market fit'],
      risks: ['Competition', 'Regulatory'],
      score: 78,
    };
  };

  const generateRecommendations = async () => {
    console.log('Generating recommendations...');
    // Mock recommendations
    setAIState(prev => ({
      ...prev,
      recommendations: {
        startups: [
          { id: '1', name: 'Nebula AI', score: 95 },
          { id: '2', name: 'GreenMesh', score: 90 },
        ],
        investors: [
          { id: 'i1', name: 'David Morgan', matchScore: 92 },
        ],
        explorers: [],
        communities: [],
      },
    }));
  };

  const analyzeFeedback = async (feedback: any[]) => {
    console.log('Analyzing feedback...');
    return {
      mostRequested: ['Feature A', 'Feature B'],
      commonComplaints: ['Slow load time', 'UI issues'],
      praised: ['Customer support', 'Design'],
    };
  };

  const analyzeReviews = async (reviews: any[]) => {
    console.log('Analyzing reviews...');
    return {
      qualityScore: 85,
      spamCount: 2,
      fakeReviews: 0,
      reviewerReputation: 78,
    };
  };

  const updateProfileScores = async () => {
    console.log('Updating profile scores...');
    setAIState(prev => ({
      ...prev,
      profileScores: {
        trvScore: 85,
        credibility: 90,
        contribution: 80,
        trust: 95,
        prestige: 75,
      },
    }));
  };

  const getAIExplanation = async (topic: string): Promise<string> => {
    console.log('Getting explanation for:', topic);
    return `Here's an explanation about ${topic}...`;
  };

  useEffect(() => {
    if (profile) {
      generateRecommendations();
      updateProfileScores();
    }
  }, [profile]);

  return (
    <AIContext.Provider
      value={{
        aiState,
        toggleCopilot,
        sendCopilotMessage,
        analyzeStartup,
        generateRecommendations,
        analyzeFeedback,
        analyzeReviews,
        updateProfileScores,
        getAIExplanation,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
