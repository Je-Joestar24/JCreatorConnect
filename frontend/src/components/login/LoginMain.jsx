import { Box } from '@mui/material';
import LoginLeftPanel from './LoginLeftPanel';
import LoginRightPanel from './LoginRightPanel';

const LoginMain = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Left Panel - Hero Section */}
      <Box
        sx={{
          width: { xs: '0%', md: '50%' },
          display: { xs: 'none', md: 'block' },
        }}
      >
        <LoginLeftPanel />
      </Box>

      {/* Right Panel - Login Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
        }}
      >
        <LoginRightPanel />
      </Box>
    </Box>
  );
};

export default LoginMain;

