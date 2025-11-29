import { motion } from 'framer-motion';
import { Box, Typography, Container } from '@mui/material';
import {
  Visibility,
  Category,
  Analytics,
  PhoneAndroid,
  AutoAwesome,
  Store,
  Groups,
} from '@mui/icons-material';
import '../../assets/css/home.css';

const AboutVission = () => {
  // Floating decorative elements
  const floatingElements = [
    { icon: Visibility, delay: 0, position: { top: '12%', left: '6%' }, size: 36 },
    { icon: AutoAwesome, delay: 0.6, position: { top: '22%', right: '8%' }, size: 40 },
    { icon: Store, delay: 1, position: { bottom: '18%', left: '10%' }, size: 34 },
    { icon: Groups, delay: 0.4, position: { bottom: '28%', right: '6%' }, size: 38 },
  ];

  // Vision points / Future plans
  const visionPlans = [
    {
      icon: Category,
      title: 'Expanding Creator Categories',
      description: 'Support diverse creator niches from education and gaming to art and music, enabling creators from all backgrounds to thrive.',
      color: 'var(--theme-primary)',
    },
    {
      icon: Analytics,
      title: 'Advanced Analytics Tools',
      description: 'Provide comprehensive insights with real-time analytics, audience demographics, and performance metrics to help creators grow.',
      color: 'var(--theme-secondary)',
    },
    {
      icon: PhoneAndroid,
      title: 'Mobile App Launch',
      description: 'Bring the platform to iOS and Android, allowing creators and supporters to connect on-the-go with native mobile experiences.',
      color: 'var(--theme-accent)',
    },
    {
      icon: AutoAwesome,
      title: 'Enhanced AI Tools',
      description: 'Expand AI capabilities with advanced content generation, automated scheduling, and intelligent audience engagement features.',
      color: 'var(--theme-success)',
    },
    {
      icon: Store,
      title: 'Creator Marketplaces',
      description: 'Enable creators to sell digital products, courses, and exclusive content directly through integrated marketplace features.',
      color: 'var(--theme-warning)',
    },
    {
      icon: Groups,
      title: 'Workshops & Communities',
      description: 'Foster creator communities through virtual workshops, networking events, and collaborative spaces for knowledge sharing.',
      color: 'var(--theme-primary)',
    },
  ];

  return (
    <Box className="about-vision-section" sx={{ py: 12, position: 'relative', overflow: 'hidden' }}>
      {/* Background Gradient */}
      <Box className="about-vision-bg" />

      {/* Floating Decorative Icons */}
      {floatingElements.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={index}
            className="about-vision-floating-icon"
            style={{
              position: 'absolute',
              ...item.position,
              zIndex: 0,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, -15, 0],
              rotate: [0, 20, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + index * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
          >
            <IconComponent
              sx={{
                fontSize: item.size,
                color: 'var(--theme-primary)',
                opacity: 0.1,
              }}
            />
          </motion.div>
        );
      })}

      {/* Animated Background Circles */}
      <motion.div
        className="about-vision-circle circle-1"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.07, 0.14, 0.07],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="about-vision-circle circle-2"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.06, 0.12, 0.06],
          x: [0, -40, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />
      <motion.div
        className="about-vision-circle circle-3"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.05, 0.1, 0.05],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
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
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2 }}>
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 25,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                    scale: {
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                >
                  <Visibility
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
                  Vision & Future Plans
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--theme-text-secondary)',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  maxWidth: '700px',
                  mx: 'auto',
                  lineHeight: 1.8,
                }}
              >
                Building the future of creator support with innovative features and expanded capabilities
              </Typography>
            </Box>
          </motion.div>

          {/* Vision Plans Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: { xs: 3, md: 4 },
            }}
          >
            {visionPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    p: { xs: 3, md: 4 },
                    borderRadius: 4,
                    background: 'var(--theme-bg-card)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--theme-border)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${plan.color}, ${plan.color}dd)`,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease',
                    },
                    '&:hover': {
                      borderColor: 'var(--theme-border-accent)',
                      boxShadow: '0 12px 40px rgba(124, 58, 237, 0.15)',
                      '&::before': {
                        transform: 'scaleX(1)',
                      },
                    },
                  }}
                >
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.2 + index * 0.1,
                    }}
                    whileHover={{ 
                      rotate: 360, 
                      scale: 1.1,
                      transition: { duration: 0.5 }
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${plan.color}20, ${plan.color}10)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        border: `2px solid ${plan.color}30`,
                      }}
                    >
                      <plan.icon
                        sx={{
                          fontSize: 32,
                          color: plan.color,
                        }}
                      />
                    </Box>
                  </motion.div>

                  {/* Title */}
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 1.5,
                      color: 'var(--theme-text)',
                      fontSize: { xs: '1.2rem', md: '1.4rem' },
                    }}
                  >
                    {plan.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'var(--theme-text-secondary)',
                      lineHeight: 1.8,
                      fontSize: { xs: '0.95rem', md: '1rem' },
                      flexGrow: 1,
                    }}
                  >
                    {plan.description}
                  </Typography>

                  {/* Decorative Corner Element */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 80,
                      height: 80,
                      background: `radial-gradient(circle, ${plan.color}08, transparent 70%)`,
                      borderRadius: '50% 0 0 0',
                      pointerEvents: 'none',
                    }}
                  />
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Bottom Inspirational Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ marginTop: '5rem' }}
          >
            <Box
              sx={{
                textAlign: 'center',
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(139, 92, 246, 0.08))',
                border: '1px solid var(--theme-border-accent)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary))',
                },
              }}
            >
              <Typography
                variant="h5"
                component="p"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '1.1rem', md: '1.4rem' },
                  color: 'var(--theme-text)',
                  lineHeight: 1.8,
                  fontStyle: 'italic',
                  maxWidth: '900px',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                "Our vision is to create a comprehensive ecosystem where creators can build sustainable
                careers, connect with their communities, and unlock their full potential through
                innovative technology and supportive networks."
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--theme-text-muted)',
                  fontSize: '0.9rem',
                }}
              >
                — JCreatorConnect Team
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutVission;

