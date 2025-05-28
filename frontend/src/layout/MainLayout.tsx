import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const MainLayout = ({ toggleDarkMode, darkMode }: MainLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
