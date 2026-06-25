import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import './VerificationCenter.css';
import { Timestamp } from 'firebase/firestore';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-1.82.33 1.65 1.65 0 0 0-1.01 2.83v.06a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.01-2.83v-.06a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.01-2.83v-.06a2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1.01 2.83z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const EmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IdCardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h15A2.5 2.5 0 0 1 22 4.5v15A2.5 2.5 0 0 1 19.5 22h-15A2.5 2.5 0 0 1 2 19.5v-15z" />
    <path d="M10 8h6" />
    <path d="M10 12h6" />
    <path d="M10 16h6" />
    <circle cx="6" cy="10" r="2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const StartupIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const InvestorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ExplorerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12C0 18.63 5.37 24 12 24C18.63 24 24 18.63 24 12C24 5.37 18.63 0 12 0ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const VerificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const { userData, updateUserData, aiVerificationEngine, riskEngine, userName } = useUser();
  const { sendVerificationEmail, checkEmailVerification } = useAuth();
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error' | ''>('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Phone Verification State
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);

  // Identity Verification State
  const [idType, setIdType] = useState<string>('Passport');
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  // LinkedIn Verification State
  const [linkedinUrl, setLinkedinUrl] = useState<string>('');

  // Website Verification State
  const [websiteUrl, setWebsiteUrl] = useState<string>('');

  // Startup Verification State
  const [startupName, setStartupName] = useState<string>('');
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [officialEmail, setOfficialEmail] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [industry, setIndustry] = useState<string>('Technology');

  // Investor Verification State
  const [firmName, setFirmName] = useState<string>('');
  const [investmentFocus, setInvestmentFocus] = useState<string>('Early Stage');
  const [geographicFocus, setGeographicFocus] = useState<string>('');
  const [investorLinkedinUrl, setInvestorLinkedinUrl] = useState<string>('');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
      setToastType('');
    }, 4000);
  };

  const handleFileUpload = (file: File, setFile: React.Dispatch<React.SetStateAction<File | null>>, setPreview: React.Dispatch<React.SetStateAction<string | null>>) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetModalState = () => {
    setPhoneNumber('');
    setOtp('');
    setOtpSent(false);
    setIdType('Passport');
    setIdDocument(null);
    setSelfie(null);
    setIdPreview(null);
    setSelfiePreview(null);
    setLinkedinUrl('');
    setWebsiteUrl('');
    setStartupName('');
    setRegistrationNumber('');
    setOfficialEmail('');
    setCountry('');
    setIndustry('Technology');
    setFirmName('');
    setInvestmentFocus('Early Stage');
    setGeographicFocus('');
    setInvestorLinkedinUrl('');
  };

  const closeModal = () => {
    resetModalState();
    setActiveModal(null);
  };

  const handleEmailVerification = async () => {
    try {
      await sendVerificationEmail();
      showToast('Verification email sent! Please check your inbox.', 'success');
    } catch (error) {
      showToast('Failed to send verification email.', 'error');
    }
  };

  const handleVerificationComplete = (verificationType: string, aiResult: any, riskResult: any) => {
    let newStatus: any = 'pending';
    let isVerified = false;
    
    // Check if we need admin review
    if (riskEngine.needsAdminReview(aiResult.recommendation, riskResult.riskLevel)) {
      newStatus = 'ready_for_approval';
    } else if (aiResult.recommendation === 'approve') {
      // Auto-approve only if low risk and AI recommends approve
      isVerified = true;
      newStatus = 'approved';
    } else if (aiResult.recommendation === 'reject') {
      newStatus = 'rejected';
    } else {
      newStatus = 'ready_for_approval';
    }
    
    return { newStatus, isVerified };
  };

  const verificationBadges = [
    {
      id: 'email',
      name: 'Email Verified',
      description: 'Verify your email address',
      icon: EmailIcon,
      verified: userData?.verification?.emailVerified || false,
      status: userData?.verification?.status || 'unverified',
      action: userData?.verification?.emailVerified ? null : handleEmailVerification,
      actionText: userData?.verification?.emailVerified ? 'Verified' : 'Verify Email'
    },
    {
      id: 'phone',
      name: 'Phone Verified',
      description: 'Verify your phone number',
      icon: PhoneIcon,
      verified: userData?.verification?.phoneVerified || false,
      status: userData?.verification?.status || 'unverified',
      action: userData?.verification?.phoneVerified ? null : () => setActiveModal('phone'),
      actionText: userData?.verification?.phoneVerified ? 'Verified' : 'Verify Phone'
    },
    {
      id: 'identity',
      name: 'Identity Verified',
      description: 'Verify your identity with government ID',
      icon: IdCardIcon,
      verified: userData?.verification?.identityVerified || false,
      status: userData?.verification?.status || 'unverified',
      action: userData?.verification?.identityVerified ? null : () => setActiveModal('identity'),
      actionText: userData?.verification?.identityVerified ? 'Verified' : 'Verify Identity'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Verified',
      description: 'Connect and verify your LinkedIn profile',
      icon: LinkedinIcon,
      verified: userData?.verification?.linkedinVerified || false,
      status: userData?.verification?.status || 'unverified',
      action: userData?.verification?.linkedinVerified ? null : () => setActiveModal('linkedin'),
      actionText: userData?.verification?.linkedinVerified ? 'Verified' : 'Connect LinkedIn'
    },
    {
      id: 'website',
      name: 'Website Verified',
      description: 'Verify your personal or company website',
      icon: GlobeIcon,
      verified: userData?.verification?.websiteVerified || false,
      status: userData?.verification?.status || 'unverified',
      action: userData?.verification?.websiteVerified ? null : () => setActiveModal('website'),
      actionText: userData?.verification?.websiteVerified ? 'Verified' : 'Verify Website'
    },
    {
      id: 'startup',
      name: 'Startup Verified',
      description: 'Verify your startup (for Architects)',
      icon: StartupIcon,
      verified: userData?.verification?.startupVerified || false,
      status: userData?.verification?.status || 'unverified',
      action: userData?.verification?.startupVerified ? null : () => setActiveModal('startup'),
      actionText: userData?.verification?.startupVerified ? 'Verified' : 'Verify Startup',
      visible: userData?.mainRole === 'ARCHITECT'
    },
    {
      id: 'investor',
      name: 'Investor Verified',
      description: 'Verify your investor status (for Catalysts)',
      icon: InvestorIcon,
      verified: userData?.verification?.investorVerified || false,
      status: userData?.verification?.status || 'unverified',
      action: userData?.verification?.investorVerified ? null : () => setActiveModal('investor'),
      actionText: userData?.verification?.investorVerified ? 'Verified' : 'Verify Investor',
      visible: userData?.mainRole === 'CATALYST'
    },
    {
      id: 'explorer',
      name: 'Explorer Verified',
      description: 'Verify your explorer status',
      icon: ExplorerIcon,
      verified: userData?.verification?.explorerVerified || false,
      status: userData?.verification?.status || 'unverified',
      action: userData?.verification?.explorerVerified ? null : () => setActiveModal('explorer'),
      actionText: userData?.verification?.explorerVerified ? 'Verified' : 'Verify Explorer',
      visible: userData?.mainRole === 'EXPLORER'
    }
  ];

  const trustScore = userData?.verification?.trustScore || 0;

  const handleLogout = () => {
    localStorage.removeItem('currentUserId');
    window.location.href = '/';
  };

  const VerificationModal = () => {
    if (!activeModal) return null;

    const modalContent = () => {
      switch (activeModal) {
        case 'phone':
          return (
            <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
              <div className="verification-modal-header">
                <h2>Verify Your Phone Number</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                  <CloseIcon />
                </button>
              </div>
              <div className="verification-modal-body">
                <div className="verification-form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={otpSent || isVerifying}
                  />
                </div>
                {otpSent && (
                  <div className="verification-form-group">
                    <label>Enter OTP</label>
                    <input 
                      type="text" 
                      placeholder="123456" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={isVerifying}
                    />
                  </div>
                )}
                <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>
                  We'll send a verification code to your phone number.
                </p>
              </div>
              <div className="verification-modal-footer">
                <button className="modal-btn secondary" onClick={closeModal} disabled={isVerifying}>Cancel</button>
                {!otpSent ? (
                  <button 
                    className="modal-btn primary" 
                    onClick={() => {
                      if (!phoneNumber) {
                        showToast('Please enter phone number', 'error');
                        return;
                      }
                      setOtpSent(true);
                      showToast('OTP sent to your phone! (Demo: use 123456)', 'success');
                    }}
                    disabled={isVerifying}
                  >
                    Send Code
                  </button>
                ) : (
                  <button 
                    className="modal-btn primary" 
                    onClick={async () => {
                      if (!otp) {
                        showToast('Please enter OTP', 'error');
                        return;
                      }
                      setIsVerifying(true);
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      
                      // Simple OTP check for demo
                      if (otp === '123456') {
                        // Calculate risk
                        const riskResult = riskEngine.calculateRiskScore(userData?.verification);
                        
                        if (userData) {
                          updateUserData({
                            verification: {
                              ...userData.verification,
                              phoneVerified: true,
                              phoneConfidenceScore: 100,
                              verificationRiskScore: riskResult.riskScore,
                              riskLevel: riskResult.riskLevel,
                              status: 'approved',
                              submittedAt: Timestamp.now()
                            }
                          });
                        }
                        closeModal();
                        showToast('Phone number verified!', 'success');
                      } else {
                        // Increment failed attempts
                        if (userData) {
                          updateUserData({
                            verification: {
                              ...userData.verification,
                              failedAttempts: (userData.verification?.failedAttempts || 0) + 1
                            }
                          });
                        }
                        showToast('Invalid OTP. Please try again.', 'error');
                      }
                      setIsVerifying(false);
                    }}
                    disabled={isVerifying}
                  >
                    {isVerifying ? 'AI Verifying...' : 'Verify OTP'}
                  </button>
                )}
              </div>
            </div>
          );
        case 'identity':
          return (
            <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
              <div className="verification-modal-header">
                <h2>Verify Your Identity</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                  <CloseIcon />
                </button>
              </div>
              <div className="verification-modal-body">
                <div className="verification-form-group">
                  <label>Government ID Type</label>
                  <select 
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    disabled={isVerifying}
                  >
                    <option>Passport</option>
                    <option>Driver's License</option>
                    <option>National ID Card</option>
                  </select>
                </div>
                <div className="verification-form-group">
                  <label>Upload ID Document</label>
                  <div 
                    className="file-upload-area"
                    onClick={() => document.getElementById('id-upload')?.click()}
                  >
                    {idPreview ? (
                      <img src={idPreview} alt="ID Preview" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }} />
                    ) : (
                      <>
                        <UploadIcon />
                        <p>Click to upload or drag and drop</p>
                        <p style={{ fontSize: '12px' }}>JPG, PNG, or PDF (Max 5MB)</p>
                      </>
                    )}
                    <input 
                      id="id-upload" 
                      type="file" 
                      accept="image/*,.pdf" 
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], setIdDocument, setIdPreview);
                        }
                      }}
                      disabled={isVerifying}
                    />
                  </div>
                </div>
                <div className="verification-form-group">
                  <label>Upload Selfie</label>
                  <div 
                    className="file-upload-area"
                    onClick={() => document.getElementById('selfie-upload')?.click()}
                  >
                    {selfiePreview ? (
                      <img src={selfiePreview} alt="Selfie Preview" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }} />
                    ) : (
                      <>
                        <UploadIcon />
                        <p>Click to upload or drag and drop</p>
                        <p style={{ fontSize: '12px' }}>JPG or PNG (Max 5MB)</p>
                      </>
                    )}
                    <input 
                      id="selfie-upload" 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], setSelfie, setSelfiePreview);
                        }
                      }}
                      disabled={isVerifying}
                    />
                  </div>
                </div>
              </div>
              <div className="verification-modal-footer">
                <button className="modal-btn secondary" onClick={closeModal} disabled={isVerifying}>Cancel</button>
                <button 
                  className="modal-btn primary" 
                  onClick={async () => {
                    if (!idDocument || !selfie) {
                      showToast('Please upload both ID document and selfie', 'error');
                      return;
                    }
                    setIsVerifying(true);
                    await new Promise(resolve => setTimeout(resolve, 2500));
                    
                    // AI document review
                    const docResult = aiVerificationEngine.reviewDocument(idDocument);
                    const selfieResult = aiVerificationEngine.reviewSelfie(selfie);
                    const combinedConfidence = Math.round((docResult.confidenceScore + selfieResult.confidenceScore) / 2);
                    
                    // Calculate risk
                    const riskResult = riskEngine.calculateRiskScore(userData?.verification);
                    
                    // Determine if we need admin review
                    const needsReview = riskEngine.needsAdminReview(docResult.recommendation, riskResult.riskLevel);
                    
                    if (userData) {
                      if (needsReview) {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            identityConfidenceScore: combinedConfidence,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'ready_for_approval',
                            submittedAt: Timestamp.now()
                          }
                        });
                        closeModal();
                        showToast(`AI confidence: ${combinedConfidence}% - waiting for admin approval`, 'success');
                      } else if (docResult.recommendation === 'approve') {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            identityVerified: true,
                            identityConfidenceScore: combinedConfidence,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'approved',
                            reviewedAt: Timestamp.now(),
                            submittedAt: Timestamp.now()
                          }
                        });
                        closeModal();
                        showToast(`Identity verified! AI confidence: ${combinedConfidence}%`, 'success');
                      } else {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            identityConfidenceScore: combinedConfidence,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'rejected',
                            failedAttempts: (userData.verification?.failedAttempts || 0) + 1
                          }
                        });
                        closeModal();
                        showToast(`Verification rejected. AI confidence: ${combinedConfidence}%`, 'error');
                      }
                    }
                    
                    // Clear files immediately
                    setIdDocument(null);
                    setSelfie(null);
                    setIdPreview(null);
                    setSelfiePreview(null);
                    setIsVerifying(false);
                  }}
                  disabled={isVerifying}
                >
                  {isVerifying ? 'AI Analyzing...' : 'Verify Now'}
                </button>
              </div>
            </div>
          );
        case 'linkedin':
          return (
            <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
              <div className="verification-modal-header">
                <h2>Connect LinkedIn</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                  <CloseIcon />
                </button>
              </div>
              <div className="verification-modal-body">
                <div className="verification-form-group">
                  <label>LinkedIn Profile URL</label>
                  <input 
                    type="url" 
                    placeholder="https://linkedin.com/in/yourprofile" 
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>
                  We'll verify your LinkedIn profile to confirm your professional identity.
                </p>
              </div>
              <div className="verification-modal-footer">
                <button className="modal-btn secondary" onClick={closeModal} disabled={isVerifying}>Cancel</button>
                <button 
                  className="modal-btn primary" 
                  onClick={async () => {
                    if (!linkedinUrl) {
                      showToast('Please enter LinkedIn URL', 'error');
                      return;
                    }
                    if (!linkedinUrl.includes('linkedin.com')) {
                      showToast('Please enter a valid LinkedIn URL', 'error');
                      return;
                    }
                    setIsVerifying(true);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // AI LinkedIn verification
                    const aiResult = aiVerificationEngine.verifyLinkedIn(linkedinUrl, userName);
                    
                    // Calculate risk
                    const riskResult = riskEngine.calculateRiskScore(userData?.verification);
                    
                    // Determine if we need admin review
                    const needsReview = riskEngine.needsAdminReview(aiResult.recommendation, riskResult.riskLevel);
                    
                    if (userData) {
                      if (needsReview) {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            linkedinConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'ready_for_approval',
                            submittedAt: Timestamp.now()
                          }
                        });
                        closeModal();
                        showToast(`AI confidence: ${aiResult.confidenceScore}% - waiting for admin approval`, 'success');
                      } else if (aiResult.recommendation === 'approve') {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            linkedinVerified: true,
                            linkedinConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'approved',
                            reviewedAt: Timestamp.now(),
                            submittedAt: Timestamp.now()
                          }
                        });
                        closeModal();
                        showToast(`LinkedIn verified! AI confidence: ${aiResult.confidenceScore}%`, 'success');
                      } else {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            linkedinConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'rejected',
                            failedAttempts: (userData.verification?.failedAttempts || 0) + 1
                          }
                        });
                        closeModal();
                        showToast(`Verification rejected. AI confidence: ${aiResult.confidenceScore}%`, 'error');
                      }
                    }
                    setIsVerifying(false);
                  }}
                  disabled={isVerifying}
                >
                  {isVerifying ? 'AI Verifying...' : 'Connect LinkedIn'}
                </button>
              </div>
            </div>
          );
        case 'website':
          return (
            <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
              <div className="verification-modal-header">
                <h2>Verify Your Website</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                  <CloseIcon />
                </button>
              </div>
              <div className="verification-modal-body">
                <div className="verification-form-group">
                  <label>Website URL</label>
                  <input 
                    type="url" 
                    placeholder="https://yourwebsite.com" 
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>
                  We'll verify your website instantly.
                </p>
              </div>
              <div className="verification-modal-footer">
                <button className="modal-btn secondary" onClick={closeModal} disabled={isVerifying}>Cancel</button>
                <button 
                  className="modal-btn primary" 
                  onClick={async () => {
                    if (!websiteUrl) {
                      showToast('Please enter website URL', 'error');
                      return;
                    }
                    setIsVerifying(true);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // AI website verification
                    const aiResult = aiVerificationEngine.verifyWebsite(websiteUrl);
                    
                    // Calculate risk
                    const riskResult = riskEngine.calculateRiskScore(userData?.verification);
                    
                    // Determine if we need admin review
                    const needsReview = riskEngine.needsAdminReview(aiResult.recommendation, riskResult.riskLevel);
                    
                    if (userData) {
                      if (needsReview) {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            websiteConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'ready_for_approval',
                            submittedAt: Timestamp.now()
                          }
                        });
                        closeModal();
                        showToast(`AI confidence: ${aiResult.confidenceScore}% - waiting for admin approval`, 'success');
                      } else if (aiResult.recommendation === 'approve') {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            websiteVerified: true,
                            websiteConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'approved',
                            reviewedAt: Timestamp.now(),
                            submittedAt: Timestamp.now()
                          }
                        });
                        closeModal();
                        showToast(`Website verified! AI confidence: ${aiResult.confidenceScore}%`, 'success');
                      } else {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            websiteConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'rejected',
                            failedAttempts: (userData.verification?.failedAttempts || 0) + 1
                          }
                        });
                        closeModal();
                        showToast(`Verification rejected. AI confidence: ${aiResult.confidenceScore}%`, 'error');
                      }
                    }
                    setIsVerifying(false);
                  }}
                  disabled={isVerifying}
                >
                  {isVerifying ? 'AI Checking...' : 'Verify Website'}
                </button>
              </div>
            </div>
          );
        case 'startup':
          return (
            <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
              <div className="verification-modal-header">
                <h2>Verify Your Startup</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                  <CloseIcon />
                </button>
              </div>
              <div className="verification-modal-body">
                <div className="verification-form-group">
                  <label>Startup Name</label>
                  <input 
                    type="text" 
                    placeholder="Your startup name" 
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>
                <div className="verification-form-group">
                  <label>Company Registration Number</label>
                  <input 
                    type="text" 
                    placeholder="Enter registration number" 
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>
                <div className="verification-form-group">
                  <label>Official Email</label>
                  <input 
                    type="email" 
                    placeholder="official@yourstartup.com" 
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>
                <div className="verification-form-group">
                  <label>Country</label>
                  <input 
                    type="text" 
                    placeholder="Your country" 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>
                <div className="verification-form-group">
                  <label>Industry</label>
                  <select 
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    disabled={isVerifying}
                  >
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>E-commerce</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="verification-modal-footer">
                <button className="modal-btn secondary" onClick={closeModal} disabled={isVerifying}>Cancel</button>
                <button 
                  className="modal-btn primary" 
                  onClick={async () => {
                    if (!startupName || !registrationNumber || !officialEmail || !country) {
                      showToast('Please fill in all required fields', 'error');
                      return;
                    }
                    setIsVerifying(true);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // AI startup verification
                    const aiResult = aiVerificationEngine.verifyStartup({
                      name: startupName,
                      website: websiteUrl || 'https://example.com',
                      email: officialEmail,
                      country: country,
                      industry: industry
                    });
                    
                    // Calculate risk
                    const riskResult = riskEngine.calculateRiskScore(userData?.verification);
                    
                    // Determine if we need admin review
                    const needsReview = riskEngine.needsAdminReview(aiResult.recommendation, riskResult.riskLevel);
                    
                    if (userData) {
                      if (needsReview) {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            startupConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'ready_for_approval',
                            submittedAt: Timestamp.now()
                          }
                        });
                        closeModal();
                        showToast(`AI confidence: ${aiResult.confidenceScore}% - waiting for admin approval`, 'success');
                      } else if (aiResult.recommendation === 'approve') {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            startupVerified: true,
                            startupConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'approved',
                            reviewedAt: Timestamp.now(),
                            submittedAt: Timestamp.now()
                          }
                        });
                        closeModal();
                        showToast(`Startup verified! AI confidence: ${aiResult.confidenceScore}%`, 'success');
                      } else {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            startupConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'rejected',
                            failedAttempts: (userData.verification?.failedAttempts || 0) + 1
                          }
                        });
                        closeModal();
                        showToast(`Verification rejected. AI confidence: ${aiResult.confidenceScore}%`, 'error');
                      }
                    }
                    setIsVerifying(false);
                  }}
                  disabled={isVerifying}
                >
                  {isVerifying ? 'AI Reviewing...' : 'Verify Startup'}
                </button>
              </div>
            </div>
          );
        case 'investor':
          return (
            <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
              <div className="verification-modal-header">
                <h2>Verify Your Investor Status</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                  <CloseIcon />
                </button>
              </div>
              <div className="verification-modal-body">
                <div className="verification-form-group">
                  <label>Investment Firm Name</label>
                  <input 
                    type="text" 
                    placeholder="Your firm name" 
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>
                <div className="verification-form-group">
                  <label>Investment Focus</label>
                  <select 
                    value={investmentFocus}
                    onChange={(e) => setInvestmentFocus(e.target.value)}
                    disabled={isVerifying}
                  >
                    <option>Early Stage</option>
                    <option>Seed</option>
                    <option>Series A</option>
                    <option>Series B+</option>
                  </select>
                </div>
                <div className="verification-form-group">
                  <label>Geographic Focus</label>
                  <input 
                    type="text" 
                    placeholder="e.g., North America, Europe" 
                    value={geographicFocus}
                    onChange={(e) => setGeographicFocus(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>
                <div className="verification-form-group">
                  <label>LinkedIn Profile</label>
                  <input 
                    type="url" 
                    placeholder="https://linkedin.com/in/yourprofile" 
                    value={investorLinkedinUrl}
                    onChange={(e) => setInvestorLinkedinUrl(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>
              </div>
              <div className="verification-modal-footer">
                <button className="modal-btn secondary" onClick={closeModal} disabled={isVerifying}>Cancel</button>
                <button 
                  className="modal-btn primary" 
                  onClick={async () => {
                    if (!firmName || !geographicFocus || !investorLinkedinUrl) {
                      showToast('Please fill in all required fields', 'error');
                      return;
                    }
                    setIsVerifying(true);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Simple AI verification for investor
                    const aiResult = { confidenceScore: 75 + Math.floor(Math.random() * 25), recommendation: 'approve' as const };
                    
                    // Calculate risk
                    const riskResult = riskEngine.calculateRiskScore(userData?.verification);
                    
                    // Determine if we need admin review
                    const needsReview = riskEngine.needsAdminReview(aiResult.recommendation, riskResult.riskLevel);
                    
                    if (userData) {
                      if (needsReview) {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            investorConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'ready_for_approval',
                            submittedAt: Timestamp.now()
                          }
                        });
                        closeModal();
                        showToast(`AI confidence: ${aiResult.confidenceScore}% - waiting for admin approval`, 'success');
                      } else if (aiResult.recommendation === 'approve') {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            investorVerified: true,
                            investorConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'approved',
                            reviewedAt: Timestamp.now(),
                            submittedAt: Timestamp.now()
                          }
                        });
                        closeModal();
                        showToast(`Investor verified! AI confidence: ${aiResult.confidenceScore}%`, 'success');
                      } else {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            investorConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'rejected',
                            failedAttempts: (userData.verification?.failedAttempts || 0) + 1
                          }
                        });
                        closeModal();
                        showToast(`Verification rejected. AI confidence: ${aiResult.confidenceScore}%`, 'error');
                      }
                    }
                    setIsVerifying(false);
                  }}
                  disabled={isVerifying}
                >
                  {isVerifying ? 'AI Reviewing...' : 'Verify Investor'}
                </button>
              </div>
            </div>
          );
        case 'explorer':
          return (
            <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
              <div className="verification-modal-header">
                <h2>Verify Your Explorer Status</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                  <CloseIcon />
                </button>
              </div>
              <div className="verification-modal-body">
                <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>
                  We'll verify your explorer status instantly.
                </p>
              </div>
              <div className="verification-modal-footer">
                <button className="modal-btn secondary" onClick={closeModal} disabled={isVerifying}>Cancel</button>
                <button 
                  className="modal-btn primary" 
                  onClick={async () => {
                    setIsVerifying(true);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // Simple AI verification for explorer
                    const aiResult = { confidenceScore: 80 + Math.floor(Math.random() * 20), recommendation: 'approve' as const };
                    
                    // Calculate risk
                    const riskResult = riskEngine.calculateRiskScore(userData?.verification);
                    
                    // Determine if we need admin review
                    const needsReview = riskEngine.needsAdminReview(aiResult.recommendation, riskResult.riskLevel);
                    
                    if (userData) {
                      if (needsReview) {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            explorerConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'ready_for_approval',
                            submittedAt: Timestamp.now()
                          }
                        });
                        closeModal();
                        showToast(`AI confidence: ${aiResult.confidenceScore}% - waiting for admin approval`, 'success');
                      } else if (aiResult.recommendation === 'approve') {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            explorerVerified: true,
                            explorerConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'approved',
                            reviewedAt: Timestamp.now(),
                            submittedAt: Timestamp.now()
                          }
                        });
                        closeModal();
                        showToast(`Explorer verified! AI confidence: ${aiResult.confidenceScore}%`, 'success');
                      } else {
                        updateUserData({
                          verification: {
                            ...userData.verification,
                            explorerConfidenceScore: aiResult.confidenceScore,
                            verificationRiskScore: riskResult.riskScore,
                            riskLevel: riskResult.riskLevel,
                            status: 'rejected',
                            failedAttempts: (userData.verification?.failedAttempts || 0) + 1
                          }
                        });
                        closeModal();
                        showToast(`Verification rejected. AI confidence: ${aiResult.confidenceScore}%`, 'error');
                      }
                    }
                    setIsVerifying(false);
                  }}
                  disabled={isVerifying}
                >
                  {isVerifying ? 'AI Verifying...' : 'Verify Explorer'}
                </button>
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="verification-modal-overlay" onClick={closeModal}>
        {modalContent()}
      </div>
    );
  };

  return (
    <div className="verification-center-container">
      <aside className="verification-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">TRIVEON</div>
        </div>

        <nav className="verification-sidebar-nav">
          <div className="verification-nav-item" onClick={() => navigate('/home')}>
            <HomeIcon />
            <span>Home</span>
          </div>
          <div className="verification-nav-item active">
            <ProfileIcon />
            <span>Verification Center</span>
          </div>
        </nav>

        <div className="verification-sidebar-bottom">
          <div className="verification-nav-item" onClick={() => navigate('/settings')}>
            <SettingsIcon />
            <span>Settings</span>
          </div>
          <div className="verification-nav-item" onClick={handleLogout}>
            <LogoutIcon />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      <main className="verification-main-content">
        <div className="verification-header">
          <h1>Verification Center</h1>
          <p className="verification-subtitle">Complete verification steps to build trust and unlock premium features</p>
        </div>

        <div className="trust-score-section">
          <div className="trust-score-circle">
            <span className="trust-score-value">{trustScore}</span>
            <span className="trust-score-label">Trust Score</span>
          </div>
          <div className="trust-score-details">
            <div className="trust-score-level">
              <h3>{userData?.verification?.verificationLevel || 'Unverified'}</h3>
              <p>Current Verification Level</p>
            </div>
            <div className="trust-score-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${trustScore}%` }}></div>
              </div>
              <p className="progress-label">{trustScore}% Complete</p>
            </div>
            {userData?.verification?.riskLevel && (
              <div className="risk-indicator" style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: userData.verification.riskLevel === 'High' ? 'rgba(255, 68, 68, 0.2)' : userData.verification.riskLevel === 'Medium' ? 'rgba(255, 170, 0, 0.2)' : 'rgba(68, 255, 102, 0.2)', borderRadius: '8px' }}>
                <p style={{ color: '#D1D5DB', margin: 0, fontSize: '14px' }}>
                  Risk Level: <span style={{ color: userData.verification.riskLevel === 'High' ? '#FF4444' : userData.verification.riskLevel === 'Medium' ? '#FFAA00' : '#44FF66', fontWeight: 600 }}>{userData.verification.riskLevel}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="verification-badges-grid">
          {verificationBadges
            .filter(badge => badge.visible !== false)
            .map(badge => {
              const IconComponent = badge.icon;
              const isReadyForApproval = userData?.verification?.status === 'ready_for_approval';
              return (
                <div 
                  key={badge.id} 
                  className={`verification-badge ${badge.status}`}
                  onClick={() => badge.action && badge.action()}
                >
                  <div className="badge-icon">
                    <IconComponent />
                  </div>
                  <div className="badge-content">
                    <h3>{badge.name}</h3>
                    <p>{badge.description}</p>
                  </div>
                  <div className="badge-status">
                    {isReadyForApproval && !badge.verified ? (
                      <span className="status-badge" style={{ backgroundColor: 'rgba(255, 170, 0, 0.2)', color: '#FFAA00' }}>
                        Ready for Review
                      </span>
                    ) : badge.verified ? (
                      <span className="status-badge verified">
                        <CheckIcon /> Verified
                      </span>
                    ) : (
                      <span className="status-badge unverified">
                        {badge.actionText}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </main>

      <VerificationModal />

      {toastMessage && (
        <div className={`toast-notification ${toastType}`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default VerificationCenter;
