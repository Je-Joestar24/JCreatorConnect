import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import HeaderMainDisplay from '../components/header/HeaderMainDisplay';
import FooterContacts from '../components/footer/FooterContacts';

const UnauthedLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--theme-bg)',
      }}
    >
      <HeaderMainDisplay />

      <Box
        component="main"
        sx={{
          flex: 1,
          pt: { xs: 8, md: 10 },
        }}
      >
        <Outlet />
      </Box>

      <FooterContacts />
    </Box>
  );
};

export default UnauthedLayout;


