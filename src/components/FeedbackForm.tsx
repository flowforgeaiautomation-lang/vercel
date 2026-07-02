import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './FeedbackForm.css';

interface FeedbackFormProps {
  startupName?: string;
  feedbackCategory?: string;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  startupName = 'Startup', 
  feedbackCategory = 'Product', 
  onClose, 
  onSubmit 
}) => {
  const { profile } = useAuth();
  const [rating, setRating] = useState(0);
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [suggestions, setSuggestions] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ rating, strengths, weaknesses, suggestions, category: feedbackCategory, startup: startupName });
    }
    onClose();
  };

  return (
    <div className="feedback-form-overlay" onClick={onClose}>
      <div className="feedback-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-form-header">
          <div>
            <h2>Give Feedback</h2>
            <p className="feedback-subtitle">Share your thoughts on {startupName}</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Rating</label>
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star}
                  type="button"
                  className={`rating-star ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Strengths</label>
            <textarea 
              className="form-textarea"
              placeholder="What did you like about this startup?"
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Weaknesses</label>
            <textarea 
              className="form-textarea"
              placeholder="What could be improved?"
              value={weaknesses}
              onChange={(e) => setWeaknesses(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Suggestions</label>
            <textarea 
              className="form-textarea"
              placeholder="Do you have any specific suggestions?"
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!profile?.isVerified}
            >
              {!profile?.isVerified ? 'Verify Email to Submit' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
