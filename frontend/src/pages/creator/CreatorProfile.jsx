import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Container, Typography, Fab } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Payment } from '@mui/icons-material';
import useCreatorProfile from '../../hooks/creatorProfileHook';
import { useAuth } from '../../hooks/authHook';
import { displayNotification } from '../../store/slices/uiSlice';
import CreatorProfileBanner from '../../components/creator/profile/CreatorProfileBanner';
import CreatorProfileHeader from '../../components/creator/profile/CreatorProfileHeader';
import CreatorProfileBody from '../../components/creator/profile/CreatorProfileBody';
import CreatorProfilePosts from '../../components/creator/profile/CreatorProfilePosts';

/**
 * Creator Profile Page
 * Displays public creator profile or own profile if viewing own page
 */
const CreatorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useAuth();
  const {
    profile,
    loading,
    error,
    isOwnProfile,
    getPublicProfile,
    getMyProfile,
    uploadBanner,
    uploadProfilePicture,
    clearError,
  } = useCreatorProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [profileNotFound, setProfileNotFound] = useState(false);

  /**
   * Check if profile is completely empty (no data at all)
   */
  const isProfileEmpty = (profileData) => {
    if (!profileData) return true;
    
    const profile = profileData.profile || {};
    const user = profileData.user || {};
    const socials = profile.socials || {};
    
    const hasBio = profile.bio && profile.bio.trim().length > 0;
    const hasAvatar = user.avatarUrl && user.avatarUrl.trim().length > 0;
    const hasBanner = profile.bannerUrl && profile.bannerUrl.trim().length > 0;
    const hasSocials = socials.instagram || socials.youtube || socials.twitter || socials.website;
    
    return !hasBio && !hasAvatar && !hasBanner && !hasSocials;
  };

  const isProfileNotFoundError = error && typeof error === 'string' && (
    error.toLowerCase().includes('not found') || 
    error.toLowerCase().includes('profile not found')
  );

  // Fetch profile on mount or when id/currentUser changes
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        clearError();
        setProfileNotFound(false);
        if (!id) {
          try {
            await getMyProfile();
          } catch (err) {
            if (currentUser?.role === 'creator') {
              setProfileNotFound(true);
              setIsEditing(true);
            }
          }
        } else {
          const isOwn = currentUser?._id === id;
          if (isOwn && currentUser?.role === 'creator') {
            try {
              await getMyProfile();
            } catch (err) {
              setProfileNotFound(true);
              setIsEditing(true);
            }
          } else {
            await getPublicProfile(id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        const errorMessage = error?.error || error?.message || '';
        const isProfileNotFound = 
          errorMessage.toLowerCase().includes('not found') || 
          errorMessage.toLowerCase().includes('profile not found') ||
          error?.response?.status === 404;
        
        if (isProfileNotFound && currentUser?.role === 'creator') {
          const isOwn = !id || currentUser?._id === id;
          if (isOwn) {
            setProfileNotFound(true);
            setIsEditing(true);
            clearError();
          }
        }
      }
    };

    if (currentUser) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentUser?._id, currentUser?.role]);

  // Display error notification
  useEffect(() => {
    if (error && !isProfileNotFoundError) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'An error occurred';
      dispatch(displayNotification({
        message: errorMessage,
        type: 'error',
      }));
      clearError();
    }
  }, [error, isProfileNotFoundError, dispatch, clearError]);

  const handleBannerUpload = async (file) => {
    try {
      await uploadBanner(file);
      dispatch(displayNotification({
        message: 'Banner uploaded successfully!',
        type: 'success',
      }));
    } catch (error) {
      console.error('Failed to upload banner:', error);
      dispatch(displayNotification({
        message: error?.error || error?.message || 'Failed to upload banner',
        type: 'error',
      }));
    }
  };

  const handlePayClick = () => {
    // TODO: Implement payment flow
    dispatch(displayNotification({
      message: 'Payment feature coming soon!',
      type: 'info',
    }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--theme-bg)',
        }}
      >
        <CircularProgress sx={{ color: 'var(--theme-primary)' }} />
      </Box>
    );
  }

  // If profile not found, show empty state (no editor)
  if (!profile && currentUser?.role === 'creator' && (!id || currentUser?._id === id) && !loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: 'var(--theme-text-secondary)', mb: 2 }}>
            Profile not found
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--theme-text-muted)' }}>
            Start by adding your profile information below.
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!profile && !(currentUser?.role === 'creator' && (!id || currentUser?._id === id)) && !loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: 'var(--theme-text-secondary)' }}>
            Profile not found
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--theme-bg)',
        }}
      >
        <CircularProgress sx={{ color: 'var(--theme-primary)' }} />
      </Box>
    );
  }

  return (
    <motion.div
      className="creator-profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'var(--theme-bg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative virtual elements */}
        <Box
          className="decorative-orb decorative-orb-1"
          sx={{
            display: { xs: 'none', lg: 'block' },
          }}
        />
        <Box
          className="decorative-orb decorative-orb-2"
          sx={{
            display: { xs: 'none', lg: 'block' },
          }}
        />

        {/* Banner */}
        <CreatorProfileBanner
          profile={profile}
          isOwnProfile={isOwnProfile}
          onBannerUpload={handleBannerUpload}
        />

        {/* Header with all info - Full width with padding */}
        <Box sx={{ position: 'relative', zIndex: 2, px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
          <CreatorProfileHeader 
            profile={profile} 
            isOwnProfile={isOwnProfile}
            onProfilePicUpload={async (file) => {
              try {
                await uploadProfilePicture(file);
                dispatch(displayNotification({
                  message: 'Profile picture uploaded successfully!',
                  type: 'success',
                }));
                await getMyProfile();
              } catch (error) {
                dispatch(displayNotification({
                  message: error?.error || error?.message || 'Failed to upload profile picture',
                  type: 'error',
                }));
              }
            }}
            onSocialUpdate={async () => {
              await getMyProfile();
            }}
          />
        </Box>

        {/* Body and Posts - Container for content */}
        <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
          {/* Body - Categories and Tiers */}
          <Box sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
            <CreatorProfileBody
              profile={profile}
              isOwnProfile={isOwnProfile}
            />
          </Box>

          {/* Posts */}
          <Box sx={{ mt: 6, position: 'relative', zIndex: 1 }}>
            <CreatorProfilePosts posts={profile.posts} />
          </Box>
        </Container>

        {/* Floating Pay Button */}
        {!isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
            }}
          >
            <Fab
              color="primary"
              onClick={handlePayClick}
              sx={{
                backgroundColor: 'var(--theme-primary)',
                color: 'white',
                boxShadow: 'var(--theme-shadow-lg)',
                '&:hover': {
                  backgroundColor: 'var(--theme-secondary)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
              aria-label="Support creator"
            >
              <Payment />
            </Fab>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export default CreatorProfile;
