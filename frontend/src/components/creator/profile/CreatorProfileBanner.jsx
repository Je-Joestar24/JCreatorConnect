import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, IconButton, CircularProgress } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

/**
 * Creator Profile Banner Component
 * Displays banner image with optional upload button for own profile
 */
const CreatorProfileBanner = ({ profile, isOwnProfile, onBannerUpload }) => {
  const bannerUrl = profile?.profile?.bannerUrl;
  const [isUploading, setIsUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && onBannerUpload) {
      setIsUploading(true);
      try {
        await onBannerUpload(file);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <motion.div
      className="creator-profile-banner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        className="banner-container"
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '200px', sm: '250px', md: '300px' },
          overflow: 'hidden',
          borderRadius: { xs: 0, md: '16px' },
          backgroundColor: 'var(--theme-bg-secondary)',
        }}
      >
        {bannerUrl ? (
          <motion.img
            src={bannerUrl}
            alt="Profile banner"
            className="banner-image"
            initial={{ scale: 1.1 }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.8 }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Decorative elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </Box>
        )}

        {isOwnProfile && (
          <AnimatePresence>
            {(isHovered || !bannerUrl) && (
              <motion.div
                className="banner-upload-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(2px)',
                }}
              >
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="banner-upload"
                  type="file"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <label htmlFor="banner-upload">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      component="span"
                      className="banner-upload-button"
                      disabled={isUploading}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: 'var(--theme-primary)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                        '&:disabled': {
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                      aria-label="Upload banner"
                    >
                      {isUploading ? (
                        <CircularProgress size={24} sx={{ color: 'var(--theme-primary)' }} />
                      ) : (
                        <CloudUpload />
                      )}
                    </IconButton>
                  </motion.div>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Box>
    </motion.div>
  );
};

export default CreatorProfileBanner;
