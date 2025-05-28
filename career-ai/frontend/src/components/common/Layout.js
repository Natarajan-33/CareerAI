import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/rootStore';

const Layout = observer(() => {
  const { authStore } = useStores();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await authStore.logout();
    navigate('/login');
  };
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-72 bg-card shadow-lg flex flex-col">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-3xl font-bold text-primary">CareerAI</h1>
          </div>
          
          {/* User info */}
          <div className="mb-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
            {authStore.user ? (
              <div>
                <p className="font-medium text-primary">
                  {authStore.user.id === 'guest' ? 'Guest User' : authStore.user.email}
                </p>
                {authStore.user.id === 'guest' && (
                  <p className="text-sm text-text-secondary mt-2">
                    Sign up to save your progress
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm">Not logged in</p>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="space-y-1.5">
            <NavLink to="/welcome" label="Welcome & Onboarding" icon="🚀" />
            <NavLink to="/ikigai" label="Ikigai Discovery" icon="🧭" />
            <NavLink to="/domains" label="Domain Selection" icon="🌐" />
            <NavLink to="/projects" label="Project Selection" icon="📋" />
            <NavLink to="/progress" label="Progress Tracking" icon="📈" />
            <NavLink to="/daily-post" label="Daily Build in Public" icon="📝" />
            <NavLink to="/milestones" label="Project Milestones" icon="🏆" />
            <NavLink to="/friction-points" label="Friction & Delight Points" icon="⚡" />
            <NavLink to="/firm-alerts" label="Target Firm Alerts" icon="🔔" />
          </nav>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="btn btn-outline w-full text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
          <p className="text-xs text-center text-text-light mt-4">
            © 2025 CareerAI
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
});

// Navigation link component
const NavLink = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center py-3 px-4 rounded-lg transition-colors ${isActive 
        ? 'bg-primary/10 text-primary font-medium' 
        : 'hover:bg-gray-100 text-text-secondary'}`}
    >
      {icon && <span className="mr-3 text-lg">{icon}</span>}
      <span>{label}</span>
    </Link>
  );
};

export default Layout;
