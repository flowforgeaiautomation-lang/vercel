import { useState, useRef, useEffect } from 'react';

interface AICopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

const AICopilot = ({ isOpen, onClose }: AICopilotProps) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your TRIVEON AI Copilot. How can I help you today? Whether you need help finding startups, understanding the platform, or anything else, I\'m here!'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great question! Let me help you with that. You can explore startups in the Discover tab.",
        "I understand! The Prestige system rewards active users with badges and perks.",
        "That's a good point! You can connect with other users in the Community section.",
        "Perfect! Have you tried the AI Recommendations yet? They're tailored just for you."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        role: 'assistant',
        content: randomResponse
      }]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '380px',
      maxWidth: '90vw',
      height: '500px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid rgba(255,215,0,0.2)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" />
            </svg>
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>AI Copilot</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>Always here to help</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '16px',
              background: msg.role === 'user' 
                ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' 
                : 'rgba(255,255,255,0.08)',
              color: msg.role === 'user' ? '#000' : '#fff',
              fontSize: '0.9rem',
              lineHeight: 1.5
            }}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        background: 'rgba(0,0,0,0.2)',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '12px 20px',
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#000',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICopilot;
