import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
// Import other pages here when created
// import CreatorProfilePage from '../pages/CreatorProfilePage';
// import CreatorDashboard from '../pages/CreatorDashboard';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* More routes will be added here */}
      {/* <Route path="/creator/:id" element={<CreatorProfilePage />} /> */}
      {/* <Route path="/dashboard" element={<CreatorDashboard />} /> */}
    </Routes>
  );
};

export default AppRouter;

