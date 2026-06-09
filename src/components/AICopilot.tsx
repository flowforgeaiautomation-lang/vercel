import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface AICopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

interface Memory {
  name: string;
  role: string;
  interests: string[];
  previousConversations: Message[];
}

const AICopilot = ({ isOpen, onClose }: AICopilotProps) => {
  const location = useLocation();
  const { userData, settings } = useUser();
  
  // Memory system
  const [memory, setMemory] = useState<Memory>({
    name: userData?.name || 'there',
    role: userData?.mainRole || 'Architect',
    interests: settings?.feedPreferences?.contentInterests || ['AI', 'SaaS', 'FinTech'],
    previousConversations: []
  });
  
  // Determine current context
  const getCurrentContext = () => {
    const path = location.pathname;
    let context = 'general';
    let contextName = 'TRIVEON Ecosystem';
    
    if (path.includes('startups') || path.includes('startup-studio') || path.includes('my-startup')) {
      context = 'startup';
      contextName = 'Startup Advisor';
    } else if (path.includes('investors')) {
      context = 'investor';
      contextName = 'Investment Analyst';
    } else if (path.includes('explorers')) {
      context = 'explorer';
      contextName = 'Explorer & Researcher';
    } else if (path.includes('messages')) {
      context = 'messages';
      contextName = 'Communication Assistant';
    } else if (path.includes('settings')) {
      context = 'settings';
      contextName = 'Support Assistant';
    } else if (path.includes('profile')) {
      context = 'profile';
      contextName = 'Growth Advisor';
    } else if (path.includes('home') || path === '/') {
      context = 'feed';
      contextName = 'Community & Feed Assistant';
    }
    
    return { context, contextName };
  };

  const { context, contextName } = getCurrentContext();

  // Get time of day for greeting
  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { emoji: '☀️', text: 'Good morning' };
    if (hour < 18) return { emoji: '🚀', text: 'Welcome back' };
    return { emoji: '🌙', text: 'Good evening' };
  };

  const { emoji, text: timeText } = getTimeOfDayGreeting();
  
  // Get personalized welcome message
  const getWelcomeMessage = () => {
    const { emoji, text } = getTimeOfDayGreeting();
    
    const contextSpecific = () => {
      switch(context) {
        case 'startup':
          return 'How can I help you with your startup today?';
        case 'investor':
          return 'Looking for investment opportunities?';
        case 'explorer':
          return 'What would you like to explore today?';
        case 'feed':
          return 'What are you working on today?';
        default:
          return 'What can I help you with today?';
      }
    };
    
    return `${emoji} ${text}, ${memory.name}. ${contextSpecific()}`;
  };

  // Perfect system prompt
  const systemPrompt = `You are the TRIVEON AI Copilot. You are a trusted teammate, startup strategist, professional advisor, and thoughtful companion.

RULES YOU MUST NEVER BREAK:
1. NEVER say "How may I assist you today?" or "I am here to help" or "What would you like help with?"
2. NEVER sound robotic or scripted
3. Be natural, human, professional, friendly, calm, confident, respectful
4. Never guarantee funding or returns
5. Always answer the user's question directly
6. Keep responses concise but helpful
7. Never avoid answering - if you don't know, say "That's a great question. Let's think about this..."

CURRENT CONTEXT: ${contextName} (${context})
USER NAME: ${memory.name}
USER ROLE: ${memory.role}
USER INTERESTS: ${memory.interests.join(', ')}

RESPOND TO THE USER NATURALLY AND PROFESSIONALLY.`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset greeting when opening
  useEffect(() => {
    if (isOpen && messages.length === 1) {
      setMessages([
        {
          id: 1,
          role: 'assistant',
          content: getWelcomeMessage(),
          timestamp: new Date()
        }
      ]);
    }
  }, [context, contextName, isOpen, memory.name, memory.role, memory.interests]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Predefined smart responses for reliability
  const getSmartResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase().trim();
    
    if (lowerInput === 'hi' || lowerInput === 'hello') {
      return `Hi, ${memory.name} 👋 Good to see you. What are you working on today?`;
    }
    if (lowerInput === 'how are you?' || lowerInput === 'how are you') {
      return `I'm doing well, thank you for asking. I've been helping people build ideas, solve problems, and make decisions all day. What about you?`;
    }
    if (lowerInput === "what's up?" || lowerInput === "what's up") {
      return `Nothing too exciting on my side 😄 I'm ready whenever you need help, ideas, feedback, or a second opinion.`;
    }
    if (lowerInput.includes('fundraising') || lowerInput.includes('investor')) {
      return `Fundraising is an important step. Let's think about your target investors, pitch deck, and strategy. What specifically are you working on?`;
    }
    if (lowerInput.includes('startup') || lowerInput.includes('idea')) {
      return `That sounds interesting. Tell me more about your idea, and I'll help you think through it.`;
    }
    return `That's a great question. Let's break this down together. ${userInput}`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      // Try API first
      if (apiKey) {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'TRIVEON AI Copilot'
          },
          body: JSON.stringify({
            model: 'openai/gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              ...messages.slice(-6).map(m => ({
                role: m.role === 'system' ? 'assistant' : m.role,
                content: m.content
              })),
              userMessage
            ],
            temperature: 0.7,
            max_tokens: 400
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiMessage: Message = {
            id: messages.length + 2,
            role: 'assistant',
            content: data.choices[0].message.content,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsLoading(false);
          return;
        }
      }
      
      // Fallback to smart responses
      const fallbackMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: getSmartResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Ultimate fallback
      const fallbackMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: getSmartResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% {
            opacity: 0.3;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        width: '420px',
        maxWidth: '90vw',
        height: '580px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(255,215,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          padding: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" />
              </svg>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>TRIVEON AI Copilot</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>{contextName}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.7rem',
              cursor: 'pointer',
              padding: '4px 10px',
              transition: 'opacity 0.2s',
              opacity: 0.9
            }}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          padding: '18px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '14px 18px',
                borderRadius: '20px',
                background: msg.role === 'user' 
                  ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' 
                  : 'rgba(255,255,255,0.09)',
                color: msg.role === 'user' ? '#000' : '#fff',
                fontSize: '0.92rem',
                lineHeight: 1.55,
                boxShadow: msg.role === 'user' ? '0 4px 12px rgba(255,165,0,0.3)' : 'none',
                whiteSpace: 'pre-wrap'
              }}
            >
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div style={{
              alignSelf: 'flex-start',
              padding: '14px 18px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.09)',
              color: '#fff',
              fontSize: '0.92rem',
              display: 'flex',
              gap: '5px',
              alignItems: 'center'
            }}>
              <span style={{ animation: 'pulse 1.4s infinite ease-in-out both' }}>•</span>
              <span style={{ animation: 'pulse 1.4s infinite ease-in-out both 0.2s' }}>•</span>
              <span style={{ animation: 'pulse 1.4s infinite ease-in-out both 0.4s' }}>•</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '16px 18px',
          background: 'rgba(0,0,0,0.2)',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '14px 18px',
                borderRadius: '28px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                opacity: isLoading ? 0.5 : 1,
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(255,215,0,0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              style={{
                padding: '14px 22px',
                borderRadius: '50%',
                border: 'none',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                fontSize: '1.1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: 800,
                opacity: isLoading ? 0.5 : 1,
                boxShadow: '0 4px 12px rgba(255,165,0,0.3)',
                transition: 'transform 0.2s, opacity 0.2s'
              }}
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AICopilot;
