import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import './TriarcoraSettings.css';

type SettingsSection = 
  | 'account-preferences' 
  | 'sign-in-security' 
  | 'visibility' 
  | 'data-privacy' 
  | 'feed-preferences' 
  | 'ai-settings' 
  | 'notifications' 
  | 'connections' 
  | 'architect-settings' 
  | 'catalyst-settings' 
  | 'explorer-settings' 
  | 'content-management' 
  | 'analytics-export' 
  | 'appearance' 
  | 'advertising' 
  | 'help-center' 
  | 'legal-policies' 
  | 'language-region' 
  | 'account-actions';

// Search index: maps search terms to sections
const searchIndex: Record<string, SettingsSection[]> = {
  'password': ['sign-in-security'],
  'security': ['sign-in-security'],
  '2fa': ['sign-in-security'],
  'two factor': ['sign-in-security'],
  'backup': ['sign-in-security'],
  'sessions': ['sign-in-security'],
  'connected accounts': ['sign-in-security'],
  'google': ['sign-in-security'],
  'apple': ['sign-in-security'],
  'github': ['sign-in-security'],
  'microsoft': ['sign-in-security'],
  
  'profile': ['account-preferences', 'visibility'],
  'photo': ['account-preferences'],
  'cover': ['account-preferences'],
  'name': ['account-preferences'],
  'username': ['account-preferences'],
  'bio': ['account-preferences'],
  'headline': ['account-preferences'],
  'location': ['account-preferences'],
  'website': ['account-preferences'],
  'social': ['account-preferences'],
  'role': ['account-preferences'],
  
  'visibility': ['visibility'],
  'privacy': ['visibility', 'data-privacy'],
  'search': ['visibility'],
  'discovery': ['visibility'],
  'public': ['visibility'],
  'private': ['visibility'],
  'connections': ['visibility', 'connections'],
  
  'data': ['data-privacy', 'analytics-export'],
  'download': ['data-privacy', 'analytics-export'],
  'export': ['data-privacy', 'analytics-export'],
  'delete': ['data-privacy', 'account-actions'],
  'history': ['data-privacy'],
  
  'feed': ['feed-preferences'],
  'recommendations': ['feed-preferences'],
  'interests': ['feed-preferences'],
  'ai': ['ai-settings', 'feed-preferences'],
  'content': ['feed-preferences', 'content-management'],
  
  'copilot': ['ai-settings'],
  'memory': ['ai-settings'],
  'assistant': ['ai-settings'],
  'context': ['ai-settings'],
  
  'notifications': ['notifications'],
  'push': ['notifications'],
  'email': ['notifications'],
  'messages': ['notifications', 'connections'],
  'mentions': ['notifications'],
  'comments': ['notifications'],
  'funding': ['notifications', 'architect-settings'],
  'deal': ['notifications', 'catalyst-settings'],
  
  'connect': ['connections'],
  'block': ['connections'],
  'mute': ['connections'],
  
  'architect': ['architect-settings'],
  'startup': ['architect-settings'],
  'team': ['architect-settings'],
  'fundraising': ['architect-settings'],
  
  'catalyst': ['catalyst-settings'],
  'investor': ['catalyst-settings'],
  'investment': ['catalyst-settings', 'analytics-export'],
  'portfolio': ['catalyst-settings'],
  
  'explorer': ['explorer-settings'],
  'reviews': ['explorer-settings'],
  'feedback': ['explorer-settings'],
  
  'posts': ['content-management'],
  'drafts': ['content-management'],
  'scheduled': ['content-management'],
  'archived': ['content-management'],
  'saved': ['content-management'],
  'bookmarks': ['content-management'],
  
  'analytics': ['analytics-export'],
  'pdf': ['analytics-export'],
  'csv': ['analytics-export'],
  'json': ['analytics-export'],
  
  'appearance': ['appearance'],
  'theme': ['appearance'],
  'dark': ['appearance'],
  'light': ['appearance'],
  'layout': ['appearance'],
  
  'ad': ['advertising'],
  'advertising': ['advertising'],
  'promotion': ['advertising'],
  
  'help': ['help-center'],
  'support': ['help-center'],
  'bug': ['help-center'],
  'feature': ['help-center'],
  
  'legal': ['legal-policies'],
  'terms': ['legal-policies'],
  'privacy policy': ['legal-policies'],
  'cookies': ['legal-policies', 'data-privacy'],
  
  'language': ['language-region'],
  'region': ['language-region'],
  'hindi': ['language-region'],
  'timezone': ['language-region'],
  'currency': ['language-region'],
  'date': ['language-region'],
  
  'logout': ['account-actions'],
  'deactivate': ['account-actions'],
  'delete account': ['account-actions']
};

const TriarcoraSettings: React.FC = () => {
  const navigate = useNavigate();
  const { userData, updateSettings, updateUserData, uploadImage, addExtraRole, deleteExtraRole, switchProfile } = useUser();
  const { logout, changePassword, deleteAccount } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>('account-preferences');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSections, setFilteredSections] = useState<SettingsSection[]>([]);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error' | ''>('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState<string | null>(null);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    bio: '',
    title: '',
    website: '',
    location: ''
  });
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'app' | 'sms' | null>(null);
  const [downloadFormatModalOpen, setDownloadFormatModalOpen] = useState(false);
  const [deleteDataModalOpen, setDeleteDataModalOpen] = useState(false);
  const [resetRecommendationsModalOpen, setResetRecommendationsModalOpen] = useState(false);
  const [contentInterests, setContentInterests] = useState<string[]>(['AI', 'SaaS', 'FinTech']);
  const [aiMemoryModalOpen, setAiMemoryModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  const [deleteAccountStep, setDeleteAccountStep] = useState(1);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize edit form data
  useEffect(() => {
    if (userData?.profile) {
      setEditFormData({
        name: userData.profile.name || '',
        bio: userData.profile.bio || '',
        title: userData.profile.title || '',
        website: userData.profile.website || '',
        location: userData.profile.location || ''
      });
    }
    if (userData?.settings?.feedPreferences?.contentInterests) {
      setContentInterests(userData.settings.feedPreferences.contentInterests);
    }
  }, [userData]);
  
  // Filter sections based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredSections([]);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const matchingSections = new Set<SettingsSection>();
    
    // Search through index
    Object.entries(searchIndex).forEach(([term, sections]) => {
      if (term.includes(lowerQuery)) {
        sections.forEach(s => matchingSections.add(s));
      }
    });
    
    // Also search section names directly
    const allSections: SettingsSection[] = [
      'account-preferences', 'sign-in-security', 'visibility', 'data-privacy',
      'feed-preferences', 'ai-settings', 'notifications', 'connections',
      'architect-settings', 'catalyst-settings', 'explorer-settings',
      'content-management', 'analytics-export', 'appearance', 'advertising',
      'help-center', 'legal-policies', 'language-region', 'account-actions'
    ];
    
    allSections.forEach(section => {
      if (section.toLowerCase().includes(lowerQuery)) {
        matchingSections.add(section);
      }
    });
    
    setFilteredSections(Array.from(matchingSections));
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
      setToastType('');
    }, 4000);
  };

  const handleFileUpload = (type: string) => {
    setCurrentUploadType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type.includes('Photo') ? 'image/*' : '*/*';
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userData && currentUploadType) {
      setUploadingFile(true);
      try {
        const path = currentUploadType === 'Profile Photo' 
          ? `profileImages/${userData.uid}/${Date.now()}-${file.name}`
          : `coverImages/${userData.uid}/${Date.now()}-${file.name}`;
        const downloadURL = await uploadImage(file, path);
        
        if (currentUploadType === 'Profile Photo') {
          updateUserData({
            profile: {
              ...userData.profile,
              profileImage: downloadURL
            }
          });
        } else if (currentUploadType === 'Cover Photo') {
          updateUserData({
            coverImage: downloadURL
          });
        }
        showToast(`${currentUploadType} uploaded successfully!`, 'success');
      } catch (error) {
        console.error('Error uploading file:', error);
        showToast(`Failed to upload ${currentUploadType}!`, 'error');
      } finally {
        setUploadingFile(false);
        setCurrentUploadType(null);
      }
    }
  };

  const handleEditProfile = (field: string) => {
    setEditProfileModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (userData) {
      updateUserData({
        profile: {
          ...userData.profile,
          name: editFormData.name,
          bio: editFormData.bio,
          title: editFormData.title,
          website: editFormData.website,
          location: editFormData.location
        }
      });
      showToast('Profile updated successfully!', 'success');
      setEditProfileModalOpen(false);
    }
  };

  const handleAddRole = (role: 'ARCHITECT' | 'CATALYST' | 'EXPLORER') => {
    addExtraRole(role);
    showToast(`Added ${role} role!`, 'success');
    setRoleModalOpen(false);
  };

  const handleRemoveRole = () => {
    deleteExtraRole();
    showToast('Role removed!', 'success');
  };

  const handleSwitchRole = (role: 'ARCHITECT' | 'CATALYST' | 'EXPLORER') => {
    switchProfile(role);
    showToast(`Switched to ${role} role!`, 'success');
  };

  const handleChangePassword = async () => {
    if (!passwordFormData.currentPassword || !passwordFormData.newPassword || !passwordFormData.confirmPassword) {
      showToast('Please fill in all fields!', 'error');
      return;
    }
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    if (passwordFormData.newPassword.length < 8) {
      showToast('Password must be at least 8 characters long!', 'error');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(passwordFormData.currentPassword, passwordFormData.newPassword);
      showToast('Password changed successfully!', 'success');
      setChangePasswordModalOpen(false);
      setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('[TriarcoraSettings] Change password error:', error);
      let errorMessage = 'An error occurred. Please try again.';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Please choose a stronger password.';
      }
      showToast(errorMessage, 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTwoFactorSetup = () => {
    if (!twoFactorMethod) {
      showToast('Please select a 2FA method!', 'error');
      return;
    }
    // Simulate 2FA setup
    updateSettings({
      signInSecurity: {
        ...settings?.signInSecurity,
        twoFactorEnabled: true,
        twoFactorMethod: twoFactorMethod
      }
    });
    showToast('Two-factor authentication set up successfully!', 'success');
    setTwoFactorModalOpen(false);
    setTwoFactorMethod(null);
  };

  const handleConnectedAccount = (provider: string, isConnected: boolean) => {
    const key = `signInSecurity.connectedAccounts.${provider}`;
    handleSettingChange(key, !isConnected);
    showToast(`${!isConnected ? 'Connecting' : 'Disconnecting'} ${provider} account...`, 'success');
  };

  const handleDataAction = (action: string) => {
    if (action === 'Download Data' || action === 'Export Data') {
      setDownloadFormatModalOpen(true);
    } else if (action === 'Delete Data') {
      setDeleteDataModalOpen(true);
    }
  };

  const downloadData = (format: 'json' | 'csv') => {
    const dataToExport = {
      user: userData,
      exportedAt: new Date().toISOString(),
      app: 'TRIARCORA'
    };
    
    let blob: Blob;
    let filename: string;
    
    if (format === 'json') {
      blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      filename = `triarcora-data-export-${Date.now()}.json`;
    } else {
      // Simple CSV export for demonstration
      const csvContent = [
        ['Field', 'Value'],
        ['Full Name', userData?.profile?.name || ''],
        ['Email', userData?.email || ''],
        ['Main Role', userData?.mainRole || ''],
        ['Exported At', new Date().toISOString()]
      ].map(row => row.join(',')).join('\n');
      blob = new Blob([csvContent], { type: 'text/csv' });
      filename = `triarcora-data-export-${Date.now()}.csv`;
    }
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(`Data downloaded successfully (${format.toUpperCase()})!`, 'success');
    setDownloadFormatModalOpen(false);
  };

  const deleteData = () => {
    updateSettings({
      dataPrivacy: {
        activityControls: {
          postHistory: false,
          searchHistory: false,
          interactionHistory: false
        }
      }
    });
    showToast('Data deletion initiated!', 'success');
    setDeleteDataModalOpen(false);
  };

  const resetRecommendations = () => {
    const defaultInterests = ['AI', 'SaaS', 'FinTech'];
    setContentInterests(defaultInterests);
    updateSettings({
      feedPreferences: {
        contentInterests: defaultInterests,
        feedControls: {
          moreStartup: true,
          moreInvestor: false,
          moreExplorer: false
        },
        contentDensity: 'comfortable',
        improveRecommendations: true
      }
    });
    showToast('Recommendations reset successfully!', 'success');
    setResetRecommendationsModalOpen(false);
  };



  const handleAIAction = (action: string) => {
    console.log(`Performing AI action: ${action}...`);
    if (action === 'View AI Memory') {
      setAiMemoryModalOpen(true);
    } else if (action === 'Clear AI Memory') {
      if (window.confirm('Are you sure you want to clear the AI memory?')) {
        // Here you would reset any AI-related settings or memory
        handleSettingChange('aiSettings.privacy.allowContextLearning', false);
        setTimeout(() => {
          handleSettingChange('aiSettings.privacy.allowContextLearning', true);
        }, 1000);
        showToast('AI Memory cleared!', 'success');
      }
    } else if (action === 'Export AI Memory') {
      const aiMemory = {
        settings: userData?.settings?.aiSettings,
        exportedAt: new Date().toISOString(),
        app: 'TRIARCORA'
      };
      const blob = new Blob([JSON.stringify(aiMemory, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `triarcora-ai-memory-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('AI Memory exported successfully!', 'success');
    }
  };

  const handleDeleteAccount = () => {
    setDeleteAccountModalOpen(true);
    setDeleteAccountStep(1);
    setDeleteAccountPassword('');
  };

  const confirmDeleteAccount = async () => {
    if (deleteAccountStep === 1) {
      if (!deleteAccountPassword) {
        showToast('Please enter your password!', 'error');
        return;
      }
      setDeleteAccountStep(2);
    } else if (deleteAccountStep === 2) {
      setIsDeletingAccount(true);
      try {
        await deleteAccount(deleteAccountPassword);
        navigate('/');
        showToast('Account deleted successfully!', 'success');
      } catch (error: any) {
        console.error('Error deleting account:', error);
        let errorMessage = 'An error occurred. Please try again.';
        if (error.code === 'auth/wrong-password') {
          errorMessage = 'Incorrect password.';
          setDeleteAccountStep(1);
        }
        showToast(errorMessage, 'error');
      } finally {
        setIsDeletingAccount(false);
        setDeleteAccountModalOpen(false);
      }
    }
  };

  const cancelDeleteAccount = () => {
    setDeleteAccountModalOpen(false);
    setDeleteAccountStep(1);
    setDeleteAccountPassword('');
  };

  const handleDeactivateAccount = () => {
    if (window.confirm('Are you sure you want to deactivate your account?')) {
      console.log('Deactivating account...');
      showToast('Account deactivated!', 'success');
    }
  };

  const handleGenerateBackupCodes = () => {
    console.log('Generating backup codes...');
    const codes = [
      Math.random().toString(36).substring(2, 8).toUpperCase(),
      Math.random().toString(36).substring(2, 8).toUpperCase(),
      Math.random().toString(36).substring(2, 8).toUpperCase(),
      Math.random().toString(36).substring(2, 8).toUpperCase(),
      Math.random().toString(36).substring(2, 8).toUpperCase(),
      Math.random().toString(36).substring(2, 8).toUpperCase()
    ];
    alert(`Backup Codes (save them!):\n${codes.join('\n')}`);
    showToast('Backup codes generated - save them in a safe place!', 'success');
  };

  const handleSetupPasskeys = () => {
    console.log('Setting up passkeys...');
    showToast('Passkey setup uses your device\'s biometrics!', 'success');
  };

  const userRoles = userData?.mainRole ? [userData.mainRole.toLowerCase()] : ['architect'];
  if (userData?.extraRole) {
    userRoles.push(userData.extraRole.toLowerCase());
  }

  const settings = userData?.settings;

  const handleSettingChange = (path: string, value: any) => {
    // Update nested settings
    const keys = path.split('.');
    const newSettings: any = {};
    let current = newSettings;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    updateSettings(newSettings);
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
    <div 
      className={`toggle-switch ${checked ? 'on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <div className="toggle-handle"></div>
    </div>
  );

  return (
    <div className="triarcora-settings-page">
      <div className="settings-sidebar">
        <div className="settings-sidebar-header">
          <button className="settings-back-button" onClick={() => navigate('/profile')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Back</span>
          </button>
          <h2>TRIARCORA Settings</h2>
        </div>
        
        <div className="settings-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search settings (e.g., 'password', 'language', 'AI')..." 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        {/* Search Results */}
        {filteredSections.length > 0 && (
          <div className="settings-search-results">
            <div className="settings-search-results-header">
              <h4>Search Results</h4>
            </div>
            {filteredSections.map(section => (
              <button
                key={section}
                className={`settings-sidebar-item ${activeSection === section ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection(section);
                  setSearchQuery('');
                  setFilteredSections([]);
                }}
              >
                {section === 'account-preferences' && '👤'}
                {section === 'sign-in-security' && '🔐'}
                {section === 'visibility' && '👁'}
                {section === 'data-privacy' && '🔒'}
                {section === 'feed-preferences' && '🎯'}
                {section === 'ai-settings' && '🤖'}
                {section === 'notifications' && '🔔'}
                {section === 'connections' && '🤝'}
                {section === 'architect-settings' && '💼'}
                {section === 'catalyst-settings' && '💰'}
                {section === 'explorer-settings' && '🔍'}
                {section === 'content-management' && '📁'}
                {section === 'analytics-export' && '📊'}
                {section === 'appearance' && '🎨'}
                {section === 'advertising' && '📢'}
                {section === 'help-center' && '📚'}
                {section === 'legal-policies' && '📜'}
                {section === 'language-region' && '🌎'}
                {section === 'account-actions' && '🚪'}
                <span>
                  {section === 'account-preferences' && 'Account Preferences'}
                  {section === 'sign-in-security' && 'Sign In & Security'}
                  {section === 'visibility' && 'Visibility'}
                  {section === 'data-privacy' && 'Data Privacy'}
                  {section === 'feed-preferences' && 'Feed Preferences'}
                  {section === 'ai-settings' && 'AI Settings'}
                  {section === 'notifications' && 'Notifications'}
                  {section === 'connections' && 'Connections'}
                  {section === 'architect-settings' && 'Architect Settings'}
                  {section === 'catalyst-settings' && 'Catalyst Settings'}
                  {section === 'explorer-settings' && 'Explorer Settings'}
                  {section === 'content-management' && 'Content Management'}
                  {section === 'analytics-export' && 'Analytics & Export'}
                  {section === 'appearance' && 'Appearance'}
                  {section === 'advertising' && 'Advertising & Promotion'}
                  {section === 'help-center' && 'Help Center'}
                  {section === 'legal-policies' && 'Legal & Policies'}
                  {section === 'language-region' && 'Language & Region'}
                  {section === 'account-actions' && 'Account Actions'}
                </span>
              </button>
            ))}
          </div>
        )}
        
        <nav className="settings-nav">
          {[
            { id: 'account-preferences', icon: '👤', label: 'Account Preferences' },
            { id: 'sign-in-security', icon: '🔐', label: 'Sign In & Security' },
            { id: 'visibility', icon: '👁', label: 'Visibility' },
            { id: 'data-privacy', icon: '🔒', label: 'Data Privacy' },
            { id: 'feed-preferences', icon: '🎯', label: 'Feed Preferences' },
            { id: 'ai-settings', icon: '🤖', label: 'AI Settings' },
            { id: 'notifications', icon: '🔔', label: 'Notifications' },
            { id: 'connections', icon: '🤝', label: 'Connections' },
            { id: 'architect-settings', icon: '💼', label: 'Architect Settings', show: userRoles.includes('architect') },
            { id: 'catalyst-settings', icon: '💰', label: 'Catalyst Settings', show: userRoles.includes('catalyst') },
            { id: 'explorer-settings', icon: '🔍', label: 'Explorer Settings', show: userRoles.includes('explorer') },
            { id: 'content-management', icon: '📁', label: 'Content Management' },
            { id: 'analytics-export', icon: '📊', label: 'Analytics & Export' },
            { id: 'appearance', icon: '🎨', label: 'Appearance' },
            { id: 'advertising', icon: '📢', label: 'Advertising & Promotion' },
            { id: 'help-center', icon: '📚', label: 'Help Center' },
            { id: 'legal-policies', icon: '📜', label: 'Legal & Policies' },
            { id: 'language-region', icon: '🌎', label: 'Language & Region' },
            { id: 'account-actions', icon: '🚪', label: 'Account Actions' }
          ].filter(section => section.show !== false).map(section => (
            <button 
              key={section.id}
              className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="settings-content">
        <div className="settings-content-wrapper">
          {/* Account Preferences */}
          {activeSection === 'account-preferences' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Account Preferences</h1>
                <p>Manage your profile information and account details</p>
              </div>
              
              <div className="settings-card">
                <h3>Profile Information</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Profile Photo</h4>
                    <p>Upload or change your profile photo</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleFileUpload('Profile Photo')}>Upload</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Cover Photo</h4>
                    <p>Upload or change your cover photo</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleFileUpload('Cover Photo')}>Upload</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Full Name</h4>
                    <p>{userData?.profile?.name || 'Unnati Chaudhary'}</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleEditProfile('Full Name')}>Edit</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Username</h4>
                    <p>@{settings?.accountPreferences?.username || 'arjunpatel'}</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleEditProfile('Username')}>Edit</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Bio</h4>
                    <p>{userData?.profile?.bio || 'Building the future of tech'}</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleEditProfile('Bio')}>Edit</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Headline</h4>
                    <p>{userData?.profile?.title || 'Founder & CEO'}</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleEditProfile('Headline')}>Edit</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Website</h4>
                    <p>{userData?.profile?.website || 'Not added'}</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleEditProfile('Website')}>Edit</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Location</h4>
                    <p>{userData?.profile?.location || 'Not added'}</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleEditProfile('Location')}>Edit</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Social Links</h4>
                    <p>Manage your connected social accounts</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleEditProfile('Social Links')}>Manage</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Account Information</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Email Address</h4>
                    <p>{userData?.email || 'arjun@triarcora.com'}</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleEditProfile('Email Address')}>Change</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Phone Number</h4>
                    <p>+91 98765 43210</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleEditProfile('Phone Number')}>Change</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Date Joined</h4>
                    <p>January 15, 2025</p>
                  </div>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Account Status</h4>
                    <p><span className="status-badge active">Active</span></p>
                  </div>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Verification Status</h4>
                    <p><span className="status-badge verified">Verified</span></p>
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <h3>Role Management</h3>
                
                {['ARCHITECT', 'CATALYST', 'EXPLORER'].map(role => {
                  const hasRole = userData?.mainRole === role || userData?.extraRole === role;
                  const isActive = userData?.mainRole === role;
                  if (!hasRole) return null;
                  return (
                    <div key={role} className="settings-item">
                      <div className="settings-item-content">
                        <h4 style={{ margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {role.charAt(0) + role.slice(1).toLowerCase()}
                          {isActive && (
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '10px',
                              background: '#8B5CF6',
                              color: '#fff',
                              fontSize: '12px',
                              fontWeight: 500
                            }}>
                              Active
                            </span>
                          )}
                        </h4>
                        <p style={{ margin: 0 }}>{isActive ? 'Your primary role' : 'Your extra role'}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!isActive && (
                          <button className="settings-btn" onClick={() => handleSwitchRole(role as any)}>
                            Switch
                          </button>
                        )}
                        {!isActive && (
                          <button className="settings-btn danger" onClick={handleRemoveRole}>
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {userRoles.length < 3 && (
                  <div className="settings-item">
                    <div className="settings-item-content">
                      <h4>Add Role</h4>
                      <p>Add a new role to your account</p>
                    </div>
                    <button className="settings-btn primary" onClick={() => setRoleModalOpen(true)}>
                      Manage Roles
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sign In & Security */}
          {activeSection === 'sign-in-security' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Sign In & Security</h1>
                <p>Protect your account with advanced security settings</p>
              </div>
              
              <div className="settings-card">
                <h3>Authentication</h3>
                
                <div className="settings-item">
                    <div className="settings-item-content">
                      <h4>Change Password</h4>
                      <p>Update your password to keep your account secure</p>
                    </div>
                    <button className="settings-btn" onClick={() => setChangePasswordModalOpen(true)}>Change</button>
                  </div>
                  
                  <div className="settings-item">
                    <div className="settings-item-content">
                      <h4>Passkeys</h4>
                      <p>Sign in without a password using passkeys</p>
                    </div>
                    <button className="settings-btn" onClick={handleSetupPasskeys}>Set up</button>
                  </div>
                  
                  <div className="settings-item">
                    <div className="settings-item-content">
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security</p>
                    </div>
                    {settings?.signInSecurity?.twoFactorEnabled ? (
                      <button className="settings-btn danger" onClick={() => {
                        updateSettings({
                          signInSecurity: {
                            ...settings?.signInSecurity,
                            twoFactorEnabled: false
                          }
                        });
                        showToast('Two-factor authentication disabled!', 'success');
                      }}>Disable</button>
                    ) : (
                      <button className="settings-btn primary" onClick={() => setTwoFactorModalOpen(true)}>Set up</button>
                    )}
                  </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Backup Codes</h4>
                    <p>Generate backup codes for account recovery</p>
                  </div>
                  <button className="settings-btn" onClick={handleGenerateBackupCodes}>Generate</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Connected Accounts</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Google</h4>
                    <p>{settings?.signInSecurity?.connectedAccounts?.google ? 'Connected' : 'Not connected'}</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleConnectedAccount('google', settings?.signInSecurity?.connectedAccounts?.google)}>
                    {settings?.signInSecurity?.connectedAccounts?.google ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Apple</h4>
                    <p>{settings?.signInSecurity?.connectedAccounts?.apple ? 'Connected' : 'Not connected'}</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleConnectedAccount('apple', settings?.signInSecurity?.connectedAccounts?.apple)}>
                    {settings?.signInSecurity?.connectedAccounts?.apple ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Microsoft</h4>
                    <p>{settings?.signInSecurity?.connectedAccounts?.microsoft ? 'Connected' : 'Not connected'}</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleConnectedAccount('microsoft', settings?.signInSecurity?.connectedAccounts?.microsoft)}>
                    {settings?.signInSecurity?.connectedAccounts?.microsoft ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>GitHub</h4>
                    <p>{settings?.signInSecurity?.connectedAccounts?.github ? 'Connected' : 'Not connected'}</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleConnectedAccount('github', settings?.signInSecurity?.connectedAccounts?.github)}>
                    {settings?.signInSecurity?.connectedAccounts?.github ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Visibility */}
          {activeSection === 'visibility' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Visibility</h1>
                <p>Control who can see your profile and content</p>
              </div>
              
              <div className="settings-card">
                <h3>Profile Visibility</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Profile Visibility</h4>
                    <p>Choose who can see your profile</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.visibility?.profile || 'public'}
                    onChange={(e) => handleSettingChange('visibility.profile', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="connections">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="settings-card">
                <h3>Startup Visibility</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Startup Visibility</h4>
                    <p>Choose who can see your startup profile</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.visibility?.startup || 'public'}
                    onChange={(e) => handleSettingChange('visibility.startup', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="investors">Investors Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="settings-card">
                <h3>Investment Visibility</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Investment Visibility</h4>
                    <p>Choose who can see your investment activity</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.visibility?.investment || 'connections'}
                    onChange={(e) => handleSettingChange('visibility.investment', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="connections">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="settings-card">
                <h3>Explorer Visibility</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Explorer Visibility</h4>
                    <p>Choose who can see your explorer activity</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.visibility?.explorer || 'public'}
                    onChange={(e) => handleSettingChange('visibility.explorer', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="connections">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="settings-card">
                <h3>Post Visibility</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Default Post Visibility</h4>
                    <p>Choose who can see your posts by default</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.visibility?.post || 'public'}
                    onChange={(e) => handleSettingChange('visibility.post', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="connections">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="settings-card">
                <h3>Search Visibility</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Appear in Search</h4>
                    <p>Allow your profile to appear in search results</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.visibility?.search || true}
                    onChange={(checked) => handleSettingChange('visibility.search', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Profile Discovery</h4>
                    <p>Allow your profile to be discovered by external search engines</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.visibility?.externalDiscovery || true}
                    onChange={(checked) => handleSettingChange('visibility.externalDiscovery', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Data Privacy */}
          {activeSection === 'data-privacy' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Data Privacy</h1>
                <p>Manage your data and privacy settings</p>
              </div>
              
              <div className="settings-card">
                <h3>Personal Data</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Download Data</h4>
                    <p>Download a copy of your data</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleDataAction('Download Data')}>Download</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Export Data</h4>
                    <p>Export your data in a machine-readable format</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleDataAction('Export Data')}>Export</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Delete Data</h4>
                    <p>Delete your data from our servers</p>
                  </div>
                  <button className="settings-btn danger" onClick={() => handleDataAction('Delete Data')}>Delete</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Activity Controls</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Post History</h4>
                    <p>Track and manage your post history</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.dataPrivacy?.activityControls?.postHistory || true}
                    onChange={(checked) => handleSettingChange('dataPrivacy.activityControls.postHistory', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Search History</h4>
                    <p>Track and manage your search history</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.dataPrivacy?.activityControls?.searchHistory || true}
                    onChange={(checked) => handleSettingChange('dataPrivacy.activityControls.searchHistory', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Interaction History</h4>
                    <p>Track and manage your interaction history</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.dataPrivacy?.activityControls?.interactionHistory || true}
                    onChange={(checked) => handleSettingChange('dataPrivacy.activityControls.interactionHistory', checked)}
                  />
                </div>
              </div>

              <div className="settings-card">
                <h3>Data Permissions</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Analytics Usage</h4>
                    <p>Allow us to use your data for analytics</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.dataPrivacy?.dataPermissions?.analytics || true}
                    onChange={(checked) => handleSettingChange('dataPrivacy.dataPermissions.analytics', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Recommendation Usage</h4>
                    <p>Allow us to use your data for recommendations</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.dataPrivacy?.dataPermissions?.recommendations || true}
                    onChange={(checked) => handleSettingChange('dataPrivacy.dataPermissions.recommendations', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>AI Training Usage</h4>
                    <p>Allow us to use your data to train AI models</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.dataPrivacy?.dataPermissions?.aiTraining || true}
                    onChange={(checked) => handleSettingChange('dataPrivacy.dataPermissions.aiTraining', checked)}
                  />
                </div>
              </div>

              <div className="settings-card">
                <h3>Cookie Preferences</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Essential Cookies</h4>
                    <p>Required for basic functionality</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.dataPrivacy?.cookies?.essential || true}
                    onChange={(checked) => handleSettingChange('dataPrivacy.cookies.essential', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Analytics Cookies</h4>
                    <p>Help us improve our service</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.dataPrivacy?.cookies?.analytics || true}
                    onChange={(checked) => handleSettingChange('dataPrivacy.cookies.analytics', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Personalization Cookies</h4>
                    <p>Personalize your experience</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.dataPrivacy?.cookies?.personalization || true}
                    onChange={(checked) => handleSettingChange('dataPrivacy.cookies.personalization', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Feed Preferences */}
          {activeSection === 'feed-preferences' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Feed Preferences</h1>
                <p>Customize your content feed</p>
              </div>
              
              <div className="settings-card">
                <h3>Content Interests</h3>
                <div className="settings-item">
                  <div className="settings-item-content">
                    <p>Select topics you're interested in</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  {['AI', 'SaaS', 'FinTech', 'HealthTech', 'ClimateTech', 'Web3', 'Robotics', 'SpaceTech', 'DeepTech', 'EdTech', 'AgriTech', 'DefenseTech', 'Consumer', 'Enterprise'].map(topic => {
                    const isSelected = settings?.feedPreferences?.contentInterests?.includes(topic);
                    return (
                      <button
                        key={topic}
                        style={{
                          padding: '10px 18px',
                          borderRadius: '12px',
                          border: isSelected ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                          background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'var(--dark-card-lighter)',
                          color: isSelected ? 'var(--gold-primary)' : 'var(--text-gray)',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => {
                          const current = settings?.feedPreferences?.contentInterests || [];
                          const newInterests = current.includes(topic) 
                            ? current.filter(t => t !== topic)
                            : [...current, topic];
                          handleSettingChange('feedPreferences.contentInterests', newInterests);
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--gold-soft)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }
                        }}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="settings-card">
                <h3>Feed Controls</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>More Startup Content</h4>
                    <p>Show more startup-related content</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.feedPreferences?.feedControls?.moreStartup || true}
                    onChange={(checked) => handleSettingChange('feedPreferences.feedControls.moreStartup', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>More Investor Content</h4>
                    <p>Show more investor-related content</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.feedPreferences?.feedControls?.moreInvestor || false}
                    onChange={(checked) => handleSettingChange('feedPreferences.feedControls.moreInvestor', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>More Explorer Content</h4>
                    <p>Show more explorer-related content</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.feedPreferences?.feedControls?.moreExplorer || false}
                    onChange={(checked) => handleSettingChange('feedPreferences.feedControls.moreExplorer', checked)}
                  />
                </div>
              </div>

              <div className="settings-card">
                <h3>Content Density</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Content Density</h4>
                    <p>Choose how compact your feed is</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.feedPreferences?.contentDensity || 'comfortable'}
                    onChange={(e) => handleSettingChange('feedPreferences.contentDensity', e.target.value)}
                  >
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                    <option value="expanded">Expanded</option>
                  </select>
                </div>
              </div>

              <div className="settings-card">
                <h3>Recommendation Controls</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Reset Recommendations</h4>
                    <p>Reset your recommendation history</p>
                  </div>
                  <button className="settings-btn" onClick={() => setResetRecommendationsModalOpen(true)}>Reset</button>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Improve Recommendations</h4>
                    <p>Allow us to improve recommendations based on your activity</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.feedPreferences?.improveRecommendations || true}
                    onChange={(checked) => handleSettingChange('feedPreferences.improveRecommendations', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI Settings */}
          {activeSection === 'ai-settings' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>AI Settings</h1>
                <p>Manage AI features and preferences</p>
              </div>
              
              <div className="settings-card">
                <h3>AI Copilot</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Enable AI</h4>
                    <p>Turn AI features on or off</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.aiSettings?.enabled || true}
                    onChange={(checked) => handleSettingChange('aiSettings.enabled', checked)}
                  />
                </div>
              </div>

              <div className="settings-card">
                <h3>AI Features</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Startup Assistant</h4>
                    <p>Get AI assistance for startup tasks</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.aiSettings?.features?.startupAssistant || true}
                    onChange={(checked) => handleSettingChange('aiSettings.features.startupAssistant', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Investor Assistant</h4>
                    <p>Get AI assistance for investment tasks</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.aiSettings?.features?.investorAssistant || true}
                    onChange={(checked) => handleSettingChange('aiSettings.features.investorAssistant', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Explorer Assistant</h4>
                    <p>Get AI assistance for explorer tasks</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.aiSettings?.features?.explorerAssistant || true}
                    onChange={(checked) => handleSettingChange('aiSettings.features.explorerAssistant', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Messaging Assistant</h4>
                    <p>Get AI assistance for messages</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.aiSettings?.features?.messagingAssistant || true}
                    onChange={(checked) => handleSettingChange('aiSettings.features.messagingAssistant', checked)}
                  />
                </div>
              </div>

              <div className="settings-card">
                <h3>AI Suggestions</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Post Suggestions</h4>
                    <p>Get AI suggestions for posts</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.aiSettings?.suggestions?.post || true}
                    onChange={(checked) => handleSettingChange('aiSettings.suggestions.post', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Startup Suggestions</h4>
                    <p>Get AI suggestions for startups</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.aiSettings?.suggestions?.startup || true}
                    onChange={(checked) => handleSettingChange('aiSettings.suggestions.startup', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Investor Suggestions</h4>
                    <p>Get AI suggestions for investors</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.aiSettings?.suggestions?.investor || true}
                    onChange={(checked) => handleSettingChange('aiSettings.suggestions.investor', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Explorer Suggestions</h4>
                    <p>Get AI suggestions for explorers</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.aiSettings?.suggestions?.explorer || true}
                    onChange={(checked) => handleSettingChange('aiSettings.suggestions.explorer', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Funding Suggestions</h4>
                    <p>Get AI suggestions for funding</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.aiSettings?.suggestions?.funding || true}
                    onChange={(checked) => handleSettingChange('aiSettings.suggestions.funding', checked)}
                  />
                </div>
              </div>

              <div className="settings-card">
                <h3>AI Memory</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>View AI Memory</h4>
                    <p>See what the AI remembers about you</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleAIAction('View AI Memory')}>View</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Clear AI Memory</h4>
                    <p>Clear the AI's memory of your interactions</p>
                  </div>
                  <button className="settings-btn danger" onClick={() => handleAIAction('Clear AI Memory')}>Clear</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Export AI Memory</h4>
                    <p>Export a copy of the AI's memory</p>
                  </div>
                  <button className="settings-btn" onClick={() => handleAIAction('Export AI Memory')}>Export</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>AI Privacy</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Allow Context Learning</h4>
                    <p>Allow AI to learn from your interactions</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.aiSettings?.privacy?.allowContextLearning || true}
                    onChange={(checked) => handleSettingChange('aiSettings.privacy.allowContextLearning', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Notifications</h1>
                <p>Manage your notification preferences</p>
              </div>
              
              <div className="settings-card">
                <h3>Push Notifications</h3>
                
                {[
                  { key: 'messages', label: 'Messages' },
                  { key: 'mentions', label: 'Mentions' },
                  { key: 'comments', label: 'Comments' },
                  { key: 'replies', label: 'Replies' },
                  { key: 'reposts', label: 'Reposts' },
                  { key: 'saves', label: 'Saves' },
                  { key: 'connections', label: 'Connections' }
                ].map(item => (
                  <div key={item.key} className="settings-item">
                    <div className="settings-item-content">
                      <h4>{item.label}</h4>
                      <p>Receive notifications for {item.label.toLowerCase()}</p>
                    </div>
                    <ToggleSwitch 
                      checked={settings?.notifications?.push?.[item.key as keyof typeof settings.notifications.push] || true}
                      onChange={(checked) => handleSettingChange(`notifications.push.${item.key}`, checked)}
                    />
                  </div>
                ))}
              </div>

              <div className="settings-card">
                <h3>Startup Notifications</h3>
                
                {[
                  { key: 'fundingUpdates', label: 'Funding Updates' },
                  { key: 'startupUpdates', label: 'Startup Updates' },
                  { key: 'productLaunches', label: 'Product Launches' }
                ].map(item => (
                  <div key={item.key} className="settings-item">
                    <div className="settings-item-content">
                      <h4>{item.label}</h4>
                      <p>Receive notifications for {item.label.toLowerCase()}</p>
                    </div>
                    <ToggleSwitch 
                      checked={settings?.notifications?.startup?.[item.key as keyof typeof settings.notifications.startup] || true}
                      onChange={(checked) => handleSettingChange(`notifications.startup.${item.key}`, checked)}
                    />
                  </div>
                ))}
              </div>

              <div className="settings-card">
                <h3>Investor Notifications</h3>
                
                {[
                  { key: 'dealFlow', label: 'Deal Flow' },
                  { key: 'investmentOpportunities', label: 'Investment Opportunities' },
                  { key: 'syndicates', label: 'Syndicates' }
                ].map(item => (
                  <div key={item.key} className="settings-item">
                    <div className="settings-item-content">
                      <h4>{item.label}</h4>
                      <p>Receive notifications for {item.label.toLowerCase()}</p>
                    </div>
                    <ToggleSwitch 
                      checked={settings?.notifications?.investor?.[item.key as keyof typeof settings.notifications.investor] || true}
                      onChange={(checked) => handleSettingChange(`notifications.investor.${item.key}`, checked)}
                    />
                  </div>
                ))}
              </div>

              <div className="settings-card">
                <h3>Explorer Notifications</h3>
                
                {[
                  { key: 'reviews', label: 'Reviews' },
                  { key: 'feedbackRequests', label: 'Feedback Requests' },
                  { key: 'contributionAlerts', label: 'Contribution Alerts' }
                ].map(item => (
                  <div key={item.key} className="settings-item">
                    <div className="settings-item-content">
                      <h4>{item.label}</h4>
                      <p>Receive notifications for {item.label.toLowerCase()}</p>
                    </div>
                    <ToggleSwitch 
                      checked={settings?.notifications?.explorer?.[item.key as keyof typeof settings.notifications.explorer] || true}
                      onChange={(checked) => handleSettingChange(`notifications.explorer.${item.key}`, checked)}
                    />
                  </div>
                ))}
              </div>

              <div className="settings-card">
                <h3>Community Notifications</h3>
                
                {[
                  { key: 'communities', label: 'Communities' },
                  { key: 'events', label: 'Events' },
                  { key: 'challenges', label: 'Challenges' }
                ].map(item => (
                  <div key={item.key} className="settings-item">
                    <div className="settings-item-content">
                      <h4>{item.label}</h4>
                      <p>Receive notifications for {item.label.toLowerCase()}</p>
                    </div>
                    <ToggleSwitch 
                      checked={settings?.notifications?.community?.[item.key as keyof typeof settings.notifications.community] || true}
                      onChange={(checked) => handleSettingChange(`notifications.community.${item.key}`, checked)}
                    />
                  </div>
                ))}
              </div>

              <div className="settings-card">
                <h3>Notification Delivery</h3>
                
                {[
                  { key: 'push', label: 'Push' },
                  { key: 'email', label: 'Email' },
                  { key: 'inApp', label: 'In-App' }
                ].map(item => (
                  <div key={item.key} className="settings-item">
                    <div className="settings-item-content">
                      <h4>{item.label}</h4>
                      <p>Receive notifications via {item.label.toLowerCase()}</p>
                    </div>
                    <ToggleSwitch 
                      checked={settings?.notifications?.delivery?.[item.key as keyof typeof settings.notifications.delivery] || true}
                      onChange={(checked) => handleSettingChange(`notifications.delivery.${item.key}`, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connections */}
          {activeSection === 'connections' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Connections</h1>
                <p>Manage your connection and message preferences</p>
              </div>
              
              <div className="settings-card">
                <h3>Connection Requests</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Who Can Send Requests</h4>
                    <p>Choose who can send you connection requests</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.connections?.requests || 'everyone'}
                    onChange={(e) => handleSettingChange('connections.requests', e.target.value)}
                  >
                    <option value="everyone">Everyone</option>
                    <option value="verified">Verified Only</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>
              </div>

              <div className="settings-card">
                <h3>Messages</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Who Can Message You</h4>
                    <p>Choose who can send you messages</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.connections?.messages || 'everyone'}
                    onChange={(e) => handleSettingChange('connections.messages', e.target.value)}
                  >
                    <option value="everyone">Everyone</option>
                    <option value="connections">Connections Only</option>
                  </select>
                </div>
              </div>

              <div className="settings-card">
                <h3>Manage</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Blocked Users</h4>
                    <p>View and manage blocked users</p>
                  </div>
                  <button className="settings-btn">Manage</button>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Muted Users</h4>
                    <p>View and manage muted users</p>
                  </div>
                  <button className="settings-btn">Manage</button>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Hidden Users</h4>
                    <p>View and manage hidden users</p>
                  </div>
                  <button className="settings-btn">Manage</button>
                </div>
              </div>
            </div>
          )}

          {/* Architect Settings */}
          {activeSection === 'architect-settings' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Architect Settings</h1>
                <p>Manage your startup preferences</p>
              </div>
              
              <div className="settings-card">
                <h3>Startup Profile</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Edit Startup</h4>
                    <p>Edit your startup profile</p>
                  </div>
                  <button className="settings-btn">Edit</button>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Startup Visibility</h4>
                    <p>Choose who can see your startup profile</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.architectSettings?.startupProfile?.visibility || 'public'}
                    onChange={(e) => handleSettingChange('architectSettings.startupProfile.visibility', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="connections">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Funding Status</h4>
                    <p>Update your funding status</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.architectSettings?.startupProfile?.fundingStatus || 'actively-raising'}
                    onChange={(e) => handleSettingChange('architectSettings.startupProfile.fundingStatus', e.target.value)}
                  >
                    <option value="pre-funding">Pre-Funding</option>
                    <option value="actively-raising">Actively Raising</option>
                    <option value="funded">Funded</option>
                    <option value="acquired">Acquired</option>
                  </select>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Hiring Status</h4>
                    <p>Update your hiring status</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.architectSettings?.startupProfile?.hiringStatus || 'hiring'}
                    onChange={(e) => handleSettingChange('architectSettings.startupProfile.hiringStatus', e.target.value)}
                  >
                    <option value="not-hiring">Not Hiring</option>
                    <option value="hiring">Hiring</option>
                    <option value="actively-hiring">Actively Hiring</option>
                  </select>
                </div>
              </div>

              <div className="settings-card">
                <h3>Startup Team</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Add Team Member</h4>
                    <p>Add a team member to your startup</p>
                  </div>
                  <button className="settings-btn primary">Add</button>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Remove Team Member</h4>
                    <p>Remove a team member from your startup</p>
                  </div>
                  <button className="settings-btn">Manage</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Startup Preferences</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Fundraising Preferences</h4>
                    <p>Show your fundraising preferences to investors</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.architectSettings?.startupPreferences?.fundraising || true}
                    onChange={(checked) => handleSettingChange('architectSettings.startupPreferences.fundraising', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Partnership Preferences</h4>
                    <p>Show your partnership preferences</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.architectSettings?.startupPreferences?.partnerships || true}
                    onChange={(checked) => handleSettingChange('architectSettings.startupPreferences.partnerships', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Hiring Preferences</h4>
                    <p>Show your hiring preferences</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.architectSettings?.startupPreferences?.hiring || true}
                    onChange={(checked) => handleSettingChange('architectSettings.startupPreferences.hiring', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Catalyst Settings */}
          {activeSection === 'catalyst-settings' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Catalyst Settings</h1>
                <p>Manage your investor preferences</p>
              </div>
              
              <div className="settings-card">
                <h3>Investment Profile</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Preferred Industries</h4>
                    <p>Select your preferred industries</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  {['AI', 'SaaS', 'FinTech', 'HealthTech', 'ClimateTech', 'Web3'].map(industry => {
                    const isSelected = settings?.catalystSettings?.investmentProfile?.preferredIndustries?.includes(industry);
                    return (
                      <button
                        key={industry}
                        style={{
                          padding: '10px 18px',
                          borderRadius: '12px',
                          border: isSelected ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                          background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'var(--dark-card-lighter)',
                          color: isSelected ? 'var(--gold-primary)' : 'var(--text-gray)',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => {
                          const current = settings?.catalystSettings?.investmentProfile?.preferredIndustries || [];
                          const newIndustries = current.includes(industry) 
                            ? current.filter(i => i !== industry)
                            : [...current, industry];
                          handleSettingChange('catalystSettings.investmentProfile.preferredIndustries', newIndustries);
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--gold-soft)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }
                        }}
                      >
                        {industry}
                      </button>
                    );
                  })}
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Ticket Size</h4>
                    <p>Select your typical ticket size</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.catalystSettings?.investmentProfile?.ticketSize || '$500K - $5M'}
                    onChange={(e) => handleSettingChange('catalystSettings.investmentProfile.ticketSize', e.target.value)}
                  >
                    <option value="$0 - $100K">$0 - $100K</option>
                    <option value="$100K - $500K">$100K - $500K</option>
                    <option value="$500K - $5M">$500K - $5M</option>
                    <option value="$5M - $20M">$5M - $20M</option>
                    <option value="$20M+">$20M+</option>
                  </select>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Investment Strategy</h4>
                    <p>Select your investment strategy</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.catalystSettings?.investmentProfile?.investmentStrategy || 'growth'}
                    onChange={(e) => handleSettingChange('catalystSettings.investmentProfile.investmentStrategy', e.target.value)}
                  >
                    <option value="seed">Seed</option>
                    <option value="growth">Growth</option>
                    <option value="late-stage">Late Stage</option>
                    <option value="impact">Impact</option>
                  </select>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Risk Preference</h4>
                    <p>Select your risk preference</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.catalystSettings?.investmentProfile?.riskPreference || 'medium'}
                    onChange={(e) => handleSettingChange('catalystSettings.investmentProfile.riskPreference', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Investment Stage</h4>
                    <p>Select your preferred investment stages</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  {['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'].map(stage => {
                    const isSelected = settings?.catalystSettings?.investmentProfile?.investmentStage?.includes(stage);
                    return (
                      <button
                        key={stage}
                        style={{
                          padding: '10px 18px',
                          borderRadius: '12px',
                          border: isSelected ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                          background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'var(--dark-card-lighter)',
                          color: isSelected ? 'var(--gold-primary)' : 'var(--text-gray)',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => {
                          const current = settings?.catalystSettings?.investmentProfile?.investmentStage || [];
                          const newStages = current.includes(stage) 
                            ? current.filter(s => s !== stage)
                            : [...current, stage];
                          handleSettingChange('catalystSettings.investmentProfile.investmentStage', newStages);
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--gold-soft)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }
                        }}
                      >
                        {stage}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="settings-card">
                <h3>Deal Flow Preferences</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>AI Recommendations</h4>
                    <p>Receive AI-powered deal recommendations</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.catalystSettings?.dealFlowPreferences?.aiRecommendations || true}
                    onChange={(checked) => handleSettingChange('catalystSettings.dealFlowPreferences.aiRecommendations', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Funding Alerts</h4>
                    <p>Receive alerts for new funding opportunities</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.catalystSettings?.dealFlowPreferences?.fundingAlerts || true}
                    onChange={(checked) => handleSettingChange('catalystSettings.dealFlowPreferences.fundingAlerts', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Explorer Settings */}
          {activeSection === 'explorer-settings' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Explorer Settings</h1>
                <p>Manage your explorer preferences</p>
              </div>
              
              <div className="settings-card">
                <h3>Explorer Profile</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Contribution Visibility</h4>
                    <p>Choose who can see your contributions</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.explorerSettings?.explorerProfile?.contributionVisibility || 'public'}
                    onChange={(e) => handleSettingChange('explorerSettings.explorerProfile.contributionVisibility', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="connections">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Review Visibility</h4>
                    <p>Choose who can see your reviews</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.explorerSettings?.explorerProfile?.reviewVisibility || 'public'}
                    onChange={(e) => handleSettingChange('explorerSettings.explorerProfile.reviewVisibility', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="connections">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Feedback Visibility</h4>
                    <p>Choose who can see your feedback</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.explorerSettings?.explorerProfile?.feedbackVisibility || 'public'}
                    onChange={(e) => handleSettingChange('explorerSettings.explorerProfile.feedbackVisibility', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="connections">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="settings-card">
                <h3>Explorer Interests</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Startup Categories</h4>
                    <p>Select your preferred startup categories</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {['AI', 'SaaS', 'FinTech', 'HealthTech', 'ClimateTech', 'Web3'].map(category => (
                    <button
                      key={category}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: '1px solid #e0e0e0',
                        background: settings?.explorerSettings?.explorerInterests?.startupCategories?.includes(category) ? '#007AFF' : '#fff',
                        color: settings?.explorerSettings?.explorerInterests?.startupCategories?.includes(category) ? '#fff' : '#333',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        const current = settings?.explorerSettings?.explorerInterests?.startupCategories || [];
                        const newCategories = current.includes(category) 
                          ? current.filter(c => c !== category)
                          : [...current, category];
                        handleSettingChange('explorerSettings.explorerInterests.startupCategories', newCategories);
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Industries</h4>
                    <p>Select your preferred industries</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {['Technology', 'Healthcare', 'Finance', 'Education', 'Agriculture', 'Defense'].map(industry => (
                    <button
                      key={industry}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: '1px solid #e0e0e0',
                        background: settings?.explorerSettings?.explorerInterests?.industries?.includes(industry) ? '#007AFF' : '#fff',
                        color: settings?.explorerSettings?.explorerInterests?.industries?.includes(industry) ? '#fff' : '#333',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        const current = settings?.explorerSettings?.explorerInterests?.industries || [];
                        const newIndustries = current.includes(industry) 
                          ? current.filter(i => i !== industry)
                          : [...current, industry];
                        handleSettingChange('explorerSettings.explorerInterests.industries', newIndustries);
                      }}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Management */}
          {activeSection === 'content-management' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Content Management</h1>
                <p>Manage your posts and saved content</p>
              </div>
              
              <div className="settings-card">
                <h3>My Content</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Posts</h4>
                    <p>View and manage your posts</p>
                  </div>
                  <button className="settings-btn">View</button>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Drafts</h4>
                    <p>View and manage your drafts</p>
                  </div>
                  <button className="settings-btn">View</button>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Scheduled Posts</h4>
                    <p>View and manage your scheduled posts</p>
                  </div>
                  <button className="settings-btn">View</button>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Archived Posts</h4>
                    <p>View and manage your archived posts</p>
                  </div>
                  <button className="settings-btn">View</button>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Pinned Posts</h4>
                    <p>View and manage your pinned posts</p>
                  </div>
                  <button className="settings-btn">View</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Saved Content</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Collections</h4>
                    <p>View and manage your collections</p>
                  </div>
                  <button className="settings-btn">View</button>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Bookmarks</h4>
                    <p>View and manage your bookmarks</p>
                  </div>
                  <button className="settings-btn">View</button>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Reposts</h4>
                    <p>View and manage your reposts</p>
                  </div>
                  <button className="settings-btn">View</button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics & Export */}
          {activeSection === 'analytics-export' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Analytics & Export</h1>
                <p>Download your data and analytics</p>
              </div>
              
              <div className="settings-card">
                <h3>Download</h3>
                
                {[
                  { key: 'profileData', label: 'Profile Data' },
                  { key: 'posts', label: 'Posts' },
                  { key: 'messages', label: 'Messages' },
                  { key: 'connections', label: 'Connections' },
                  { key: 'investments', label: 'Investments' },
                  { key: 'startupData', label: 'Startup Data' }
                ].map(item => (
                  <div key={item.key} className="settings-item">
                    <div className="settings-item-content">
                      <h4>{item.label}</h4>
                      <p>Download your {item.label.toLowerCase()}</p>
                    </div>
                    <button className="settings-btn">Download</button>
                  </div>
                ))}
              </div>

              <div className="settings-card">
                <h3>Export Formats</h3>
                
                {[
                  { key: 'pdf', label: 'PDF' },
                  { key: 'csv', label: 'CSV' },
                  { key: 'json', label: 'JSON' }
                ].map(format => (
                  <div key={format.key} className="settings-item">
                    <div className="settings-item-content">
                      <h4>{format.label}</h4>
                      <p>Export data as {format.label}</p>
                    </div>
                    <ToggleSwitch 
                      checked={settings?.analyticsExport?.exportFormats?.includes(format.key) || true}
                      onChange={(checked) => {
                        const current = settings?.analyticsExport?.exportFormats || [];
                        const newFormats = checked 
                          ? [...current, format.key]
                          : current.filter(f => f !== format.key);
                        handleSettingChange('analyticsExport.exportFormats', newFormats);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Appearance</h1>
                <p>Customize how TRIARCORA looks for you</p>
              </div>
              
              <div className="settings-card">
                <h3>Theme</h3>
                
                <div className="settings-options-grid">
                  {[
                    { key: 'dark', label: 'Dark' },
                    { key: 'light', label: 'Light' },
                    { key: 'system', label: 'System' }
                  ].map(theme => (
                    <div 
                      key={theme.key}
                      className={`settings-option ${settings?.appearance?.theme === theme.key ? 'selected' : ''}`}
                      onClick={() => handleSettingChange('appearance.theme', theme.key)}
                    >
                      <div className={`theme-preview ${theme.key}`}></div>
                      <span>{theme.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="settings-card">
                <h3>Layout</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Layout</h4>
                    <p>Choose your preferred layout</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.appearance?.layout || 'comfortable'}
                    onChange={(e) => handleSettingChange('appearance.layout', e.target.value)}
                  >
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                  </select>
                </div>
              </div>

              <div className="settings-card">
                <h3>Accessibility</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Font Size</h4>
                    <p>Adjust the text size</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.appearance?.accessibility?.fontSize || 'medium'}
                    onChange={(e) => handleSettingChange('appearance.accessibility.fontSize', e.target.value)}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>High Contrast</h4>
                    <p>Increase contrast for better readability</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.appearance?.accessibility?.highContrast || false}
                    onChange={(checked) => handleSettingChange('appearance.accessibility.highContrast', checked)}
                  />
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Reduced Motion</h4>
                    <p>Minimize animations</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.appearance?.accessibility?.reducedMotion || false}
                    onChange={(checked) => handleSettingChange('appearance.accessibility.reducedMotion', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Advertising & Promotion */}
          {activeSection === 'advertising' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Advertising & Promotion</h1>
                <p>Manage your ad and promotion preferences</p>
              </div>
              
              <div className="settings-card">
                <h3>Ad Preferences</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Personalized Ads</h4>
                    <p>Show personalized ads based on your activity</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.advertising?.adPreferences?.personalized || true}
                    onChange={(checked) => handleSettingChange('advertising.adPreferences.personalized', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Generic Ads</h4>
                    <p>Show generic ads instead</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.advertising?.adPreferences?.generic || false}
                    onChange={(checked) => handleSettingChange('advertising.adPreferences.generic', checked)}
                  />
                </div>
              </div>

              <div className="settings-card">
                <h3>Promotions</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Startup Promotion Preferences</h4>
                    <p>Receive startup promotion offers</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.advertising?.promotions?.startup || true}
                    onChange={(checked) => handleSettingChange('advertising.promotions.startup', checked)}
                  />
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Investor Promotion Preferences</h4>
                    <p>Receive investor promotion offers</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.advertising?.promotions?.investor || true}
                    onChange={(checked) => handleSettingChange('advertising.promotions.investor', checked)}
                  />
                </div>
              </div>

              <div className="settings-card">
                <h3>Sponsored Content Controls</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Sponsored Content</h4>
                    <p>Control how sponsored content is shown</p>
                  </div>
                  <ToggleSwitch 
                    checked={settings?.advertising?.sponsoredContentControls || false}
                    onChange={(checked) => handleSettingChange('advertising.sponsoredContentControls', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Help Center */}
          {activeSection === 'help-center' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Help Center</h1>
                <p>Get help and support</p>
              </div>
              
              <div className="settings-card">
                <h3>Help Articles</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Help Articles</h4>
                    <p>Browse our help articles</p>
                  </div>
                  <button className="settings-btn">Browse</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>FAQs</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>FAQs</h4>
                    <p>View frequently asked questions</p>
                  </div>
                  <button className="settings-btn">View</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Contact Support</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Contact Support</h4>
                    <p>Get in touch with our support team</p>
                  </div>
                  <button className="settings-btn">Contact</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Report Bug</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Report Bug</h4>
                    <p>Report a bug or issue</p>
                  </div>
                  <button className="settings-btn">Report</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Feature Request</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Feature Request</h4>
                    <p>Request a new feature</p>
                  </div>
                  <button className="settings-btn">Request</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Community Guidelines</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Community Guidelines</h4>
                    <p>Read our community guidelines</p>
                  </div>
                  <button className="settings-btn">Read</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Safety Center</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Safety Center</h4>
                    <p>Learn about safety on TRIARCORA</p>
                  </div>
                  <button className="settings-btn">Learn</button>
                </div>
              </div>

              <div className="settings-card">
                <h3>Trust Center</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Trust Center</h4>
                    <p>Learn about trust and security on TRIARCORA</p>
                  </div>
                  <button className="settings-btn">Learn</button>
                </div>
              </div>
            </div>
          )}

          {/* Legal & Policies */}
          {activeSection === 'legal-policies' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Legal & Policies</h1>
                <p>Read our legal documents and policies</p>
              </div>
              
              {[
                { label: 'Professional Community Policies', key: 'policies' },
                { label: 'Privacy Policy', key: 'privacy' },
                { label: 'User Agreement', key: 'agreement' },
                { label: 'Recommendation Transparency', key: 'transparency' },
                { label: 'Terms of Service', key: 'terms' },
                { label: 'Cookie Policy', key: 'cookie' },
                { label: 'Copyright Policy', key: 'copyright' },
                { label: 'End User License Agreement', key: 'eula' },
                { label: 'Open Source Licenses', key: 'opensource' }
              ].map(item => (
                <div key={item.key} className="settings-card">
                  <div className="settings-item">
                    <div className="settings-item-content">
                      <h4>{item.label}</h4>
                      <p>Read our {item.label.toLowerCase()}</p>
                    </div>
                    <button className="settings-btn">Read</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Language & Region */}
          {activeSection === 'language-region' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Language & Region</h1>
                <p>Set your language and region preferences</p>
              </div>
              
              <div className="settings-card">
                <h3>Language</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Language</h4>
                    <p>Choose your preferred language</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.languageRegion?.language || 'en'}
                    onChange={(e) => handleSettingChange('languageRegion.language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                  </select>
                </div>
              </div>

              <div className="settings-card">
                <h3>Region</h3>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Country</h4>
                    <p>Choose your country</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.languageRegion?.country || 'US'}
                    onChange={(e) => handleSettingChange('languageRegion.country', e.target.value)}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="IN">India</option>
                    <option value="CN">China</option>
                    <option value="JP">Japan</option>
                  </select>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Time Zone</h4>
                    <p>Choose your time zone</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.languageRegion?.timeZone || 'America/New_York'}
                    onChange={(e) => handleSettingChange('languageRegion.timeZone', e.target.value)}
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                    <option value="Europe/Paris">Central European Time (CET)</option>
                    <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                  </select>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Date Format</h4>
                    <p>Choose your preferred date format</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.languageRegion?.dateFormat || 'MM/DD/YYYY'}
                    onChange={(e) => handleSettingChange('languageRegion.dateFormat', e.target.value)}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Currency</h4>
                    <p>Choose your preferred currency</p>
                  </div>
                  <select 
                    className="settings-select"
                    value={settings?.languageRegion?.currency || 'USD'}
                    onChange={(e) => handleSettingChange('languageRegion.currency', e.target.value)}
                  >
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                    <option value="CAD">Canadian Dollar (C$)</option>
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="JPY">Japanese Yen (¥)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Account Actions */}
          {activeSection === 'account-actions' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h1>Account Actions</h1>
                <p>Manage your account status and data</p>
              </div>
              
              <div className="settings-card">
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Log Out</h4>
                    <p>Sign out of your account on this device</p>
                  </div>
                  <button className="settings-btn" onClick={async () => {
                      try {
                        await logout();
                        navigate('/');
                      } catch (error) {
                        console.error('Logout failed:', error);
                      }
                    }}>Log Out</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Deactivate Account</h4>
                    <p>Temporarily deactivate your account</p>
                  </div>
                  <button className="settings-btn danger" onClick={handleDeactivateAccount}>Deactivate</button>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-content">
                    <h4>Delete Account</h4>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <button className="settings-btn danger" onClick={handleDeleteAccount}>Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input 
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`premium-toast ${toastType}`}>
          <svg className="premium-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {toastType === 'success' ? (
              <polyline points="20 6 9 17 4 12" />
            ) : (
              <circle cx="12" cy="12" r="10" />
            )}
            {toastType === 'error' && (
              <>
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </>
            )}
          </svg>
          <span className="premium-toast-message">{toastMessage}</span>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editProfileModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setEditProfileModalOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Edit Profile</h3>
              <button className="profile-modal-close" onClick={() => setEditProfileModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="profile-modal-body">
              <div className="profile-edit-section">
                <label className="profile-edit-label">Full Name</label>
                <input
                  type="text"
                  className="profile-edit-input"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>
              <div className="profile-edit-section">
                <label className="profile-edit-label">Bio</label>
                <textarea
                  className="profile-edit-textarea"
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                />
              </div>
              <div className="profile-edit-section">
                <label className="profile-edit-label">Headline</label>
                <input
                  type="text"
                  className="profile-edit-input"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                />
              </div>
              <div className="profile-edit-section">
                <label className="profile-edit-label">Website</label>
                <input
                  type="text"
                  className="profile-edit-input"
                  value={editFormData.website}
                  onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                />
              </div>
              <div className="profile-edit-section">
                <label className="profile-edit-label">Location</label>
                <input
                  type="text"
                  className="profile-edit-input"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                />
              </div>
            </div>
            <div className="profile-modal-footer">
              <button className="profile-modal-btn cancel" onClick={() => setEditProfileModalOpen(false)}>
                Cancel
              </button>
              <button className="profile-modal-btn save" onClick={handleSaveProfile}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Management Modal */}
      {roleModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setRoleModalOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Manage Roles</h3>
              <button className="profile-modal-close" onClick={() => setRoleModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="profile-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['ARCHITECT', 'CATALYST', 'EXPLORER'].map((role) => {
                  const hasRole = userData?.mainRole === role || userData?.extraRole === role;
                  const isActive = userData?.mainRole === role;
                  return (
                    <div
                      key={role}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: `2px solid ${isActive ? '#8B5CF6' : '#333'}`,
                        background: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: '#fff' }}>
                          {role.charAt(0) + role.slice(1).toLowerCase()}
                        </h4>
                        <p style={{ margin: 0, color: '#9CA3AF', fontSize: '14px' }}>
                          {hasRole ? (isActive ? 'Currently active' : 'Extra role') : 'Add this role to your account'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {hasRole ? (
                          <>
                            {!isActive && (
                              <button
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  border: '1px solid #8B5CF6',
                                  background: 'transparent',
                                  color: '#8B5CF6',
                                  cursor: 'pointer',
                                  fontSize: '14px'
                                }}
                                onClick={() => handleSwitchRole(role as any)}
                              >
                                Switch
                              </button>
                            )}
                            {!isActive && (
                              <button
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  border: '1px solid #EF4444',
                                  background: 'transparent',
                                  color: '#EF4444',
                                  cursor: 'pointer',
                                  fontSize: '14px'
                                }}
                                onClick={handleRemoveRole}
                              >
                                Remove
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              background: '#8B5CF6',
                              color: '#fff',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                            onClick={() => handleAddRole(role as any)}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="profile-modal-footer">
              <button className="profile-modal-btn cancel" onClick={() => setRoleModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {changePasswordModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setChangePasswordModalOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Change Password</h3>
              <button className="profile-modal-close" onClick={() => setChangePasswordModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="profile-modal-body">
              <div className="profile-edit-section">
                <label className="profile-edit-label">Current Password</label>
                <div className="password-input-container">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    className="profile-edit-input"
                    value={passwordFormData.currentPassword}
                    onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="profile-edit-section">
                <label className="profile-edit-label">New Password</label>
                <div className="password-input-container">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="profile-edit-input"
                    value={passwordFormData.newPassword}
                    onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="profile-edit-section">
                <label className="profile-edit-label">Confirm New Password</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="profile-edit-input"
                    value={passwordFormData.confirmPassword}
                    onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="profile-modal-footer">
              <button className="profile-modal-btn cancel" onClick={() => setChangePasswordModalOpen(false)}>
                Cancel
              </button>
              <button className="profile-modal-btn save" onClick={handleChangePassword}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication Modal */}
      {twoFactorModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setTwoFactorModalOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Two-Factor Authentication</h3>
              <button className="profile-modal-close" onClick={() => setTwoFactorModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="profile-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: `2px solid ${twoFactorMethod === 'app' ? '#8B5CF6' : '#333'}`,
                    background: 'rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setTwoFactorMethod('app')}
                >
                  <h4 style={{ margin: '0 0 4px 0', color: '#fff' }}>Authenticator App</h4>
                  <p style={{ margin: 0, color: '#9CA3AF', fontSize: '14px' }}>Use apps like Google Authenticator or Authy</p>
                </div>
                <div
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: `2px solid ${twoFactorMethod === 'sms' ? '#8B5CF6' : '#333'}`,
                    background: 'rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setTwoFactorMethod('sms')}
                >
                  <h4 style={{ margin: '0 0 4px 0', color: '#fff' }}>SMS</h4>
                  <p style={{ margin: 0, color: '#9CA3AF', fontSize: '14px' }}>Receive verification codes via text message</p>
                </div>
              </div>
            </div>
            <div className="profile-modal-footer">
              <button className="profile-modal-btn cancel" onClick={() => setTwoFactorModalOpen(false)}>
                Cancel
              </button>
              <button className="profile-modal-btn save" onClick={handleTwoFactorSetup}>
                Set up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Format Modal */}
      {downloadFormatModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setDownloadFormatModalOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Download Data</h3>
              <button className="profile-modal-close" onClick={() => setDownloadFormatModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="profile-modal-body">
              <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>Choose a format to download your data:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    background: 'rgba(0,0,0,0.3)',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                  onClick={() => downloadData('json')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#8B5CF6';
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                    e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>📄</span>
                    <div>
                      <div style={{ color: '#fff', fontWeight: '600' }}>JSON</div>
                      <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Structured data format for easy parsing</div>
                    </div>
                  </div>
                </button>
                <button
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    background: 'rgba(0,0,0,0.3)',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                  onClick={() => downloadData('csv')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#8B5CF6';
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                    e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>📊</span>
                    <div>
                      <div style={{ color: '#fff', fontWeight: '600' }}>CSV</div>
                      <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Spreadsheet format for easy viewing</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div className="profile-modal-footer">
              <button className="profile-modal-btn cancel" onClick={() => setDownloadFormatModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Data Confirmation Modal */}
      {deleteDataModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setDeleteDataModalOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Delete Data</h3>
              <button className="profile-modal-close" onClick={() => setDeleteDataModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="profile-modal-body">
              <p style={{ color: '#fff', marginBottom: '16px', fontSize: '16px', fontWeight: '500' }}>
                Are you sure you want to delete your data?
              </p>
              <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>
                This will delete:
              </p>
              <ul style={{ color: '#9CA3AF', paddingLeft: '20px', marginBottom: '24px' }}>
                <li>Search history</li>
                <li>AI memory</li>
                <li>Activity history</li>
              </ul>
              <p style={{ color: '#EF4444', fontSize: '14px' }}>
                This action is irreversible!
              </p>
            </div>
            <div className="profile-modal-footer">
              <button className="profile-modal-btn cancel" onClick={() => setDeleteDataModalOpen(false)}>
                Cancel
              </button>
              <button 
                className="profile-modal-btn save" 
                style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }} 
                onClick={deleteData}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Recommendations Confirmation Modal */}
      {resetRecommendationsModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setResetRecommendationsModalOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Reset Recommendations</h3>
              <button className="profile-modal-close" onClick={() => setResetRecommendationsModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="profile-modal-body">
              <p style={{ color: '#fff', marginBottom: '16px', fontSize: '16px', fontWeight: '500' }}>
                Reset your recommendations?
              </p>
              <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>
                This will:
              </p>
              <ul style={{ color: '#9CA3AF', paddingLeft: '20px', marginBottom: '24px' }}>
                <li>Delete your user preferences</li>
                <li>Rebuild your feed</li>
                <li>Reset content interests to default</li>
              </ul>
            </div>
            <div className="profile-modal-footer">
              <button className="profile-modal-btn cancel" onClick={() => setResetRecommendationsModalOpen(false)}>
                Cancel
              </button>
              <button className="profile-modal-btn save" onClick={resetRecommendations}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Memory Modal */}
      {aiMemoryModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setAiMemoryModalOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="profile-modal-header">
              <h3>AI Memory</h3>
              <button className="profile-modal-close" onClick={() => setAiMemoryModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="profile-modal-body">
              {/* Saved Preferences */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ color: '#fff', marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>
                  🎯 Saved Preferences
                </h4>
                <div style={{ 
                  padding: '16px', 
                  borderRadius: '12px', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <p style={{ color: '#9CA3AF', marginBottom: '8px', fontSize: '14px' }}>
                    <strong>Main Role:</strong> {userData?.mainRole || 'Architect'}
                  </p>
                  <p style={{ color: '#9CA3AF', marginBottom: '8px', fontSize: '14px' }}>
                    <strong>Content Interests:</strong> {settings?.feedPreferences?.contentInterests?.join(', ') || 'AI, SaaS, FinTech'}
                  </p>
                  <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
                    <strong>Content Density:</strong> {settings?.feedPreferences?.contentDensity || 'comfortable'}
                  </p>
                </div>
              </div>

              {/* Interests */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ color: '#fff', marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>
                  💡 Interests
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {(settings?.feedPreferences?.contentInterests || ['AI', 'SaaS', 'FinTech']).map((interest, idx) => (
                    <span key={idx} style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(102, 126, 234, 0.2))',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#FFD700',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Context */}
              <div>
                <h4 style={{ color: '#fff', marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>
                  🤖 AI Context
                </h4>
                <div style={{ 
                  padding: '16px', 
                  borderRadius: '12px', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <p style={{ color: '#9CA3AF', marginBottom: '8px', fontSize: '14px' }}>
                    The AI remembers recent interactions with the AI Copilot to provide personalized assistance. This context helps the AI give more relevant responses based on your previous conversations.
                  </p>
                  <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
                    <strong>Note:</strong> Context is temporary and only used during your current session for better AI assistance.
                  </p>
                </div>
              </div>
            </div>
            <div className="profile-modal-footer">
              <button className="profile-modal-btn cancel" onClick={() => setAiMemoryModalOpen(false)}>
                Close
              </button>
              <button 
                className="profile-modal-btn" 
                style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
                onClick={() => {
                  handleAIAction('Clear AI Memory');
                  setAiMemoryModalOpen(false);
                }}
              >
                Clear Memory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {deleteAccountModalOpen && (
        <div className="profile-modal-overlay" onClick={cancelDeleteAccount}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Delete Account</h3>
              <button className="profile-modal-close" onClick={cancelDeleteAccount}>
                ×
              </button>
            </div>
            <div className="profile-modal-body">
              {deleteAccountStep === 1 ? (
                <div>
                  <p style={{ color: '#fff', marginBottom: '16px', fontSize: '16px', fontWeight: '500' }}>
                    To continue, please enter your password:
                  </p>
                  <div className="profile-edit-section">
                    <label className="profile-edit-label">Password</label>
                    <input
                      type="password"
                      className="profile-edit-input"
                      value={deleteAccountPassword}
                      onChange={(e) => setDeleteAccountPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ color: '#fff', marginBottom: '16px', fontSize: '16px', fontWeight: '500' }}>
                    Are you absolutely sure you want to delete your account?
                  </p>
                  <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>
                    This will permanently delete:
                  </p>
                  <ul style={{ color: '#9CA3AF', paddingLeft: '20px', marginBottom: '24px' }}>
                    <li>Your profile and personal information</li>
                    <li>All your posts, drafts, and saved items</li>
                    <li>Connections and messages</li>
                    <li>Notifications</li>
                    <li>Role data and settings</li>
                    <li>User account and authentication</li>
                  </ul>
                  <p style={{ color: '#EF4444', fontSize: '14px' }}>
                    This action is irreversible!
                  </p>
                </div>
              )}
            </div>
            <div className="profile-modal-footer">
              <button className="profile-modal-btn cancel" onClick={cancelDeleteAccount}>
                Cancel
              </button>
              <button 
                className="profile-modal-btn" 
                style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
                onClick={confirmDeleteAccount}
                disabled={isDeletingAccount}
              >
                {isDeletingAccount 
                  ? 'Deleting...' 
                  : deleteAccountStep === 1 
                    ? 'Continue' 
                    : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default TriarcoraSettings;
