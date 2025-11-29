import { Box, Typography } from '@mui/material';

const FooterCopyright = () => {
  return (
    <Box
      sx={{
        borderTop: '1px solid rgba(148, 163, 184, 0.25)',
        mt: 4,
        pt: 2,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: 'var(--theme-text-muted)' }}
      >
        © {new Date().getFullYear()} JCreatorConnect. All rights reserved.
      </Typography>
    </Box>
  );
};

export default FooterCopyright;


