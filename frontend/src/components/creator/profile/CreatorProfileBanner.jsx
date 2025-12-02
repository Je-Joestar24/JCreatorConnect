import { motion } from 'framer-motion';
import { Box, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

/**
 * Creator Profile Banner Component
 * Displays banner image with optional upload button for own profile
 */
const CreatorProfileBanner = ({ profile, isOwnProfile, onBannerUpload }) => {
  const bannerUrl = profile?.profile?.bannerUrl;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onBannerUpload) {
      onBannerUpload(file);
    }
  };

  return (
    <motion.div
      className="creator-profile-banner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Box
        className="banner-container"
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '200px', sm: '250px', md: '300px' },
          overflow: 'hidden',
          borderRadius: { xs: 0, md: '16px 16px 0 0' },
          backgroundColor: 'var(--theme-bg-secondary)',
        }}
      >
        {bannerUrl ? (
          <motion.img
            src={bannerUrl}
            alt="Profile banner"
            className="banner-image"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
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
            }}
          />
        )}

        {isOwnProfile && (
          <motion.div
            className="banner-upload-overlay"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="banner-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="banner-upload">
              <IconButton
                component="span"
                className="banner-upload-button"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export default CreatorProfileBanner;

