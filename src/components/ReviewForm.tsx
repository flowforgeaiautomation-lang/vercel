import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './ReviewForm.css';

interface ReviewFormProps {
  startupName?: string;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

const REVIEW_CATEGORIES = [
  { id: 'productQuality', name: 'Product Quality', icon: '📦' },
  { id: 'innovation', name: 'Innovation', icon: '💡' },
  { id: 'userExperience', name: 'User Experience', icon: '🎨' },
  { id: 'marketPotential', name: 'Market Potential', icon: '📈' },
  { id: 'execution', name: 'Execution', icon: '🚀' },
  { id: 'trust', name: 'Trust', icon: '🤝' },
];

const ReviewForm: React.FC<ReviewFormProps> = ({ startupName = 'Startup', onClose, onSubmit }) => {
  const { profile } = useAuth();
  const [ratings, setRatings] = useState<Record<string, number>>({
    productQuality: 0,
    innovation: 0,
    userExperience: 0,
    marketPotential: 0,
    execution: 0,
    trust: 0,
  });
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        startupName,
        ratings,
        reviewText,
        isVerified: profile?.isVerified,
        submittedAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  const handleRatingChange = (category: string, rating: number) => {
    setRatings(prev => ({ ...prev, [category]: rating }));
  };

  const getOverallRating = () => {
    const values = Object.values(ratings);
    if (values.length === 0) return 0;
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <div className="review-form-overlay" onClick={onClose}>
      <div className="review-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="review-form-header">
          <div>
            <h2>Write a Review</h2>
            <p className="review-subtitle">Share your experience with {startupName}</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form className="review-form" onSubmit={handleSubmit}>
          <div className="overall-rating-section">
            <h3>Overall Rating</h3>
            <div className="overall-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`overall-star ${
                    star <= Math.round(parseFloat(getOverallRating())) ? 'filled' : ''
                  }`}
                  disabled
                >
                  ★
                </button>
              ))}
              <span className="overall-score">{getOverallRating()}</span>
            </div>
          </div>

          <div className="categories-section">
            <h3>Category Ratings</h3>
            <div className="categories-grid">
              {REVIEW_CATEGORIES.map(category => (
                <div key={category.id} className="category-item">
                  <div className="category-header">
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                  </div>
                  <div className="category-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`category-star ${ratings[category.id] >= star ? 'filled' : ''}`}
                        onClick={() => handleRatingChange(category.id, star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="review-text-section">
            <h3>Your Review</h3>
            <textarea
              className="review-textarea"
              placeholder="Share your detailed experience with this startup..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              rows={6}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="submit-btn"
              disabled={!profile?.isVerified || !reviewText.trim()}
            >
              {!profile?.isVerified ? 'Verify Email to Post' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
