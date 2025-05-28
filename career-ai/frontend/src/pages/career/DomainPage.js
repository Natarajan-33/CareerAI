import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/rootStore';

const DomainPage = observer(() => {
  const { ikigaiStore } = useStores();
  const navigate = useNavigate();
  
  const [selectedDomain, setSelectedDomain] = useState('');
  
  // Set selected domain from ikigai data if available
  useEffect(() => {
    if (ikigaiStore.ikigaiData.final_domain) {
      setSelectedDomain(ikigaiStore.ikigaiData.final_domain);
    }
  }, [ikigaiStore.ikigaiData]);
  
  const handleContinue = () => {
    // Navigate to project selection with the selected domain
    navigate('/projects', { state: { domain: selectedDomain } });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Domain Selection
        </h1>
        <p className="text-lg text-gray-600">
          Based on your Ikigai discovery, explore these AI/ML domains and confirm your selection.
        </p>
      </div>
      
      {/* Domain selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DomainCard
          id="nlp"
          title="Natural Language Processing"
          description="Build AI systems that can understand, interpret, and generate human language."
          skills={["Text analysis", "Sentiment analysis", "Chatbots", "Machine translation", "Information extraction"]}
          careers={["NLP Engineer", "Conversational AI Developer", "Text Analytics Specialist"]}
          companies={["OpenAI", "Google", "Microsoft", "Amazon", "Meta"]}
          selected={selectedDomain === 'nlp'}
          onSelect={() => setSelectedDomain('nlp')}
        />
        
        <DomainCard
          id="computer_vision"
          title="Computer Vision"
          description="Develop systems that can interpret and understand visual information from the world."
          skills={["Image recognition", "Object detection", "Image segmentation", "Video analysis", "Augmented reality"]}
          careers={["Computer Vision Engineer", "AR/VR Developer", "Robotics Vision Specialist"]}
          companies={["NVIDIA", "Tesla", "Google", "Microsoft", "Apple"]}
          selected={selectedDomain === 'computer_vision'}
          onSelect={() => setSelectedDomain('computer_vision')}
        />
        
        <DomainCard
          id="robotics"
          title="Robotics & Automation"
          description="Create intelligent robots and automated systems that can interact with the physical world."
          skills={["Robot control", "Motion planning", "Sensor fusion", "Autonomous navigation", "Manipulation"]}
          careers={["Robotics Engineer", "Automation Specialist", "Drone Developer"]}
          companies={["Boston Dynamics", "ABB", "Fetch Robotics", "iRobot", "DJI"]}
          selected={selectedDomain === 'robotics'}
          onSelect={() => setSelectedDomain('robotics')}
        />
        
        <DomainCard
          id="data_science"
          title="Data Science & Analytics"
          description="Extract insights and knowledge from structured and unstructured data."
          skills={["Statistical analysis", "Data visualization", "Predictive modeling", "A/B testing", "Business intelligence"]}
          careers={["Data Scientist", "Business Intelligence Analyst", "ML Engineer"]}
          companies={["Netflix", "Airbnb", "Spotify", "LinkedIn", "Uber"]}
          selected={selectedDomain === 'data_science'}
          onSelect={() => setSelectedDomain('data_science')}
        />
        
        <DomainCard
          id="reinforcement_learning"
          title="Reinforcement Learning"
          description="Build systems that learn optimal behaviors through interaction with environments."
          skills={["Policy optimization", "Q-learning", "Multi-agent systems", "Game AI", "Simulation"]}
          careers={["RL Research Scientist", "Game AI Developer", "Autonomous Systems Engineer"]}
          companies={["DeepMind", "OpenAI", "Unity", "Electronic Arts", "Waymo"]}
          selected={selectedDomain === 'reinforcement_learning'}
          onSelect={() => setSelectedDomain('reinforcement_learning')}
        />
        
        <DomainCard
          id="generative_ai"
          title="Generative AI"
          description="Create AI systems that can generate new content, from text to images to music."
          skills={["GANs", "Diffusion models", "Transformers", "Content generation", "Creative AI"]}
          careers={["Generative AI Engineer", "Creative AI Developer", "AI Art Specialist"]}
          companies={["OpenAI", "Stability AI", "Midjourney", "Anthropic", "Runway"]}
          selected={selectedDomain === 'generative_ai'}
          onSelect={() => setSelectedDomain('generative_ai')}
        />
      </div>
      
      {/* Ikigai summary */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Ikigai Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Your Passions</h3>
            <p className="text-gray-700">{ikigaiStore.ikigaiData.passion || 'Not identified'}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Your Strengths</h3>
            <p className="text-gray-700">{ikigaiStore.ikigaiData.strengths || 'Not identified'}</p>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-medium text-gray-900 mb-2">AI Recommendation</h3>
            <p className="text-gray-700">{ikigaiStore.ikigaiData.ai_suggestion || 'No recommendation available'}</p>
          </div>
        </div>
      </div>
      
      {/* Continue button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selectedDomain}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 transition-colors"
        >
          Continue to Project Selection
        </button>
      </div>
    </div>
  );
});

// Domain card component
const DomainCard = ({ id, title, description, skills, careers, companies, selected, onSelect }) => {
  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all ${selected ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
      onClick={onSelect}
    >
      <div className="p-4 cursor-pointer">
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
        
        <div className="mt-4">
          <h4 className="font-medium text-sm text-gray-700">Key Skills</h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {skills.map((skill, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-3">
          <h4 className="font-medium text-sm text-gray-700">Career Paths</h4>
          <p className="text-sm text-gray-600 mt-1">{careers.join(', ')}</p>
        </div>
        
        <div className="mt-3">
          <h4 className="font-medium text-sm text-gray-700">Top Companies</h4>
          <p className="text-sm text-gray-600 mt-1">{companies.join(', ')}</p>
        </div>
      </div>
      
      <div className={`p-3 ${selected ? 'bg-blue-50' : 'bg-gray-50'} border-t`}>
        <div className="flex items-center">
          <input
            type="radio"
            name="domain"
            id={id}
            checked={selected}
            onChange={() => onSelect()}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={id} className="ml-2 block text-sm font-medium text-gray-700">
            Select this domain
          </label>
        </div>
      </div>
    </div>
  );
};

export default DomainPage;
