import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

// Import store provider
import { StoreProvider, useStores } from './stores/rootStore';

// Import pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import WelcomePage from './pages/WelcomePage';
import IkigaiPage from './pages/ikigai/IkigaiPage';
import DomainPage from './pages/career/DomainPage';
import ProjectPage from './pages/career/ProjectPage';
import ProgressPage from './pages/career/ProgressPage';
import DailyPostPage from './pages/career/DailyPostPage';
import MilestonePage from './pages/career/MilestonePage';
import FrictionPointsPage from './pages/career/FrictionPointsPage';
import FirmAlertsPage from './pages/career/FirmAlertsPage';

// Import components
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Main App component
const AppContent = observer(() => {
  const { authStore } = useStores();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/ikigai" element={<IkigaiPage />} />
          <Route path="/domains" element={<DomainPage />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/daily-post" element={<DailyPostPage />} />
          <Route path="/milestones" element={<MilestonePage />} />
          <Route path="/friction-points" element={<FrictionPointsPage />} />
          <Route path="/firm-alerts" element={<FirmAlertsPage />} />
        </Route>
      </Route>
      
      {/* Redirect root to login or welcome based on auth status */}
      <Route 
        path="/" 
        element={
          authStore.isLoggedIn ? 
          <Navigate to="/welcome" replace /> : 
          <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
});

// Wrap the app with store provider
const App = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
