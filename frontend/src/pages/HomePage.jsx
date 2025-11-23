import { Box } from '@mui/material';
import HomeHeroSection from '../components/home/HomeHeroSection';
import HomeHowItWorks from '../components/home/HomeHowItWorks';
import HomeHighlightsSection from '../components/home/HomeHighlightsSection';

const HomePage = () => {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <HomeHeroSection />
      <HomeHowItWorks />
      <HomeHighlightsSection />
    </Box>
  );
};

export default HomePage;

