import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Container, Paper, Chip } from '@mui/material';
import {
  AutoAwesome,
  Lightbulb,
  Edit,
  Description,
  LocalOffer,
  Recommend,
} from '@mui/icons-material';

const HomeHighlightsSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showLogo, setShowLogo] = useState(true); // Conditional rendering for logo

  // AI feature cards data
  const aiFeatures = [
    {
      id: 1,
      icon: Lightbulb,
      title: 'Generate Post Ideas',
      description: 'Get instant creative content ideas tailored to your niche. Never run out of inspiration with AI-powered suggestions.',
      position: { top: '5%', left: '20%' },
      delay: 0.1,
      color: 'var(--theme-primary)',
    },
    {
      id: 2,
      icon: Edit,
      title: 'Rewrite Content in Seconds',
      description: 'Transform your text with different tones and styles. Professional, casual, or creative - rewrite in seconds.',
      position: { top: '15%', right: '18%' },
      delay: 0.2,
      color: 'var(--theme-secondary)',
    },
    {
      id: 3,
      icon: Description,
      title: 'Create Descriptions Automatically',
      description: 'Generate engaging post descriptions and summaries automatically. Save time while maintaining quality.',
      position: { bottom: '1%', left: '35%' },
      delay: 0.3,
      color: 'var(--theme-accent)',
    },
    {
      id: 4,
      icon: LocalOffer,
      title: 'Smart Topic/Tag Suggestions',
      description: 'Get intelligent tag and category recommendations to improve discoverability and reach the right audience.',
      position: { top: '40%', left: '15%' },
      delay: 0.4,
      color: 'var(--theme-success)',
    },
    {
      id: 5,
      icon: Recommend,
      title: 'AI Recommendations for Supporters',
      description: 'Help supporters discover creators they\'ll love with personalized AI-powered recommendations based on interests.',
      position: { bottom: '10%', right: '15%' },
      delay: 0.5,
      color: 'var(--theme-warning)',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = (delay) => ({
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  });

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1], // Smooth ease-out curve
      },
    },
  };

  // Logo Component (Reusing Hero Section Style)
  const LogoPlaceholder = () => {
    if (!showLogo) return null;

    return (
      <motion.div
        variants={logoVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="ai-logo-container"
      >
        <Box className="central-illustration">
          <motion.div
            className="main-shape"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Box className="shape-container">
              <AutoAwesome className="shape-icon" />
            </Box>
          </motion.div>
        </Box>
      </motion.div>
    );
  };

  return (
    <Box className="ai-highlights-section" sx={{ py: 10, position: 'relative', overflow: 'hidden' }}>
      {/* Background Decoration */}
      <Box className="ai-highlights-bg" />

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
              icon={<AutoAwesome sx={{ fontSize: 18 }} />}
              label="AI-Powered"
              sx={{
                mb: 2,
                px: 2,
                py: 3,
                fontSize: '0.9rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, var(--theme-primary)15 0%, var(--theme-secondary)15 100%)',
                color: 'var(--theme-primary)',
                border: '1px solid var(--theme-border-accent)',
                '& .MuiChip-icon': {
                  color: 'var(--theme-primary)',
                },
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
              AI Tools to Help Creators{' '}
              <span className="gradient-text">Publish Faster</span>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                color: 'var(--theme-text-secondary)',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              Show your competitive advantage with cutting-edge AI features
              powered by Groq API
            </Typography>
            
            {/* Groq API Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Chip
                label="Powered by Groq API"
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #00A67E 0%, #00C896 100%)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(0, 166, 126, 0.3)',
                }}
              />
            </motion.div>
          </Box>
        </motion.div>

        {/* Floating Cards Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="ai-floating-container"
        >
          <Box
            sx={{
              position: 'relative',
              minHeight: { xs: '600px', md: '700px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            {/* Central Logo - Centered */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
              }}
            >
              <LogoPlaceholder />
            </Box>

            {/* Floating Feature Cards */}
            {aiFeatures.map((feature) => {
              const IconComponent = feature.icon;
              const isHovered = hoveredCard === feature.id;

              return (
                <motion.div
                  key={feature.id}
                  variants={cardVariants(feature.delay)}
                  className="ai-feature-card"
                  style={{
                    position: 'absolute',
                    ...feature.position,
                  }}
                  onHoverStart={() => setHoveredCard(feature.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    y: {
                      duration: 4 + feature.id * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    rotate: {
                      duration: 5 + feature.id * 0.3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                >
                  <Paper
                    elevation={isHovered ? 12 : 4}
                    className="ai-card"
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      background: 'var(--theme-bg-card)',
                      backdropFilter: 'blur(10px)',
                      border: `2px solid ${isHovered ? feature.color : 'var(--theme-border)'}`,
                      maxWidth: { xs: '280px', md: '320px' },
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${feature.color} 0%, ${feature.color}dd 100%)`,
                        transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 0.3s ease',
                      },
                    }}
                  >
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${feature.color}15 0%, ${feature.color}25 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        border: `2px solid ${feature.color}30`,
                        transition: 'all 0.3s ease',
                        transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                      }}
                    >
                      <IconComponent
                        sx={{
                          fontSize: 32,
                          color: feature.color,
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 1.5,
                        color: 'var(--theme-text)',
                        fontSize: { xs: '1rem', md: '1.1rem' },
                      }}
                    >
                      {feature.title}
                    </Typography>

                    {/* Description - Shows on hover */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isHovered ? 'auto' : 0,
                        opacity: isHovered ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'var(--theme-text-secondary)',
                          lineHeight: 1.7,
                          fontSize: { xs: '0.85rem', md: '0.9rem' },
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </motion.div>

                    {/* Hover Indicator */}
                    {isHovered && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ai-card-glow"
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '200px',
                          height: '200px',
                          borderRadius: '50%',
                          background: `radial-gradient(circle, ${feature.color}20, transparent)`,
                          transform: 'translate(-50%, -50%)',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                  </Paper>
                </motion.div>
              );
            })}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HomeHighlightsSection;

