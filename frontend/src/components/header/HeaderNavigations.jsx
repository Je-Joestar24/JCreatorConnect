import { NavLink } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
];

const HeaderNavigations = () => {
  return (
    <Box
      component="nav"
      aria-label="Primary navigation"
      sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
    >
      {navItems.map((item) => (
        <motion.div
          key={item.to}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            component={NavLink}
            to={item.to}
            sx={{
              position: 'relative',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: 'var(--theme-text-secondary)',
              textTransform: 'none',
              paddingX: 1,
              '&.active': {
                color: 'var(--theme-primary)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                bottom: -4,
                width: 0,
                height: 2,
                borderRadius: 999,
                background:
                  'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary))',
                transition: 'width 0.25s ease',
              },
              '&.active::after, &:hover::after': {
                width: '100%',
              },
            }}
          >
            {item.label}
          </Button>
        </motion.div>
      ))}
    </Box>
  );
};

export default HeaderNavigations;


