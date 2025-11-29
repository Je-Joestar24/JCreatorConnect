import { NavLink } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';

const FooterNavs = () => {
  return (
    <Box sx={{ minWidth: 200 }}>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1.5, color: 'var(--theme-text-muted)', fontWeight: 600 }}
      >
        Navigation
      </Typography>
      <Stack spacing={0.5}>
        {[
          { label: 'Home', to: '/' },
          { label: 'About', to: '/about' },
        ].map((item) => (
          <Button
            key={item.to}
            component={NavLink}
            to={item.to}
            sx={{
              justifyContent: 'flex-start',
              color: 'var(--theme-text-secondary)',
              textTransform: 'none',
              fontSize: '0.9rem',
              px: 0,
              '&.active': {
                color: 'var(--theme-accent)',
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default FooterNavs;


