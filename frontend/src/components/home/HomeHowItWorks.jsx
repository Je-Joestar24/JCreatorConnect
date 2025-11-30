import { motion } from 'framer-motion';
import { Box, Typography, Container, Paper, Grid, Chip } from '@mui/material';
import {
  PersonAdd,
  Create,
  Share,
  AttachMoney,
  Search,
  Favorite,
  LockOpen,
  AutoAwesome,
  AccountCircle,
  PostAdd,
  Payment,
  Group,
} from '@mui/icons-material';

const HomeHowItWorks = () => {
  // Creator steps
  const creatorSteps = [
    {
      icon: PersonAdd,
      title: 'Sign Up as Creator',
      description: 'Create your account and set up your creator profile with bio, social links, and categories.',
      color: 'var(--theme-primary)',
    },
    {
      icon: Create,
      title: 'Build Your Profile',
      description: 'Add your profile photo, banner, and showcase your work. Set up membership tiers if desired.',
      color: 'var(--theme-secondary)',
    },
    {
      icon: PostAdd,
      title: 'Share Your Content',
      description: 'Post text, images, videos, or links. Create free content or exclusive supporter-only posts.',
      color: 'var(--theme-accent)',
    },
    {
      icon: AttachMoney,
      title: 'Receive Support',
      description: 'Get tips from supporters and monthly subscriptions. Track your earnings and analytics.',
      color: 'var(--theme-success)',
    },
  ];

  // Supporter steps
  const supporterSteps = [
    {
      icon: Search,
      title: 'Discover Creators',
      description: 'Browse creator profiles and use AI-powered search to find creators in your favorite categories.',
      color: 'var(--theme-primary)',
    },
    {
      icon: Favorite,
      title: 'Support Creators',
      description: 'Send tips ($1-$10 or custom amounts) or subscribe to monthly membership plans.',
      color: 'var(--theme-secondary)',
    },
    {
      icon: LockOpen,
      title: 'Unlock Content',
      description: 'Access exclusive supporter-only posts and membership content from creators you support.',
      color: 'var(--theme-accent)',
    },
    {
      icon: AutoAwesome,
      title: 'Get Recommendations',
      description: 'Receive AI-powered suggestions for creators you might like based on your interests.',
      color: 'var(--theme-warning)',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        duration: 0.5,
      },
    },
  };

  const StepCard = ({ step, index, isCreator }) => {
    const IconComponent = step.icon;

    return (
      <motion.div
        variants={itemVariants}
        className="how-it-works-step"
        whileHover={{ y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Paper
          elevation={4}
          className="step-card"
          sx={{
            p: 3,
            height: '100%',
            borderRadius: 4,
            background: 'var(--theme-bg-card)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--theme-border)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 40px rgba(124, 58, 237, 0.2)',
              borderColor: 'var(--theme-primary)',
            },
          }}
        >
          {/* Step Number Badge */}
          <Box
            className="step-number"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.2rem',
              boxShadow: `0 4px 12px ${step.color}40`,
            }}
          >
            {index + 1}
          </Box>

          {/* Icon Container */}
          <motion.div
            variants={iconVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            whileHover="hover"
            className="step-icon-container"
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${step.color}15 0%, ${step.color}25 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                border: `2px solid ${step.color}30`,
              }}
            >
              <IconComponent
                sx={{
                  fontSize: 40,
                  color: step.color,
                }}
              />
            </Box>
          </motion.div>

          {/* Content */}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              mb: 1.5,
              color: 'var(--theme-text)',
            }}
          >
            {step.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'var(--theme-text-secondary)',
              lineHeight: 1.7,
            }}
          >
            {step.description}
          </Typography>

          {/* Decorative Line */}
          <Box
            className="step-line"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 4,
              width: '0%',
              background: `linear-gradient(90deg, ${step.color} 0%, ${step.color}dd 100%)`,
              transition: 'width 0.5s ease',
            }}
          />
        </Paper>
      </motion.div>
    );
  };

  return (
    <Box className="how-it-works-section" sx={{ py: 10, position: 'relative', overflow: 'hidden' }}>
      {/* Background Decoration */}
      <Box className="how-it-works-bg-decoration" />

      <Container maxWidth="xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="How It Works"
              sx={{
                mb: 2,
                px: 2,
                py: 3,
                fontSize: '0.9rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, var(--theme-primary)15 0%, var(--theme-secondary)15 100%)',
                color: 'var(--theme-primary)',
                border: '1px solid var(--theme-border-accent)',
              }}
            />
            <Typography
              variant="h2"
              component="h2"
              className="section-title"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                mb: 2,
                color: 'var(--theme-text)',
              }}
            >
              How <span className="gradient-text">JCreatorConnect</span> Works
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                color: 'var(--theme-text-secondary)',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.7,
              }}
            >
              A simple platform connecting creators with their supporters. Start
              sharing your work or discover amazing creators to support.
            </Typography>
          </Box>
        </motion.div>

        {/* Creator Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="creator-section"
        >
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 4,
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}
            >
              <AccountCircle
                sx={{
                  fontSize: 48,
                  color: 'var(--theme-primary)',
                }}
              />
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  fontWeight: 700,
                  color: 'var(--theme-text)',
                }}
              >
                For Creators
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {creatorSteps.map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <StepCard step={step} index={index} isCreator={true} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Box
            sx={{
              height: 2,
              background: 'linear-gradient(90deg, transparent 0%, var(--theme-primary) 50%, transparent 100%)',
              my: 8,
              borderRadius: 2,
            }}
          />
        </motion.div>

        {/* Supporter Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="supporter-section"
        >
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 4,
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Group
                sx={{
                  fontSize: 48,
                  color: 'var(--theme-secondary)',
                }}
              />
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  fontWeight: 700,
                  color: 'var(--theme-text)',
                }}
              >
                For Supporters
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {supporterSteps.map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <StepCard step={step} index={index} isCreator={false} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box
            sx={{
              mt: 8,
              textAlign: 'center',
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, var(--theme-primary)10 0%, var(--theme-secondary)10 100%)',
              border: '1px solid var(--theme-border-accent)',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: 'var(--theme-text)',
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'var(--theme-text-secondary)',
                mb: 3,
              }}
            >
              Join thousands of creators and supporters building meaningful
              connections
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HomeHowItWorks;

