import { Box, Typography } from '@mui/material';

const FooterLogo = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(124, 58, 237, 0.5)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'var(--theme-text-inverse)',
              fontWeight: 700,
            }}
          >
            JC
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: 'var(--theme-text)' }}
        >
          JCreatorConnect
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{ color: 'var(--theme-text-secondary)', maxWidth: 360 }}
      >
        A modern creator support platform where fans can fund creators through
        tips and memberships.
      </Typography>
    </Box>
  );
};

export default FooterLogo;


