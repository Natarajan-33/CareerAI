import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      {/* Hero section */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Discover Your Ideal <span className="text-primary-600 dark:text-primary-400">AI Career Path</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          CareerAI guides you through a personalized journey into high-demand AI/ML and robotics roles.
          Uncover your Ikigai and build practical skills through structured project-based learning.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/ikigai')}
          >
            Start Your Ikigai Journey
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/domains')}
          >
            Explore AI Domains
          </Button>
        </div>
      </div>

      {/* Features section */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
          How CareerAI Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Discover Your Ikigai</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our AI-powered chatbot helps you uncover your passions, strengths, and ideal career path through natural conversation.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Build Practical Skills</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choose from curated projects in various AI domains. Each project is designed to build practical, in-demand skills.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Track Your Progress</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor your growth with visual progress tracking. Share your journey and connect with others in the field.
            </p>
          </div>
        </div>
      </div>

      {/* Domains preview section */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
          Explore AI Domains
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'Machine Learning',
              icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
              color: 'blue',
              description: 'Build and deploy machine learning models to solve real-world problems.'
            },
            {
              name: 'Natural Language Processing',
              icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
              color: 'purple',
              description: 'Create applications that understand and generate human language.'
            },
            {
              name: 'Computer Vision',
              icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
              color: 'green',
              description: 'Develop systems that can interpret and understand visual information.'
            },
            {
              name: 'Robotics & AI',
              icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
              color: 'orange',
              description: 'Build intelligent systems that interact with the physical world.'
            }
          ].map((domain, index) => {
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
              purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
              green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
              orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            }[domain.color];
            
            return (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col h-full">
                <div className={`w-12 h-12 ${colorClasses} rounded-lg flex items-center justify-center mb-4`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={domain.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{domain.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{domain.description}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/domains')}
                  className="mt-auto"
                >
                  Explore Domain
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA section */}
      <div className="max-w-4xl mx-auto text-center bg-primary-50 dark:bg-primary-900 rounded-xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Start Your AI Career Journey?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Join thousands of learners who have discovered their ideal AI career path and built practical skills with CareerAI.
        </p>
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => navigate('/ikigai')}
        >
          Start Your Ikigai Journey
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
