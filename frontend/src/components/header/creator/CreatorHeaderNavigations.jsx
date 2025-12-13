import { NavLink, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Dashboard, Person, Article } from '@mui/icons-material';

/**
 * Creator Header Navigation Component
 * Navigation links for creator dashboard
 */
const CreatorHeaderNavigations = () => {
  const location = useLocation();

  const navItems = [
    { 
      label: 'Posts', 
      to: '/creator/posts',
      icon: Article,
    }
  ];

  return (
    <Box
      component="nav"
      aria-label="Creator navigation"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.5,
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;
        
        return (
          <motion.div
            key={item.to}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              component={NavLink}
              to={item.to}
              startIcon={<Icon sx={{ fontSize: 20 }} />}
              sx={{
                position: 'relative',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: isActive ? 'var(--theme-primary)' : 'var(--theme-text-secondary)',
                textTransform: 'none',
                px: 2,
                py: 1,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                backgroundColor: isActive ? 'var(--theme-bg-secondary)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'var(--theme-bg-secondary)',
                  color: 'var(--theme-primary)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: '50%',
                  bottom: 4,
                  transform: isActive ? 'translateX(-50%)' : 'translateX(-50%) scaleX(0)',
                  width: '60%',
                  height: 2,
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary))',
                  transition: 'transform 0.3s ease',
                },
                '&:hover::after': {
                  transform: 'translateX(-50%) scaleX(1)',
                },
              }}
            >
              {item.label}
            </Button>
          </motion.div>
        );
      })}
    </Box>
  );
};

export default CreatorHeaderNavigations;

