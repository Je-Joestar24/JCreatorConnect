import { Box, Container, IconButton, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import FooterLogo from './FooterLogo';
import FooterNavs from './FooterNavs';
import FooterCopyright from './FooterCopyright';

const socialLinks = [
  {
    label: 'Upwork',
    href: '#',
    icon: WorkOutlineIcon,
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: LinkedInIcon,
  },
  {
    label: 'Facebook',
    href: '#',
    icon: FacebookIcon,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Je-Joestar24',
    icon: GitHubIcon,
  },
];

const FooterContacts = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        pt: 6,
        pb: 4,
        background:
          'radial-gradient(circle at top left, rgba(124,58,237,0.15), transparent 55%), var(--theme-bg-secondary)',
        borderTop: '1px solid rgba(226, 232, 240, 0.9)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          <FooterLogo />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              minWidth: 220,
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              textAlign: { xs: 'left', md: 'right' },
            }}
          >
            <FooterNavs />

            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'var(--theme-text)',
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                Contact
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'var(--theme-text-secondary)' }}
              >
                Jejomar Parrilla · jpar1252003@gmail.com
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    component="a"
                    href={href}
                    target={href === '#' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={label}
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      border: '1px solid rgba(148, 163, 184, 0.5)',
                      color: 'var(--theme-text-secondary)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'var(--theme-primary)',
                        background:
                          'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))',
                        color: 'var(--theme-text-inverse)',
                      },
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                </motion.div>
              ))}
            </Stack>
          </Box>
        </Box>

        <FooterCopyright />
      </Container>
    </Box>
  );
};

export default FooterContacts;


