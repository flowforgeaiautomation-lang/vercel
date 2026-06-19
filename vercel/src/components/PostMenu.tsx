
import { useState } from 'react';
import { usePosts, Post } from '../contexts/PostContext';
import { useUser } from '../contexts/UserContext';

interface PostMenuProps {
  post: Post;
  onClose: () => void;
  onEdit?: () => void;
}

const PostMenu = ({ post, onClose, onEdit }: PostMenuProps) => {
  const { userData } = useUser();
  const {
    repost,
    savePost,
    unsavePost,
    pinPost,
    unpinPost,
    muteUser,
    hidePost,
    markNotInterested,
    reportPost,
    copyPostLink,
    copyPostText,
    editPost,
    deletePost,
    archivePost,
    pinnedPostIds,
    savedPosts
  } = usePosts();

  const [showRepostOptions, setShowRepostOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(savedPosts.includes(post.id));
  const [isPinned, setIsPinned] = useState(pinnedPostIds.includes(post.id));
  const [selectedReportReason, setSelectedReportReason] = useState<string | null>(null);

  const currentUserId = userData?.uid || 'current-user';
  const isOwner = post.userId === currentUserId;

  const handleRepost = (withComment: boolean) => {
    repost(post.id, withComment ? 'Reposting this!' : undefined);
    setShowRepostOptions(false);
    onClose();
  };

  const handleShare = (platform: string) => {
    const link = copyPostLink(post.id);
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(link)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`, '_blank');
        break;
      case 'x':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?body=${encodeURIComponent(link)}`, '_blank');
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: post.postType,
            text: post.description,
            url: link
          });
        }
        break;
      default:
        break;
    }
    setShowShareOptions(false);
    onClose();
  };

  const handleReport = (reason: string) => {
    setSelectedReportReason(reason);
  };

  const submitReport = () => {
    if (selectedReportReason) {
      reportPost(post.id, selectedReportReason);
      setShowReportOptions(false);
      onClose();
    }
  };

  const handleDelete = () => {
    deletePost(post.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleToggleSave = () => {
    if (isSaved) {
      unsavePost(post.id);
    } else {
      savePost(post.id);
    }
    setIsSaved(!isSaved);
    onClose();
  };

  const handleTogglePin = () => {
    if (isPinned) {
      unpinPost(post.id);
    } else {
      pinPost(post.id);
    }
    setIsPinned(!isPinned);
    onClose();
  };

  const handleCopyLink = () => {
    copyPostLink(post.id);
    onClose();
  };

  const handleCopyText = () => {
    copyPostText(post.id);
    onClose();
  };

  const handleMuteUser = () => {
    muteUser(post.userId);
    onClose();
  };

  const handleHidePost = () => {
    hidePost(post.id);
    onClose();
  };

  const handleNotInterested = () => {
    markNotInterested(post.tags);
    onClose();
  };

  const handleArchive = () => {
    archivePost(post.id);
    onClose();
  };

  if (showRepostOptions) {
    return (
      <div className="post-menu-overlay" onClick={onClose}>
        <div className="post-menu" onClick={(e) => e.stopPropagation()}>
          <div className="post-menu-header">
            <button className="menu-back-button" onClick={() => setShowRepostOptions(false)}>←</button>
            <span className="menu-title">Repost</span>
          </div>
          <div className="menu-item" onClick={() => handleRepost(false)}>
            <span>🔄</span>
            <span>Repost Now</span>
          </div>
          <div className="menu-item" onClick={() => handleRepost(true)}>
            <span>💬</span>
            <span>Add Your Thoughts + Repost</span>
          </div>
        </div>
      </div>
    );
  }

  if (showShareOptions) {
    return (
      <div className="post-menu-overlay" onClick={onClose}>
        <div className="post-menu" onClick={(e) => e.stopPropagation()}>
          <div className="post-menu-header">
            <button className="menu-back-button" onClick={() => setShowShareOptions(false)}>←</button>
            <span className="menu-title">Share Via</span>
          </div>
          <div className="menu-item" onClick={() => handleCopyLink()}>
            <span>🔗</span>
            <span>Copy Link</span>
          </div>
          <div className="menu-item" onClick={() => handleShare('whatsapp')}>
            <span>💬</span>
            <span>Share to WhatsApp</span>
          </div>
          <div className="menu-item" onClick={() => handleShare('linkedin')}>
            <span>💼</span>
            <span>Share to LinkedIn</span>
          </div>
          <div className="menu-item" onClick={() => handleShare('x')}>
            <span>🐦</span>
            <span>Share to X</span>
          </div>
          <div className="menu-item" onClick={() => handleShare('email')}>
            <span>📧</span>
            <span>Share via Email</span>
          </div>
          <div className="menu-item" onClick={() => handleShare('native')}>
            <span>📤</span>
            <span>Share via Device</span>
          </div>
        </div>
      </div>
    );
  }

  if (showReportOptions) {
    return (
      <div className="post-menu-overlay" onClick={onClose}>
        <div className="post-menu" onClick={(e) => e.stopPropagation()}>
          <div className="post-menu-header">
            <button className="menu-back-button" onClick={() => setShowReportOptions(false)}>←</button>
            <span className="menu-title">Report Post</span>
          </div>
          {['Spam', 'Harassment', 'Misinformation', 'Scam', 'Hate Content', 'Copyright', 'Fake Startup', 'Fake Investment', 'Other'].map(reason => (
            <div 
              key={reason}
              className={`menu-item ${selectedReportReason === reason ? 'active' : ''}`}
              onClick={() => handleReport(reason)}
            >
              <span>{selectedReportReason === reason ? '✅' : '⭕'}</span>
              <span>{reason}</span>
            </div>
          ))}
          {selectedReportReason && (
            <div className="menu-item danger" onClick={submitReport}>
              <span>🚩</span>
              <span>Submit Report</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showDeleteConfirm) {
    return (
      <div className="post-menu-overlay" onClick={onClose}>
        <div className="post-menu delete-confirm" onClick={(e) => e.stopPropagation()}>
          <div className="delete-confirm-header">
            <span>🗑️</span>
            <h3>Delete Post?</h3>
            <p>This action cannot be undone. This will permanently delete the post.</p>
          </div>
          <div className="delete-confirm-actions">
            <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            <button className="btn-delete" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-menu-overlay" onClick={onClose}>
      <div className="post-menu" onClick={(e) => e.stopPropagation()}>
        <div className="post-menu-header">
          <span className="menu-title">Actions</span>
          <button className="menu-close-button" onClick={onClose}>✕</button>
        </div>

        {!isOwner && (
          <>
            <div className="menu-item" onClick={() => setShowRepostOptions(true)}>
              <span>🔄</span>
              <span>Repost</span>
            </div>
            <div className="menu-item" onClick={() => setShowShareOptions(true)}>
              <span>📤</span>
              <span>Share Via</span>
            </div>
            <div className="menu-item" onClick={handleTogglePin}>
              <span>📌</span>
              <span>{isPinned ? 'Unpin from Profile' : 'Pin to Profile'}</span>
            </div>
            <div className="menu-item">
              <span>👤</span>
              <span>View Author Profile</span>
            </div>
            <div className="menu-item" onClick={handleMuteUser}>
              <span>🔕</span>
              <span>Mute User</span>
            </div>
            <div className="menu-item" onClick={handleHidePost}>
              <span>🙈</span>
              <span>Hide Post</span>
            </div>
            <div className="menu-item" onClick={handleNotInterested}>
              <span>🚫</span>
              <span>Not Interested</span>
            </div>
            <div className="menu-item" onClick={() => setShowReportOptions(true)}>
              <span>🚩</span>
              <span>Report Post</span>
            </div>
            <div className="menu-item" onClick={handleCopyLink}>
              <span>📋</span>
              <span>Copy Link</span>
            </div>
            <div className="menu-item" onClick={handleCopyText}>
              <span>📑</span>
              <span>Copy Post Text</span>
            </div>
          </>
        )}

        {isOwner && (
          <>
            <div className="menu-item" onClick={onEdit}>
              <span>✏️</span>
              <span>Edit Post</span>
            </div>
            <div className="menu-item" onClick={handleTogglePin}>
              <span>📌</span>
              <span>{isPinned ? 'Unpin from Profile' : 'Pin to Profile'}</span>
            </div>
            <div className="menu-item" onClick={handleArchive}>
              <span>📁</span>
              <span>Archive Post</span>
            </div>
            <div className="menu-item danger" onClick={() => setShowDeleteConfirm(true)}>
              <span>🗑️</span>
              <span>Delete Post</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostMenu;
