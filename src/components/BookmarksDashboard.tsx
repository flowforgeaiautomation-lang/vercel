import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { usePosts, SavedCollection } from '../contexts/PostContext';
import PrestigeStarBadge from './PrestigeStarBadge';
import './BookmarksDashboard.css';

type BookmarkType = 'Startup' | 'Investment' | 'Funding Round' | 'Syndicate' | 'Investment Deal' | 'Person' | 'Post' | 'Signal' | 'Feedback' | 'Review' | 'Article' | 'Marketplace Asset' | 'Opportunity';

interface BookmarkItem {
  id: string;
  type: BookmarkType;
  title: string;
  description: string;
  savedDate: Date;
  icon: string;
  category: string;
  actionLabel: string;
  collectionId?: string;
  isArchived?: boolean;
}

const initialBookmarks: BookmarkItem[] = [
  { id: '1', type: 'Startup', title: 'Nebula AI', description: 'AI Co-founder for building startups faster', savedDate: new Date(Date.now() - 86400000), icon: '🏢', category: 'AI', actionLabel: 'View Startup' },
  { id: '2', type: 'Investment', title: 'FinFlow $500k Seed Round', description: 'Series A funding opportunity for fintech startup', savedDate: new Date(Date.now() - 172800000), icon: '💰', category: 'Fintech', actionLabel: 'View Investment' },
  { id: '3', type: 'Person', title: 'Unnati Chaudhary', description: 'Partner @ Peak Capital', savedDate: new Date(Date.now() - 259200000), icon: '👤', category: 'Investor', actionLabel: 'View Profile' },
  { id: '4', type: 'Article', title: 'Building Scalable AI Infrastructure', description: 'Deep dive into modern AI architectures', savedDate: new Date(Date.now() - 345600000), icon: '📚', category: 'AI', actionLabel: 'Open Article' },
  { id: '5', type: 'Opportunity', title: 'Y Combinator S25 Batch', description: 'Apply for YC Winter 2025', savedDate: new Date(Date.now() - 432000000), icon: '🚀', category: 'Accelerator', actionLabel: 'Open Opportunity' },
  { id: '6', type: 'Funding Round', title: 'GreenOrbit Series A', description: '$10M round for climate tech startup', savedDate: new Date(Date.now() - 518400000), icon: '🌱', category: 'ClimateTech', actionLabel: 'View Round' },
  { id: '7', type: 'Post', title: 'Founder Update: Nebula AI', description: 'Weekly progress update from Riya', savedDate: new Date(Date.now() - 604800000), icon: '📝', category: 'Founder', actionLabel: 'Open Post' },
  { id: '8', type: 'Marketplace Asset', title: 'Premium Domain: TechFlow.io', description: 'Available for acquisition', savedDate: new Date(Date.now() - 691200000), icon: '🌐', category: 'Domains', actionLabel: 'View Asset' },
];

const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 1) return 'Today';
  if (diffDays < 2) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const BookmarksDashboard = () => {
  const navigate = useNavigate();
  const { userRole, userData, userName } = useUser();
  const { savedCollections, createCollection, addToCollection, removeFromCollection, getSavedPosts } = usePosts();
  
  const [activeFilter, setActiveFilter] = useState<'All' | 'Recent' | 'Important' | 'Startups' | 'Investments' | 'People' | 'Posts' | 'Articles' | 'Opportunities'>('All');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(initialBookmarks);
  const [collections, setCollections] = useState<SavedCollection[]>([
    { id: '1', name: 'My Future Investments', postIds: [], createdAt: new Date(Date.now() - 604800000) },
    { id: '2', name: 'Favorite Startups', postIds: [], createdAt: new Date(Date.now() - 1209600000) },
    { id: '3', name: 'Potential Co-founders', postIds: [], createdAt: new Date(Date.now() - 1814400000) },
    { id: '4', name: 'Funding Opportunities', postIds: [], createdAt: new Date(Date.now() - 2419200000) },
  ]);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [showRenameCollection, setShowRenameCollection] = useState<string | null>(null);
  const [renameCollectionName, setRenameCollectionName] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showMoveMenu, setShowMoveMenu] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchive, setShowArchive] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  useEffect(() => {
    // AI smart organization suggestions
    const startupCount = bookmarks.filter(b => b.type === 'Startup').length;
    const investorCount = bookmarks.filter(b => b.type === 'Person' && b.category === 'Investor').length;
    
    if (startupCount >= 3 && !collections.find(c => c.name.includes('AI Startup'))) {
      setAiSuggestion('Create AI Startup Collection?');
    } else if (investorCount >= 2 && !collections.find(c => c.name.includes('Investor'))) {
      setAiSuggestion('Create Investor Watchlist?');
    } else {
      setAiSuggestion(null);
    }
  }, [bookmarks, collections]);

  const filteredBookmarks = bookmarks.filter(b => {
    if (showArchive && !b.isArchived) return false;
    if (!showArchive && b.isArchived) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return b.title.toLowerCase().includes(query) || 
             b.description.toLowerCase().includes(query) || 
             b.category.toLowerCase().includes(query) ||
             b.type.toLowerCase().includes(query);
    }

    if (activeFilter === 'All') return true;
    if (activeFilter === 'Recent') {
      const weekAgo = new Date(Date.now() - 604800000);
      return b.savedDate > weekAgo;
    }
    if (activeFilter === 'Important') return true; // Add your important logic here
    if (activeFilter === 'Startups') return b.type === 'Startup';
    if (activeFilter === 'Investments') return ['Investment', 'Funding Round', 'Syndicate', 'Investment Deal'].includes(b.type);
    if (activeFilter === 'People') return b.type === 'Person';
    if (activeFilter === 'Posts') return ['Post', 'Signal', 'Feedback', 'Review'].includes(b.type);
    if (activeFilter === 'Articles') return b.type === 'Article';
    if (activeFilter === 'Opportunities') return ['Opportunity', 'Marketplace Asset'].includes(b.type);
    
    return true;
  });

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      setCollections([...collections, { id: Date.now().toString(), name: newCollectionName, postIds: [], createdAt: new Date() }]);
      setNewCollectionName('');
      setShowCreateCollection(false);
      setAiSuggestion(null);
    }
  };

  const handleRenameCollection = (collectionId: string) => {
    if (renameCollectionName.trim()) {
      setCollections(collections.map(c => c.id === collectionId ? { ...c, name: renameCollectionName } : c));
      setRenameCollectionName('');
      setShowRenameCollection(null);
    }
  };

  const handleDeleteCollection = (collectionId: string) => {
    setCollections(collections.filter(c => c.id !== collectionId));
    setBookmarks(bookmarks.map(b => b.collectionId === collectionId ? { ...b, collectionId: undefined } : b));
  };

  const handleUnbookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const handleArchive = (id: string) => {
    setBookmarks(bookmarks.map(b => b.id === id ? { ...b, isArchived: true } : b));
  };

  const handleUnarchive = (id: string) => {
    setBookmarks(bookmarks.map(b => b.id === id ? { ...b, isArchived: false } : b));
  };

  const handleShare = (id: string) => {
    const bookmark = bookmarks.find(b => b.id === id);
    if (bookmark) {
      if (navigator.share) {
        navigator.share({
          title: bookmark.title,
          text: bookmark.description,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(`${bookmark.title}: ${bookmark.description}`);
        alert('Link copied to clipboard!');
      }
    }
  };

  const handleMoveToCollection = (bookmarkId: string, collectionId: string | null) => {
    setBookmarks(bookmarks.map(b => b.id === bookmarkId ? { ...b, collectionId: collectionId || undefined } : b));
    setShowMoveMenu(null);
  };

  const handleAcceptAiSuggestion = () => {
    if (aiSuggestion?.includes('AI Startup')) {
      setCollections([...collections, { id: Date.now().toString(), name: 'AI Startup Collection', postIds: [], createdAt: new Date() }]);
    } else if (aiSuggestion?.includes('Investor')) {
      setCollections([...collections, { id: Date.now().toString(), name: 'Investor Watchlist', postIds: [], createdAt: new Date() }]);
    }
    setAiSuggestion(null);
  };

  return (
    <div className="bk-container">
      <div className="bk-left-sidebar">
        <div className="bk-logo" onClick={() => navigate('/home')}>
          <div className="bk-logo-icon">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="logoGradBk" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
              </defs>
              <polygon points="20,80 50,20 80,80" fill="url(#logoGradBk)" />
              <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
            </svg>
          </div>
          <span className="bk-logo-text">TRIVEON</span>
        </div>

        <div className="bk-section-title">Vault</div>

        <nav className="bk-nav">
          <div className="bk-nav-item" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span>Home</span>
          </div>

          <div className="bk-nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>Bookmarks</span>
          </div>

          <div className="bk-nav-item" onClick={() => setShowArchive(!showArchive)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 4h14v4H5z" />
              <path d="M6 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
            </svg>
            <span>{showArchive ? 'Show Active' : 'Show Archive'}</span>
          </div>

          <div className="bk-nav-item" onClick={() => navigate('/messages')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Messages</span>
          </div>

          <div className="bk-nav-item" onClick={() => navigate('/signals')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span>Signals</span>
          </div>
        </nav>

        <div className="bk-ai-copilot">
          <div className="bk-ai-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" />
            </svg>
          </div>
          <div className="bk-ai-content">
            <strong>AI Copilot</strong>
            <p>Find, summarize, organize</p>
          </div>
        </div>
      </div>

      <div className="bk-main">
        <div className="bk-content">
          <div className="bk-main-col">
            <div className="bk-page-header">
              <div className="bk-title">
                <h1>{showArchive ? 'Archive' : 'Bookmarks'}</h1>
                <p>Your saved ecosystem in one place</p>
              </div>
              <div className="bk-header-actions">
                <div className="bk-search-bar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search bookmarks..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="bk-settings-btn" onClick={() => setShowSettingsModal(true)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </button>
              </div>
            </div>

            {aiSuggestion && (
              <div className="bk-ai-suggestion">
                <div className="bk-ai-suggestion-content">
                  <div className="bk-ai-suggestion-icon">✨</div>
                  <div>
                    <strong>AI Suggestion</strong>
                    <p>{aiSuggestion}</p>
                  </div>
                </div>
                <div className="bk-ai-suggestion-actions">
                  <button className="bk-ai-suggestion-accept" onClick={handleAcceptAiSuggestion}>
                    Create
                  </button>
                  <button className="bk-ai-suggestion-dismiss" onClick={() => setAiSuggestion(null)}>
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div className="bk-filters">
              <div className="bk-tabs">
                {['All', 'Recent', 'Important', 'Startups', 'Investments', 'People', 'Posts', 'Articles', 'Opportunities'].map(tab => (
                  <button
                    key={tab}
                    className={`bk-tab ${activeFilter === tab ? 'active' : ''}`}
                    onClick={() => setActiveFilter(tab as any)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="bk-bookmarks-list">
              {filteredBookmarks.length > 0 ? (
                filteredBookmarks.map(bookmark => (
                  <div key={bookmark.id} className="bk-bookmark-card">
                    <div className="bk-bookmark-icon">{bookmark.icon}</div>
                    <div className="bk-bookmark-content">
                      <div className="bk-bookmark-header">
                        <div className="bk-bookmark-title">
                          <strong>{bookmark.title}</strong>
                          <span className="bk-category-badge">{bookmark.category}</span>
                          {bookmark.collectionId && (
                            <span className="bk-collection-tag">
                              {collections.find(c => c.id === bookmark.collectionId)?.name}
                            </span>
                          )}
                        </div>
                        <div className="bk-bookmark-actions">
                          <button 
                            className="bk-action-btn" 
                            title="Share"
                            onClick={() => handleShare(bookmark.id)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="18" cy="5" r="3" />
                              <circle cx="6" cy="12" r="3" />
                              <circle cx="18" cy="19" r="3" />
                              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                            </svg>
                          </button>
                          <button 
                            className="bk-action-btn" 
                            title="Move to Collection"
                            onClick={() => setShowMoveMenu(showMoveMenu === bookmark.id ? null : bookmark.id)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 15a4 4 0 0 0 4 4h9a5 5 0 1 0-.1-9.999 5.002 5.002 0 1 0-9.796 2.617A3 3 0 0 0 3 15z" />
                            </svg>
                          </button>
                          {bookmark.isArchived ? (
                            <button 
                              className="bk-action-btn" 
                              title="Unarchive"
                              onClick={() => handleUnarchive(bookmark.id)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 7h16v14H4z" />
                                <path d="M4 3h16v4H4z" />
                                <polyline points="16 14 12 10 8 14" />
                                <line x1="12" y1="10" x2="12" y2="21" />
                              </svg>
                            </button>
                          ) : (
                            <button 
                              className="bk-action-btn" 
                              title="Archive"
                              onClick={() => handleArchive(bookmark.id)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 4h14v4H5z" />
                                <path d="M6 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
                              </svg>
                            </button>
                          )}
                          <button 
                            className="bk-action-btn" 
                            title="Remove Bookmark"
                            onClick={() => handleUnbookmark(bookmark.id)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="bk-bookmark-description">{bookmark.description}</p>
                      <div className="bk-bookmark-footer">
                        <span className="bk-date-saved">Saved {formatDate(bookmark.savedDate)}</span>
                        <button className="bk-view-btn">{bookmark.actionLabel}</button>
                      </div>

                      {showMoveMenu === bookmark.id && (
                        <div className="bk-move-menu">
                          <div className="bk-move-title">Move to collection</div>
                          <button 
                            className="bk-move-option" 
                            onClick={() => handleMoveToCollection(bookmark.id, null)}
                          >
                            No Collection
                          </button>
                          {collections.map(col => (
                            <button 
                              key={col.id} 
                              className="bk-move-option"
                              onClick={() => handleMoveToCollection(bookmark.id, col.id)}
                            >
                              {col.name}
                            </button>
                          ))}
                          <div className="bk-move-divider" />
                          <button 
                            className="bk-create-collection-link" 
                            onClick={() => setShowCreateCollection(true)}
                          >
                            Create new collection
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bk-empty-state">
                  <div className="bk-empty-icon">📦</div>
                  <h2>Your saved ecosystem will appear here</h2>
                  <p>Save startups, investors, posts, and opportunities to revisit later</p>
                  <div className="bk-empty-actions">
                    <button onClick={() => navigate('/home')} className="bk-empty-btn">
                      Discover Startups
                    </button>
                    <button onClick={() => navigate('/')} className="bk-empty-btn">
                      Explore Investments
                    </button>
                    <button onClick={() => navigate('/explorers')} className="bk-empty-btn">
                      Find Opportunities
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bk-collections-section">
              <div className="bk-collections-header">
                <h3>Collections</h3>
                <button className="bk-add-collection-btn" onClick={() => setShowCreateCollection(true)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create Collection
                </button>
              </div>
              <div className="bk-collections-grid">
                {collections.map(col => (
                  <div key={col.id} className="bk-collection-card">
                    <div className="bk-collection-icon">🗂️</div>
                    <div className="bk-collection-info">
                      <div className="bk-collection-name">{col.name}</div>
                      <div className="bk-collection-count">
                        {bookmarks.filter(b => b.collectionId === col.id).length} items
                      </div>
                    </div>
                    <div className="bk-collection-actions">
                      <button 
                        className="bk-collection-action-btn"
                        onClick={() => {
                          setRenameCollectionName(col.name);
                          setShowRenameCollection(col.id);
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button 
                        className="bk-collection-action-btn bk-collection-delete"
                        onClick={() => handleDeleteCollection(col.id)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {showCreateCollection && (
        <div className="bk-modal-overlay" onClick={() => setShowCreateCollection(false)}>
          <div className="bk-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="bk-modal-header">
              <h2>Create New Collection</h2>
              <button className="bk-modal-close" onClick={() => setShowCreateCollection(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="bk-modal-body">
              <input
                type="text"
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="bk-modal-input"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
              />
              <div className="bk-modal-actions">
                <button className="bk-modal-cancel" onClick={() => setShowCreateCollection(false)}>Cancel</button>
                <button className="bk-modal-create" onClick={handleCreateCollection}>Create</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRenameCollection && (
        <div className="bk-modal-overlay" onClick={() => setShowRenameCollection(null)}>
          <div className="bk-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="bk-modal-header">
              <h2>Rename Collection</h2>
              <button className="bk-modal-close" onClick={() => setShowRenameCollection(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="bk-modal-body">
              <input
                type="text"
                placeholder="New name"
                value={renameCollectionName}
                onChange={(e) => setRenameCollectionName(e.target.value)}
                className="bk-modal-input"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleRenameCollection(showRenameCollection)}
              />
              <div className="bk-modal-actions">
                <button className="bk-modal-cancel" onClick={() => setShowRenameCollection(null)}>Cancel</button>
                <button className="bk-modal-create" onClick={() => handleRenameCollection(showRenameCollection)}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="bk-modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="bk-modal-content bk-settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bk-modal-header">
              <h2>Bookmark Settings</h2>
              <button className="bk-modal-close" onClick={() => setShowSettingsModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="bk-modal-body">
              <div className="bk-setting-item">
                <span>Auto-organize bookmarks</span>
                <label className="bk-toggle">
                  <input type="checkbox" checked />
                  <span className="bk-toggle-slider" />
                </label>
              </div>
              <div className="bk-setting-item">
                <span>AI suggestions</span>
                <label className="bk-toggle">
                  <input type="checkbox" checked />
                  <span className="bk-toggle-slider" />
                </label>
              </div>
              <div className="bk-setting-item">
                <span>Save to default collection</span>
                <label className="bk-toggle">
                  <input type="checkbox" />
                  <span className="bk-toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookmarksDashboard;
