import { motion } from 'framer-motion';
import { Box, Typography, Container, Paper } from '@mui/material';
import { AutoAwesome, Favorite, TrendingUp, Star } from '@mui/icons-material';
import '../../assets/css/home.css';

const AboutIntro = () => {
  // Decorative floating elements
  const decorativeElements = [
    { icon: AutoAwesome, delay: 0, position: { top: '10%', left: '5%' } },
    { icon: Star, delay: 0.5, position: { top: '20%', right: '8%' } },
    { icon: Favorite, delay: 1, position: { bottom: '15%', left: '10%' } },
    { icon: TrendingUp, delay: 1.5, position: { bottom: '25%', right: '5%' } },
  ];

  return (
    <Box className="about-intro-section" sx={{ py: 10, position: 'relative', overflow: 'hidden' }}>
      {/* Background Decorative Elements */}
      <Box className="about-intro-bg" />

      {/* Floating Decorative Icons */}
      {decorativeElements.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={index}
            className="about-decorative-icon"
            style={{
              position: 'absolute',
              ...item.position,
              zIndex: 0,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
          >
            <IconComponent
              sx={{
                fontSize: 40,
                color: 'var(--theme-primary)',
                opacity: 0.15,
              }}
            />
          </motion.div>
        );
      })}

      {/* Decorative Circles */}
      <motion.div
        className="about-intro-circle circle-1"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="about-intro-circle circle-2"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.18, 0.08],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 2fr 1fr' },
            gap: { xs: 4, md: 6 },
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Left Column - Logo & Title */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                gap: 2,
              }}
            >
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    width: { xs: 80, md: 100 },
                    height: { xs: 80, md: 100 },
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 60px rgba(124, 58, 237, 0.3)',
                    position: 'relative',
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'var(--theme-text-inverse)',
                      fontWeight: 700,
                      letterSpacing: 1,
                    }}
                  >
                    JC
                  </Typography>
                  {/* Glow effect */}
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                      animation: 'logoGlow 2s ease-in-out infinite alternate',
                    }}
                  />
                </Box>
              </motion.div>

              {/* Title */}
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  color: 'var(--theme-text)',
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                JCreator
                <span className="gradient-text">Connect</span>
              </Typography>

              {/* Tagline */}
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--theme-text-secondary)',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  textAlign: { xs: 'center', md: 'left' },
                  maxWidth: '300px',
                }}
              >
                Empowering creators, connecting communities
              </Typography>
            </Box>
          </motion.div>

          {/* Center Column - Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper
              elevation={4}
              sx={{
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
                  background:
                    'linear-gradient(90deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)',
                },
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: 'var(--theme-text)',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
              >
                About JCreatorConnect
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--theme-text-secondary)',
                  lineHeight: 1.8,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  mb: 2,
                }}
              >
                JCreatorConnect is a full-stack MERN application designed to help
                creators build a community around their work and receive financial
                support through micro-payments and memberships.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--theme-text-secondary)',
                  lineHeight: 1.8,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                }}
              >
                The platform allows creators to publish posts, images, and links,
                while supporters can browse creator pages, unlock exclusive content,
                and contribute directly. With seamless authentication, secure
                payments, AI-powered content generation, and a clear modern UI,
                JCreatorConnect demonstrates a wide range of real-world development
                skills.
              </Typography>
            </Paper>
          </motion.div>

          {/* Right Column - Decorative Element */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: 200,
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Central Decorative Shape */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                  scale: {
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                    border: '2px solid var(--theme-border-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Inner rotating element */}
                  <motion.div
                    animate={{ rotate: [0, -360] }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <AutoAwesome
                      sx={{
                        fontSize: 60,
                        color: 'var(--theme-primary)',
                        opacity: 0.3,
                      }}
                    />
                  </motion.div>

                  {/* Outer decorative dots */}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--theme-primary)',
                        top: '50%',
                        left: '50%',
                        transformOrigin: '0 75px',
                        transform: `rotate(${i * 60}deg) translateY(-75px)`,
                      }}
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutIntro;

