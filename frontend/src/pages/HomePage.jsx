import { Box } from '@mui/material';
import HomeHeroSection from '../components/home/HomeHeroSection';
import HomeHowItWorks from '../components/home/HomeHowItWorks';
import HomeHighlightsSection from '../components/home/HomeHighlightsSection';
import HomeCallToActionSection from '../components/home/HomeCallToActionSection';

const HomePage = () => {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <HomeHeroSection />
      <HomeHowItWorks />
      <HomeHighlightsSection />
      <HomeCallToActionSection />
    </Box>
  );
};

export default HomePage;

