import { motion } from 'framer-motion';
import { Box, Typography, Container } from '@mui/material';
import { Flag, RocketLaunch, Lightbulb, TrendingUp } from '@mui/icons-material';
import '../../assets/css/home.css';

const AboutMission = () => {
  // Floating decorative elements
  const floatingElements = [
    { icon: Flag, delay: 0, position: { top: '15%', left: '8%' }, size: 32 },
    { icon: RocketLaunch, delay: 0.8, position: { top: '25%', right: '10%' }, size: 40 },
    { icon: Lightbulb, delay: 1.2, position: { bottom: '20%', left: '12%' }, size: 36 },
    { icon: TrendingUp, delay: 0.4, position: { bottom: '30%', right: '8%' }, size: 34 },
  ];

  // Mission points
  const missionPoints = [
    {
      title: 'Empower Creators',
      description: 'Provide creators with a simple, effective platform to share their work and build sustainable income streams.',
    },
    {
      title: 'Connect Communities',
      description: 'Foster meaningful connections between creators and their supporters through direct engagement and support.',
    },
    {
      title: 'Innovate with AI',
      description: 'Leverage cutting-edge AI technology to enhance content creation and discovery experiences.',
    },
  ];

  return (
    <Box className="about-mission-section" sx={{ py: 12, position: 'relative', overflow: 'hidden' }}>
      {/* Background Gradient */}
      <Box className="about-mission-bg" />

      {/* Floating Decorative Icons */}
      {floatingElements.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={index}
            className="about-mission-floating-icon"
            style={{
              position: 'absolute',
              ...item.position,
              zIndex: 0,
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, 10, -10, 0],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 5 + index * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
          >
            <IconComponent
              sx={{
                fontSize: item.size,
                color: 'var(--theme-primary)',
                opacity: 0.12,
              }}
            />
          </motion.div>
        );
      })}

      {/* Animated Background Circles */}
      <motion.div
        className="about-mission-circle circle-1"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.08, 0.15, 0.08],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="about-mission-circle circle-2"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.06, 0.12, 0.06],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />
      <motion.div
        className="about-mission-circle circle-3"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
      />

      <Container maxWidth="lg">
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
          }}
        >
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
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
                <Flag
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
                Our Mission
              </Typography>
            </Box>
          </motion.div>

          {/* Main Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              component="p"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                color: 'var(--theme-text-secondary)',
                lineHeight: 1.8,
                maxWidth: '900px',
                mx: 'auto',
                mb: 8,
                fontStyle: 'italic',
              }}
            >
              To empower creators by giving them a simple platform to share content and receive
              financial support — similar to BuyMeACoffee, Patreon, or Ko-fi, but built using modern
              MERN technologies paired with AI enhancements.
            </Typography>
          </motion.div>

          {/* Mission Points */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: { xs: 4, md: 6 },
              mt: 6,
            }}
          >
            {missionPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    p: { xs: 3, md: 4 },
                    textAlign: 'center',
                  }}
                >
                  {/* Decorative Number Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.4 + index * 0.15,
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)',
                        position: 'relative',
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          color: 'var(--theme-text-inverse)',
                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </Typography>
                      {/* Glow effect */}
                      <Box
                        sx={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                          animation: 'missionBadgeGlow 2s ease-in-out infinite alternate',
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
                      mb: 2,
                      color: 'var(--theme-text)',
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                    }}
                  >
                    {point.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'var(--theme-text-secondary)',
                      lineHeight: 1.8,
                      fontSize: { xs: '0.95rem', md: '1.05rem' },
                    }}
                  >
                    {point.description}
                  </Typography>

                  {/* Decorative Line */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '60%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.15 }}
                    style={{
                      height: 2,
                      background: 'linear-gradient(90deg, transparent, var(--theme-primary), transparent)',
                      margin: '1.5rem auto 0',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Bottom Decorative Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ marginTop: '4rem' }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'inline-block',
                px: 4,
                py: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  color: 'var(--theme-text-muted)',
                  fontStyle: 'italic',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                "It's not a social network. It's not a streaming site. It's a support hub where
                creators maintain a professional profile and supporters directly fund them."
              </Typography>
              {/* Decorative quotes */}
              <Typography
                component="span"
                sx={{
                  position: 'absolute',
                  top: -10,
                  left: 0,
                  fontSize: '4rem',
                  color: 'var(--theme-primary)',
                  opacity: 0.15,
                  fontFamily: 'Georgia, serif',
                  lineHeight: 1,
                }}
              >
                "
              </Typography>
              <Typography
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  right: 0,
                  fontSize: '4rem',
                  color: 'var(--theme-primary)',
                  opacity: 0.15,
                  fontFamily: 'Georgia, serif',
                  lineHeight: 1,
                }}
              >
                "
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutMission;

