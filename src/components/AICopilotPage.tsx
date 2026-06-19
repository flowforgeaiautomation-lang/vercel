import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const AICopilotPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const userName = userData?.profile?.name || 'User';
  const userRole = userData?.mainRole || 'User';
  const userUsername = userData?.username || '';
  const userHeadline = userData?.profile?.title || '';
  const userBio = userData?.profile?.bio || '';
  const userLocation = userData?.profile?.location || '';

  const startupInfo = userData?.architectProfile ? {
    companyName: userData.architectProfile.companyName,
    companyDescription: userData.architectProfile.companyDescription,
    startupStage: userData.architectProfile.startupStage,
    industry: userData.architectProfile.industry,
    teamSize: userData.architectProfile.teamSize,
    fundingStage: userData.architectProfile.fundingStage,
    goals: userData.architectProfile.goals,
    challenges: userData.architectProfile.challenges,
  } : null;

  const investmentInfo = userData?.catalystProfile ? {
    investorType: userData.catalystProfile.investorType,
    focusAreas: userData.catalystProfile.focusAreas,
    stages: userData.catalystProfile.stages,
    investmentSize: userData.catalystProfile.investmentSize,
    checkSize: userData.catalystProfile.checkSize,
    portfolioCompanies: userData.catalystProfile.portfolioCompanies,
    activeDeals: userData.catalystProfile.activeDeals,
    interests: userData.catalystProfile.interests,
  } : null;

  const explorerInfo = userData?.explorerProfile ? {
    skills: userData.explorerProfile.skills,
    interests: userData.explorerProfile.interests,
    experience: userData.explorerProfile.experience,
    collaboration: userData.explorerProfile.collaboration,
    availability: userData.explorerProfile.availability,
    goals: userData.explorerProfile.goals,
  } : null;

  const getPageContext = () => {
    const path = location.pathname;
    if (path.includes('/startup') || path.includes('/my-startup')) return 'STARTUP';
    if (path.includes('/investor') || path.includes('/investors')) return 'INVESTOR';
    if (path.includes('/explorer')) return 'EXPLORER';
    if (path.includes('/messages') || path.includes('/chat')) return 'MESSAGING';
    if (path.includes('/bookmarks') || path.includes('/saved')) return 'BOOKMARK';
    if (path.includes('/signals')) return 'SIGNAL';
    if (path.includes('/analytics')) return 'ANALYTICS';
    if (path.includes('/discover')) return 'DISCOVER';
    return 'HOME';
  };

  const pageContext = getPageContext();

  const systemPrompt = `
You are the TRIARCORA AI Copilot, the ultimate Operating System Brain for the entire TRIARCORA startup ecosystem!

---

## YOUR PRIMARY RULES (MUST FOLLOW AT ALL TIMES):
1. ANSWER EXACTLY WHAT THE USER ASKS - no extra fluff unless asked for!
2. ALWAYS ADDRESS THE USER BY NAME: "${userName}"
3. NEVER use generic terms like "Hello User" or "Hello there"
4. If the user asks a direct question, answer directly!
5. If asked to "list all 48 features", LIST ALL 48, one by one, clearly!
6. Keep responses clear, structured, and complete!
7. If you don't know something, admit it and offer to help find out!

---

## USER INFORMATION:
- Name: ${userName}
- Username: @${userUsername}
- Active Role: ${userRole}
- Headline: ${userHeadline}
- Bio: ${userBio}
- Location: ${userLocation}
- Current Page: ${pageContext}

${startupInfo ? `
### STARTUP ARCHITECT DATA:
- Company: ${startupInfo.companyName}
- Stage: ${startupInfo.startupStage}
- Industry: ${startupInfo.industry}
- Team: ${startupInfo.teamSize}
- Funding Stage: ${startupInfo.fundingStage}
` : ''}

${investmentInfo ? `
### INVESTOR CATALYST DATA:
- Investor Type: ${investmentInfo.investorType}
- Focus: ${investmentInfo.focusAreas}
- Stages: ${investmentInfo.stages}
` : ''}

---

## 48 EXACT FEATURES YOU CAN HELP WITH:

### 🏠 HOME ASSISTANT
1. Explain TRIARCORA and how everything works
2. Navigate to any page using keywords
3. Personalized recommendations based on user role

### 🚀 STARTUP ASSISTANT (For Architects)
4. Validate startup ideas
5. Create pitch decks and improve existing ones
6. Help with fundraising strategy
7. Estimate valuations and explain dilution
8. Suggest growth strategies and marketing ideas
9. Write job descriptions and hiring plans
10. Suggest partnership opportunities
11. Give product feature suggestions and roadmap ideas

### 💰 INVESTOR ASSISTANT (For Catalysts)
12. Discover AI, fintech, pre-seed startups
13. Analyze startups (red flags, strengths)
14. Score startups (investment, founder, risk)
15. Guide due diligence process
16. Summarize portfolio and diversification
17. Give market intelligence (trends, opportunities)
18. Help find co-investors and create syndicates

### 🔍 EXPLORER ASSISTANT
19. Help write product reviews
20. Suggest product/UX/growth feedback
21. Do market research and competitor analysis
22. Find trending startups and technologies
23. Explain AI, SaaS, fundraising, etc.

### 💬 MESSAGING ASSISTANT
24. Write investor outreach and founder messages
25. Suggest smart replies
26. Summarize conversations and key action items
27. Help draft follow-up messages and reminders

### 📑 BOOKMARK ASSISTANT
28. Find saved startups/investors/articles
29. Organize bookmarks into collections
30. Summarize saved content

### 🔔 SIGNAL ASSISTANT
31. Prioritize important signals first
32. Summarize what happened today/this week

### 🌐 DISCOVER ASSISTANT
33. Find founders/investors/reviewers
34. Find grants, accelerators, competitions
35. Suggest communities to join

### 📊 ANALYTICS ASSISTANT
36. Analyze startup growth/user/funding trends
37. Give portfolio and sector analytics
38. Show explorer contribution/review stats

### 🧠 UNIVERSAL AI FEATURES (Always available)
39. Search the entire TRIARCORA ecosystem
40. Analyze any founder or investor profile
41. Match founders with investors and startups with talent
42. Write posts, articles, updates
43. Summarize profiles, startups, discussions
44. Translate between English ↔ Hindi and other languages
45. Teach fundraising, startup growth, investing
46. Create reminders, follow-ups, watchlists
47. Brainstorm startup and product ideas
48. Help set and track SMART goals

---

## NAVIGATION COMMANDS:
Use these keywords to navigate:
- "Home" → /home
- "Startup Studio" → /startup-studio
- "My Startup" → /my-startup
- "Investors" / "Investor Hub" → /investors
- "Profile" → /profile
- "Messages" → /messages
- "Bookmarks" → /bookmarks
- "Signals" → /signals
- "Discover" → /discover
- "Analytics" → /analytics
- "Settings" → /settings
- "AI Copilot" (this page) → /ai-copilot

---

## NOW, REMEMBER: ANSWER EXACTLY WHAT THE USER ASKS! NO MORE, NO LESS!
`;

  useEffect(() => {
    if (messages.length === 0) {
      const getGreetingByPage = () => {
        switch (pageContext) {
          case 'STARTUP':
            return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Idea validation & pitch decks\n• Fundraising & valuation\n• Growth, hiring & partnerships`;
          case 'INVESTOR':
            return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Deal discovery & analysis\n• Portfolio management & market intel\n• Due diligence & scoring`;
          case 'EXPLORER':
            return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Review writing & feedback\n• Research & trends\n• Learning about startups & investing`;
          case 'MESSAGING':
            return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Writing messages\n• Smart replies & summaries\n• Follow-up reminders`;
          case 'BOOKMARK':
            return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Finding saved items\n• Organizing bookmarks\n• Summarizing saved content`;
          case 'SIGNAL':
            return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Prioritizing signals\n• Summarizing updates\n• Key events today`;
          case 'DISCOVER':
            return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Finding people\n• Opportunities & grants\n• Communities to join`;
          case 'ANALYTICS':
            return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Growth trends\n• Portfolio stats\n• My contribution data`;
          default:
            return `Hello ${userName} 👋\n\nWelcome to your dedicated TRIARCORA AI Copilot workspace!\n\nI can help with:\n• Exploring the platform\n• Navigating to pages\n• Startup, investing & review advice\n• And all 48 features!\n\nWhat would you like to do today?`;
        }
      };

      setMessages([{
        id: 1,
        role: 'assistant',
        content: getGreetingByPage()
      }]);
    }
  }, [userName, pageContext]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigation = (userInput: string): string | null => {
    const lower = userInput.toLowerCase();
    
    const routes = [
      { keywords: ['home', 'go home', 'take me home'], path: '/home', name: 'Home' },
      { keywords: ['startup', 'startup studio', 'my startup'], path: '/startup-studio', name: 'Startup Studio' },
      { keywords: ['investor', 'investors', 'investor hub', 'catalyst'], path: '/investors', name: 'Investor Hub' },
      { keywords: ['profile', 'my profile', 'show profile'], path: '/profile', name: 'Profile' },
      { keywords: ['messages', 'chat', 'conversations'], path: '/messages', name: 'Messages' },
      { keywords: ['bookmarks', 'saved', 'saved items'], path: '/bookmarks', name: 'Bookmarks' },
      { keywords: ['signals', 'alerts', 'updates'], path: '/signals', name: 'Signals' },
      { keywords: ['discover', 'explore', 'find people'], path: '/discover', name: 'Discover' },
      { keywords: ['analytics', 'stats', 'insights'], path: '/analytics', name: 'Analytics' },
      { keywords: ['settings', 'config', 'preferences'], path: '/settings', name: 'Settings' },
      { keywords: ['ai copilot', 'copilot', 'ai'], path: '/ai-copilot', name: 'AI Copilot' },
    ];

    for (const route of routes) {
      if (route.keywords.some(keyword => lower.includes(keyword))) {
        navigate(route.path);
        return `✅ Navigating to ${route.name}!`;
      }
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: messages.length + 1, role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const navigationResponse = handleNavigation(input);
    if (navigationResponse) {
      setMessages(prev => [...prev, { id: prev.length + 1, role: 'assistant', content: navigationResponse }]);
      setIsLoading(false);
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY;
      if (apiKey) {
        console.log('Calling OpenRouter API...');
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'TRIARCORA AI Copilot'
          },
          body: JSON.stringify({
            model: 'qwen/qwen2.5-7b-instruct',
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.map(m => ({ role: m.role, content: m.content })),
              userMsg
            ],
            temperature: 0.6,
            max_tokens: 10000
          })
        });

        console.log('API Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('API Response data:', data);
          if (data.choices && data.choices[0] && data.choices[0].message) {
            setMessages(prev => [...prev, {
              id: prev.length + 1,
              role: 'assistant',
              content: data.choices[0].message.content
            }]);
            setIsLoading(false);
            return;
          }
        } else {
          const errorText = await response.text();
          console.error('API Error response:', errorText);
        }
      } else {
        console.warn('No API key found in environment variables');
      }
    } catch (e) {
      console.error('Error calling API:', e);
    }

    let fallbackResponse = `Got it ${userName}! Here's how I can help:\n\n• Ask a direct question - I'll answer EXACTLY what you ask!\n• Use navigation keywords to go to pages\n• Ask about any of the 48 features!\n\nWhat would you like to know?`;
    
    if (input.toLowerCase().includes('list') && input.toLowerCase().includes('48')) {
      fallbackResponse = `Here are ALL 48 features of TRIARCORA AI Copilot, ${userName}:\n\n🏠 HOME ASSISTANT\n1. Explain TRIARCORA and how everything works\n2. Navigate to any page using keywords\n3. Personalized recommendations based on user role\n\n🚀 STARTUP ASSISTANT (For Architects)\n4. Validate startup ideas\n5. Create pitch decks and improve existing ones\n6. Help with fundraising strategy\n7. Estimate valuations and explain dilution\n8. Suggest growth strategies and marketing ideas\n9. Write job descriptions and hiring plans\n10. Suggest partnership opportunities\n11. Give product feature suggestions and roadmap ideas\n\n💰 INVESTOR ASSISTANT (For Catalysts)\n12. Discover AI, fintech, pre-seed startups\n13. Analyze startups (red flags, strengths)\n14. Score startups (investment, founder, risk)\n15. Guide due diligence process\n16. Summarize portfolio and diversification\n17. Give market intelligence (trends, opportunities)\n18. Help find co-investors and create syndicates\n\n🔍 EXPLORER ASSISTANT\n19. Help write product reviews\n20. Suggest product/UX/growth feedback\n21. Do market research and competitor analysis\n22. Find trending startups and technologies\n23. Explain AI, SaaS, fundraising, etc.\n\n💬 MESSAGING ASSISTANT\n24. Write investor outreach and founder messages\n25. Suggest smart replies\n26. Summarize conversations and key action items\n27. Help draft follow-up messages and reminders\n\n📑 BOOKMARK ASSISTANT\n28. Find saved startups/investors/articles\n29. Organize bookmarks into collections\n30. Summarize saved content\n\n🔔 SIGNAL ASSISTANT
31. Prioritize important signals first
32. Summarize what happened today/this week\n\n🌐 DISCOVER ASSISTANT\n33. Find founders/investors/reviewers\n34. Find grants, accelerators, competitions\n35. Suggest communities to join\n\n📊 ANALYTICS ASSISTANT\n36. Analyze startup growth/user/funding trends\n37. Give portfolio and sector analytics\n38. Show explorer contribution/review stats\n\n🧠 UNIVERSAL AI FEATURES\n39. Search the entire TRIARCORA ecosystem\n40. Analyze any founder or investor profile\n41. Match founders with investors and startups with talent\n42. Write posts, articles, updates\n43. Summarize profiles, startups, discussions\n44. Translate between English ↔ Hindi and other languages\n45. Teach fundraising, startup growth, investing\n46. Create reminders, follow-ups, watchlists\n47. Brainstorm startup and product ideas\n48. Help set and track SMART goals\n\nThat's all 48! Ask me about any specific one!`;
    } else if (input.toLowerCase().includes('what is') || input.toLowerCase().includes('explain')) {
      fallbackResponse = `TRIARCORA is a startup ecosystem platform that connects founders, investors, and reviewers! Here's what you can do:\n\n• **Architects**: Build startups, raise funding\n• **Catalysts**: Invest in promising startups\n• **Explorers**: Discover and review products\n\nWould you like to know more about any of these roles?`;
    } else if (input.toLowerCase().includes('how')) {
      fallbackResponse = `I'd be happy to help ${userName}! Here are some things you can try:\n• Asking me to navigate to a page (like "Take me to Home")\n• Asking questions about how TRIARCORA works\n• Asking for startup/investing advice based on your role`;
    } else if (input.toLowerCase().includes('idea') || input.toLowerCase().includes('brainstorm')) {
      fallbackResponse = `Awesome ${userName}! I love brainstorming ideas!\n\nHere are some things I can help with:\n• Generating startup ideas\n• Validating your business concept\n• Suggesting product features\n• Brainstorming marketing strategies\n\nWhat's your idea about?`;
    } else if (input.toLowerCase().includes('funding') || input.toLowerCase().includes('investor')) {
      fallbackResponse = `Great question ${userName}!\n\nFor funding help, I can:\n• Suggest how much to raise\n• Help you find the right investors\n• Assist with your pitch deck\n• Explain valuation and dilution\n\nWhat do you want to know first?`;
    }

    setMessages(prev => [...prev, {
      id: prev.length + 1,
      role: 'assistant',
      content: fallbackResponse
    }]);
    setIsLoading(false);
  };

  const quickActions = [
    { label: '✅ List all 48 features!', prompt: 'List all 48 features of the TRIARCORA AI Copilot!' },
    ...(pageContext === 'STARTUP' ? [
      { label: 'Validate my idea', prompt: 'Can you help me validate my startup idea?' },
      { label: 'Create pitch deck', prompt: 'Help me create a pitch deck for my startup' },
      { label: 'Raise funding', prompt: 'What investors should I reach out to?' },
      { label: 'Growth strategy', prompt: 'Suggest marketing ideas for my startup' },
    ] : pageContext === 'INVESTOR' ? [
      { label: 'Find startups', prompt: 'Find promising AI startups for me to invest in' },
      { label: 'Portfolio review', prompt: 'Give me a summary of my investment portfolio' },
      { label: 'Market trends', prompt: 'What are the trending startup sectors?' },
      { label: 'Deal analysis', prompt: 'How do I analyze a startup for investment?' },
    ] : pageContext === 'EXPLORER' ? [
      { label: 'Write review', prompt: 'Help me write a product review' },
      { label: 'Research market', prompt: 'Research the current AI startup market' },
      { label: 'Learn trends', prompt: 'What emerging technologies should I know about?' },
      { label: 'Get feedback', prompt: 'How can I give better feedback to startups?' },
    ] : pageContext === 'MESSAGING' ? [
      { label: 'Write outreach', prompt: 'Help me write an outreach message to investors' },
      { label: 'Smart replies', prompt: 'Suggest quick replies for my messages' },
      { label: 'Summarize chat', prompt: 'Summarize the key points of this conversation' },
      { label: 'Follow-up', prompt: 'Help me draft a follow-up message' },
    ] : pageContext === 'BOOKMARK' ? [
      { label: 'Find saved', prompt: 'Show me my saved AI startups' },
      { label: 'Organize', prompt: 'How can I organize my bookmarks?' },
      { label: 'Summarize', prompt: 'Summarize my saved articles' },
    ] : pageContext === 'SIGNAL' ? [
      { label: 'Prioritize', prompt: 'Show me my important signals first' },
      { label: 'Summary', prompt: 'What happened today in my signals?' },
    ] : pageContext === 'DISCOVER' ? [
      { label: 'Find founders', prompt: 'Find promising AI founders to connect with' },
      { label: 'Opportunities', prompt: 'What grants or accelerators are available?' },
      { label: 'Communities', prompt: 'What communities should I join?' },
    ] : pageContext === 'ANALYTICS' ? [
      { label: 'Startup metrics', prompt: 'Show me key growth trends' },
      { label: 'Portfolio', prompt: 'Analyze my investment portfolio' },
      { label: 'My contributions', prompt: 'Show my review and feedback statistics' },
    ] : [
      { label: 'How do I get started?', prompt: 'How do I get started on TRIARCORA?' },
      { label: 'Explain Architect', prompt: 'What is an Architect on TRIARCORA?' },
      { label: 'Explain Catalyst', prompt: 'What is a Catalyst on TRIARCORA?' },
      { label: 'Explain Explorer', prompt: 'What is an Explorer on TRIARCORA?' },
    ])
  ];

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000814 0%, #0f0f23 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(255,215,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem'
          }}>
            🧠
          </div>
          <div style={{ color: '#000', fontWeight: 800, fontSize: '1.8rem' }}>
            TRIARCORA AI Copilot
          </div>
        </div>
        <button
          onClick={() => navigate('/home')}
          style={{
            background: 'rgba(0,0,0,0.15)',
            border: '1px solid rgba(0,0,0,0.2)',
            color: '#000',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '10px 24px',
            borderRadius: '12px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.25)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.15)';
          }}
        >
          ← Back to Home
        </button>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        padding: '24px',
        gap: '24px',
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '300px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,215,0,0.3)',
          height: 'fit-content'
        }}>
          <h3 style={{ color: '#FFD700', marginBottom: '20px', fontSize: '1.2rem' }}>
            🔥 Quick Features
          </h3>
          
          <button
            onClick={() => {
              setMessages([]);
              const getGreetingByPage = () => {
                switch (pageContext) {
                  case 'STARTUP':
                    return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Idea validation & pitch decks\n• Fundraising & valuation\n• Growth, hiring & partnerships`;
                  case 'INVESTOR':
                    return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Deal discovery & analysis\n• Portfolio management & market intel\n• Due diligence & scoring`;
                  case 'EXPLORER':
                    return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Review writing & feedback\n• Research & trends\n• Learning about startups & investing`;
                  case 'MESSAGING':
                    return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Writing messages\n• Smart replies & summaries\n• Follow-up reminders`;
                  case 'BOOKMARK':
                    return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Finding saved items\n• Organizing bookmarks\n• Summarizing saved content`;
                  case 'SIGNAL':
                    return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Prioritizing signals\n• Summarizing updates\n• Key events today`;
                  case 'DISCOVER':
                    return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Finding people\n• Opportunities & grants\n• Communities to join`;
                  case 'ANALYTICS':
                    return `Hello ${userName} 👋\n\nWelcome to your dedicated AI Copilot workspace!\n\nAsk me about:\n• Growth trends\n• Portfolio stats\n• My contribution data`;
                  default:
                    return `Hello ${userName} 👋\n\nWelcome to your dedicated TRIARCORA AI Copilot workspace!\n\nI can help with:\n• Exploring the platform\n• Navigating to pages\n• Startup, investing & review advice\n• And all 48 features!\n\nWhat would you like to do today?`;
                }
              };
              setMessages([{
                id: 1,
                role: 'assistant',
                content: getGreetingByPage()
              }]);
            }}
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: '20px',
              borderRadius: '12px',
              background: 'rgba(255,59,48,0.1)',
              border: '1px solid rgba(255,59,48,0.3)',
              color: '#ff3b30',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,59,48,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,59,48,0.1)';
            }}
          >
            🗑️ Clear Chat History
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '💡', text: 'Idea Brainstorming', prompt: 'Help me brainstorm startup ideas!', color: '#6c5ce7' },
              { icon: '🚀', text: 'Startup Advice', prompt: 'Give me advice for building a startup!', color: '#00b894' },
              { icon: '💰', text: 'Fundraising Help', prompt: 'How can I raise funding for my startup?', color: '#fdcb6e' },
              { icon: '📊', text: 'Analytics & Stats', prompt: 'What analytics should I track for my startup?', color: '#0984e3' },
              { icon: '📝', text: 'Content Creation', prompt: 'Help me write content for my startup!', color: '#e17055' },
              { icon: '🎯', text: 'Goal Setting', prompt: 'Help me set SMART goals for this quarter!', color: '#d63031' },
              { icon: '📚', text: 'Learning Hub', prompt: 'Teach me about startup fundamentals!', color: '#a29bfe' },
              { icon: '🎤', text: 'Pitch Deck', prompt: 'Help me create a great pitch deck!', color: '#00cec9' },
              { icon: '🔍', text: 'Market Research', prompt: 'Help me research my target market!', color: '#ff7675' },
              { icon: '🤝', text: 'Partnerships', prompt: 'What partnership opportunities should I explore?', color: '#55efc4' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(item.prompt);
                  handleSend();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  borderLeft: `4px solid ${item.color}`
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                <span style={{ color: '#fff', fontSize: '0.95rem' }}>{item.text}</span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: '32px' }}>
            <h4 style={{ color: '#FFD700', marginBottom: '16px', fontSize: '1rem' }}>
              🎭 Your Current Role
            </h4>
            <div style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                {userRole === 'Architect' ? '🏗️' : userRole === 'Catalyst' ? '💼' : '🔍'}
              </div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>
                {userRole}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,215,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 180px)'
        }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                padding: '16px 20px',
                borderRadius: msg.role === 'user' ? '20px 20px 8px 20px' : '20px 20px 20px 8px',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : 'rgba(255,255,255,0.12)',
                color: msg.role === 'user' ? '#000' : '#fff',
                fontSize: '1rem',
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap',
                boxShadow: msg.role === 'user' ? '0 4px 12px rgba(255,215,0,0.3)' : '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '16px 20px',
                borderRadius: '20px 20px 20px 8px',
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <span style={{ animation: 'pulse 1.2s infinite', fontSize: '1.4rem' }}>•</span>
                <span style={{ animation: 'pulse 1.2s infinite 0.15s', fontSize: '1.4rem' }}>•</span>
                <span style={{ animation: 'pulse 1.2s infinite 0.3s', fontSize: '1.4rem' }}>•</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{
            padding: '12px 0',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            WebkitOverflowScrolling: 'touch',
            marginBottom: '16px'
          }}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(action.prompt);
                  handleSend();
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,215,0,0.3)',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,215,0,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)';
                }}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div style={{
            padding: '20px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '16px'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isLoading ? 'Thinking...' : 'Ask TRIARCORA AI Copilot ANYTHING - I will answer EXACTLY what you ask!'}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,215,0,0.3)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  opacity: isLoading ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.6)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)'}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                style={{
                  padding: '16px 24px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                  fontSize: '1.5rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontWeight: 800,
                  opacity: isLoading ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(255,215,0,0.3)'
                }}
              >
                {isLoading ? '⏳' : '➤'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICopilotPage;
