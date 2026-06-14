import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext';
import './CreateExplorerPost.css';

interface CreateExplorerPostProps {
  onClose?: () => void;
}

interface HashtagSuggestion {
  tag: string;
  isTrending: boolean;
  ecosystemReach: string;
  investorInterest: number;
  trendVelocity: number;
  category: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  type: string;
}

const CreateExplorerPost: React.FC<CreateExplorerPostProps> = ({ onClose }) => {
  console.log('CreateExplorerPost RENDERED!');
  const { userData } = useUser();
  const { addPost } = usePosts();

  const loadDraft = () => {
    const savedDraft = localStorage.getItem('explorerCreatePostDraft');
    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      return {
        selectedPostType: parsed.selectedPostType || 'Startup Review',
        selectedIntent: parsed.selectedIntent || 'Giving Feedback',
        description: parsed.description || '',
        visibility: parsed.visibility || 'Public',
        selectedTags: parsed.selectedTags || ['StartupReview', 'Feedback', 'AI']
      };
    }
    return {
      selectedPostType: 'Startup Review',
      selectedIntent: 'Giving Feedback',
      description: '',
      visibility: 'Public',
      selectedTags: ['StartupReview', 'Feedback', 'AI']
    };
  };

  const draft = loadDraft();

  const [selectedPostType, setSelectedPostType] = useState(draft.selectedPostType);
  const [selectedIntent, setSelectedIntent] = useState(draft.selectedIntent);
  const [description, setDescription] = useState(draft.description);
  const [visibility, setVisibility] = useState(draft.visibility);
  const [selectedTags, setSelectedTags] = useState<string[]>(draft.selectedTags);
  const [customTagInput, setCustomTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const userName = userData?.profile?.name || 'Alex Rivera';
  const userAvatar = userData?.profile?.profileImage;
  const userTitle = 'Explorer & Community Contributor';

  useEffect(() => {
    const draftData = {
      selectedPostType,
      selectedIntent,
      description,
      visibility,
      selectedTags
    };
    localStorage.setItem('explorerCreatePostDraft', JSON.stringify(draftData));
  }, [selectedPostType, selectedIntent, description, visibility, selectedTags]);

  const hashtagDatabase: HashtagSuggestion[] = [
    { tag: 'StartupReview', isTrending: true, ecosystemReach: '15.3K', investorInterest: 95, trendVelocity: 92, category: 'Status' },
    { tag: 'Feedback', isTrending: true, ecosystemReach: '18.5K', investorInterest: 90, trendVelocity: 85, category: 'Status' },
    { tag: 'Research', isTrending: true, ecosystemReach: '14.2K', investorInterest: 90, trendVelocity: 85, category: 'Category' },
    { tag: 'AI', isTrending: true, ecosystemReach: '15.3K', investorInterest: 95, trendVelocity: 92, category: 'Category' },
    { tag: 'FinTech', isTrending: true, ecosystemReach: '12.8K', investorInterest: 90, trendVelocity: 85, category: 'Category' },
    { tag: 'MarketInsight', isTrending: true, ecosystemReach: '11.5K', investorInterest: 88, trendVelocity: 82, category: 'Status' },
    { tag: 'FounderFeedback', isTrending: true, ecosystemReach: '10.7K', investorInterest: 88, trendVelocity: 79, category: 'Status' },
    { tag: 'Discovery', isTrending: true, ecosystemReach: '13.6K', investorInterest: 85, trendVelocity: 80, category: 'Status' }
  ];

  const [tagSuggestions, setTagSuggestions] = useState<HashtagSuggestion[]>(hashtagDatabase.slice(0, 5));

  const postTypes = [
    'Startup Review',
    'Product Feedback',
    'Research Insight',
    'Market Observation',
    'Explorer Discovery',
    'Community Discussion',
    'Learning Post',
    'Founder Feedback',
    'Startup Recommendation',
    'Trend Analysis'
  ];

  const intents = [
    'Giving Feedback',
    'Sharing Insight',
    'Helping Founders',
    'Starting Discussion',
    'Sharing Discovery',
    'Learning Together'
  ];

  const categoryTags = [
    { name: 'AI', color: 'purple' },
    { name: 'FinTech', color: 'blue' },
    { name: 'HealthTech', color: 'pink' },
    { name: 'ClimateTech', color: 'green' },
    { name: 'SaaS', color: 'cyan' },
    { name: 'Web3', color: 'orange' }
  ];

  const statusTags = [
    { name: 'StartupReview', color: 'blue' },
    { name: 'Feedback', color: 'green' },
    { name: 'Research', color: 'purple' },
    { name: 'MarketInsight', color: 'cyan' },
    { name: 'FounderFeedback', color: 'pink' },
    { name: 'Discovery', color: 'orange' }
  ];

  const stageTags = [
    { name: 'PreSeed', color: 'orange' },
    { name: 'Seed', color: 'green' },
    { name: 'SeriesA', color: 'blue' },
    { name: 'SeriesB', color: 'purple' }
  ];

  useEffect(() => {
    if (customTagInput.length > 0) {
      setShowTagSuggestions(true);
      const filtered = hashtagDatabase.filter(h =>
        h.tag.toLowerCase().includes(customTagInput.toLowerCase())
      );
      setTagSuggestions(filtered.length > 0 ? filtered : hashtagDatabase.slice(0, 5));
    } else {
      setShowTagSuggestions(false);
      setTagSuggestions(hashtagDatabase.slice(0, 5));
    }
  }, [customTagInput]);

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(t => t !== tagName);
      } else {
        return [...prev, tagName];
      }
    });
  };

  const getTagColor = (tagName: string) => {
    const allTags = [...categoryTags, ...statusTags, ...stageTags];
    const found = allTags.find(t => t.name === tagName);
    return found?.color || 'blue';
  };

  const MAX_TAG_LENGTH = 30;
  const MAX_TAGS = 10;

  const addCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (!trimmed) return;

    if (trimmed.length > MAX_TAG_LENGTH) {
      setValidationErrors([`Tag "${trimmed}" is too long (max ${MAX_TAG_LENGTH} characters)`]);
      setTimeout(() => setValidationErrors([]), 5000);
      return;
    }

    if (selectedTags.includes(trimmed)) {
      setValidationErrors([`Tag "${trimmed}" already exists`]);
      setTimeout(() => setValidationErrors([]), 5000);
      return;
    }

    if (selectedTags.length >= MAX_TAGS) {
      setValidationErrors([`Maximum ${MAX_TAGS} tags allowed`]);
      setTimeout(() => setValidationErrors([]), 5000);
      return;
    }

    setSelectedTags(prev => [...prev, trimmed]);
    setCustomTagInput('');
    setShowTagSuggestions(false);
  };

  const handleCustomTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  };

  const getInterestLevel = (score: number) => {
    if (score >= 90) return 'Very High';
    if (score >= 75) return 'High';
    if (score >= 60) return 'Medium';
    return 'Moderate';
  };

  const getVelocityIndicator = (score: number) => {
    if (score >= 85) return '🚀';
    if (score >= 70) return '📈';
    if (score >= 50) return '➡️';
    return '📉';
  };

  const handleAiWrite = () => {
    if (!aiInput.trim()) return;
    setIsAiTyping(true);
    setTimeout(() => {
      let generatedPost = '';

      if (selectedPostType === 'Startup Review') {
        generatedPost = `📝 I just tried this startup and wanted to share my thoughts!\n\n${aiInput}\n\nOverall, I think they have a lot of potential. Would love to hear other people's experiences!\n\n#StartupReview #Feedback ${selectedTags.map(t => `#${t}`).join(' ')}`;
      } else if (selectedPostType === 'Product Feedback') {
        generatedPost = `💬 Some feedback on this product:\n\n${aiInput}\n\nI hope this helps the team make it even better!\n\n#Feedback ${selectedTags.map(t => `#${t}`).join(' ')}`;
      } else {
        generatedPost = `💡 ${selectedPostType}!\n\n${aiInput}\n\nLet's discuss in the comments!\n\n${selectedTags.map(t => `#${t}`).join(' ')}`;
      }

      setDescription(generatedPost);
      setIsAiTyping(false);
      setAiCopilotOpen(false);
    }, 1800);
  };

  const handleAiImprove = () => {
    if (!description.trim()) return;
    setIsAiTyping(true);
    setTimeout(() => {
      let improvements = '';

      if (description.length < 100) {
        improvements += '\n• Expanded content for better engagement';
      }
      if (!description.includes('#')) {
        improvements += '\n• Added relevant hashtags';
      }
      if (!/[.!?]$/.test(description.trim())) {
        improvements += '\n• Improved sentence structure';
      }

      const improvedPost = description + `\n\n---\n✨ Enhanced by TRIVEON AI:${improvements || '\n• Optimized readability and flow'}\n• Added clear call-to-action\n• Improved engagement potential\n\n${selectedTags.map(t => `#${t}`).join(' ')}`;

      setDescription(improvedPost);
      setIsAiTyping(false);
      setAiCopilotOpen(false);
    }, 1500);
  };

  const handleAiMakeShorter = () => {
    if (!description.trim()) return;
    setIsAiTyping(true);
    setTimeout(() => {
      const sentences = description.split(/[.!?]+/).filter(s => s.trim());
      const shorterPost = sentences.slice(0, 3).join('. ') + '.';
      setDescription(shorterPost);
      setIsAiTyping(false);
      setAiCopilotOpen(false);
    }, 1000);
  };

  const handleAiAddCTA = () => {
    if (!description.trim()) return;
    setIsAiTyping(true);
    setTimeout(() => {
      let cta = '';
      if (selectedIntent === 'Giving Feedback') {
        cta = '\n\nI hope this feedback helps! Let me know your thoughts too!';
      } else if (selectedIntent === 'Sharing Insight') {
        cta = '\n\nWhat do you think about this? Let\'s discuss in the comments!';
      } else {
        cta = '\n\nWould love to hear from the community!';
      }
      setDescription(description + cta);
      setIsAiTyping(false);
      setAiCopilotOpen(false);
    }, 800);
  };

  const handleAiFixMistakes = () => {
    if (!description.trim()) return;
    setIsAiTyping(true);
    setTimeout(() => {
      let fixedPost = description
        .replace(/\bi\b/g, 'I')
        .replace(/\bu\b/g, 'you')
        .replace(/\bthats\b/g, "that's")
        .replace(/\bdont\b/g, "don't")
        .replace(/\bwont\b/g, "won't")
        .replace(/\bcant\b/g, "can't")
        .replace(/\bisnt\b/g, "isn't")
        .replace(/\bwerent\b/g, "weren't");

      fixedPost = fixedPost.replace(/(^|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());

      fixedPost += '\n\n✨ Checked and improved by TRIVEON AI';

      setDescription(fixedPost);
      setIsAiTyping(false);
      setAiCopilotOpen(false);
    }, 1200);
  };

  const handlePublish = () => {
    addPost({
      userId: userData?.uid || 'demo-explorer',
      userName,
      userAvatar,
      userRole: 'EXPLORER',
      userTitle,
      postType: selectedPostType,
      intent: selectedIntent,
      description,
      tags: selectedTags
    });
    if (onClose) {
      onClose();
    }
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'video/mp4',
    'video/webm',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const validateFiles = (files: File[]): { valid: File[], errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File size exceeds 10MB limit`);
      } else if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|gif|webp|pdf|mp4|webm|doc|docx)$/i)) {
        errors.push(`${file.name}: File type not allowed`);
      } else {
        valid.push(file);
      }
    });

    return { valid, errors };
  };

  const processFiles = (files: File[]) => {
    const { valid, errors } = validateFiles(files);

    if (errors.length > 0) {
      setValidationErrors(errors);
      setTimeout(() => setValidationErrors([]), 5000);
    }

    if (valid.length > 0) {
      const newFiles: UploadedFile[] = valid.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        type: file.type.split('/')[1].toUpperCase() || file.name.split('.').pop()?.toUpperCase() || 'FILE'
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(file => file.id !== id);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  const clearDraft = () => {
    localStorage.removeItem('explorerCreatePostDraft');
    setSelectedPostType('Startup Review');
    setSelectedIntent('Giving Feedback');
    setDescription('');
    setVisibility('Public');
    setSelectedTags(['StartupReview', 'Feedback', 'AI']);
  };

  return (
    <div className="create-post-overlay" style={{ zIndex: 100000, display: 'flex' }} onClick={() => console.log('Overlay clicked!')}>
      <div className="create-post-modal role-explorer">
        <div className="create-post-header">
          <div className="create-post-header-left">
            <h1 className="create-post-title">Create Signal</h1>
            <p className="create-post-subtitle">Share your insight with the ecosystem 💙</p>
          </div>
          <div className="create-post-header-right">
            <button className="ai-copilot-trigger-btn" onClick={() => setAiCopilotOpen(!aiCopilotOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" />
              </svg>
              AI Copilot
            </button>
            <button className="clear-draft-btn" onClick={clearDraft}>Clear Draft</button>
            <button className="save-draft-btn" onClick={onClose}>Save Draft</button>
            <button className="close-modal-btn" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {aiCopilotOpen && (
          <div className="ai-copilot-panel">
            <div className="ai-copilot-panel-header">
              <div className="ai-copilot-panel-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" />
                </svg>
              </div>
              <div className="ai-copilot-panel-title">
                <strong>TRIVEON AI Copilot</strong>
                <span>Your intelligent writing assistant</span>
              </div>
            </div>

            <div className="ai-copilot-quick-actions">
              <button className="ai-action-btn" onClick={handleAiImprove} disabled={!description.trim() || isAiTyping}>
                ✨ Improve current post
              </button>
              <button className="ai-action-btn" onClick={handleAiMakeShorter} disabled={!description.trim() || isAiTyping}>
                📝 Make it shorter
              </button>
              <button className="ai-action-btn" onClick={handleAiAddCTA} disabled={!description.trim() || isAiTyping}>
                🎯 Add call-to-action
              </button>
              <button className="ai-action-btn" onClick={handleAiFixMistakes} disabled={!description.trim() || isAiTyping}>
                ✅ Fix grammar & mistakes
              </button>
              <button className="ai-action-btn" onClick={() => {
                setDescription(`📝 Just wanted to share my thoughts on this startup:\n\n${aiInput || 'I really like their product and think they have great potential!'}\n\nWould love to hear what other explorers think!\n\n#StartupReview #Feedback ${selectedTags.map(t => `#${t}`).join(' ')}`);
              }}>
                📝 Generate review
              </button>
              <button className="ai-action-btn" onClick={() => {
                setDescription(`💬 Feedback on this product:\n\n${aiInput || 'Great features, but there are a few things I think could be improved!'}\n\nI hope this helps the team make it even better!\n\n#Feedback ${selectedTags.map(t => `#${t}`).join(' ')}`);
              }}>
                💬 Generate feedback
              </button>
            </div>

            <div className="ai-copilot-input-area">
              <input
                type="text"
                className="ai-copilot-input"
                placeholder="Tell AI what to write (e.g., 'Create a post about a startup I tried')"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAiWrite();
                }}
              />
              <button className="ai-copilot-generate-btn" onClick={handleAiWrite} disabled={!aiInput.trim() || isAiTyping}>
                {isAiTyping ? (
                  <span className="ai-loading-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </span>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5,3 19,12 5,21 5,3" />
                    </svg>
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="create-post-user-header">
          <div className="user-avatar-wrapper">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}>
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-info">
            <div className="user-name-row">
              <h2 className="user-name">{userName}</h2>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#3B82F6' }}>
                <path d="M12 0C5.37 0 0 5.37 0 12C0 18.63 5.37 24 12 24C18.63 24 24 18.63 24 12C24 5.37 18.63 0 12 0ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
              </svg>
            </div>
            <p className="user-title">{userTitle}</p>
            <div className="user-badges">
              <span className="user-badge">Explorer</span>
              <span className="user-meta">💙 Sovereign Tier • Trust Index 94</span>
            </div>
          </div>
        </div>

        <div className="post-type-selector">
          {postTypes.map((type) => (
            <div
              key={type}
              className={`post-type-card ${selectedPostType === type ? 'selected' : ''}`}
              onClick={() => setSelectedPostType(type)}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {type === 'Startup Review' && (
                  <>
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  </>
                )}
                {type === 'Product Feedback' && (
                  <>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </>
                )}
                {type === 'Research Insight' && (
                  <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </>
                )}
                {type === 'Market Observation' && (
                  <>
                    <path d="M3 3v18h18" />
                    <path d="M18 17l-4-4-4 4-6-6" />
                  </>
                )}
                {type === 'Explorer Discovery' && (
                  <>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                  </>
                )}
                {type === 'Community Discussion' && (
                  <>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </>
                )}
                {type === 'Learning Post' && (
                  <>
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l-6 3.46M12 14l6 3.46M12 7v14" />
                  </>
                )}
                {type === 'Founder Feedback' && (
                  <>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </>
                )}
                {type === 'Startup Recommendation' && (
                  <>
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  </>
                )}
                {type === 'Trend Analysis' && (
                  <>
                    <path d="M3 3v18h18" />
                    <path d="M18 17l-4-4-4 4-6-6" />
                  </>
                )}
              </svg>
              <span>{type}</span>
            </div>
          ))}
        </div>

        <div className="description-section">
          <div className="section-title-row">
            <h3 className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              What are you sharing?
            </h3>
          </div>
          <div className="textarea-wrapper">
            <textarea
              className="description-textarea"
              placeholder="Share feedback, analysis, insights, reviews, discoveries, or observations with the ecosystem..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
            />
            <div className="char-counter">{description.length}/2000</div>
          </div>
        </div>

        <div className="investment-details-section">
          <div className="section-title-row">
            <h3 className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Explorer Details
            </h3>
          </div>
          <div className="investment-grid">
            <div className="investment-field">
              <label className="field-label">Review Type</label>
              <select className="field-select">
                <option>Startup</option>
                <option>Product</option>
                <option>Founder</option>
                <option>Market</option>
                <option>Technology</option>
              </select>
            </div>
            <div className="investment-field">
              <label className="field-label">Rating</label>
              <select className="field-select">
                <option>⭐</option>
                <option>⭐⭐</option>
                <option>⭐⭐⭐</option>
                <option>⭐⭐⭐⭐</option>
                <option>⭐⭐⭐⭐⭐</option>
              </select>
            </div>
            <div className="investment-field">
              <label className="field-label">Focus Area</label>
              <select className="field-select">
                <option>AI</option>
                <option>SaaS</option>
                <option>FinTech</option>
                <option>HealthTech</option>
                <option>ClimateTech</option>
                <option>Web3</option>
                <option>Robotics</option>
                <option>More</option>
              </select>
            </div>
          </div>
        </div>

        <div className="intent-visibility-row">
          <div className="intent-section">
            <h3 className="section-title small">Post Intent</h3>
            <p className="section-subtitle">Let others know why you're posting</p>
            <div className="intent-pills">
              {intents.map((intent) => (
                <button
                  key={intent}
                  className={`intent-pill ${selectedIntent === intent ? 'selected' : ''}`}
                  onClick={() => setSelectedIntent(intent)}
                >
                  {intent}
                </button>
              ))}
            </div>
          </div>
          <div className="visibility-section">
            <h3 className="section-title small">Visibility</h3>
            <select className="visibility-select" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
              <option>Public</option>
              <option>Connections</option>
              <option>Private Draft</option>
            </select>
          </div>
        </div>

        <div className="assets-tags-row">
          <div className="assets-section">
            <h3 className="section-title small">Attach Assets</h3>
            <p className="section-subtitle">Add supporting materials (Max 10MB per file)</p>
            {validationErrors.length > 0 && (
              <div className="validation-errors">
                {validationErrors.map((error, index) => (
                  <div key={index} className="validation-error">{error}</div>
                ))}
              </div>
            )}
            <div
              className={`assets-grid ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadedFiles.map((file) => (
                <div key={file.id} className="asset-card">
                  {file.file.type.startsWith('image/') ? (
                    <img src={file.preview} alt={file.name} className="asset-preview" />
                  ) : file.file.type.startsWith('video/') ? (
                    <video src={file.preview} className="asset-preview" controls muted />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  )}
                  <div className="asset-info">
                    <div className="asset-name">{file.name}</div>
                    <div className="asset-type">{file.type}</div>
                  </div>
                  <button className="asset-remove-btn" onClick={() => removeFile(file.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              <label className="add-asset-card">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add More</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  accept="image/*,application/pdf,video/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
              </label>
            </div>
          </div>

          <div className="tags-section">
            <h3 className="section-title small">Premium Hashtags</h3>
            <p className="section-subtitle">AI-powered tags to maximize your reach</p>

            <div className="selected-tags-display">
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="selected-tag-premium"
                  onClick={() => toggleTag(tag)}
                >
                  <span className="tag-hash-small">#</span>
                  {tag}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
              ))}
            </div>

            <div className="tag-category">
              <div className="tag-category-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Create Your Own
                <span className="tag-count">{selectedTags.length}/{MAX_TAGS}</span>
              </div>
              <div className="custom-tag-input-wrapper">
                <div className="custom-tag-prefix">#</div>
                <input
                  type="text"
                  className="custom-tag-input"
                  placeholder="e.g., StartupReview, Feedback"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={handleCustomTagKeyDown}
                  maxLength={MAX_TAG_LENGTH}
                />
                <div className="tag-char-count">{customTagInput.length}/{MAX_TAG_LENGTH}</div>
                <button className="custom-tag-add-btn" onClick={addCustomTag}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>

              {showTagSuggestions && (
                <div className="tag-suggestions-dropdown">
                  <div className="suggestions-header">
                    <span className="suggestions-title">🤖 AI Suggestions</span>
                    <span className="suggestions-subtitle">Trending in ecosystem</span>
                  </div>
                  {tagSuggestions.map((suggestion, idx) => (
                    <div
                      key={suggestion.tag}
                      className="tag-suggestion-item"
                      onClick={() => {
                        toggleTag(suggestion.tag);
                        setCustomTagInput('');
                        setShowTagSuggestions(false);
                      }}
                    >
                      <div className="suggestion-tag-main">
                        <span className="suggestion-tag">
                          <span className="tag-hash-small">#</span>
                          {suggestion.tag}
                          {suggestion.isTrending && <span className="trending-badge">🔥 Trending</span>}
                        </span>
                      </div>
                      <div className="suggestion-metrics">
                        <span className="metric-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                          </svg>
                          {suggestion.ecosystemReach}
                        </span>
                        <span className="metric-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          {getInterestLevel(suggestion.investorInterest)}
                        </span>
                        <span className="metric-item">
                          {getVelocityIndicator(suggestion.trendVelocity)}
                          {suggestion.trendVelocity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="tags-categories">
              <div>
                <div className="tag-category-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Quick Add (Click to Toggle)
                </div>
                <div className="tag-pills-group">
                  {[...categoryTags, ...statusTags, ...stageTags].map(tag => (
                    <span
                      key={tag.name}
                      className={`tag-pill-premium ${selectedTags.includes(tag.name) ? 'active' : ''}`}
                      onClick={() => toggleTag(tag.name)}
                    >
                      <span className="tag-hash-small">#</span>
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="preview-section">
          <h3 className="section-title small">Live Preview</h3>
          <p className="preview-subtitle">How your post will appear in the feed</p>
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-avatar-wrapper">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="preview-avatar" />
                ) : (
                  <div className="preview-avatar" style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="preview-user-info">
                <div className="preview-user-name">{userName}</div>
                <div className="preview-user-title">{userTitle}</div>
                <div className="preview-time">Just now</div>
              </div>
            </div>
            <div className="preview-badges">
              <span className="preview-badge">{selectedPostType}</span>
              <span className="preview-badge intent">{selectedIntent}</span>
            </div>
            <div className="preview-content">
              <h4 className="preview-title">{selectedPostType}</h4>
              <p className="preview-text">{description || 'Share feedback, analysis, insights, reviews, discoveries, or observations with the ecosystem...'}</p>
              {selectedTags.length > 0 && (
                <div className="preview-metrics">
                  {selectedTags.map(tag => (
                    <span key={tag} className="preview-metric">#{tag}</span>
                  ))}
                </div>
              )}
              {uploadedFiles.length > 0 && (
                <div className="preview-assets">
                  {uploadedFiles.slice(0, 3).map(file => (
                    <div key={file.id} className="preview-asset">
                      {file.file.type.startsWith('image/') ? (
                        <img src={file.preview} alt={file.name} className="preview-asset-image" />
                      ) : (
                        <div className="preview-asset-file">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          </svg>
                          <span>{file.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bottom-actions">
          <button className="publish-btn" onClick={handlePublish}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <div className="publish-text">
              <span className="publish-main">Publish Signal</span>
              <span className="publish-sub">Share with the ecosystem</span>
            </div>
          </button>
          <button className="save-draft-bottom-btn" onClick={clearDraft}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <div className="save-text">
              <span className="save-main">Save Draft</span>
              <span className="save-sub">Finish later</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateExplorerPost;
