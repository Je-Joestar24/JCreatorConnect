import { motion } from 'framer-motion';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import {
  School,
  VideoLibrary,
  Groups,
  AutoAwesome,
  Favorite,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/home.css';

const HomeHeroSection = () => {
  const navigate = useNavigate();

  // Floating feature cards animation variants
  const floatingCardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.2,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
    hover: {
      y: -10,
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  // Decorative circles animation
  const circleVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <Box className="hero-section">
      <Container maxWidth="xl" sx={{ position: 'relative', height: '100vh' }}>
        <Box className="hero-container">
          {/* Left Content Area */}
          <motion.div
            className="hero-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Typography
                variant="h1"
                component="h1"
                className="hero-title"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mb: 3,
                  color: 'var(--theme-text)',
                }}
              >
                Best Platform For{' '}
                <span className="gradient-text">Creator Support</span>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Typography
                variant="body1"
                className="hero-description"
                sx={{
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  color: 'var(--theme-text-secondary)',
                  mb: 4,
                  maxWidth: '600px',
                  lineHeight: 1.7,
                }}
              >
                Empower creators to share content and receive financial support
                through micro-payments and memberships. Join a community where
                creativity meets support.
              </Typography>
            </motion.div>

            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="large"
                  className="cta-button-primary"
                  onClick={() => navigate('/register?role=creator')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: 'none',
                    mr: 2,
                    mb: { xs: 2, sm: 0 },
                    background: 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)',
                    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, var(--theme-secondary) 0%, var(--theme-primary) 100%)',
                      boxShadow: '0 12px 32px rgba(124, 58, 237, 0.4)',
                    },
                  }}
                >
                  Become a Creator
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  size="large"
                  className="cta-button-secondary"
                  onClick={() => navigate('/creators')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: 'none',
                    borderWidth: 2,
                    borderColor: 'var(--theme-primary)',
                    color: 'var(--theme-primary)',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: 'var(--theme-secondary)',
                      backgroundColor: 'rgba(124, 58, 237, 0.05)',
                    },
                  }}
                >
                  Support a Creator
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content Area with Shapes */}
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            {/* Decorative Circles */}
            <motion.div
              className="decorative-circle circle-1"
              variants={circleVariants}
              animate="animate"
            />
            <motion.div
              className="decorative-circle circle-2"
              variants={circleVariants}
              animate="animate"
              style={{ animationDelay: '1s' }}
            />
            <motion.div
              className="decorative-circle circle-3"
              variants={circleVariants}
              animate="animate"
              style={{ animationDelay: '2s' }}
            />

            {/* Central Illustration Area */}
            <Box className="central-illustration">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                className="main-shape"
              >
                <Box className="shape-container">
                  <AutoAwesome className="shape-icon" />
                </Box>
              </motion.div>
            </Box>

            {/* Floating Feature Cards */}
            <motion.div
              className="feature-card card-1"
              variants={floatingCardVariants}
              initial="initial"
              animate="animate"
              custom={0}
              whileHover="hover"
            >
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: 'var(--theme-bg-card)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--theme-border)',
                }}
              >
                <School sx={{ color: 'var(--theme-primary)', fontSize: 32, mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--theme-text)' }}>
                  Share Content
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--theme-text-muted)' }}>
                  Post updates & media
                </Typography>
              </Paper>
            </motion.div>

            <motion.div
              className="feature-card card-2"
              variants={floatingCardVariants}
              initial="initial"
              animate="animate"
              custom={1}
              whileHover="hover"
            >
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: 'var(--theme-bg-card)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--theme-border)',
                }}
              >
                <VideoLibrary sx={{ color: 'var(--theme-primary)', fontSize: 32, mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--theme-text)' }}>
                  Video Content
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--theme-text-muted)' }}>
                  Embed & share videos
                </Typography>
              </Paper>
            </motion.div>

            <motion.div
              className="feature-card card-3"
              variants={floatingCardVariants}
              initial="initial"
              animate="animate"
              custom={2}
              whileHover="hover"
            >
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: 'var(--theme-bg-card)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--theme-border)',
                }}
              >
                <Groups sx={{ color: 'var(--theme-primary)', fontSize: 32, mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--theme-text)' }}>
                  Build Community
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--theme-text-muted)' }}>
                  Connect with supporters
                </Typography>
              </Paper>
            </motion.div>

            <motion.div
              className="feature-card card-4"
              variants={floatingCardVariants}
              initial="initial"
              animate="animate"
              custom={3}
              whileHover="hover"
            >
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: 'var(--theme-bg-card)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--theme-border)',
                }}
              >
                <Favorite sx={{ color: 'var(--theme-primary)', fontSize: 32, mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--theme-text)' }}>
                  Receive Support
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--theme-text-muted)' }}>
                  Tips & memberships
                </Typography>
              </Paper>
            </motion.div>

            <motion.div
              className="feature-card card-5"
              variants={floatingCardVariants}
              initial="initial"
              animate="animate"
              custom={4}
              whileHover="hover"
            >
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: 'var(--theme-bg-card)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--theme-border)',
                }}
              >
                <TrendingUp sx={{ color: 'var(--theme-primary)', fontSize: 32, mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--theme-text)' }}>
                  Grow Your Reach
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--theme-text-muted)' }}>
                  Analytics & insights
                </Typography>
              </Paper>
            </motion.div>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default HomeHeroSection;

