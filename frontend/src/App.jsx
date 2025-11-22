import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* More routes will be added here */}
      </Routes>
    </motion.div>
  );
};

export default App;

