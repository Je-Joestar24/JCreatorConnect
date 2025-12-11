import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Avatar, Typography, IconButton, TextField, Dialog, DialogContent, CircularProgress } from '@mui/material';
import { Edit, Check, Close, Email, Chat, PhotoCamera, Visibility } from '@mui/icons-material';
import { Instagram, YouTube, Twitter, Language } from '@mui/icons-material';
import useCreatorProfile from '../../../hooks/creatorProfileHook';
import { useDebounce } from '../../../hooks/useDebounce';
import { useDispatch } from 'react-redux';
import { displayNotification } from '../../../store/slices/uiSlice';

/**
 * Creator Profile Header Component
 * Displays profile picture, name, username, bio, social links, email, chat button, and reviews
 * With inline editing capabilities and clickable profile picture
 */
const CreatorProfileHeader = ({ profile, isOwnProfile, onProfilePicUpload }) => {
  if (!profile?.user) return null;

  const { user } = profile;
  const dispatch = useDispatch();
  const { updateBio, updateSocialLinks, uploadProfilePicture } = useCreatorProfile();
  
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState(profile?.profile?.bio || '');
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [isViewingProfilePic, setIsViewingProfilePic] = useState(false);
  const [isUploadingProfilePic, setIsUploadingProfilePic] = useState(false);
  const [hovered, setHovered] = useState(false);
  const bioInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const debouncedBio = useDebounce(bioValue, 1000);

  const socials = profile?.profile?.socials || {};
  const socialIcons = {
    instagram: Instagram,
    youtube: YouTube,
    twitter: Twitter,
    website: Language,
  };

  // Auto-save bio
  useEffect(() => {
    if (isEditingBio && debouncedBio !== (profile?.profile?.bio || '') && !isSavingBio && debouncedBio !== undefined) {
      const timer = setTimeout(() => {
        handleSaveBio();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedBio]);

  const handleSaveBio = async () => {
    if (!isOwnProfile) return;
    setIsSavingBio(true);
    try {
      await updateBio(bioValue);
    } catch (error) {
      console.error('Failed to save bio:', error);
    } finally {
      setIsSavingBio(false);
      setIsEditingBio(false);
    }
  };

  const handleCancelBio = () => {
    setBioValue(profile?.profile?.bio || '');
    setIsEditingBio(false);
  };

  const handleProfilePicClick = () => {
    if (isOwnProfile) {
      // If own profile, allow upload
      fileInputRef.current?.click();
    } else if (user.avatarUrl) {
      // If viewing others' profile and has avatar, view it
      setIsViewingProfilePic(true);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingProfilePic(true);
      try {
        if (onProfilePicUpload) {
          await onProfilePicUpload(file);
        } else {
          await uploadProfilePicture(file);
          dispatch(displayNotification({
            message: 'Profile picture uploaded successfully!',
            type: 'success',
          }));
        }
      } catch (error) {
        dispatch(displayNotification({
          message: error?.error || error?.message || 'Failed to upload profile picture',
          type: 'error',
        }));
      } finally {
        setIsUploadingProfilePic(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  // Mock reviews data (replace with real data later)
  const reviews = {
    rating: 4.5,
    count: 193,
  };

  return (
    <>
      <motion.div
        className="creator-profile-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Box className="profile-header-content">
          {/* Avatar - Clickable */}
          <motion.div
            className="profile-avatar-wrapper"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{ position: 'relative', zIndex: 1, cursor: 'pointer' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleProfilePicClick}
          >
            <input
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-pic-upload"
              type="file"
              onChange={handleProfilePicChange}
              disabled={isUploadingProfilePic}
            />
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={user.avatarUrl || '/default-avatar.png'}
                alt={`${user.name}'s profile picture`}
                className="profile-avatar"
                sx={{
                  width: { xs: 100, sm: 120, md: 140 },
                  height: { xs: 100, sm: 120, md: 140 },
                  border: '4px solid var(--theme-bg)',
                  boxShadow: 'var(--theme-shadow-lg)',
                  backgroundColor: !user.avatarUrl ? 'var(--theme-primary)' : 'transparent',
                }}
              >
                {!user.avatarUrl && user.name?.charAt(0).toUpperCase()}
              </Avatar>
              {/* Hover Overlay */}
              <AnimatePresence>
                {hovered && !isUploadingProfilePic && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      pointerEvents: 'none',
                    }}
                  >
                    {isOwnProfile ? 'Upload' : user.avatarUrl ? 'View' : ''}
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Uploading Overlay */}
              {isUploadingProfilePic && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '50%',
                  }}
                >
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                </Box>
              )}
              {/* Camera Icon Badge for Own Profile without Avatar */}
              {isOwnProfile && !user.avatarUrl && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'var(--theme-primary)',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid var(--theme-bg)',
                    boxShadow: 'var(--theme-shadow-md)',
                  }}
                >
                  <PhotoCamera sx={{ fontSize: 18, color: 'white' }} />
                </Box>
              )}
            </Box>
          </motion.div>

          {/* Profile Info */}
          <Box className="profile-info" sx={{ flex: 1, ml: { xs: 0, md: 3 }, mt: { xs: 2, md: 0 } }}>
            {/* Name */}
            <Typography
              variant="h4"
              component="h1"
              className="profile-name"
              sx={{
                fontWeight: 700,
                color: 'var(--theme-text)',
                mb: 0.5,
              }}
            >
              {user.name}
            </Typography>

            {/* Username */}
            <Typography
              variant="body2"
              className="profile-username"
              sx={{
                color: 'var(--theme-text-secondary)',
                mb: 2,
              }}
            >
              @{user.username || user.email?.split('@')[0]}
            </Typography>

            {/* Bio Section */}
            <Box className="bio-section" sx={{ mb: 2 }}>
              {isEditingBio && isOwnProfile ? (
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    inputRef={bioInputRef}
                    fullWidth
                    multiline
                    rows={3}
                    value={bioValue}
                    onChange={(e) => setBioValue(e.target.value)}
                    placeholder="Tell your supporters about yourself..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'var(--theme-bg)',
                        '& fieldset': {
                          borderColor: 'var(--theme-primary)',
                        },
                      },
                    }}
                    autoFocus
                  />
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
                    <IconButton
                      size="small"
                      onClick={handleSaveBio}
                      disabled={isSavingBio}
                      sx={{
                        color: 'var(--theme-success)',
                        '&:hover': { backgroundColor: 'var(--theme-bg-secondary)' },
                      }}
                      aria-label="Save bio"
                    >
                      <Check fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handleCancelBio}
                      disabled={isSavingBio}
                      sx={{
                        color: 'var(--theme-error)',
                        '&:hover': { backgroundColor: 'var(--theme-bg-secondary)' },
                      }}
                      aria-label="Cancel editing"
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                  {isSavingBio && (
                    <Typography variant="caption" sx={{ color: 'var(--theme-text-muted)', ml: 1 }}>
                      Saving...
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography
                    variant="body1"
                    className="profile-bio"
                    sx={{
                      color: 'var(--theme-text-secondary)',
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap',
                      flex: 1,
                    }}
                  >
                    {profile?.profile?.bio || (isOwnProfile ? 'Add a bio to tell your supporters about yourself!' : 'No bio yet.')}
                  </Typography>
                  {isOwnProfile && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setIsEditingBio(true);
                        setTimeout(() => bioInputRef.current?.focus(), 100);
                      }}
                      sx={{
                        color: 'var(--theme-primary)',
                        '&:hover': { backgroundColor: 'var(--theme-bg-secondary)' },
                      }}
                      aria-label="Edit bio"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              )}
            </Box>

            {/* Social Links */}
            {(socials.instagram || socials.youtube || socials.twitter || socials.website) && (
              <Box className="social-links-section" sx={{ mb: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {Object.entries(socials).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = socialIcons[platform];
                  if (!Icon) return null;

                  return (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          color: 'var(--theme-primary)',
                          backgroundColor: 'var(--theme-bg-secondary)',
                          '&:hover': {
                            backgroundColor: 'var(--theme-primary)',
                            color: 'white',
                          },
                        }}
                        aria-label={`Visit ${platform} profile`}
                      >
                        <Icon fontSize="small" />
                      </IconButton>
                    </motion.a>
                  );
                })}
              </Box>
            )}

            {/* Email and Chat */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              {user.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 18, color: 'var(--theme-text-secondary)' }} />
                  <Typography variant="body2" sx={{ color: 'var(--theme-text-secondary)' }}>
                    {user.email}
                  </Typography>
                </Box>
              )}
              <motion.button
                className="chat-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--theme-primary)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
                aria-label="Chat with creator"
              >
                <Chat fontSize="small" />
                Chat
              </motion.button>
            </Box>

            {/* Reviews */}
            <Box className="reviews-section" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Typography variant="h6" sx={{ color: 'var(--theme-text)', fontWeight: 700 }}>
                {reviews.rating}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.25 }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= Math.floor(reviews.rating);
                  const halfFilled = star === Math.ceil(reviews.rating) && reviews.rating % 1 !== 0;
                  return (
                    <motion.svg
                      key={star}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={filled ? '#fbbf24' : halfFilled ? 'url(#half-star)' : 'none'}
                      stroke={filled || halfFilled ? '#fbbf24' : '#d1d5db'}
                      strokeWidth={filled || halfFilled ? 0 : 1.5}
                      whileHover={{ scale: 1.3, rotate: 15 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      style={{ cursor: 'pointer' }}
                    >
                      <defs>
                        <linearGradient id="half-star">
                          <stop offset="50%" stopColor="#fbbf24" />
                          <stop offset="50%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </motion.svg>
                  );
                })}
              </Box>
              <Typography variant="body2" sx={{ color: 'var(--theme-text-secondary)', ml: 0.5 }}>
                {reviews.count} reviews
              </Typography>
            </Box>
          </Box>
        </Box>
      </motion.div>

      {/* Profile Picture View Dialog */}
      <Dialog
        open={isViewingProfilePic}
        onClose={() => setIsViewingProfilePic(false)}
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setIsViewingProfilePic(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
            aria-label="Close"
          >
            <Close />
          </IconButton>
          <img
            src={user.avatarUrl}
            alt={`${user.name}'s profile picture`}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatorProfileHeader;
