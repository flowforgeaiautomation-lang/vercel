
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { supabase, Insight } from '../lib/supabase';
import PrestigeStarBadge from './PrestigeStarBadge';
import './InsightsDashboard.css';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const getRoleColor = (role: string): string => {
  const r = role.toUpperCase();
  if (r === 'ARCHITECT') return '#FFD700';
  if (r === 'CATALYST') return '#00C896';
  if (r === 'EXPLORER') return '#06b6d4';
  return '#9CA3AF';
};

const CATEGORIES = ['All', 'Startup', 'Investment', 'Research', 'Technology', 'Marketing', 'Operations', 'Leadership', 'Product', 'Growth', 'AI'];

const CATEGORY_COLORS: Record<string, string> = {
  Startup: '#FFD700',
  Investment: '#00C896',
  Research: '#06b6d4',
  Technology: '#8B5CF6',
  Marketing: '#F59E0B',
  Operations: '#EF4444',
  Leadership: '#EC4899',
  Product: '#3B82F6',
  Growth: '#10B981',
  AI: '#A78BFA',
};

const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

interface CreateInsightForm {
  title: string;
  subtitle: string;
  category: string;
  tags: string;
  content: string;
  visibility: string;
  status: string;
}

const InsightsDashboard = () => {
  const { user, profile } = useAuth();
  const { userData } = useUser();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [myInsights, setMyInsights] = useState<Insight[]>([]);
  const [savedInsightIds, setSavedInsightIds] = useState<Set<string>>(new Set());
  const [likedInsightIds, setLikedInsightIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'discover' | 'my-insights'>('discover');
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [form, setForm] = useState<CreateInsightForm>({
    title: '',
    subtitle: '',
    category: 'Technology',
    tags: '',
    content: '',
    visibility: 'public',
    status: 'published',
  });

  const userName = userData?.profile?.name || profile?.name || 'User';
  const userRole = userData?.mainRole || profile?.role || 'ARCHITECT';

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .eq('status', 'published')
      .eq('visibility', 'public')
      .order('published_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setInsights(data as Insight[]);
    }
    setLoadingInsights(false);
  };

  const fetchMyInsights = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .eq('user_id', user.uid)
      .order('created_at', { ascending: false });
    if (!error && data) setMyInsights(data as Insight[]);
  };

  const fetchSavedAndLiked = async () => {
    if (!user) return;
    const [savesRes, likesRes] = await Promise.all([
      supabase.from('insight_saves').select('insight_id').eq('user_id', user.uid),
      supabase.from('insight_likes').select('insight_id').eq('user_id', user.uid),
    ]);
    if (savesRes.data) setSavedInsightIds(new Set(savesRes.data.map((r: any) => r.insight_id)));
    if (likesRes.data) setLikedInsightIds(new Set(likesRes.data.map((r: any) => r.insight_id)));
  };

  useEffect(() => {
    fetchInsights();
    if (user) {
      fetchMyInsights();
      fetchSavedAndLiked();
    }
  }, [user?.uid]);

  const handleToggleSave = async (insightId: string) => {
    if (!user) return;
    const isSaved = savedInsightIds.has(insightId);
    if (isSaved) {
      await supabase.from('insight_saves').delete().eq('insight_id', insightId).eq('user_id', user.uid);
      setSavedInsightIds(prev => { const s = new Set(prev); s.delete(insightId); return s; });
    } else {
      await supabase.from('insight_saves').insert({ insight_id: insightId });
      setSavedInsightIds(prev => new Set(prev).add(insightId));
    }
  };

  const handleToggleLike = async (insightId: string) => {
    if (!user) return;
    const isLiked = likedInsightIds.has(insightId);
    if (isLiked) {
      await supabase.from('insight_likes').delete().eq('insight_id', insightId).eq('user_id', user.uid);
      setLikedInsightIds(prev => { const s = new Set(prev); s.delete(insightId); return s; });
      setInsights(prev => prev.map(i => i.id === insightId ? { ...i, likes_count: Math.max(0, i.likes_count - 1) } : i));
    } else {
      await supabase.from('insight_likes').insert({ insight_id: insightId });
      setLikedInsightIds(prev => new Set(prev).add(insightId));
      setInsights(prev => prev.map(i => i.id === insightId ? { ...i, likes_count: i.likes_count + 1 } : i));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.title.trim()) { setCreateError('Title is required.'); return; }
    if (!form.content.trim()) { setCreateError('Content is required.'); return; }
    setCreating(true);
    setCreateError('');
    const wordCount = form.content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const contentBlocks = [{ type: 'paragraph', text: form.content.trim() }];
    const { error } = await supabase.from('insights').insert({
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      category: form.category,
      tags,
      content: contentBlocks,
      visibility: form.visibility,
      status: form.status,
      reading_time: readingTime,
      published_at: form.status === 'published' ? new Date().toISOString() : null,
    });
    if (error) {
      setCreateError(error.message);
      setCreating(false);
      return;
    }
    setShowCreateModal(false);
    setForm({ title: '', subtitle: '', category: 'Technology', tags: '', content: '', visibility: 'public', status: 'published' });
    fetchInsights();
    fetchMyInsights();
    setCreating(false);
    if (form.status === 'published') setActiveTab('discover');
    else setActiveTab('my-insights');
  };

  const handleDeleteInsight = async (insightId: string) => {
    if (!window.confirm('Delete this insight?')) return;
    await supabase.from('insights').delete().eq('id', insightId).eq('user_id', user?.uid);
    setMyInsights(prev => prev.filter(i => i.id !== insightId));
    setInsights(prev => prev.filter(i => i.id !== insightId));
  };

  const handleEditInsight = (insight: Insight) => {
    setEditingInsight(insight);
    setForm({
      title: insight.title,
      subtitle: insight.subtitle,
      category: insight.category,
      tags: (insight.tags || []).join(', '),
      content: Array.isArray(insight.content) ? insight.content.map((b: any) => b.text || '').join('\n\n') : '',
      visibility: insight.visibility,
      status: insight.status,
    });
    setShowCreateModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingInsight) return;
    if (!form.title.trim()) { setCreateError('Title is required.'); return; }
    if (!form.content.trim()) { setCreateError('Content is required.'); return; }
    setCreating(true);
    setCreateError('');
    const wordCount = form.content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const contentBlocks = [{ type: 'paragraph', text: form.content.trim() }];
    const { error } = await supabase.from('insights').update({
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      category: form.category,
      tags,
      content: contentBlocks,
      visibility: form.visibility,
      status: form.status,
      reading_time: readingTime,
      published_at: form.status === 'published' && !editingInsight.published_at ? new Date().toISOString() : editingInsight.published_at,
    }).eq('id', editingInsight.id).eq('user_id', user.uid);
    if (error) {
      setCreateError(error.message);
      setCreating(false);
      return;
    }
    setShowCreateModal(false);
    setEditingInsight(null);
    setForm({ title: '', subtitle: '', category: 'Technology', tags: '', content: '', visibility: 'public', status: 'published' });
    fetchInsights();
    fetchMyInsights();
    setCreating(false);
  };

  const openInsightDetail = async (insight: Insight) => {
    setSelectedInsight(insight);
    // Increment view count
    await supabase.from('insights').update({ views: insight.views + 1 }).eq('id', insight.id);
    setInsights(prev => prev.map(i => i.id === insight.id ? { ...i, views: i.views + 1 } : i));
    // Fetch comments
    setLoadingComments(true);
    const { data: commentData } = await supabase
      .from('insight_comments')
      .select('*')
      .eq('insight_id', insight.id)
      .order('created_at', { ascending: true });
    if (commentData) setComments(commentData);
    setLoadingComments(false);
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedInsight || !newComment.trim()) return;
    setSubmittingComment(true);
    const { data, error } = await supabase.from('insight_comments').insert({
      insight_id: selectedInsight.id,
      content: newComment.trim(),
    }).select('*').single();
    if (!error && data) {
      setComments(prev => [...prev, data]);
      setNewComment('');
      // Update comment count
      setInsights(prev => prev.map(i => i.id === selectedInsight.id ? { ...i, comments_count: i.comments_count + 1 } : i));
      setSelectedInsight(prev => prev ? { ...prev, comments_count: prev.comments_count + 1 } : prev);
    }
    setSubmittingComment(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user || !selectedInsight) return;
    await supabase.from('insight_comments').delete().eq('id', commentId).eq('user_id', user.uid);
    setComments(prev => prev.filter(c => c.id !== commentId));
    setInsights(prev => prev.map(i => i.id === selectedInsight.id ? { ...i, comments_count: Math.max(0, i.comments_count - 1) } : i));
    setSelectedInsight(prev => prev ? { ...prev, comments_count: Math.max(0, prev.comments_count - 1) } : prev);
  };

  const filteredInsights = insights.filter(insight => {
    const matchesCategory = activeCategory === 'All' || insight.category === activeCategory;
    const matchesSearch = !searchQuery || insight.title.toLowerCase().includes(searchQuery.toLowerCase()) || insight.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredInsight = filteredInsights[0];
  const restInsights = filteredInsights.slice(1);

  return (
    <div className="insights-container">
      {/* Left Sidebar */}
      <div className="insights-left-sidebar">
        <div className="insights-logo" onClick={() => navigate('/home')}>
          <div className="insights-logo-icon">
            <img src="/images/triarcora-png.png" alt="Triarcora" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          </div>
          <span className="insights-logo-text">TRIARCORA</span>
        </div>

        <nav className="insights-nav">
          <div className="insights-nav-item" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
          </div>
          <div className={`insights-nav-item ${activeTab === 'discover' ? 'active' : ''}`} onClick={() => setActiveTab('discover')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            <span>Discover</span>
          </div>
          <div className={`insights-nav-item ${activeTab === 'my-insights' ? 'active' : ''}`} onClick={() => setActiveTab('my-insights')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>My Insights</span>
          </div>
          <div className="insights-nav-item" onClick={() => navigate('/bookmarks')}>
            <BookmarkIcon />
            <span>Saved</span>
          </div>
        </nav>

        <div className="insights-user-card">
          <div className="insights-user-avatar">
            {userData?.profile?.profileImage ? (
              <img src={userData.profile.profileImage} alt={userName} />
            ) : (
              <span>{getInitials(userName)}</span>
            )}
          </div>
          <div className="insights-user-info">
            <span className="insights-user-name">{userName}</span>
            <span className="insights-user-role" style={{ color: getRoleColor(userRole) }}>{userRole}</span>
          </div>
          {userData?.prestigeSystem && (
            <PrestigeStarBadge
              starId={userData.prestigeSystem.currentStarId}
              size="small"
              color="#FFD700"
            />
          )}
        </div>

        <div className="insights-copilot-card">
          <div className="insights-copilot-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"></polygon>
            </svg>
          </div>
          <div className="insights-copilot-content">
            <strong>Share knowledge.</strong>
            <span>Build impact.</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="insights-main">
        <div className="insights-content">
          {/* Header */}
          <div className="insights-page-header">
            <div>
              <h1>Insights</h1>
              <p>Ideas worth sharing. Knowledge worth saving.</p>
            </div>
            <div className="insights-header-actions">
              <div className="insights-search-wrapper">
                <SearchIcon />
                <input
                  className="insights-search-input"
                  placeholder="Search insights..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="create-insight-btn" onClick={() => setShowCreateModal(true)}>
                <PlusIcon />
                Create
              </button>
            </div>
          </div>

          {activeTab === 'discover' && (
            <>
              {/* Category Tabs */}
              <div className="insights-tabs">
                {CATEGORIES.map(cat => (
                  <div
                    key={cat}
                    className={`insights-tab ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </div>
                ))}
              </div>

              {loadingInsights ? (
                <div className="insights-loading">
                  <div className="insights-spinner" />
                  <p>Loading insights...</p>
                </div>
              ) : filteredInsights.length === 0 ? (
                <div className="insights-empty">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                    <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  <h3>No insights yet</h3>
                  <p>Be the first to share your knowledge with the ecosystem.</p>
                  <button className="create-insight-btn" onClick={() => setShowCreateModal(true)}>
                    <PlusIcon /> Create Insight
                  </button>
                </div>
              ) : (
                <>
                  {/* Featured */}
                  {featuredInsight && (
                    <div className="featured-insight">
                      {featuredInsight.cover_image ? (
                        <img src={featuredInsight.cover_image} alt={featuredInsight.title} className="featured-image" />
                      ) : (
                        <div className="featured-image featured-image-placeholder">
                          <div className="featured-placeholder-content">
                            <span style={{ color: CATEGORY_COLORS[featuredInsight.category] || '#FFD700', fontSize: 48, fontWeight: 800 }}>
                              {featuredInsight.category[0]}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="featured-content" onClick={() => openInsightDetail(featuredInsight)} style={{ cursor: 'pointer' }}>
                        <div className="featured-label">FEATURED</div>
                        <span className="insight-category-badge" style={{ background: `${CATEGORY_COLORS[featuredInsight.category]}22`, color: CATEGORY_COLORS[featuredInsight.category] || '#FFD700' }}>
                          {featuredInsight.category}
                        </span>
                        <h2>{featuredInsight.title}</h2>
                        {featuredInsight.subtitle && <p>{featuredInsight.subtitle}</p>}
                        <div className="featured-meta">
                          <div className="featured-stats">
                            <span><ClockIcon /> {featuredInsight.reading_time} min read</span>
                            <span>•</span>
                            <span><EyeIcon /> {featuredInsight.views.toLocaleString()} views</span>
                            <span>•</span>
                            <span><HeartIcon /> {featuredInsight.likes_count}</span>
                          </div>
                          <div className="featured-actions">
                            <button
                              className={`insight-action-btn ${likedInsightIds.has(featuredInsight.id) ? 'active-like' : ''}`}
                              onClick={() => handleToggleLike(featuredInsight.id)}
                            >
                              <HeartIcon /> {likedInsightIds.has(featuredInsight.id) ? 'Liked' : 'Like'}
                            </button>
                            <button
                              className={`insight-action-btn ${savedInsightIds.has(featuredInsight.id) ? 'active-save' : ''}`}
                              onClick={() => handleToggleSave(featuredInsight.id)}
                            >
                              <BookmarkIcon /> {savedInsightIds.has(featuredInsight.id) ? 'Saved' : 'Save'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Grid */}
                  {restInsights.length > 0 && (
                    <>
                      <div className="latest-insights-header">
                        <h3>Latest Insights</h3>
                        <span className="insights-count">{restInsights.length} insights</span>
                      </div>
                      <div className="latest-insights-grid">
                        {restInsights.map(insight => (
                          <div key={insight.id} className="insight-card" onClick={() => openInsightDetail(insight)} style={{ cursor: 'pointer' }}>
                            {insight.cover_image ? (
                              <img src={insight.cover_image} alt={insight.title} className="insight-image" />
                            ) : (
                              <div className="insight-image insight-image-placeholder">
                                <span style={{ color: CATEGORY_COLORS[insight.category] || '#FFD700', fontSize: 28, fontWeight: 800 }}>
                                  {insight.category[0]}
                                </span>
                              </div>
                            )}
                            <div className="insight-info">
                              <span className="insight-category" style={{ color: CATEGORY_COLORS[insight.category] || '#9CA3AF' }}>
                                {insight.category}
                              </span>
                              <h4>{insight.title}</h4>
                              {insight.subtitle && <p>{insight.subtitle}</p>}
                              <div className="insight-tags">
                                {(insight.tags || []).slice(0, 3).map(tag => (
                                  <span key={tag} className="insight-tag">#{tag}</span>
                                ))}
                              </div>
                              <div className="insight-meta">
                                <div className="insight-stats">
                                  <span><ClockIcon /> {insight.reading_time} min</span>
                                  <span><EyeIcon /> {insight.views.toLocaleString()}</span>
                                  <span><HeartIcon /> {insight.likes_count}</span>
                                </div>
                                <div className="insight-card-actions">
                                  <button
                                    className={`insight-action-sm ${likedInsightIds.has(insight.id) ? 'active-like' : ''}`}
                                    onClick={() => handleToggleLike(insight.id)}
                                    title="Like"
                                  >
                                    <HeartIcon />
                                  </button>
                                  <button
                                    className={`insight-action-sm ${savedInsightIds.has(insight.id) ? 'active-save' : ''}`}
                                    onClick={() => handleToggleSave(insight.id)}
                                    title="Save"
                                  >
                                    <BookmarkIcon />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === 'my-insights' && (
            <div className="my-insights-section">
              <div className="my-insights-header">
                <h3>My Insights</h3>
                <button className="create-insight-btn" onClick={() => setShowCreateModal(true)}>
                  <PlusIcon /> New Insight
                </button>
              </div>
              {myInsights.length === 0 ? (
                <div className="insights-empty">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                    <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  <h3>No insights yet</h3>
                  <p>Share your expertise and build your thought leadership.</p>
                  <button className="create-insight-btn" onClick={() => setShowCreateModal(true)}>
                    <PlusIcon /> Write Your First Insight
                  </button>
                </div>
              ) : (
                <div className="my-insights-list">
                  {myInsights.map(insight => (
                    <div key={insight.id} className="my-insight-row">
                      <div className="my-insight-info" onClick={() => openInsightDetail(insight)} style={{ cursor: 'pointer' }}>
                        <span className="insight-category" style={{ color: CATEGORY_COLORS[insight.category] || '#9CA3AF' }}>
                          {insight.category}
                        </span>
                        <h4>{insight.title}</h4>
                        {insight.subtitle && <p>{insight.subtitle}</p>}
                      </div>
                      <div className="my-insight-meta">
                        <span className={`insight-status-badge status-${insight.status}`}>{insight.status}</span>
                        <span><EyeIcon /> {insight.views}</span>
                        <span><HeartIcon /> {insight.likes_count}</span>
                        <span><BookmarkIcon /> {insight.saves_count}</span>
                        <button className="insight-edit-btn" onClick={() => handleEditInsight(insight)} title="Edit">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                        <button className="insight-delete-btn" onClick={() => handleDeleteInsight(insight.id)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Insight Modal */}
      {showCreateModal && (
        <div className="insights-modal-overlay" onClick={() => { setShowCreateModal(false); setEditingInsight(null); }}>
          <div className="insights-modal" onClick={e => e.stopPropagation()}>
            <div className="insights-modal-header">
              <h3>{editingInsight ? 'Edit Insight' : 'Create Insight'}</h3>
              <button className="modal-close-btn" onClick={() => { setShowCreateModal(false); setEditingInsight(null); }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <form className="insights-create-form" onSubmit={editingInsight ? handleUpdate : handleCreate}>
              {createError && <div className="insights-create-error">{createError}</div>}
              <div className="form-row">
                <div className="form-group-insights">
                  <label>Title *</label>
                  <input
                    className="insights-form-input"
                    placeholder="e.g. How We Raised Our Seed Round"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group-insights">
                  <label>Subtitle</label>
                  <input
                    className="insights-form-input"
                    placeholder="A brief summary of your insight"
                    value={form.subtitle}
                    onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-row form-row-split">
                <div className="form-group-insights">
                  <label>Category</label>
                  <select className="insights-form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group-insights">
                  <label>Visibility</label>
                  <select className="insights-form-select" value={form.visibility} onChange={e => setForm(f => ({ ...f, visibility: e.target.value }))}>
                    <option value="public">Public</option>
                    <option value="connections_only">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="form-group-insights">
                  <label>Status</label>
                  <select className="insights-form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group-insights">
                  <label>Tags (comma-separated)</label>
                  <input
                    className="insights-form-input"
                    placeholder="e.g. fundraising, growth, saas"
                    value={form.tags}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group-insights">
                  <label>Content *</label>
                  <textarea
                    className="insights-form-textarea"
                    placeholder="Share your knowledge, insights, or experiences..."
                    rows={8}
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  />
                </div>
              </div>
              <div className="insights-form-actions">
                <button type="button" className="insights-cancel-btn" onClick={() => { setShowCreateModal(false); setEditingInsight(null); }}>Cancel</button>
                <button type="submit" className="insights-submit-btn" disabled={creating}>
                  {creating ? 'Saving...' : editingInsight ? 'Update Insight' : form.status === 'published' ? 'Publish Insight' : 'Save Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Insight Detail Modal with Comments */}
      {selectedInsight && (
        <div className="insights-modal-overlay" onClick={() => { setSelectedInsight(null); setComments([]); }}>
          <div className="insights-modal insight-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="insights-modal-header">
              <span className="insight-category-badge" style={{ background: `${CATEGORY_COLORS[selectedInsight.category]}22`, color: CATEGORY_COLORS[selectedInsight.category] || '#FFD700' }}>
                {selectedInsight.category}
              </span>
              <button className="modal-close-btn" onClick={() => { setSelectedInsight(null); setComments([]); }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="insight-detail-content">
              <h2 className="insight-detail-title">{selectedInsight.title}</h2>
              {selectedInsight.subtitle && <p className="insight-detail-subtitle">{selectedInsight.subtitle}</p>}
              <div className="insight-detail-meta">
                <span><ClockIcon /> {selectedInsight.reading_time} min read</span>
                <span><EyeIcon /> {selectedInsight.views.toLocaleString()} views</span>
                <span><HeartIcon /> {selectedInsight.likes_count} likes</span>
                <span><BookmarkIcon /> {selectedInsight.saves_count} saves</span>
              </div>
              {selectedInsight.tags && selectedInsight.tags.length > 0 && (
                <div className="insight-tags" style={{ marginBottom: 16 }}>
                  {selectedInsight.tags.map(tag => <span key={tag} className="insight-tag">#{tag}</span>)}
                </div>
              )}
              <div className="insight-detail-body">
                {Array.isArray(selectedInsight.content) && selectedInsight.content.map((block: any, idx: number) => (
                  <p key={idx}>{block.text}</p>
                ))}
              </div>

              {/* Comments Section */}
              <div className="insight-comments-section">
                <h4 className="comments-section-title">Comments ({comments.length})</h4>
                {loadingComments ? (
                  <div className="insights-loading"><div className="insights-spinner" /></div>
                ) : comments.length === 0 ? (
                  <p className="no-comments-text">No comments yet. Be the first to share your thoughts.</p>
                ) : (
                  <div className="comments-list">
                    {comments.map(comment => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-avatar">{getInitials(userName)}</div>
                        <div className="comment-body">
                          <div className="comment-header">
                            <span className="comment-author">{userName}</span>
                            <span className="comment-time">{new Date(comment.created_at).toLocaleDateString()}</span>
                            {comment.user_id === user?.uid && (
                              <button className="comment-delete-btn" onClick={() => handleDeleteComment(comment.id)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>
                              </button>
                            )}
                          </div>
                          <p className="comment-text">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {user && (
                  <form className="comment-form" onSubmit={handlePostComment}>
                    <div className="comment-avatar">{getInitials(userName)}</div>
                    <input
                      className="comment-input"
                      placeholder="Share your thoughts..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      disabled={submittingComment}
                    />
                    <button type="submit" className="comment-submit-btn" disabled={submittingComment || !newComment.trim()}>
                      Post
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsDashboard;
