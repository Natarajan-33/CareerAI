import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const MainLayout = ({ toggleDarkMode, darkMode }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  CareerAI
                </Link>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Home
                </Link>
                <Link to="/ikigai" className="group relative border-transparent text-gray-500 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 inline-flex items-center px-4 pt-1 text-sm font-medium overflow-hidden">
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-purple-500 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
                  <span className="flex items-center relative z-10">
                    <span className="relative overflow-hidden mr-1.5 inline-block">
                      <span className="inline-block transform transition-transform duration-300 ease-out group-hover:-translate-y-full">💡</span>
                      <span className="absolute top-0 left-0 transform translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">💡</span>
                    </span>
                    <span className="relative overflow-hidden inline-block">
                      <span className="inline-block transform transition-transform duration-300 ease-out group-hover:-translate-y-full">Ikigai</span>
                      <span className="absolute top-0 left-0 transform translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">Ikigai</span>
                    </span>
                  </span>
                </Link>
                <Link to="/journey" className="group relative border-transparent text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 inline-flex items-center px-4 pt-1 text-sm font-medium overflow-hidden">
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-primary-500 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
                  <span className="flex items-center relative z-10">
                    <span className="relative overflow-hidden mr-1.5 inline-block">
                      <span className="inline-block transform transition-transform duration-300 ease-out group-hover:-translate-y-full">🚀</span>
                      <span className="absolute top-0 left-0 transform translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">🚀</span>
                    </span>
                    <span className="relative overflow-hidden inline-block">
                      <span className="inline-block transform transition-transform duration-300 ease-out group-hover:-translate-y-full">Journey</span>
                      <span className="absolute top-0 left-0 transform translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">Journey</span>
                    </span>
                  </span>
                </Link>
              </nav>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div>
                  <button className="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <span className="sr-only">View notifications</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="ml-3 relative">
                <Link to="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Login
                </Link>
              </div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button type="button" className="bg-white dark:bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500" aria-controls="mobile-menu" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Home
            </Link>
            <Link to="/ikigai" className="border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-500 hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              <span className="inline-flex items-center">
                <span className="mr-2">💡</span>
                Ikigai
              </span>
            </Link>
            <Link to="/journey" className="border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-400 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              <span className="inline-flex items-center">
                <span className="mr-2">🚀</span>
                Journey
              </span>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-4">
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-gray-200">Guest User</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">guest@example.com</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link to="/login" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                Login
              </Link>
              <Link to="/register" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Render child routes */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="px-4 py-6 sm:px-0"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} CareerAI. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
