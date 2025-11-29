import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

// Logo component with optional image.
// If no logoSrc is provided, a gradient circle with initials is shown.
const HeaderLogo = ({ logoSrc }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
      }}
      aria-label="JCreatorConnect logo"
      role="button"
    >
      {logoSrc ? (
        <Box
          component="img"
          src={logoSrc}
          alt="JCreatorConnect logo"
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 0 18px rgba(124, 58, 237, 0.6)',
          }}
        />
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background:
                'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: 'var(--theme-text-inverse)',
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              JC
            </Typography>
          </Box>
        </motion.div>
      )}

      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          letterSpacing: 0.8,
          color: 'var(--theme-text)',
        }}
      >
        JCreatorConnect
      </Typography>
    </Box>
  );
};

export default HeaderLogo;


