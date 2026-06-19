import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAI, generateAIResponse } from '../contexts/AIContext';
import './AICopilot.css';

const AICopilot = () => {
  const { 
    isOpen, 
    setIsOpen, 
    messages, 
    addMessage, 
    currentContext, 
    userRole, 
    userName,
    isLoading,
    setIsLoading
  } = useAI();
  const [input, setInput] = useState('');
  const [showMoreQuickActions, setShowMoreQuickActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Contextual Quick Actions ---
  const quickActions = useMemo(() => {
    const coreActions = [
      { icon: '❓', label: 'Ask Question' },
      { icon: '🔍', label: 'Analyze' },
      { icon: '✨', label: 'Generate' },
      { icon: '📝', label: 'Summarize' }
    ];
    
    let contextActions = [];
    switch (currentContext) {
      case 'startup': contextActions = [{ icon: '🚀', label: 'Pitch Help' }, { icon: '💰', label: 'Funding Tips' }]; break;
      case 'investor': contextActions = [{ icon: '📈', label: 'Deal Analysis' }, { icon: '🔍', label: 'Find Deals' }]; break;
      case 'explorer': contextActions = [{ icon: '📝', label: 'Review Help' }, { icon: '🔍', label: 'Research' }]; break;
      case 'feed': contextActions = [{ icon: '📰', label: 'Create Post' }, { icon: '💬', label: 'Engagement' }]; break;
      case 'messages': contextActions = [{ icon: '✉️', label: 'Draft Message' }, { icon: '🔤', label: 'Rewrite' }]; break;
      case 'insights': contextActions = [{ icon: '📄', label: 'Summarize' }, { icon: '📝', label: 'Take Notes' }]; break;
      case 'profile': contextActions = [{ icon: '👤', label: 'Optimize Profile' }, { icon: '🔗', label: 'Connections' }]; break;
      default: contextActions = [{ icon: '🚀', label: 'Startups' }, { icon: '💼', label: 'Investors' }];
    }
    
    return [...coreActions, ...contextActions];
  }, [currentContext]);

  // --- Contextual Suggestions ---
  const suggestedPrompts = useMemo(() => {
    switch (currentContext) {
      case 'startup':
        return ['Validate my startup idea', 'Help with pitch deck', 'Prepare a funding plan', 'Analyze competitors', 'Generate a startup post'];
      case 'investor':
        return ['Analyze this startup', 'Estimate valuation', 'Generate investment thesis', 'Compare opportunities', 'Summarize pitch deck'];
      case 'explorer':
        return ['Review a product', 'Analyze UX', 'Research an industry', 'Discover trends', 'Write a review'];
      case 'feed':
        return ['Help me create a post', 'Summarize this post', 'Generate a response', 'Suggest engagement', 'Explain this signal'];
      case 'messages':
        return ['Rewrite this message', 'Make it professional', 'Make it friendly', 'Summarize conversation', 'Generate a reply'];
      case 'insights':
        return ['Summarize this article', 'Help create notes', 'Create an action plan', 'Generate learning path', 'Recommend resources'];
      case 'profile':
        return ['Optimize my profile', 'Improve my bio', 'Improve my headline', 'Recommend connections', 'Recommend opportunities'];
      default:
        return ['Help me analyze a startup', 'Analyze this investment', 'Can you summarize this?', 'Recommend opportunities'];
    }
  }, [currentContext]);

  // --- Scroll to Bottom ---
  useMemo(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Quick Action Handlers ---
  const handleQuickAction = (label: string) => {
    switch (label) {
      case 'Ask Question': setInput('What can you help me with?'); break;
      case 'Analyze': setInput('Help me analyze something'); break;
      case 'Generate': setInput('Help me generate some content'); break;
      case 'Summarize': setInput('Can you summarize this for me?'); break;
      case 'Pitch Help': setInput('Help me with my pitch deck'); break;
      case 'Funding Tips': setInput('Give me tips for fundraising'); break;
      case 'Deal Analysis': setInput('Help me analyze this deal'); break;
      case 'Find Deals': setInput('Help me find investment opportunities'); break;
      case 'Review Help': setInput('Help me write a review'); break;
      case 'Research': setInput('Help me research something'); break;
      case 'Create Post': setInput('Help me create a post'); break;
      case 'Engagement': setInput('Suggest engagement ideas'); break;
      case 'Draft Message': setInput('Help me draft a message'); break;
      case 'Rewrite': setInput('Help me rewrite this message'); break;
      case 'Take Notes': setInput('Help me create notes'); break;
      case 'Optimize Profile': setInput('Optimize my profile'); break;
      case 'Connections': setInput('Recommend connections for me'); break;
      case 'Startups': setInput('Tell me about startups'); break;
      case 'Investors': setInput('Tell me about investors'); break;
      default: setInput(`Tell me about ${label.toLowerCase()}`);
    }
  };

  // --- Send Message ---
  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    addMessage('user', userMessage);
    setInput('');
    setIsLoading(true);

    // Simulate fast response (<300ms)
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage, currentContext, userRole, userName, messages);
      addMessage('assistant', aiResponse);
      setIsLoading(false);
    }, 300);
  };

  return (
    <>
      {/* Global Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ai-copilot-floating-btn"
          aria-label="Open AI Copilot"
        >
          <span className="floating-btn-icon">🤖</span>
        </button>
      )}

      {/* AI Copilot Drawer */}
      {isOpen && (
        <div className="ai-copilot-overlay">
          <div className="ai-copilot-panel">
            {/* Header */}
            <div className="ai-copilot-header">
              <div className="ai-copilot-header-left">
                <div className="ai-copilot-star">✦</div>
                <div className="ai-copilot-title-section">
                  <div className="ai-copilot-title">TRIVEON AI COPILOT</div>
                  <div className="ai-copilot-subtitle">
                    {currentContext === 'startup' && 'Your startup advisor'}
                    {currentContext === 'investor' && 'Your investment analyst'}
                    {currentContext === 'explorer' && 'Your research assistant'}
                    {currentContext === 'feed' && 'Your engagement assistant'}
                    {currentContext === 'insights' && 'Your learning partner'}
                    {currentContext === 'messages' && 'Your communication partner'}
                    {currentContext === 'settings' && 'Your support assistant'}
                    {currentContext === 'profile' && 'Your growth advisor'}
                    {!['startup', 'investor', 'explorer', 'feed', 'insights', 'messages', 'settings', 'profile'].includes(currentContext) && 'Your intelligent partner'}
                  </div>
                  <div className="ai-copilot-tagline">Ask anything. Discover everything.</div>
                </div>
              </div>
              <div className="ai-copilot-header-right">
                <button onClick={() => setIsOpen(false)} className="ai-copilot-close-btn" aria-label="Close AI Copilot">
                  ✕
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="ai-copilot-quick-actions">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.label)}
                  className="ai-copilot-quick-btn"
                >
                  <span className="quick-icon">{action.icon}</span>
                  <span className="quick-label">{action.label}</span>
                </button>
              ))}
              <button
                className="ai-copilot-quick-btn more-btn"
                onClick={() => setShowMoreQuickActions(!showMoreQuickActions)}
              >
                <span className="quick-icon">•••</span>
                <span className="quick-label">More</span>
              </button>
            </div>

            {/* More Quick Actions */}
            {showMoreQuickActions && (
              <div className="ai-copilot-more-quick-actions">
                {[
                  { icon: '👥', label: 'Connections' },
                  { icon: '📚', label: 'Resources' },
                  { icon: '💡', label: 'Explain' },
                  { icon: '🧭', label: 'Navigate' }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.label)}
                    className="ai-copilot-quick-btn"
                  >
                    <span className="quick-icon">{action.icon}</span>
                    <span className="quick-label">{action.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div className="ai-copilot-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`ai-copilot-message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  <div className="ai-copilot-avatar">
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="ai-copilot-bubble" style={{ whiteSpace: 'pre-line' }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="ai-copilot-message ai-message">
                  <div className="ai-copilot-avatar">🤖</div>
                  <div className="ai-copilot-bubble ai-copilot-typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            {messages.length <= 5 && (
              <div className="ai-copilot-suggestions">
                {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInput(prompt)}
                  className="ai-copilot-suggestion-btn"
                >
                  {prompt}
                </button>
              ))}
            </div>
            )}

            {/* Input Area */}
            <div className="ai-copilot-input-area">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask TRIVEON AI anything..."
                className="ai-copilot-input"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="ai-copilot-send-btn"
                aria-label="Send message"
              >
                {isLoading ? '...' : '➤'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AICopilot;
