import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="sm:text-center lg:text-left"
              >
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block">Discover Your</span>
                  <span className="block text-primary-600 dark:text-primary-400">AI Career Path</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  CareerAI helps you find your purpose and build a career path in high-demand AI/ML and robotics roles through personalized guidance and actionable steps.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="flex flex-col items-center">
                    <Link to="/ikigai" className="group relative w-full overflow-hidden flex items-center justify-center px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-purple-700 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></span>
                      <span className="relative flex items-center">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9.25 11.5L4.75 14L12 18.25L19.25 14L14.75 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Start Ikigai Analysis
                      </span>
                    </Link>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: 0.3, 
                        duration: 0.6,
                        type: "spring",
                        stiffness: 300
                      }}
                      className="mt-3 relative"
                    >
                      <div className="relative inline-flex flex-col items-center">
                        {/* Arrow pointing up to the button */}
                        <div className="mb-1">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L12 16" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 9L12 4L17 9" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="inline-flex items-center">
                          <span className="mr-1 text-sm">💡</span>
                          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 tracking-wider">KNOW WHAT YOU WANT</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3 flex flex-col items-center">
                    <Link to="/journey" className="group relative w-full overflow-hidden flex items-center justify-center px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10 rounded-xl bg-gradient-to-br from-blue-500 to-primary-500 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-400 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-primary-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></span>
                      <span className="relative flex items-center">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 5V19H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 9L13 15L9.5 11.5L5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Explore Career Journey
                      </span>
                    </Link>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: 0.5, 
                        duration: 0.6,
                        type: "spring",
                        stiffness: 300
                      }}
                      className="mt-3 relative"
                    >
                      <div className="relative inline-flex flex-col items-center">
                        {/* Arrow pointing up to the button */}
                        <div className="mb-1">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L12 16" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 9L12 4L17 9" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="inline-flex items-center">
                          <span className="mr-1 text-sm">🚀</span>
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 tracking-wider">GET WHAT YOU WANT</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              AI-Powered Career Discovery
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              Discover your ideal career path with our comprehensive AI tools and personalized guidance.
            </p>
          </div>

          <div className="mt-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10"
            >
              {[
                {
                  name: 'Ikigai Analysis',
                  description: 'Discover your purpose through our AI-powered Ikigai analysis that combines what you love, what you\'re good at, what the world needs, and what you can be paid for.',
                  icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l-6.16-3.422a12.083 12.083 0 00-.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 016.824-2.998 12.078 12.078 0 00-.665-6.479L12 14z'
                },
                {
                  name: 'Career Journey Planning',
                  description: 'Build a structured career journey with milestones, projects, and learning paths tailored to your goals and the industry demands.',
                  icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2'
                },
                {
                  name: 'Progress Tracking',
                  description: 'Track your career development with visual analytics and receive personalized recommendations to accelerate your growth.',
                  icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                },
                {
                  name: 'Target Firm Alerts',
                  description: 'Get notifications about job openings, news, and events from your target companies that match your career profile.',
                  icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                }
              ].map((feature, index) => (
                <motion.div 
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                    </svg>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{feature.name}</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700 dark:bg-primary-900">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start your AI career journey?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Begin with our Ikigai analysis to discover your unique path in the AI industry.
          </p>
          <Link to="/ikigai" className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 sm:w-auto">
            Start Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
