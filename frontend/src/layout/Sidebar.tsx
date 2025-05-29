import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Define interface for navigation items
interface NavItem {
  name: string;
  path: string;
  icon: string;
  children?: NavItem[];
}

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Check if current path is under journey to auto-expand that section
  useEffect(() => {
    const journeyPaths = [
      '/journey',
      '/domains',
      '/projects',
      '/progress',
      '/build-in-public',
      '/milestones',
      '/friction-points',
      '/target-firms'
    ];
    
    if (journeyPaths.some(path => location.pathname.startsWith(path))) {
      setExpandedSection('journey');
    }
  }, [location.pathname]);

  // Define hierarchical navigation structure
  const navItems: NavItem[] = [
    { 
      name: 'Home', 
      path: '/', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    { 
      name: 'Ikigai Chatbot', 
      path: '/ikigai', 
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
    },
    { 
      name: 'Journey', 
      path: '/journey', 
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      children: [
        { 
          name: 'Domains', 
          path: '/domains', 
          icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
        },
        { 
          name: 'Projects', 
          path: '/projects', 
          icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
        },
        { 
          name: 'Progress', 
          path: '/progress', 
          icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
        },
        { 
          name: 'Build in Public', 
          path: '/build-in-public', 
          icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
        },
        { 
          name: 'Milestones', 
          path: '/milestones', 
          icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
        },
        { 
          name: 'Friction Points', 
          path: '/friction-points', 
          icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
        },
        { 
          name: 'Target Firms', 
          path: '/target-firms', 
          icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
        },
      ]
    },
  ];

  // Animation variants for menu items
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  // Animation variants for submenu
  const submenuVariants = {
    hidden: { height: 0, opacity: 0, overflow: 'hidden' },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: { 
        height: { duration: 0.3 }, 
        opacity: { duration: 0.2 }
      }
    }
  };

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  // Render a nav item with potential children
  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSection === item.path.substring(1); // Remove leading slash
    
    return (
      <motion.li 
        key={item.path}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className={level > 0 ? 'pl-4' : ''}
      >
        {hasChildren ? (
          <div className="flex flex-col">
            <button
              onClick={() => toggleSection(item.path.substring(1))}
              className={`flex items-center justify-between w-full p-2 text-base font-normal rounded-lg transition-colors 
                ${location.pathname === item.path ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100' : 
                'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'}`}
            >
              <div className="flex items-center">
                <svg 
                  className="w-6 h-6 transition-colors duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </div>
              {!collapsed && hasChildren && (
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
            
            {/* Children submenu with animation */}
            {!collapsed && (
              <AnimatePresence>
                {isExpanded && (
                  <motion.ul 
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={submenuVariants}
                    className="mt-1 space-y-1"
                  >
                    {item.children?.map(child => renderNavItem(child, level + 1))}
                  </motion.ul>
                )}
              </AnimatePresence>
            )}
          </div>
        ) : (
          <NavLink 
            to={item.path}
            className={({ isActive }) => 
              `flex items-center p-2 text-base font-normal rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100' 
                  : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
              }`
            }
          >
            <svg 
              className="w-6 h-6 transition-colors duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {!collapsed && <span className="ml-3">{item.name}</span>}
          </NavLink>
        )}
      </motion.li>
    );
  };

  return (
    <motion.aside 
      initial={{ width: collapsed ? 64 : 256 }}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <AnimatePresence>
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-semibold text-primary-600 dark:text-primary-400"
            >
              CareerAI
            </motion.span>
          )}
        </AnimatePresence>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
        >
          {collapsed ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </motion.button>
      </div>
      
      {/* Navigation */}
      <nav className="mt-5 px-2 overflow-y-auto max-h-[calc(100vh-80px)]">
        <motion.ul className="space-y-2">
          {navItems.map(item => renderNavItem(item))}
        </motion.ul>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
