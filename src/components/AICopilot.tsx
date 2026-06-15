import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

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

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        role: 'assistant',
        content: 'Hi! I\'m your TRIARCORA AI Copilot!\n\nType "1" = Home\nType "2" = Startup Studio\nType "3" = My Startup\nType "4" = Investor Hub\nType "5" = Profile\n\nOr ask me anything!'
      }])
    }
  }, [isOpen])

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

    const lower = input.toLowerCase().trim()

    if (lower === '1' || lower.includes('home')) {
      navigate('/home')
      setMessages(prev => [...prev, { id: prev.length + 1, role: 'assistant', content: '✅ Navigating to Home!' }])
      setIsLoading(false)
      return
    }
    if (lower === '2' || lower.includes('startup studio')) {
      navigate('/startup-studio')
      setMessages(prev => [...prev, { id: prev.length + 1, role: 'assistant', content: '✅ Navigating to Startup Studio!' }])
      setIsLoading(false)
      return
    }
    if (lower === '3' || lower.includes('my startup')) {
      navigate('/my-startup')
      setMessages(prev => [...prev, { id: prev.length + 1, role: 'assistant', content: '✅ Navigating to My Startup!' }])
      setIsLoading(false)
      return
    }
    if (lower === '4' || lower.includes('investor')) {
      navigate('/investors')
      setMessages(prev => [...prev, { id: prev.length + 1, role: 'assistant', content: '✅ Navigating to Investor Hub!' }])
      setIsLoading(false)
      return
    }
    if (lower === '5' || lower.includes('profile')) {
      navigate('/profile')
      setMessages(prev => [...prev, { id: prev.length + 1, role: 'assistant', content: '✅ Navigating to Profile!' }])
      setIsLoading(false)
      return
    }
    if (lower.includes('messages') || lower.includes('chat')) {
      navigate('/messages')
      setMessages(prev => [...prev, { id: prev.length + 1, role: 'assistant', content: '✅ Navigating to Messages!' }])
      setIsLoading(false)
      return
    }
    if (lower.includes('bookmark') || lower.includes('saved')) {
      navigate('/bookmarks')
      setMessages(prev => [...prev, { id: prev.length + 1, role: 'assistant', content: '✅ Navigating to Bookmarks!' }])
      setIsLoading(false)
      return
    }

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      if (apiKey) {
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
              { role: 'system', content: 'You are a helpful, friendly, concise assistant for TRIARCORA startup platform.' },
              ...messages.map(m => ({ role: m.role, content: m.content })),
              userMsg
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        })

        if (response.ok) {
          const data = await response.json()
          setMessages(prev => [...prev, {
            id: prev.length + 1,
            role: 'assistant',
            content: data.choices[0].message.content
          }])
          setIsLoading(false)
          return
        }
      }
    } catch (e) {
      console.error(e)
    }

    setMessages(prev => [...prev, {
      id: prev.length + 1,
      role: 'assistant',
      content: 'Got it! I\'m here to help! Try typing a number 1-5 to navigate!'
    }])
    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px',
      right: '20px',
      width: '400px',
      maxWidth: '95vw',
      height: '600px',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid rgba(255,215,0,0.3)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🧠
          </div>
          <div style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>TRIARCORA AI</div>
        </div>
        <button onClick={onClose} style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '1.8rem',
          cursor: 'pointer',
          padding: '4px 10px'
        }}>×</button>
      </div>

      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            padding: '12px 16px',
            borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            background: msg.role === 'user' ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : 'rgba(255,255,255,0.1)',
            color: msg.role === 'user' ? '#000' : '#fff',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap'
          }}>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div style={{
            alignSelf: 'flex-start',
            padding: '12px 16px',
            borderRadius: '18px 18px 18px 4px',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            display: 'flex',
            gap: '6px',
            alignItems: 'center'
          }}>
            <span style={{ animation: 'pulse 1.2s infinite' }}>•</span>
            <span style={{ animation: 'pulse 1.2s infinite 0.15s' }}>•</span>
            <span style={{ animation: 'pulse 1.2s infinite 0.3s' }}>•</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.3)',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isLoading ? 'Thinking...' : 'Type 1-5 or ask anything...'}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
              opacity: isLoading ? 0.5 : 1
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            style={{
              padding: '12px 22px',
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#000',
              fontSize: '1.2rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 800,
              opacity: isLoading ? 0.5 : 1
            }}
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AICopilot
