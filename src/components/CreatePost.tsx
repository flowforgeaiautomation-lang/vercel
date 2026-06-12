
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext';
import PrestigeStarBadge from './PrestigeStarBadge';
import './CreatePost.css';

interface CreatePostProps {
  role?: 'ARCHITECT' | 'EXPLORER' | 'CATALYST';
  onClose?: () => void;
}

interface HashtagSuggestion {
  tag: string;
  isTrending: boolean;
  ecosystemReach: string;
  investorInterest: number; // 0-100
  trendVelocity: number; // 0-100
  category: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  type: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ role: propRole, onClose }) => {
  console.log("CreatePost RENDERED!");
  const { userData } = useUser();
  const { addPost } = usePosts();
  
  const role = userData?.mainRole || propRole || 'ARCHITECT';
  
  // Load draft from localStorage on initial render
  const loadDraft = () => {
    const savedDraft = localStorage.getItem('createPostDraft');
    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      return {
        selectedPostType: parsed.selectedPostType || 'Startup Launch',
        selectedIntent: parsed.selectedIntent || 'Seeking Investment',
        description: parsed.description || '',
        visibility: parsed.visibility || 'Public',
        selectedTags: parsed.selectedTags || ['EdTech', 'StudentLife', 'TimeManagement']
      };
    }
    return {
      selectedPostType: 'Startup Launch',
      selectedIntent: 'Seeking Investment',
      description: '',
      visibility: 'Public',
      selectedTags: ['EdTech', 'StudentLife', 'TimeManagement']
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

  const userName = userData?.profile?.name || 'Unnati Chaudhary';
  const userAvatar = userData?.profile?.profileImage;
  const userRole = userData?.mainRole || role;
  const userTitle = 'Founder & CEO @ Nexora';
  
  // Auto-save draft to localStorage
  useEffect(() => {
    const draftData = {
      selectedPostType,
      selectedIntent,
      description,
      visibility,
      selectedTags
    };
    localStorage.setItem('createPostDraft', JSON.stringify(draftData));
  }, [selectedPostType, selectedIntent, description, visibility, selectedTags]);

  // Simulated AI hashtag suggestions database
  const hashtagDatabase: HashtagSuggestion[] = [
    { tag: 'AI', isTrending: true, ecosystemReach: '12.4K', investorInterest: 92, trendVelocity: 88, category: 'Category' },
    { tag: 'Fintech', isTrending: true, ecosystemReach: '8.7K', investorInterest: 85, trendVelocity: 72, category: 'Category' },
    { tag: 'EdTech', isTrending: true, ecosystemReach: '18.3K', investorInterest: 90, trendVelocity: 95, category: 'Category' },
    { tag: 'StudentLife', isTrending: true, ecosystemReach: '22.1K', investorInterest: 75, trendVelocity: 89, category: 'Category' },
    { tag: 'TimeManagement', isTrending: true, ecosystemReach: '15.6K', investorInterest: 70, trendVelocity: 80, category: 'Category' },
    { tag: 'HealthyHabits', isTrending: true, ecosystemReach: '14.2K', investorInterest: 68, trendVelocity: 78, category: 'Category' },
    { tag: 'Productivity', isTrending: true, ecosystemReach: '16.8K', investorInterest: 72, trendVelocity: 83, category: 'Category' },
    { tag: 'StudyTips', isTrending: true, ecosystemReach: '13.4K', investorInterest: 65, trendVelocity: 77, category: 'Category' },
    { tag: 'ClimateTech', isTrending: true, ecosystemReach: '7.3K', investorInterest: 88, trendVelocity: 81, category: 'Category' },
    { tag: 'Web3', isTrending: false, ecosystemReach: '5.2K', investorInterest: 65, trendVelocity: 45, category: 'Category' },
    { tag: 'HealthTech', isTrending: true, ecosystemReach: '6.8K', investorInterest: 78, trendVelocity: 76, category: 'Category' },
    { tag: 'StartupLaunch', isTrending: true, ecosystemReach: '15.2K', investorInterest: 95, trendVelocity: 90, category: 'Status' },
    { tag: 'SeekingInvestment', isTrending: true, ecosystemReach: '11.8K', investorInterest: 98, trendVelocity: 85, category: 'Status' },
    { tag: 'ProductUpdate', isTrending: false, ecosystemReach: '4.3K', investorInterest: 60, trendVelocity: 52, category: 'Status' },
    { tag: 'Seed', isTrending: true, ecosystemReach: '9.5K', investorInterest: 90, trendVelocity: 82, category: 'Stage' },
    { tag: 'SeriesA', isTrending: false, ecosystemReach: '7.1K', investorInterest: 88, trendVelocity: 68, category: 'Stage' },
    { tag: 'DeFi', isTrending: false, ecosystemReach: '4.1K', investorInterest: 55, trendVelocity: 40, category: 'Category' },
    { tag: 'SaaS', isTrending: true, ecosystemReach: '8.9K', investorInterest: 82, trendVelocity: 75, category: 'Category' },
  ];

  const [tagSuggestions, setTagSuggestions] = useState<HashtagSuggestion[]>(hashtagDatabase.slice(0, 5));

  const postTypes = [
    'Startup Launch',
    'Product Launch',
    'Founder Update',
    'Fundraising Announcement',
    'Startup Milestone',
    'Startup Case Study',
    'Founder Lessons',
    'Startup Hiring',
    'Startup Partnership',
    'Startup Acquisition',
    'Idea / Concept',
    'Progress Update',
    'Investment Opportunity',
    'Feedback Request',
    'Collaboration Request',
    'Insight / Research'
  ];

  const intents = [
    'Seeking Investment',
    'Seeking Feedback',
    'Hiring',
    'Partnerships',
    'Sharing Insight'
  ];

  const categoryTags = [
    { name: 'AI', color: 'purple' },
    { name: 'Fintech', color: 'blue' },
    { name: 'EdTech', color: 'orange' },
    { name: 'StudentLife', color: 'pink' },
    { name: 'TimeManagement', color: 'cyan' },
    { name: 'HealthyHabits', color: 'green' },
    { name: 'Productivity', color: 'gold' },
    { name: 'StudyTips', color: 'purple' },
    { name: 'ClimateTech', color: 'green' },
    { name: 'Web3', color: 'cyan' },
    { name: 'HealthTech', color: 'pink' }
  ];

  const statusTags = [
    { name: 'StartupLaunch', color: 'gold' },
    { name: 'SeekingInvestment', color: 'green' },
    { name: 'ProductUpdate', color: 'blue' },
    { name: 'ResearchSignal', color: 'purple' },
    { name: 'FounderJourney', color: 'pink' },
    { name: 'FutureOfAI', color: 'cyan' }
  ];

  const stageTags = [
    { name: 'Pre-Seed', color: 'blue' },
    { name: 'Seed', color: 'green' },
    { name: 'SeriesA', color: 'purple' },
    { name: 'EarlyStage', color: 'orange' },
    { name: 'Bootstrapped', color: 'pink' },
    { name: 'VC-Backed', color: 'cyan' }
  ];

  // AI suggestion logic
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
    return found?.color || 'gold';
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

  // AI Copilot Post Writer
  const handleAiWrite = () => {
    if (!aiInput.trim()) return;
    setIsAiTyping(true);
    setTimeout(() => {
      let generatedPost = '';
      
      if (selectedPostType === 'Startup Launch') {
        generatedPost = `🚀 We're LIVE and excited to share our journey!

${aiInput}

Our team has been working tirelessly to bring this vision to life, and we can't wait to see the impact we'll make together. We're actively looking for:
• Early adopters to test our product
• Strategic partners who share our mission
• Investors passionate about ${selectedTags[0] || 'innovation'}

Let's connect and build something extraordinary!

#StartupLaunch ${selectedTags.map(t => `#${t}`).join(' ')} #FounderJourney`;
      } else if (selectedPostType === 'Investment Opportunity') {
        generatedPost = `💰 Exciting investment opportunity!

${aiInput}

Key Highlights:
• Market size: $50B+ TAM
• Team with proven track record
• Early traction and strong unit economics
• Clear path to profitability

We're raising ${selectedTags.includes('Seed') ? 'seed' : selectedTags.includes('SeriesA') ? 'Series A' : ''} capital to scale product development and go-to-market.

Looking forward to connecting with angel investors and VCs!

#SeekingInvestment ${selectedTags.map(t => `#${t}`).join(' ')} #VC`;
      } else if (selectedPostType === 'Progress Update') {
        generatedPost = `📈 Major milestone alert!

${aiInput}

What we've accomplished:
• [Add your key metrics]
• [Add your product updates]
• [Add your team growth]

Thank you to our incredible community for your support — this is just the beginning!

#ProgressUpdate ${selectedTags.map(t => `#${t}`).join(' ')} #StartupGrowth`;
      } else {
        generatedPost = `💡 ${selectedPostType}!

${aiInput}

We'd love to hear your thoughts, feedback, and insights. Let's start a conversation!

${selectedTags.map(t => `#${t}`).join(' ')} #Innovation #Community`;
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
      // AI improvements
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
      
      const improvedPost = description + `

---
✨ Enhanced by TRIVEON AI:${improvements || '\n• Optimized readability and flow'}
• Added clear call-to-action
• Improved engagement potential

${selectedTags.map(t => `#${t}`).join(' ')}`;
      
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
      if (selectedIntent === 'Seeking Investment') {
        cta = '\n\nInterested investors, please reach out — let\'s discuss!\n';
      } else if (selectedIntent === 'Seeking Feedback') {
        cta = '\n\nWould love your thoughts in the comments below!\n';
      } else if (selectedIntent === 'Hiring') {
        cta = '\n\nWe\'re hiring! Check out our careers page or DM for details.\n';
      } else {
        cta = '\n\nLet\'s connect and collaborate!\n';
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
      // Simple simulated fixes
      let fixedPost = description
        .replace(/\bi\b/g, 'I')
        .replace(/\bu\b/g, 'you')
        .replace(/\bthats\b/g, "that's")
        .replace(/\bdont\b/g, "don't")
        .replace(/\bwont\b/g, "won't")
        .replace(/\bcant\b/g, "can't")
        .replace(/\bisnt\b/g, "isn't")
        .replace(/\bwerent\b/g, "weren't");
      
      // Capitalize first letter of sentences
      fixedPost = fixedPost.replace(/(^|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
      
      fixedPost += '\n\n✨ Checked and improved by TRIVEON AI';
      
      setDescription(fixedPost);
      setIsAiTyping(false);
      setAiCopilotOpen(false);
    }, 1200);
  };

  const handlePublish = () => {
    addPost({
      userId: userData?.uid || 'demo-user',
      userName,
      userAvatar,
      userRole,
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

  const getRoleColors = (role: string) => {
    if (role === 'CATALYST') {
      return ['#00C896', '#34D399', '#059669', '#10B981', '#065F46'];
    } else if (role === 'EXPLORER') {
      return ['#3B82F6', '#60A5FA', '#2563EB', '#38BDF8', '#0284C7'];
    } else {
      return ['#B8860B', '#DAA520', '#8B6914', '#FFD700', '#CD853F'];
    }
  };

  const roleColors = getRoleColors(role);

  const traction = [
    { label: 'Users', value: '10,000+', color: roleColors[0] },
    { label: 'Revenue', value: '$120K MRR', color: roleColors[1] },
    { label: 'Growth', value: '48% MoM', color: roleColors[2] },
    { label: 'Waitlist', value: '5,200+', color: roleColors[3] },
    { label: 'Partnerships', value: '12', color: roleColors[4] }
  ];

  // File validation: max 10MB per file, allowed types
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
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
      // Clear errors after 5 seconds
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
    // Reset input to allow selecting the same file again
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

  // Drag and drop handlers
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
    localStorage.removeItem('createPostDraft');
    setSelectedPostType('Startup Launch');
    setSelectedIntent('Seeking Investment');
    setDescription('');
    setVisibility('Public');
    setSelectedTags(['EdTech', 'StudentLife', 'TimeManagement']);
  };

  return (
    <div className="create-post-overlay" style={{ zIndex: 100000, display: 'flex' }} onClick={() => console.log("Overlay clicked!")}>
      <div className={`create-post-modal role-${role.toLowerCase()}`}>
        <div className="create-post-header">
          <div className="create-post-header-left">
            <h1 className="create-post-title">Create Post</h1>
            <p className="create-post-subtitle">Publish a signal to the ecosystem ✨</p>
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
                setDescription(`🚀 We're thrilled to announce our official launch! 

After months of hard work, we're ready to share our vision with the world. Our mission is to transform how founders and investors connect, collaborate, and build the future.

We'd love to hear your thoughts and connect with like-minded individuals!

#StartupLaunch ${selectedTags.map(t => `#${t}`).join(' ')}`);
              }}>
                🚀 Generate launch post
              </button>
              <button className="ai-action-btn" onClick={() => {
                setDescription(`📈 Exciting progress update! 

We've achieved significant milestones this month:
• 50% month-over-month growth
• Added 20+ new team members
• Launched 3 key features
• Expanded to 5 new markets

Grateful for our incredible community!

#ProgressUpdate ${selectedTags.map(t => `#${t}`).join(' ')}`);
              }}>
                📈 Generate progress update
              </button>
            </div>

            <div className="ai-copilot-input-area">
              <input
                type="text"
                className="ai-copilot-input"
                placeholder="Tell AI what to write (e.g., 'Create a post about our seed round')"
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
                background: 'linear-gradient(135deg, #B8860B, #DAA520)',
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#B8860B' }}>
                <path d="M12 0C5.37 0 0 5.37 0 12C0 18.63 5.37 24 12 24C18.63 24 24 18.63 24 12C24 5.37 18.63 0 12 0ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
              </svg>
            </div>
            <p className="user-title">{userTitle}</p>
            <div className="user-badges" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="user-badge">{userRole === 'ARCHITECT' ? 'Architect' : userRole === 'EXPLORER' ? 'Explorer' : 'Catalyst'}</span>
              {userData?.prestigeSystem && (
                <PrestigeStarBadge
                  starId={userData.prestigeSystem.currentStarId}
                  size="small"
                  color={userRole === 'ARCHITECT' ? '#FFD700' : userRole === 'CATALYST' ? '#00C896' : '#06b6d4'}
                />
              )}
              <span className="user-meta">👑 Sovereign Tier • Trust Index 94</span>
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {type === 'Startup Launch' && (
                  <>
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  </>
                )}
                {type === 'Product Launch' && (
                  <>
                    <path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2z" />
                  </>
                )}
                {type === 'Founder Update' && (
                  <>
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </>
                )}
                {type === 'Fundraising Announcement' && (
                  <>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  </>
                )}
                {type === 'Startup Milestone' && (
                  <>
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    <path d="M12 2v10" />
                    <circle cx="12" cy="12" r="4" />
                  </>
                )}
                {type === 'Startup Case Study' && (
                  <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </>
                )}
                {type === 'Founder Lessons' && (
                  <>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                  </>
                )}
                {type === 'Startup Hiring' && (
                  <>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </>
                )}
                {type === 'Startup Partnership' && (
                  <>
                    <circle cx="12" cy="5" r="3" />
                    <circle cx="5" cy="19" r="3" />
                    <circle cx="19" cy="19" r="3" />
                    <line x1="12" y1="8" x2="5" y2="16" />
                    <line x1="12" y1="8" x2="19" y2="16" />
                  </>
                )}
                {type === 'Startup Acquisition' && (
                  <>
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </>
                )}
                {type === 'Idea / Concept' && (
                  <>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                  </>
                )}
                {type === 'Progress Update' && (
                  <>
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </>
                )}
                {type === 'Investment Opportunity' && (
                  <>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  </>
                )}
                {type === 'Feedback Request' && (
                  <>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </>
                )}
                {type === 'Collaboration Request' && (
                  <>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </>
                )}
                {type === 'Insight / Research' && (
                  <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
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
              placeholder="Describe your startup, vision, traction, or the opportunity you're building…"
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
              Investment Opportunity Details
            </h3>
          </div>
          <div className="investment-grid">
            <div className="investment-field">
              <label className="field-label">Funding Stage</label>
              <select className="field-select">
                <option>Seed</option>
                <option>Series A</option>
                <option>Series B</option>
              </select>
            </div>
            <div className="investment-field">
              <label className="field-label">Ticket Size</label>
              <select className="field-select">
                <option>$250K — $1M</option>
                <option>$1M — $5M</option>
                <option>$5M — $10M</option>
              </select>
            </div>
            <div className="investment-field">
              <label className="field-label">Industry / Focus (Select up to 3)</label>
              <select className="field-select">
                <option>Fintech • SaaS • Infra</option>
              </select>
              <div className="selected-tags">
                <span className="selected-tag">Fintech</span>
                <span className="selected-tag">SaaS</span>
                <span className="selected-tag">Infra</span>
              </div>
            </div>
            <div className="investment-field">
              <label className="field-label">Funding Purpose</label>
              <select className="field-select">
                <option>Product Scaling</option>
                <option>Marketing</option>
                <option>Hiring</option>
              </select>
            </div>
            <div className="investment-field">
              <label className="field-label">Investment Status</label>
              <select className="field-select">
                <option>Raising Now</option>
                <option>Upcoming Round</option>
              </select>
            </div>
            <div className="investment-field">
              <label className="field-label">Target Investors</label>
              <select className="field-select">
                <option>Angels, VCs, Strategic Investors</option>
              </select>
            </div>
          </div>
        </div>

        <div className="traction-section">
          <div className="section-title-row">
            <h3 className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18" />
                <path d="m19 9 12 16 5 9" />
              </svg>
              Traction Snapshot (Optional)
            </h3>
          </div>
          <div className="traction-grid">
            {traction.map((item, index) => (
              <div key={index} className="traction-card" style={{ '--accent-color': item.color } as React.CSSProperties}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2">
                  {index === 0 && (
                    <>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h8a3.5 3.5 0 0 0 0-7zM21 19H2.99" />
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </>
                  )}
                  {index === 3 && (
                    <>
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </>
                  )}
                  {index === 4 && (
                    <>
                      <circle cx="12" cy="5" r="3" />
                      <circle cx="5" cy="19" r="3" />
                      <circle cx="19" cy="19" r="3" />
                      <line x1="12" y1="8" x2="5" y2="16" />
                      <line x1="12" y1="8" x2="19" y2="16" />
                    </>
                  )}
                </svg>
                <div className="traction-value">{item.value}</div>
                <div className="traction-label">{item.label}</div>
              </div>
            ))}
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
              <option>Private</option>
              <option>Followers Only</option>
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
                  className={`selected-tag-premium ${getTagColor(tag)}`}
                  onClick={() => toggleTag(tag)}
                >
                  <span className="tag-hash">#</span>
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
                  placeholder="e.g., DeFi, Crypto, SaaS"
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
                        <span className={`suggestion-tag ${getTagColor(suggestion.tag)}`}>
                          #
                          {suggestion.tag}
                        </span>
                        {suggestion.isTrending && <span className="trending-badge">🔥 Trending</span>}
                      </div>
                      <div className="suggestion-metrics">
                        <span className="metric-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          {suggestion.ecosystemReach} reach
                        </span>
                        <span className="metric-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h8a3.5 3.5 0 0 0 0-7zM21 19H2.99" />
                          </svg>
                          {getInterestLevel(suggestion.investorInterest)} investor interest
                        </span>
                        <span className="metric-item">
                          {getVelocityIndicator(suggestion.trendVelocity)} {suggestion.trendVelocity} velocity
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="tags-categories">
              <div className="tag-category">
                <div className="tag-category-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" />
                  </svg>
                  Categories
                </div>
                <div className="tag-pills-group">
                  {categoryTags.map(tag => (
                    <button
                      key={tag.name}
                      className={`tag-pill-premium ${tag.color} ${selectedTags.includes(tag.name) ? 'active' : ''}`}
                      onClick={() => toggleTag(tag.name)}
                    >
                      <span className="tag-hash-small">#</span>
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="tag-category">
                <div className="tag-category-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                  </svg>
                  Status & Signals
                </div>
                <div className="tag-pills-group">
                  {statusTags.map(tag => (
                    <button
                      key={tag.name}
                      className={`tag-pill-premium ${tag.color} ${selectedTags.includes(tag.name) ? 'active' : ''}`}
                      onClick={() => toggleTag(tag.name)}
                    >
                      <span className="tag-hash-small">#</span>
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="tag-category">
                <div className="tag-category-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Stage
                </div>
                <div className="tag-pills-group">
                  {stageTags.map(tag => (
                    <button
                      key={tag.name}
                      className={`tag-pill-premium ${tag.color} ${selectedTags.includes(tag.name) ? 'active' : ''}`}
                      onClick={() => toggleTag(tag.name)}
                    >
                      <span className="tag-hash-small">#</span>
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="preview-section">
          <div className="section-title-row">
            <h3 className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Live Preview
            </h3>
            <span className="preview-subtitle">This is how your post will appear in the feed</span>
          </div>
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-avatar-wrapper">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="preview-avatar"
                  />
                ) : (
                  <div className="preview-avatar" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}>
                    {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="preview-user-info">
                <div className="preview-user-name">{userName}</div>
                <div className="preview-user-title">{userTitle}</div>
                <div className="preview-time">2m ago</div>
              </div>
            </div>
            <div className="preview-badges">
              <span className="preview-badge">Seed</span>
              <span className="preview-badge">$250K — $1M</span>
              {selectedTags.slice(0, 4).map(tag => (
                <span key={tag} className={`preview-badge hashtag ${getTagColor(tag)}`}>
                  <span className="preview-tag-hash">#</span>
                  {tag}
                </span>
              ))}
              <span className="preview-badge intent">{selectedIntent}</span>
            </div>
            <div className="preview-content">
              <h4 className="preview-title">{selectedPostType}</h4>
              <p className="preview-text">{description || 'Describe your startup, vision, traction, or the opportunity you\'re building…'}</p>
              {uploadedFiles.length > 0 && (
                <div className="preview-assets">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="preview-asset">
                      {file.file.type.startsWith('image/') ? (
                        <img src={file.preview} alt={file.name} className="preview-asset-image" />
                      ) : file.file.type.startsWith('video/') ? (
                        <video src={file.preview} className="preview-asset-image" controls muted />
                      ) : (
                        <div className="preview-asset-file">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span>{file.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="preview-metrics">
                <span className="preview-metric">10K+ Users</span>
                <span className="preview-metric">$120K MRR</span>
                <span className="preview-metric">48% MoM Growth</span>
                <span className="preview-metric">12 Partnerships</span>
              </div>
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
          <button className="save-draft-bottom-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
            <div className="save-text">
              <span className="save-main">Save Draft</span>
              <span className="save-sub">Save and continue later</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
