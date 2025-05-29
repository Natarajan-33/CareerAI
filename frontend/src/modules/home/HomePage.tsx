import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* Hero section with gradient background */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80"></div>
        
        {/* Subtle animated background effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        </div>
        
        {/* Content */}
        <div className="z-10 max-w-6xl mx-auto text-center mb-16 mt-16">
          {/* Headline and subheadline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Discover. Decide. Do.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto">
            CareerAI helps you find your purpose and turn it into progress.
          </p>
          
          {/* Two CTA cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
            {/* Card 1: Ikigai Chatbot */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center">
              <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">💬</div>
              <h2 className="text-3xl font-bold mb-2 text-white">Ikigai Chatbot</h2>
              <p className="text-gray-300 mb-8 text-lg">Know what you want</p>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/ikigai')}
                className="w-full mt-auto"
              >
                Start Chat
              </Button>
            </div>
            
            {/* Card 2: Execution Hub */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center">
              <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">🚀</div>
              <h2 className="text-3xl font-bold mb-2 text-white">Execution Hub</h2>
              <p className="text-gray-300 mb-8 text-lg">Get what you want</p>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/journey')}
                className="w-full mt-auto"
              >
                Start Building
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
