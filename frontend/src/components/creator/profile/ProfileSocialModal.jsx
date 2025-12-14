import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Close, Instagram, YouTube, Twitter, Language, Save } from '@mui/icons-material';
import useCreatorProfile from '../../../hooks/creatorProfileHook';
import { useDispatch } from 'react-redux';
import { displayNotification } from '../../../store/slices/uiSlice';

/**
 * Profile Social Modal Component
 * Modal for editing all social media links at once
 */
const ProfileSocialModal = ({ open, onClose, profile, isOwnProfile, onSave }) => {
  const dispatch = useDispatch();
  const { updateSocialLinks } = useCreatorProfile();
  
  const [formData, setFormData] = useState({
    instagram: '',
    youtube: '',
    twitter: '',
    website: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data from profile
  useEffect(() => {
    if (profile?.profile?.socials) {
      setFormData({
        instagram: profile.profile.socials.instagram || '',
        youtube: profile.profile.socials.youtube || '',
        twitter: profile.profile.socials.twitter || '',
        website: profile.profile.socials.website || '',
      });
    }
  }, [profile, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!isOwnProfile) return;
    
    setIsSaving(true);
    try {
      // Allow empty strings - all socials are optional
      const socials = {
        instagram: formData.instagram ? formData.instagram.trim() : '',
        youtube: formData.youtube ? formData.youtube.trim() : '',
        twitter: formData.twitter ? formData.twitter.trim() : '',
        website: formData.website ? formData.website.trim() : '',
      };
      
      await updateSocialLinks(socials);
      dispatch(displayNotification({
        message: 'Social links saved successfully!',
        type: 'success',
      }));
      if (onSave) {
        await onSave();
      }
      onClose();
    } catch (error) {
      dispatch(displayNotification({
        message: error?.error || error?.message || 'Failed to save social links',
        type: 'error',
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const socialFields = [
    {
      name: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      placeholder: 'https://instagram.com/yourusername',
    },
    {
      name: 'youtube',
      label: 'YouTube',
      icon: YouTube,
      placeholder: 'https://youtube.com/@yourchannel',
    },
    {
      name: 'twitter',
      label: 'Twitter/X',
      icon: Twitter,
      placeholder: 'https://twitter.com/yourusername',
    },
    {
      name: 'website',
      label: 'Website',
      icon: Language,
      placeholder: 'https://yourwebsite.com',
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: 'var(--theme-bg)',
          border: '1px solid var(--theme-border)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          borderBottom: '1px solid var(--theme-border)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--theme-text)' }}>
          Edit Social Links
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'var(--theme-text-secondary)',
            '&:hover': {
              backgroundColor: 'var(--theme-bg-secondary)',
            },
          }}
          aria-label="Close"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          {socialFields.map((field) => {
            const Icon = field.icon;
            const hasValue = formData[field.name] && formData[field.name].trim().length > 0;
            
            return (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: socialFields.indexOf(field) * 0.1 }}
              >
                <TextField
                  fullWidth
                  name={field.name}
                  label={field.label}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        <Icon 
                          sx={{ 
                            color: hasValue ? 'var(--theme-primary)' : 'var(--theme-text-muted)',
                            transition: 'color 0.3s ease',
                          }} 
                        />
                      </Box>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'var(--theme-bg)',
                      '& fieldset': {
                        borderColor: hasValue ? 'var(--theme-primary)' : 'var(--theme-border)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'var(--theme-primary)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'var(--theme-primary)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'var(--theme-text-secondary)',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'var(--theme-primary)',
                    },
                  }}
                />
              </motion.div>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button
          onClick={onClose}
          disabled={isSaving}
          sx={{
            color: 'var(--theme-text-secondary)',
            '&:hover': {
              backgroundColor: 'var(--theme-bg-secondary)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          variant="contained"
          startIcon={isSaving ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Save />}
          sx={{
            backgroundColor: 'var(--theme-primary)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'var(--theme-secondary)',
            },
            '&:disabled': {
              backgroundColor: 'var(--theme-text-muted)',
            },
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileSocialModal;

