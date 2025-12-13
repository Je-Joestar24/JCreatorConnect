import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AutoAwesome } from '@mui/icons-material';

/**
 * Creator Header Logo Component
 * Displays the application logo with animation
 */
const CreatorHeaderLogo = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/creator/posts');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ cursor: 'pointer' }}
      onClick={handleLogoClick}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        >
          <AutoAwesome
            sx={{
              fontSize: 32,
              background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          />
        </motion.div>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px',
          }}
        >
          JCreatorConnect
        </Typography>
      </Box>
    </motion.div>
  );
};

export default CreatorHeaderLogo;

