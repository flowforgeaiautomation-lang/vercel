import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getFollowingList,
  getFollowersList,
  followUser as fbFollowUser,
  unfollowUser as fbUnfollowUser,
  isFollowing,
  FollowUser
} from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import './FollowersModal.css';

interface FollowersModalProps {
  userId: string;
  initialTab: 'following' | 'followers';
  onClose: () => void;
}

const VerifiedBadge = ({ level }: { level: string }) => {
  if (!level || level === 'Unverified') return null;
  const color = level === 'TRIVEON Verified' ? '#FFD700' : level === 'Professional Verified' ? '#00C896' : '#3B82F6';
  return (
    <span title={level} style={{ color, fontSize: '12px', marginLeft: '4px' }}>✔</span>
  );
};

const getRoleColor = (role: string) => {
  if (role === 'ARCHITECT') return '#FFD700';
  if (role === 'CATALYST') return '#00C896';
  if (role === 'EXPLORER') return '#A78BFA';
  return '#9CA3AF';
};

const UserCard: React.FC<{
  user: FollowUser;
  currentUserId: string;
  followingMap: Record<string, boolean>;
  onFollowToggle: (uid: string) => void;
  onViewProfile: (uid: string) => void;
}> = ({ user, currentUserId, followingMap, onFollowToggle, onViewProfile }) => {
  const isMe = user.uid === currentUserId;
  const following = followingMap[user.uid] ?? false;
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);

  const handleFollowClick = () => {
    if (following) {
      setShowUnfollowConfirm(true);
    } else {
      onFollowToggle(user.uid);
    }
  };

  return (
    <div className="fm-user-card">
      <div className="fm-user-left" onClick={() => onViewProfile(user.uid)}>
        <div className="fm-avatar">
          {user.profileImage
            ? <img src={user.profileImage} alt={user.name} />
            : <span>{user.name.charAt(0).toUpperCase()}</span>
          }
        </div>
        <div className="fm-user-info">
          <div className="fm-user-name">
            {user.name}
            <VerifiedBadge level={user.verificationLevel} />
          </div>
          {user.username && <div className="fm-username">@{user.username}</div>}
          {user.title && <div className="fm-title">{user.title}</div>}
          <div className="fm-meta">
            <span className="fm-role-badge" style={{ color: getRoleColor(user.mainRole), borderColor: getRoleColor(user.mainRole) + '40' }}>
              {user.mainRole}
            </span>
            {user.trustIndex > 0 && (
              <span className="fm-trust">⭐ {user.trustIndex}</span>
            )}
          </div>
        </div>
      </div>
      {!isMe && (
        <div className="fm-user-actions">
          {showUnfollowConfirm ? (
            <div className="fm-unfollow-confirm">
              <span>Unfollow?</span>
              <button className="fm-btn-cancel" onClick={() => setShowUnfollowConfirm(false)}>Cancel</button>
              <button className="fm-btn-unfollow" onClick={() => { setShowUnfollowConfirm(false); onFollowToggle(user.uid); }}>Unfollow</button>
            </div>
          ) : (
            <button
              className={`fm-follow-btn ${following ? 'following' : ''}`}
              onClick={handleFollowClick}
            >
              {following ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const FollowersModal: React.FC<FollowersModalProps> = ({ userId, initialTab, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>(initialTab);
  const [followingList, setFollowingList] = useState<FollowUser[]>([]);
  const [followersList, setFollowersList] = useState<FollowUser[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const currentUserId = user?.uid || '';

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [following, followers] = await Promise.all([
        getFollowingList(userId),
        getFollowersList(userId)
      ]);
      setFollowingList(following);
      setFollowersList(followers);

      // Build followingMap for current user
      if (currentUserId) {
        const allUids = [...new Set([...following.map(u => u.uid), ...followers.map(u => u.uid)])];
        const checks = await Promise.all(allUids.map(uid => isFollowing(currentUserId, uid)));
        const map: Record<string, boolean> = {};
        allUids.forEach((uid, i) => { map[uid] = checks[i]; });
        setFollowingMap(map);
      }
    } catch (e) {
      console.error('Error loading follow data:', e);
    } finally {
      setLoading(false);
    }
  }, [userId, currentUserId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFollowToggle = async (targetUid: string) => {
    if (!currentUserId) return;
    const wasFollowing = followingMap[targetUid];
    // Optimistic update
    setFollowingMap(prev => ({ ...prev, [targetUid]: !wasFollowing }));
    try {
      if (wasFollowing) {
        await fbUnfollowUser(currentUserId, targetUid);
      } else {
        await fbFollowUser(currentUserId, targetUid);
      }
    } catch (e) {
      // Revert on error
      setFollowingMap(prev => ({ ...prev, [targetUid]: wasFollowing }));
    }
  };

  const handleViewProfile = (uid: string) => {
    onClose();
    navigate(`/profile/${uid}`);
  };

  const activeList = activeTab === 'following' ? followingList : followersList;
  const filtered = activeList.filter(u => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.title.toLowerCase().includes(q) ||
      u.mainRole.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fm-overlay" onClick={onClose}>
      <div className="fm-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="fm-header">
          <h2 className="fm-title-text">Connections</h2>
          <button className="fm-close" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="fm-tabs">
          <button
            className={`fm-tab ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Following
            <span className="fm-tab-count">{followingList.length}</span>
          </button>
          <button
            className={`fm-tab ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Followers
            <span className="fm-tab-count">{followersList.length}</span>
          </button>
        </div>

        {/* Search */}
        <div className="fm-search-wrap">
          <span className="fm-search-icon">🔍</span>
          <input
            className="fm-search"
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="fm-list">
          {loading ? (
            <div className="fm-empty">
              <div className="fm-spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="fm-empty">
              {search ? (
                <p>No results for "{search}"</p>
              ) : activeTab === 'following' ? (
                <>
                  <p>You are not following anyone yet.</p>
                  <button className="fm-discover-btn" onClick={() => { onClose(); navigate('/atlas'); }}>
                    Discover People
                  </button>
                </>
              ) : (
                <>
                  <p>No followers yet.</p>
                  <button className="fm-discover-btn" onClick={() => { onClose(); navigate('/profile'); }}>
                    Share Your Profile
                  </button>
                </>
              )}
            </div>
          ) : (
            filtered.map(user => (
              <UserCard
                key={user.uid}
                user={user}
                currentUserId={currentUserId}
                followingMap={followingMap}
                onFollowToggle={handleFollowToggle}
                onViewProfile={handleViewProfile}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
