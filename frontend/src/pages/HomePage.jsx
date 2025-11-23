import { Box } from '@mui/material';
import HomeHeroSection from '../components/home/HomeHeroSection';
import HomeHowItWorks from '../components/home/HomeHowItWorks';

const HomePage = () => {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <HomeHeroSection />
      <HomeHowItWorks />
    </Box>
  );
};

export default HomePage;

