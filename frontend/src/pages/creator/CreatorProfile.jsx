import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import useCreatorProfile from '../../hooks/creatorProfileHook';
import { useAuth } from '../../hooks/authHook';
import { displayNotification } from '../../store/slices/uiSlice';
import CreatorProfileBanner from '../../components/creator/profile/CreatorProfileBanner';
import CreatorProfileHeader from '../../components/creator/profile/CreatorProfileHeader';
import CreatorProfileBody from '../../components/creator/profile/CreatorProfileBody';
import CreatorProfilePosts from '../../components/creator/profile/CreatorProfilePosts';
import ProfileCompletionPrompt from '../../components/creator/profile/ProfileCompletionPrompt';
import ProfileEditor from '../../components/creator/profile/ProfileEditor';
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
    
    // Profile is empty if none of these fields have data
    return !hasBio && !hasAvatar && !hasBanner && !hasSocials;
  };

  // Check if error is "profile not found" - calculated before hooks
  const isProfileNotFoundError = error && typeof error === 'string' && (
    error.toLowerCase().includes('not found') || 
    error.toLowerCase().includes('profile not found')
  );

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // Fetch profile on mount or when id/currentUser changes
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        clearError();
        setProfileNotFound(false);
        // If no id param, fetch own profile
        if (!id) {
          try {
            await getMyProfile();
          } catch (err) {
            // If profile not found, allow creator to create it
            if (currentUser?.role === 'creator') {
              setProfileNotFound(true);
              setIsEditing(true);
            }
          }
        } else {
          // Check if viewing own profile
          const isOwn = currentUser?._id === id;
          if (isOwn && currentUser?.role === 'creator') {
            try {
              await getMyProfile();
            } catch (err) {
              // If profile not found, allow creator to create it
              setProfileNotFound(true);
              setIsEditing(true);
            }
          } else {
            await getPublicProfile(id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Check if error message indicates profile not found
        const errorMessage = error?.error || error?.message || '';
        const isProfileNotFound = 
          errorMessage.toLowerCase().includes('not found') || 
          errorMessage.toLowerCase().includes('profile not found') ||
          error?.response?.status === 404;
        
        // If profile not found and user is a creator viewing their own profile, show editor
        if (isProfileNotFound && currentUser?.role === 'creator') {
          const isOwn = !id || currentUser?._id === id;
          if (isOwn) {
            setProfileNotFound(true);
            setIsEditing(true);
            clearError(); // Clear the error since we're showing the editor
          }
        }
      }
    };

    if (currentUser) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentUser?._id, currentUser?.role]);

  // Display error notification if there's an error (notification component handles it)
  useEffect(() => {
    if (error && !isProfileNotFoundError) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'An error occurred';
      dispatch(displayNotification({
        message: errorMessage,
        type: 'error',
      }));
      clearError(); // Clear error after showing notification
    }
  }, [error, isProfileNotFoundError, dispatch, clearError]);

  // Display notification for profile not found (public view)
  useEffect(() => {
    if (!profile && !(currentUser?.role === 'creator' && (!id || currentUser?._id === id)) && !loading && !error) {
      dispatch(displayNotification({
        message: 'Profile not found',
        type: 'info',
      }));
    }
  }, [profile, currentUser, id, loading, error, dispatch]);

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

  // If profile not found but user is creator, check if it's completely empty
  // Only show editor if profile is completely empty (no data at all)
  if ((!profile || profileNotFound) && currentUser?.role === 'creator' && (isEditing || profileNotFound)) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProfileEditor
            onSave={async () => {
              setIsEditing(false);
              setProfileNotFound(false);
              clearError();
              await getMyProfile();
            }}
          />
        </motion.div>
      </Container>
    );
  }

  // If profile exists but is completely empty, show editor
  if (profile && isOwnProfile && isProfileEmpty(profile) && !isEditing) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProfileEditor
            initialProfile={profile}
            onSave={async () => {
              setIsEditing(false);
              clearError();
              await getMyProfile();
            }}
          />
        </motion.div>
      </Container>
    );
  }

  // If error is "profile not found" and user is creator, show editor
  if (isProfileNotFoundError && currentUser?.role === 'creator' && !profile) {
    const isOwn = !id || currentUser?._id === id;
    if (isOwn) {
      return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProfileEditor
              onSave={async () => {
                clearError();
                await getMyProfile();
              }}
            />
          </motion.div>
        </Container>
      );
    }
  }

  // If no profile and not editing, show editor for creators
  if (!profile && currentUser?.role === 'creator' && !id) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ProfileEditor
          onSave={async () => {
            setIsEditing(false);
            await getMyProfile();
          }}
        />
      </Container>
    );
  }

  // If profile not found for public view (not creator's own profile)
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

  // If still loading or no profile, show loading
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
        }}
      >
        {/* Banner */}
        <CreatorProfileBanner
          profile={profile}
          isOwnProfile={isOwnProfile}
          onBannerUpload={handleBannerUpload}
        />

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Profile Completion Prompt - Only show for own profile */}
          {isOwnProfile && profile.completionStatus && (
            <Box sx={{ mb: 3 }}>
              <ProfileCompletionPrompt
                profile={profile}
                completionStatus={profile.completionStatus}
              />
            </Box>
          )}

          {/* Header */}
          <CreatorProfileHeader profile={profile} isOwnProfile={isOwnProfile} />

          {/* Body */}
          <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
            <Box>
              {isEditing ? (
                <ProfileEditor
                  initialProfile={profile}
                  onSave={async () => {
                    setIsEditing(false);
                    await getMyProfile();
                  }}
                />
              ) : (
                <CreatorProfileBody
                  profile={profile}
                  isOwnProfile={isOwnProfile}
                  onEditClick={() => setIsEditing(true)}
                />
              )}
            </Box>

            {/* Sidebar for future features */}
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              {/* Can add featured post, quick stats, etc. here */}
            </Box>
          </Box>

          {/* Posts */}
          <Box sx={{ mt: 6 }}>
            <CreatorProfilePosts posts={profile.posts} />
          </Box>
        </Container>
      </Box>
    </motion.div>
  );
};

export default CreatorProfile;

