import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Layout components
import MainLayout from './layout/MainLayout';

// Page components
import HomePage from './modules/home/HomePage';

// Store
import { rootStore, RootStoreProvider } from './stores/index';

// Import animation library
import { motion } from 'framer-motion';

// Animation variants for page transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

// Page components with animations
const PageWrapper = ({ children, title }: { children: React.ReactNode, title: string }) => (
  <motion.div 
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    className="p-8"
  >
    <motion.h1 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="text-3xl font-bold"
    >
      {title}
    </motion.h1>
    {children}
  </motion.div>
);

// Primary pages
const IkigaiPage = () => (
  <PageWrapper title="Ikigai Chatbot">
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-4"
    >
      Discover your purpose and career path through our AI-powered Ikigai analysis.
    </motion.p>
  </PageWrapper>
);

const JourneyPage = () => (
  <PageWrapper title="Career Journey">
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-4"
    >
      Your career journey hub - manage all aspects of your career development here.
    </motion.p>
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {[
        { title: 'Domains', path: '/domains', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
        { title: 'Projects', path: '/projects', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        { title: 'Progress', path: '/progress', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { title: 'Build in Public', path: '/build-in-public', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
        { title: 'Milestones', path: '/milestones', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
        { title: 'Friction Points', path: '/friction-points', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
        { title: 'Target Firms', path: '/target-firms', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      ].map((item, index) => (
        <motion.div 
          key={item.path}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + (index * 0.1), duration: 0.4 }}
          whileHover={{ scale: 1.05, filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))' }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all duration-300"
        >
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Manage your {item.title.toLowerCase()} effectively</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-auto px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors duration-200"
            onClick={() => window.location.href = item.path}
          >
            Explore
          </motion.button>
        </motion.div>
      ))}
    </motion.div>
  </PageWrapper>
);

// Journey sub-pages with animations
const DomainSelectionPage = () => (
  <PageWrapper title="Domain Selection">
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-4"
    >
      Explore and select your career domains of interest.
    </motion.p>
  </PageWrapper>
);

const ProjectsPage = () => (
  <PageWrapper title="Projects">
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-4"
    >
      Manage your career-building projects and track their progress.
    </motion.p>
  </PageWrapper>
);

const ProgressPage = () => (
  <PageWrapper title="Progress Tracking">
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-4"
    >
      Track your career development progress with visual analytics.
    </motion.p>
  </PageWrapper>
);

const BuildInPublicPage = () => (
  <PageWrapper title="Build in Public">
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-4"
    >
      Share your career journey with the world and build your personal brand.
    </motion.p>
  </PageWrapper>
);

const MilestonesPage = () => (
  <PageWrapper title="Milestones">
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-4"
    >
      Set and track important career milestones and achievements.
    </motion.p>
  </PageWrapper>
);

const FrictionPointsPage = () => (
  <PageWrapper title="Friction & Delight Points">
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-4"
    >
      Identify challenges and opportunities in your career journey.
    </motion.p>
  </PageWrapper>
);

const TargetFirmsPage = () => (
  <PageWrapper title="Target Firm Alerts">
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-4"
    >
      Monitor and get alerts about your target companies and opportunities.
    </motion.p>
  </PageWrapper>
);

// Auth pages
const LoginPage = () => (
  <PageWrapper title="Login">
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-4"
    >
      Sign in to access your career journey.
    </motion.p>
  </PageWrapper>
);

const RegisterPage = () => (
  <PageWrapper title="Register">
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-4"
    >
      Create your account to start your career journey.
    </motion.p>
  </PageWrapper>
);

// Using the singleton rootStore instance from the stores/index.ts file

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
    <RootStoreProvider value={rootStore}>
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
            <Route path="journey" element={<JourneyPage />} />
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
    </RootStoreProvider>
  );
}

export default App;
