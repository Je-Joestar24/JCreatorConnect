import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import CreatorHeaderLayout from '../components/header/creator/CreatorHeaderLayout';

/**
 * Creator Layout Component
 * Main layout wrapper for creator dashboard pages
 */
const CreatorLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--theme-bg)',
      }}
    >
      {/* Enhanced Header */}
      <CreatorHeaderLayout />

      {/* Page Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default CreatorLayout;

