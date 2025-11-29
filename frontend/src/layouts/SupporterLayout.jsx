import { Box, Button } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/authHook';

const SupporterLayout = () => {
  const { logout, user } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--theme-bg)',
      }}
    >
      {/* Simple Header with Logout */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--theme-border)',
        }}
      >
        <Box>
          <strong>Supporter Dashboard</strong>
          {user && <span style={{ marginLeft: '1rem', color: 'var(--theme-text-secondary)' }}>{user.name}</span>}
        </Box>
        <Button variant="outlined" onClick={logout}>
          Logout
        </Button>
      </Box>

      {/* Page Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          p: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default SupporterLayout;

