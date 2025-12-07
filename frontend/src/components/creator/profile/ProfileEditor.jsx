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

/**
 * Profile Editor Component
 * Allows creators to create/edit their profile
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

  // Get form data from Redux store
  const storeFormData = useSelector((state) => state.creatorProfile.formData);
  const storeProfilePicPreview = useSelector((state) => state.creatorProfile.profilePicPreview);
  const storeBannerPreview = useSelector((state) => state.creatorProfile.bannerPreview);

  // Use store data if available, otherwise use initialProfile
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

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
    dispatch(updateFormData(newFormData)); // Sync with Redux store
    setSaveError(null);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreviewLocal(reader.result);
        dispatch(setProfilePicPreview(reader.result)); // Sync with Redux store
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreviewLocal(reader.result);
        dispatch(setBannerPreview(reader.result)); // Sync with Redux store
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const errors = [];
    
    try {
      // Update bio if provided (even if empty, allow clearing)
      try {
        await updateBio(formData.bio || '');
      } catch (err) {
        errors.push(`Bio: ${err?.error || err?.message || 'Failed to update'}`);
      }

      // Update social links (allow empty values to clear)
      const socials = {
        instagram: formData.instagram.trim() || '',
        youtube: formData.youtube.trim() || '',
        twitter: formData.twitter.trim() || '',
        website: formData.website.trim() || '',
      };
      
      try {
        await updateSocialLinks(socials);
      } catch (err) {
        errors.push(`Social links: ${err?.error || err?.message || 'Failed to update'}`);
      }

      // Upload profile picture if selected (don't fail if this fails)
      if (profilePicFile) {
        try {
          await uploadProfilePicture(profilePicFile);
        } catch (err) {
          errors.push(`Profile picture: ${err?.error || err?.message || 'Failed to upload'}`);
          // Don't throw - continue with other updates
        }
      }

      // Upload banner if selected (don't fail if this fails)
      if (bannerFile) {
        try {
          await uploadBanner(bannerFile);
        } catch (err) {
          errors.push(`Banner: ${err?.error || err?.message || 'Failed to upload'}`);
          // Don't throw - continue with other updates
        }
      }

      // If there were errors but some operations succeeded, show partial success
      if (errors.length > 0) {
        const errorMessage = `Some updates failed: ${errors.join(', ')}`;
        setSaveError(errorMessage);
        dispatch(displayNotification({
          message: errorMessage,
          type: 'warning',
        }));
      } else {
        setSaveSuccess(true);
        dispatch(displayNotification({
          message: 'Profile saved successfully!',
          type: 'success',
        }));
        setTimeout(() => {
          if (onSave) onSave();
        }, 1500);
      }
    } catch (err) {
      const errorMessage = err?.error || err?.message || 'Failed to save profile';
      setSaveError(errorMessage);
      dispatch(displayNotification({
        message: errorMessage,
        type: 'error',
      }));
    } finally {
      setSaving(false);
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
            Complete your profile to start attracting supporters. You can always update these details later.
          </Typography>

          {saveError && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSaveError(null)}>
              {saveError}
            </Alert>
          )}

          {saveSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Profile saved successfully! Refreshing...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Profile Picture Upload */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--theme-text)', mb: 2 }}>
                Profile Picture
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
                  />
                  <label htmlFor="profile-pic-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCamera />}
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
                />
                <label
                  htmlFor="banner-upload"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    cursor: 'pointer',
                  }}
                />
              </Box>
            </Box>

            {/* Bio */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--theme-text)', mb: 2 }}>
                Bio
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

            {/* Submit Button */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving || loading}
                startIcon={saving || loading ? <CircularProgress size={20} /> : <Save />}
                sx={{
                  backgroundColor: 'var(--theme-primary)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'var(--theme-secondary)',
                  },
                  '&:disabled': {
                    backgroundColor: 'var(--theme-text-muted)',
                  },
                }}
              >
                {saving || loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileEditor;

