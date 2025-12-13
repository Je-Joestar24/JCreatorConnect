import { motion } from 'framer-motion';
import { Box, Container } from '@mui/material';
import CreatorHeaderLogo from './CreatorheaderLogo';
import CreatorHeaderNavigations from './CreatorHeaderNavigations';
import CreatorHeaderProfile from './CreatorHeaderProfile';

/**
 * Creator Header Layout Component
 * Main header component for creator dashboard
 */
const CreatorHeaderLayout = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--theme-bg-card)',
        borderBottom: '1px solid var(--theme-border)',
        boxShadow: 'var(--theme-shadow-sm)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
            gap: 3,
          }}
        >
          {/* Logo */}
          <Box sx={{ flexShrink: 0 }}>
            <CreatorHeaderLogo />
          </Box>

          {/* Navigation - Hidden on mobile, centered on desktop */}
          <Box
            sx={{
              flex: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
            }}
          >
            <CreatorHeaderNavigations />
          </Box>

          {/* Profile - Always visible */}
          <Box sx={{ flexShrink: 0, ml: 'auto' }}>
            <CreatorHeaderProfile />
          </Box>
        </Box>

        {/* Mobile Navigation - Shown only on mobile */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'center',
            pb: 2,
            borderTop: '1px solid var(--theme-border)',
            pt: 2,
            mt: 2,
          }}
        >
          <CreatorHeaderNavigations />
        </Box>
      </Container>
    </motion.header>
  );
};

export default CreatorHeaderLayout;

