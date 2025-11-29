import { Box, Container, Typography } from '@mui/material';

const AboutPage = () => {
  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: 'var(--theme-text)',
          }}
        >
          About JCreatorConnect
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'var(--theme-text-secondary)',
            lineHeight: 1.8,
            mb: 2,
          }}
        >
          JCreatorConnect is a modern creator support platform inspired by
          products like BuyMeACoffee and Patreon, built with the MERN stack and
          enhanced by Groq AI. It helps creators share content, build
          meaningful relationships with supporters, and earn from their work
          through tips and memberships.
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'var(--theme-text-secondary)', lineHeight: 1.8 }}
        >
          This project is crafted as a portfolio-ready, production-style
          application, demonstrating full-stack skills, modern UI/UX, and
          real-world business logic tailored for global clients.
        </Typography>
      </Container>
    </Box>
  );
};

export default AboutPage;


