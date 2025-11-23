import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import AppRouter from './router/AppRouter';

const App = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AppRouter />
      </motion.div>
    </AnimatePresence>
  );
};

export default App;

