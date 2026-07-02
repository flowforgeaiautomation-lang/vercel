import React, { useState } from 'react';
import { submitReport, Report } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import './ReportModal.css';

const REPORT_REASONS = [
  'Scam',
  'Fake Information',
  'Harassment',
  'Spam',
  'Impersonation',
  'Copyright Violation',
  'Hate Content',
  'Fraudulent Investment Claim',
  'Fake Startup Claim',
  'Other'
];

interface ReportModalProps {
  targetId: string;
  targetType: Report['targetType'];
  targetName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ targetId, targetType, targetName, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!user || !selectedReason) return;
    setSubmitting(true);
    try {
      await submitReport({
        reporterId: user.uid,
        targetId,
        targetType,
        reason: selectedReason,
        description
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 2000);
    } catch (e) {
      console.error('Error submitting report:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const typeLabel = targetType.charAt(0).toUpperCase() + targetType.slice(1);

  return (
    <div className="rm-overlay" onClick={onClose}>
      <div className="rm-modal" onClick={e => e.stopPropagation()}>
        <div className="rm-header">
          <h2 className="rm-title">Report {typeLabel}</h2>
          {targetName && <p className="rm-subtitle">"{targetName}"</p>}
          <button className="rm-close" onClick={onClose}>✕</button>
        </div>

        {submitted ? (
          <div className="rm-success">
            <div className="rm-success-icon">✓</div>
            <h3>Report Submitted</h3>
            <p>Thank you. Our trust & safety team will review this.</p>
          </div>
        ) : (
          <>
            <div className="rm-body">
              <p className="rm-label">Select a reason</p>
              <div className="rm-reasons">
                {REPORT_REASONS.map(reason => (
                  <button
                    key={reason}
                    className={`rm-reason-btn ${selectedReason === reason ? 'selected' : ''}`}
                    onClick={() => setSelectedReason(reason)}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <p className="rm-label rm-label-mt">Additional details (optional)</p>
              <textarea
                className="rm-textarea"
                placeholder="Describe the issue..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="rm-footer">
              <button className="rm-btn-cancel" onClick={onClose}>Cancel</button>
              <button
                className="rm-btn-submit"
                onClick={handleSubmit}
                disabled={!selectedReason || submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
