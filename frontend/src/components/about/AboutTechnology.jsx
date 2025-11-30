import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Container } from '@mui/material';
import { Code, Security, CloudUpload } from '@mui/icons-material';

// Import technology logos
import mongodbLogo from '../../assets/images/about/mongodb.png';
import expressLogo from '../../assets/images/about/express.png';
import reactLogo from '../../assets/images/about/react.png';
import nodeLogo from '../../assets/images/about/node.png';
import groqLogo from '../../assets/images/about/groq.png';
import stripeLogo from '../../assets/images/about/stripe.png';

const AboutTechnology = () => {
  const [activeTech, setActiveTech] = useState(0);
  const [hoveredTech, setHoveredTech] = useState(null);

  // Technology stack data
  const technologies = [
    {
      id: 'mongodb',
      name: 'MongoDB',
      logo: mongodbLogo,
      description: 'NoSQL database for flexible, scalable data storage and management.',
      category: 'Database',
    },
    {
      id: 'express',
      name: 'Express.js',
      logo: expressLogo,
      description: 'Fast, minimalist web framework for building robust RESTful APIs.',
      category: 'Backend Framework',
    },
    {
      id: 'react',
      name: 'React',
      logo: reactLogo,
      description: 'Modern UI library for building interactive, component-based user interfaces.',
      category: 'Frontend Library',
    },
    {
      id: 'node',
      name: 'Node.js',
      logo: nodeLogo,
      description: 'JavaScript runtime for building scalable server-side applications.',
      category: 'Runtime',
    },
    {
      id: 'groq',
      name: 'Groq AI',
      logo: groqLogo,
      description: 'AI-powered content generation and intelligent recommendations for creators.',
      category: 'AI Integration',
    },
    {
      id: 'stripe',
      name: 'Stripe',
      logo: stripeLogo,
      description: 'Secure payment processing for tips, memberships, and subscriptions.',
      category: 'Payment Gateway',
    },
  ];

  // Auto-transition every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTech((prev) => (prev + 1) % technologies.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [technologies.length]);

  const currentTech = technologies[activeTech];

  return (
    <Box className="about-technology-section" sx={{ py: 12, position: 'relative', overflow: 'hidden' }}>
      {/* Background Gradient */}
      <Box className="about-technology-bg" />

      {/* Decorative Background Elements */}
      <motion.div
        className="about-tech-circle circle-1"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.06, 0.12, 0.06],
          x: [0, 40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="about-tech-circle circle-2"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.05, 0.1, 0.05],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <Container maxWidth="lg">
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2 }}>
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Code
                    sx={{
                      fontSize: 40,
                      color: 'var(--theme-primary)',
                    }}
                  />
                </motion.div>
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2rem', md: '3rem' },
                    background: 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Technology Behind the Platform
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--theme-text-secondary)',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  maxWidth: '700px',
                  mx: 'auto',
                }}
              >
                Built with modern technologies to deliver a seamless, secure, and scalable experience
              </Typography>
            </Box>
          </motion.div>

          {/* Technology Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(3, 1fr)' },
              gap: { xs: 3, md: 4 },
              mb: 6,
            }}
          >
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredTech(tech.id)}
                onHoverEnd={() => setHoveredTech(null)}
                onClick={() => setActiveTech(index)}
                style={{ cursor: 'pointer' }}
              >
                <Box
                  className={`tech-logo-container ${activeTech === index ? 'active' : ''} ${hoveredTech === tech.id ? 'hovered' : ''}`}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    background: activeTech === index
                      ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(139, 92, 246, 0.1))'
                      : 'transparent',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: 'var(--theme-border-accent)',
                    },
                  }}
                >
                  {/* Logo */}
                  <Box
                    component="img"
                    src={tech.logo}
                    alt={tech.name}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'contain',
                      mb: 2,
                      filter: activeTech === index ? 'none' : 'grayscale(0.3)',
                      opacity: activeTech === index ? 1 : 0.7,
                      transition: 'all 0.3s ease',
                    }}
                  />

                  {/* Title - Always visible */}
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.95rem', md: '1.1rem' },
                      color: activeTech === index ? 'var(--theme-primary)' : 'var(--theme-text)',
                      textAlign: 'center',
                      mb: hoveredTech === tech.id ? 1 : 0,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {tech.name}
                  </Typography>

                  {/* Description - Show on hover */}
                  <AnimatePresence>
                    {hoveredTech === tech.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'var(--theme-text-secondary)',
                            fontSize: { xs: '0.85rem', md: '0.9rem' },
                            textAlign: 'center',
                            lineHeight: 1.6,
                            mt: 1,
                          }}
                        >
                          {tech.description}
                        </Typography>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Category Badge */}
                  <Box
                    sx={{
                      mt: 1,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      background: activeTech === index
                        ? 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))'
                        : 'var(--theme-bg-secondary)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: activeTech === index ? 'var(--theme-text-inverse)' : 'var(--theme-text-muted)',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    >
                      {tech.category}
                    </Typography>
                  </Box>

                  {/* Active Indicator */}
                  {activeTech === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))',
                        boxShadow: '0 0 12px rgba(124, 58, 237, 0.6)',
                      }}
                    />
                  )}
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Active Technology Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTech}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  background: 'var(--theme-bg-card)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--theme-border)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={currentTech.logo}
                    alt={currentTech.name}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: 'contain',
                    }}
                  />
                  <Box>
                    <Typography
                      variant="h4"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'var(--theme-text)',
                        fontSize: { xs: '1.5rem', md: '2rem' },
                      }}
                    >
                      {currentTech.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--theme-text-muted)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {currentTech.category}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'var(--theme-text-secondary)',
                    lineHeight: 1.8,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    maxWidth: '800px',
                    mx: 'auto',
                  }}
                >
                  {currentTech.description}
                </Typography>
              </Box>
            </motion.div>
          </AnimatePresence>

          {/* Additional Features */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              mt: 6,
            }}
          >
            {[
              {
                icon: Security,
                title: 'Secure Authentication',
                description: 'JWT-based authentication with refresh tokens for enhanced security.',
              },
              {
                icon: CloudUpload,
                title: 'Cloud Media Management',
                description: 'Efficient media storage and delivery using cloud infrastructure.',
              },
              {
                icon: Code,
                title: 'Modern Architecture',
                description: 'Scalable, modular codebase following industry best practices.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    textAlign: 'center',
                    background: 'var(--theme-bg-secondary)',
                    border: '1px solid var(--theme-border)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'var(--theme-border-accent)',
                      boxShadow: '0 8px 24px rgba(124, 58, 237, 0.15)',
                    },
                  }}
                >
                  <feature.icon
                    sx={{
                      fontSize: 40,
                      color: 'var(--theme-primary)',
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h6"
                    component="h4"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: 'var(--theme-text)',
                      fontSize: '1.1rem',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--theme-text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutTechnology;

