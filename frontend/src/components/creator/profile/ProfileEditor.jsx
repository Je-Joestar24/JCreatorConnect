import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Save,
  PhotoCamera,
  Instagram,
  YouTube,
  Twitter,
  Language,
  Visibility,
} from '@mui/icons-material';
import useCreatorProfile from '../../../hooks/creatorProfileHook';
import { displayNotification } from '../../../store/slices/uiSlice';
import { 
  updateFormData, 
  setProfilePicPreview, 
  setBannerPreview 
} from '../../../store/slices/creatorProfileSlice';
import { useDebounce } from '../../../hooks/useDebounce';

/**
 * Profile Editor Component
 * Inline editing like Upwork - each field auto-saves
 */
const ProfileEditor = ({ onSave, initialProfile = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    updateBio,
    updateSocialLinks,
    uploadProfilePicture,
    uploadBanner,
    loading,
    error,
    profile,
  } = useCreatorProfile();

  const storeFormData = useSelector((state) => state.creatorProfile.formData);
  const storeProfilePicPreview = useSelector((state) => state.creatorProfile.profilePicPreview);
  const storeBannerPreview = useSelector((state) => state.creatorProfile.bannerPreview);

  const currentProfile = profile || initialProfile;
  const [formData, setFormData] = useState(
    storeFormData.bio || storeFormData.instagram ? storeFormData : {
      bio: currentProfile?.profile?.bio || '',
      instagram: currentProfile?.profile?.socials?.instagram || '',
      youtube: currentProfile?.profile?.socials?.youtube || '',
      twitter: currentProfile?.profile?.socials?.twitter || '',
      website: currentProfile?.profile?.socials?.website || '',
    }
  );

  const [profilePicPreview, setProfilePicPreviewLocal] = useState(
    storeProfilePicPreview || currentProfile?.user?.avatarUrl || null
  );
  const [bannerPreview, setBannerPreviewLocal] = useState(
    storeBannerPreview || currentProfile?.profile?.bannerUrl || null
  );

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [savingStates, setSavingStates] = useState({
    bio: false,
    socials: false,
    profilePic: false,
    banner: false,
  });

  // Debounced values for auto-save
  const debouncedBio = useDebounce(formData.bio, 1000);
  const debouncedSocials = useDebounce(formData, 1000);

  // Update form data when profile changes
  useEffect(() => {
    if (currentProfile) {
      const newFormData = {
        bio: currentProfile?.profile?.bio || '',
        instagram: currentProfile?.profile?.socials?.instagram || '',
        youtube: currentProfile?.profile?.socials?.youtube || '',
        twitter: currentProfile?.profile?.socials?.twitter || '',
        website: currentProfile?.profile?.socials?.website || '',
      };
      setFormData(newFormData);
      dispatch(updateFormData(newFormData));
      
      if (currentProfile?.user?.avatarUrl) {
        setProfilePicPreviewLocal(currentProfile.user.avatarUrl);
        dispatch(setProfilePicPreview(currentProfile.user.avatarUrl));
      }
      if (currentProfile?.profile?.bannerUrl) {
        setBannerPreviewLocal(currentProfile.profile.bannerUrl);
        dispatch(setBannerPreview(currentProfile.profile.bannerUrl));
      }
    }
  }, [currentProfile, dispatch]);

  // Auto-save bio
  useEffect(() => {
    if (debouncedBio !== (currentProfile?.profile?.bio || '') && debouncedBio !== undefined) {
      const timer = setTimeout(() => {
        handleAutoSaveBio();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedBio]);

  // Auto-save socials
  useEffect(() => {
    const currentSocials = currentProfile?.profile?.socials || {};
    const hasChanges = 
      formData.instagram !== (currentSocials.instagram || '') ||
      formData.youtube !== (currentSocials.youtube || '') ||
      formData.twitter !== (currentSocials.twitter || '') ||
      formData.website !== (currentSocials.website || '');
    
    if (hasChanges && formData.instagram !== undefined) {
      const timer = setTimeout(() => {
        handleAutoSaveSocials();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSocials]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
    dispatch(updateFormData(newFormData));
  };

  const handleAutoSaveBio = async () => {
    if (savingStates.bio) return;
    setSavingStates(prev => ({ ...prev, bio: true }));
    try {
      await updateBio(formData.bio || '');
      dispatch(displayNotification({
        message: 'Bio saved',
        type: 'success',
      }));
    } catch (err) {
      dispatch(displayNotification({
        message: err?.error || err?.message || 'Failed to save bio',
        type: 'error',
      }));
    } finally {
      setSavingStates(prev => ({ ...prev, bio: false }));
    }
  };

  const handleAutoSaveSocials = async () => {
    if (savingStates.socials) return;
    setSavingStates(prev => ({ ...prev, socials: true }));
    try {
      const socials = {
        instagram: formData.instagram.trim() || '',
        youtube: formData.youtube.trim() || '',
        twitter: formData.twitter.trim() || '',
        website: formData.website.trim() || '',
      };
      await updateSocialLinks(socials);
      dispatch(displayNotification({
        message: 'Social links saved',
        type: 'success',
      }));
    } catch (err) {
      dispatch(displayNotification({
        message: err?.error || err?.message || 'Failed to save social links',
        type: 'error',
      }));
    } finally {
      setSavingStates(prev => ({ ...prev, socials: false }));
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreviewLocal(reader.result);
        dispatch(setProfilePicPreview(reader.result));
      };
      reader.readAsDataURL(file);

      // Auto-upload
      setSavingStates(prev => ({ ...prev, profilePic: true }));
      try {
        await uploadProfilePicture(file);
        dispatch(displayNotification({
          message: 'Profile picture uploaded',
          type: 'success',
        }));
        if (onSave) onSave();
      } catch (err) {
        dispatch(displayNotification({
          message: err?.error || err?.message || 'Failed to upload profile picture',
          type: 'error',
        }));
      } finally {
        setSavingStates(prev => ({ ...prev, profilePic: false }));
      }
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreviewLocal(reader.result);
        dispatch(setBannerPreview(reader.result));
      };
      reader.readAsDataURL(file);

      // Auto-upload
      setSavingStates(prev => ({ ...prev, banner: true }));
      try {
        await uploadBanner(file);
        dispatch(displayNotification({
          message: 'Banner uploaded',
          type: 'success',
        }));
        if (onSave) onSave();
      } catch (err) {
        dispatch(displayNotification({
          message: err?.error || err?.message || 'Failed to upload banner',
          type: 'error',
        }));
      } finally {
        setSavingStates(prev => ({ ...prev, banner: false }));
      }
    }
  };

  const handleViewPublic = () => {
    const userId = currentProfile?.user?._id;
    if (userId) {
      navigate(`/creator/${userId}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          backgroundColor: 'var(--theme-bg-card)',
          border: '1px solid var(--theme-border)',
          boxShadow: 'var(--theme-shadow-lg)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'var(--theme-text)',
              }}
            >
              {currentProfile && (currentProfile.profile?.bio || currentProfile.user?.avatarUrl || currentProfile.profile?.bannerUrl || 
                (currentProfile.profile?.socials && (currentProfile.profile.socials.instagram || currentProfile.profile.socials.youtube || 
                currentProfile.profile.socials.twitter || currentProfile.profile.socials.website)))
                ? 'Edit Your Creator Profile'
                : 'Set Up Your Creator Profile'}
            </Typography>
            {currentProfile && (
              <Button
                variant="outlined"
                startIcon={<Visibility />}
                onClick={handleViewPublic}
                sx={{
                  borderColor: 'var(--theme-primary)',
                  color: 'var(--theme-primary)',
                  '&:hover': {
                    borderColor: 'var(--theme-secondary)',
                    backgroundColor: 'var(--theme-bg-secondary)',
                  },
                }}
              >
                View Public Profile
              </Button>
            )}
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: 'var(--theme-text-secondary)',
              mb: 4,
            }}
          >
            Complete your profile to start attracting supporters. Changes are saved automatically.
          </Typography>

          <Box component="form">
            {/* Profile Picture Upload */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--theme-text)', mb: 2 }}>
                Profile Picture
                {savingStates.profilePic && (
                  <CircularProgress size={16} sx={{ ml: 1, color: 'var(--theme-primary)' }} />
                )}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: 'var(--theme-bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '3px solid var(--theme-primary)',
                    position: 'relative',
                  }}
                >
                  {profilePicPreview || currentProfile?.user?.avatarUrl ? (
                    <img
                      src={profilePicPreview || currentProfile?.user?.avatarUrl}
                      alt="Profile preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <PhotoCamera sx={{ fontSize: 40, color: 'var(--theme-text-muted)' }} />
                  )}
                </Box>
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-pic-upload"
                    type="file"
                    onChange={handleProfilePicChange}
                    disabled={savingStates.profilePic}
                  />
                  <label htmlFor="profile-pic-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCamera />}
                      disabled={savingStates.profilePic}
                      sx={{
                        borderColor: 'var(--theme-primary)',
                        color: 'var(--theme-primary)',
                        '&:hover': {
                          borderColor: 'var(--theme-secondary)',
                          backgroundColor: 'var(--theme-bg-secondary)',
                        },
                      }}
                    >
                      Upload Photo
                    </Button>
                  </label>
                </Box>
              </Box>
            </Box>

            {/* Banner Upload */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--theme-text)', mb: 2 }}>
                Banner Image
                {savingStates.banner && (
                  <CircularProgress size={16} sx={{ ml: 1, color: 'var(--theme-primary)' }} />
                )}
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  borderRadius: 2,
                  backgroundColor: 'var(--theme-bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '2px dashed var(--theme-border)',
                  position: 'relative',
                }}
              >
                {bannerPreview || currentProfile?.profile?.bannerUrl ? (
                  <img
                    src={bannerPreview || currentProfile?.profile?.bannerUrl}
                    alt="Banner preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <PhotoCamera sx={{ fontSize: 48, color: 'var(--theme-text-muted)', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: 'var(--theme-text-muted)' }}>
                      Upload banner image
                    </Typography>
                  </Box>
                )}
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="banner-upload"
                  type="file"
                  onChange={handleBannerChange}
                  disabled={savingStates.banner}
                />
                <label
                  htmlFor="banner-upload"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    cursor: savingStates.banner ? 'wait' : 'pointer',
                  }}
                />
              </Box>
            </Box>

            {/* Bio */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--theme-text)', mb: 2 }}>
                Bio
                {savingStates.bio && (
                  <CircularProgress size={16} sx={{ ml: 1, color: 'var(--theme-primary)' }} />
                )}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell your supporters about yourself, your content, and what makes you unique..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--theme-bg)',
                    '& fieldset': {
                      borderColor: 'var(--theme-border)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--theme-primary)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--theme-primary)',
                    },
                  },
                }}
                inputProps={{
                  maxLength: 1000,
                }}
                helperText={`${formData.bio.length}/1000 characters`}
              />
            </Box>

            {/* Social Links */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--theme-text)', mb: 2 }}>
                Social Media Links
                {savingStates.socials && (
                  <CircularProgress size={16} sx={{ ml: 1, color: 'var(--theme-primary)' }} />
                )}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourusername"
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        <Instagram sx={{ color: 'var(--theme-primary)' }} />
                      </Box>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'var(--theme-bg)',
                    },
                  }}
                />
                <TextField
                  fullWidth
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  placeholder="https://youtube.com/@yourchannel"
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        <YouTube sx={{ color: 'var(--theme-primary)' }} />
                      </Box>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'var(--theme-bg)',
                    },
                  }}
                />
                <TextField
                  fullWidth
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/yourusername"
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        <Twitter sx={{ color: 'var(--theme-primary)' }} />
                      </Box>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'var(--theme-bg)',
                    },
                  }}
                />
                <TextField
                  fullWidth
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        <Language sx={{ color: 'var(--theme-primary)' }} />
                      </Box>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'var(--theme-bg)',
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileEditor;
