import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { AutoAwesome, Favorite, Star, TrendingUp, Psychology } from '@mui/icons-material';
import favLogo from '../../assets/images/fav.png';

const LoginLeftPanel = () => {
  // Flowing decorative elements (neuro link style)
  const decorativeElements = [
    { icon: AutoAwesome, delay: 0, position: { top: '15%', left: '10%' }, size: 24 },
    { icon: Star, delay: 0.3, position: { top: '25%', right: '15%' }, size: 20 },
    { icon: Favorite, delay: 0.6, position: { bottom: '30%', left: '12%' }, size: 22 },
    { icon: TrendingUp, delay: 0.9, position: { bottom: '20%', right: '10%' }, size: 26 },
    { icon: Psychology, delay: 1.2, position: { top: '50%', left: '8%' }, size: 28 },
  ];

  // Neural network connection points
  const neuralPoints = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: i * 0.1,
  }));

  return (
    <Box
      className="login-left-panel"
      sx={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Background Neural Network Pattern */}
      <Box
        component="svg"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.15,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {neuralPoints.map((point, index) => {
          const nextPoint = neuralPoints[(index + 1) % neuralPoints.length];
          return (
            <motion.line
              key={`line-${index}`}
              x1={`${point.x}%`}
              y1={`${point.y}%`}
              x2={`${nextPoint.x}%`}
              y2={`${nextPoint.y}%`}
              stroke="var(--theme-primary)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 3 + index * 0.2,
                repeat: Infinity,
                delay: point.delay,
                ease: 'easeInOut',
              }}
              style={{ vectorEffect: 'non-scaling-stroke' }}
            />
          );
        })}
      </Box>

      {/* Floating Decorative Icons */}
      {decorativeElements.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={index}
            style={{
              position: 'absolute',
              ...item.position,
              zIndex: 1,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, -15, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
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
                opacity: 0.2,
              }}
            />
          </motion.div>
        );
      })}

      {/* Neural Network Connection Points */}
      {neuralPoints.map((point) => (
        <motion.div
          key={point.id}
          style={{
            position: 'absolute',
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--theme-primary)',
            zIndex: 1,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: point.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Pulsing Background Circles */}
      <motion.div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1), transparent 70%)',
          filter: 'blur(60px)',
          top: '20%',
          left: '10%',
          zIndex: 0,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent 70%)',
          filter: 'blur(60px)',
          bottom: '15%',
          right: '8%',
          zIndex: 0,
        }}
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Logo and Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          px: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Box
            component="img"
            src={favLogo}
            alt="JCreatorConnect Logo"
            sx={{
              width: { xs: 120, md: 180 },
              height: 'auto',
              mb: 4,
              filter: 'drop-shadow(0 10px 30px rgba(124, 58, 237, 0.3))',
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 2,
              background: 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Welcome Back
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.1rem' },
              color: 'var(--theme-text-secondary)',
              maxWidth: '500px',
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            Connect with creators, support their work, and be part of a thriving
            creative community.
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

export default LoginLeftPanel;

