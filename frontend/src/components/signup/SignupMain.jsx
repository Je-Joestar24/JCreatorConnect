import { Box } from '@mui/material';
import SignupLeftPanel from './SignupLeftPanel';
import SignupRightPanel from './SignupRightPanel';

const SignupMain = ({ role }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Left Panel - Hero Section / Role Selection */}
      <Box
        sx={{
          width: { xs: '0%', md: '50%' },
          display: { xs: 'none', md: 'block' },
        }}
      >
        <SignupLeftPanel role={role} />
      </Box>

      {/* Right Panel - Signup Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
        }}
      >
        <SignupRightPanel role={role} />
      </Box>
    </Box>
  );
};

export default SignupMain;

