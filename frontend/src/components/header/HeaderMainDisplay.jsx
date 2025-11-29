import { useEffect, useState } from 'react';
import { AppBar, Box, Toolbar } from '@mui/material';
import { motion } from 'framer-motion';
import HeaderLogo from './HeaderLogo';
import HeaderActions from './HeaderActions';

const MotionAppBar = motion(AppBar);

const HeaderMainDisplay = () => {
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setElevated(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <MotionAppBar
      position="fixed"
      elevation={elevated ? 3 : 0}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      sx={{
        backgroundColor: elevated
          ? 'rgba(255, 255, 255, 0.96)'
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          maxWidth: '1200px',
          width: '100%',
          mx: 'auto',
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <HeaderLogo />

        <Box sx={{ flex: 1 }} />

        <HeaderActions />
      </Toolbar>
    </MotionAppBar>
  );
};

export default HeaderMainDisplay;


