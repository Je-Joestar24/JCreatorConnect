import { Box } from '@mui/material';
import AboutIntro from '../components/about/AboutIntro';
import AboutMission from '../components/about/AboutMission';

const AboutPage = () => {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <AboutIntro />
      <AboutMission />
    </Box>
  );
};

export default AboutPage;


