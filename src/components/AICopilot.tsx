import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import './AICopilot.css'

interface AICopilotProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

const AICopilot = ({ isOpen, onClose }: AICopilotProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { userData } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showMoreQuickActions, setShowMoreQuickActions] = useState(false)

  const userName = userData?.profile?.name || 'Unnati'
  const userRole = userData?.mainRole || 'User'

  useEffect(() => {
    if (isOpen && messages.length === 0) {
    }
  }, [isOpen, userName])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg: Message = { id: messages.length + 1, role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const responses = [
        `Great question! I'm here to help with that.`,
        `Absolutely! Let's explore that together.`,
        `Got it! I'll help you with that.`,
        `Interesting! Let's dive into this.`
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages(prev => [...prev, { id: prev.length + 1, role: 'assistant', content: randomResponse }])
      setIsLoading(false)
    }, 1000)
  }

  const quickActions = [
    { icon: '🚀', label: 'Startups' },
    { icon: '💼', label: 'Investors' },
    { icon: '💰', label: 'Funding' },
    { icon: '📊', label: 'Market Insights' },
  ]

  const moreQuickActions = [
    { icon: '🌐', label: 'Communities' },
    { icon: '📚', label: 'Knowledge Hub' },
    { icon: '⭐', label: 'Trending' },
  ]

  const suggestedPrompts = [
    'Find startups looking for seed funding in AI space',
    'Show me top investors who invest in SaaS startups',
  ]

  if (!isOpen) return null

  return (
    <div className="ai-copilot-container">
      <div className="ai-copilot-header">
        <div className="ai-copilot-header-left">
          <div className="ai-copilot-star">✦</div>
          <div className="ai-copilot-title-section">
            <div className="ai-copilot-title">TRIVEON AI COPILOT</div>
            <div className="ai-copilot-subtitle">Your intelligent partner across the TRIVEON ecosystem.</div>
            <div className="ai-copilot-tagline">Ask anything. Discover everything.</div>
          </div>
        </div>
        <div className="ai-copilot-header-right">
          <button className="ai-copilot-minimize">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
          <button className="ai-copilot-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className="ai-copilot-content">
        {messages.length === 0 && (
          <div className="ai-copilot-welcome">
            <div className="ai-copilot-icon-container">
              <div className="ai-copilot-icon-glow-outer"></div>
              <div className="ai-copilot-icon-glow-inner"></div>
              <div className="ai-copilot-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
                </svg>
              </div>
              <div className="ai-copilot-badge">AI</div>
            </div>
            <div className="ai-copilot-greeting">
              <span className="hello-text">Hello,</span>
              <span className="name-text">{userName}</span>
              <span className="crown">👑</span>
            </div>
            <div className="ai-copilot-sub-greeting">How can I help you today?</div>
          </div>
        )}

        <div className="ai-copilot-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`ai-copilot-message ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="ai-copilot-avatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
                  </svg>
                </div>
              )}
              <div className="ai-copilot-message-content">{msg.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="ai-copilot-message assistant">
              <div className="ai-copilot-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
                </svg>
              </div>
              <div className="ai-copilot-typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 0 && (
          <>
            <div className="ai-copilot-quick-actions">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInput(`Tell me about ${action.label.toLowerCase()}`)
                  }}
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

            {showMoreQuickActions && (
              <div className="ai-copilot-more-actions">
                {moreQuickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(`Tell me about ${action.label.toLowerCase()}`)
                    }}
                    className="ai-copilot-quick-btn"
                  >
                    <span className="quick-icon">{action.icon}</span>
                    <span className="quick-label">{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {messages.length === 0 && (
          <div className="ai-copilot-suggestions">
            <div className="suggestions-title">TRY THESE</div>
            <div className="suggestions-list">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInput(prompt)
                  }}
                  className="suggestion-item"
                >
                  <div className="suggestion-icon">✦</div>
                  <div className="suggestion-text">{prompt}</div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="ai-copilot-input-section">
        <div className="ai-copilot-input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="ai-copilot-input"
          />
        </div>

        {messages.length === 0 && (
          <div className="ai-copilot-input-actions">
            <button className="input-action-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <button className="input-action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14,9V5a3,3,0,0,0-3-3l-4,9v11h11.28a2,2,0,0,0,2-1.7l1.38-9a2,2,0,0,0-2-2.3ZM7,22H4a2,2,0,0,1-2-2v-7a2,2,0,0,1,2-2H9" />
              </svg>
              <span>Deep Research</span>
            </button>
            <button className="input-action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
              </svg>
              <span>Analyze</span>
            </button>
            <button className="input-action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44,11.05l-9.19,9.19a6,6,0,0,1-8.49-8.49l9.19-9.19a4,4,0,0,1,5.66,5.66l-9.2,9.19a2,2,0,0,1-2.83-2.83l8.49-8.48" />
              </svg>
              <span>Suggest</span>
            </button>
          </div>
        )}

        <div className="ai-copilot-input-right">
          <button className="ai-copilot-mic-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12,3a3,3,0,0,0-3,3v5a3,3,0,0,0,6,0V6a3,3,0,0,0-3-3Z" />
              <path d="M19,10v2a7,7,0,0,1-14,0V10" />
              <line x1="12" y1="21" x2="12" y2="18" />
              <line x1="8" y1="21" x2="16" y2="21" />
            </svg>
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="ai-copilot-send-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22,2L11,13" />
              <path d="M22,2l-7,20-4-9-9-4,20-7Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="ai-copilot-footer">
        <div className="ai-copilot-disclaimer">
          AI Copilot can make mistakes. Please verify important information.
        </div>
      </div>
    </div>
  )
}

export default AICopilot