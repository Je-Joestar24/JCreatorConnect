import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
} from '@mui/icons-material';
import useCreatorProfile from '../../../hooks/creatorProfileHook';

/**
 * Profile Editor Component
 * Allows creators to create/edit their profile
 */
const ProfileEditor = ({ onSave, initialProfile = null }) => {
  const {
    updateBio,
    updateSocialLinks,
    uploadProfilePicture,
    uploadBanner,
    loading,
    error,
  } = useCreatorProfile();

  const [formData, setFormData] = useState({
    bio: initialProfile?.profile?.bio || '',
    instagram: initialProfile?.profile?.socials?.instagram || '',
    youtube: initialProfile?.profile?.socials?.youtube || '',
    twitter: initialProfile?.profile?.socials?.twitter || '',
    website: initialProfile?.profile?.socials?.website || '',
  });

  // Update form data when initialProfile changes
  useEffect(() => {
    if (initialProfile) {
      setFormData({
        bio: initialProfile?.profile?.bio || '',
        instagram: initialProfile?.profile?.socials?.instagram || '',
        youtube: initialProfile?.profile?.socials?.youtube || '',
        twitter: initialProfile?.profile?.socials?.twitter || '',
        website: initialProfile?.profile?.socials?.website || '',
      });
      if (initialProfile?.user?.avatarUrl) {
        setProfilePicPreview(initialProfile.user.avatarUrl);
      }
      if (initialProfile?.profile?.bannerUrl) {
        setBannerPreview(initialProfile.profile.bannerUrl);
      }
    }
  }, [initialProfile]);

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSaveError(null);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
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
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Update bio if provided
      if (formData.bio.trim()) {
        await updateBio(formData.bio);
      }

      // Update social links if any provided
      const socials = {};
      if (formData.instagram.trim()) socials.instagram = formData.instagram;
      if (formData.youtube.trim()) socials.youtube = formData.youtube;
      if (formData.twitter.trim()) socials.twitter = formData.twitter;
      if (formData.website.trim()) socials.website = formData.website;

      if (Object.keys(socials).length > 0) {
        await updateSocialLinks(socials);
      }

      // Upload profile picture if selected
      if (profilePicFile) {
        await uploadProfilePicture(profilePicFile);
      }

      // Upload banner if selected
      if (bannerFile) {
        await uploadBanner(bannerFile);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        if (onSave) onSave();
      }, 1500);
    } catch (err) {
      setSaveError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
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
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'var(--theme-text)',
              mb: 3,
            }}
          >
            Set Up Your Creator Profile
          </Typography>

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
                  }}
                >
                  {profilePicPreview ? (
                    <img
                      src={profilePicPreview}
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
                {bannerPreview ? (
                  <img
                    src={bannerPreview}
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

