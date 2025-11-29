import { Box } from '@mui/material';
import AboutIntro from '../components/about/AboutIntro';
import AboutMission from '../components/about/AboutMission';
import AboutTechnology from '../components/about/AboutTechnology';
import AboutVission from '../components/about/AboutVission';

const AboutPage = () => {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <AboutIntro />
      <AboutMission />
      <AboutTechnology />
      <AboutVission />
    </Box>
  );
};

export default AboutPage;


