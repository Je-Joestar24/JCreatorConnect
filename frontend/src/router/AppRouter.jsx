import { Routes, Route } from 'react-router-dom';
import UnauthedLayout from '../layouts/UnauthedLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<UnauthedLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;

