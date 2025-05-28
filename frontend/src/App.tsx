import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Layout components
import MainLayout from './layout/MainLayout';

// Page components - will be implemented later
const HomePage = () => <div className="p-8"><h1 className="text-3xl font-bold">Welcome to CareerAI</h1><p className="mt-4">Your AI-powered career discovery and execution platform</p></div>;
const IkigaiPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Ikigai Chatbot</h1><p className="mt-4">Coming soon...</p></div>;
const DomainSelectionPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Domain Selection</h1><p className="mt-4">Coming soon...</p></div>;
const ProjectsPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Projects</h1><p className="mt-4">Coming soon...</p></div>;
const ProgressPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Progress Tracking</h1><p className="mt-4">Coming soon...</p></div>;
const BuildInPublicPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Build in Public</h1><p className="mt-4">Coming soon...</p></div>;
const MilestonesPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Milestones</h1><p className="mt-4">Coming soon...</p></div>;
const FrictionPointsPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Friction & Delight Points</h1><p className="mt-4">Coming soon...</p></div>;
const TargetFirmsPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Target Firm Alerts</h1><p className="mt-4">Coming soon...</p></div>;
const LoginPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Login</h1><p className="mt-4">Coming soon...</p></div>;
const RegisterPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Register</h1><p className="mt-4">Coming soon...</p></div>;

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  // Check for user's preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    
    // Listen for changes in color scheme preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      setDarkMode(e.matches);
    });
  }, []);
  
  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Main app routes with layout */}
          <Route path="/" element={<MainLayout toggleDarkMode={() => setDarkMode(!darkMode)} darkMode={darkMode} />}>
            <Route index element={<HomePage />} />
            <Route path="ikigai" element={<IkigaiPage />} />
            <Route path="domains" element={<DomainSelectionPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="build-in-public" element={<BuildInPublicPage />} />
            <Route path="milestones" element={<MilestonesPage />} />
            <Route path="friction-points" element={<FrictionPointsPage />} />
            <Route path="target-firms" element={<TargetFirmsPage />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
