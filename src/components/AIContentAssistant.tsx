import React, { useState } from 'react';
import './AIContentAssistant.css';

interface AIContentAssistantProps {
  initialContent: string;
  onUpdateContent: (newContent: string) => void;
}

const AIContentAssistant: React.FC<AIContentAssistantProps> = ({ initialContent, onUpdateContent }) => {
  const [showAssistantOpen, setShowAssistantOpen] = useState(false);
  const [content, setContent] = useState(initialContent);

  const handleImprove = async () => {
    const improved = `[Improved] ${content}`;
    setContent(improved);
    onUpdateContent(improved);
  };

  const handleShorten = async () => {
    const shortened = content.length > 100 ? content.substring(0, 100) + '...' : content;
    setContent(shortened);
    onUpdateContent(shortened);
  };

  const handleExpand = async () => {
    const expanded = `${content} [Expanded content with more details...`;
    setContent(expanded);
    onUpdateContent(expanded);
  };

  const handleProfessionalize = async () => {
    const professional = `[Professional Tone] ${content}`;
    setContent(professional);
    onUpdateContent(professional);
  };

  return (
    <div className="ai-content-assistant">
      <button
        onClick={() => setShowAssistantOpen(!showAssistantOpen)}
        className="ai-assistant-toggle"
      >
        ✨ AI Assistant
      </button>
      {showAssistantOpen && (
        <div className="ai-assistant-panel">
          <h4>AI Content Assistant</h4>
          <div className="ai-assistant-actions">
            <button onClick={handleImprove} className="ai-action-btn">✨ Improve</button>
            <button onClick={handleShorten} className="ai-action-btn">✂️ Shorten</button>
            <button onClick={handleExpand} className="ai-action-btn">📝 Expand</button>
            <button onClick={handleProfessionalize} className="ai-action-btn">💼 Professional</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContentAssistant;
