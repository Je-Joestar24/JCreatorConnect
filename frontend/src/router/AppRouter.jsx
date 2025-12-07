import { Routes, Route } from 'react-router-dom';
import UnauthedLayout from '../layouts/UnauthedLayout';
import CreatorLayout from '../layouts/CreatorLayout';
import SupporterLayout from '../layouts/SupporterLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import CreatorPosts from '../pages/creator/CreatorPosts';
import CreatorProfile from '../pages/creator/CreatorProfile';
import SupporterHome from '../pages/supporter/SupporterHome';
import RequiresCreator from './access/RequiresCreator';
import RequiresSupporter from './access/RequiresSupporter';
import RequiresGuest from './access/RequiresGuest';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<UnauthedLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/creator/:id" element={<CreatorProfile />} />
      </Route>

      {/* Guest Only Routes */}
      <Route
        path="/login"
        element={
          <RequiresGuest>
            <LoginPage />
          </RequiresGuest>
        }
      />
      <Route
        path="/signup"
        element={
          <RequiresGuest>
            <SignupPage />
          </RequiresGuest>
        }
      />

      {/* Creator Routes */}
      <Route
        element={
          <RequiresCreator>
            <CreatorLayout />
          </RequiresCreator>
        }
      >
        <Route path="/creator/posts" element={<CreatorPosts />} />
        <Route path="/creator/profile" element={<CreatorProfile />} />
      </Route>

      {/* Supporter Routes */}
      <Route
        element={
          <RequiresSupporter>
            <SupporterLayout />
          </RequiresSupporter>
        }
      >
        <Route path="/supporter/home" element={<SupporterHome />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;

