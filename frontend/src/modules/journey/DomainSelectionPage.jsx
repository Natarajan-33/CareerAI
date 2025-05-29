import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useProjectStore } from '../../stores/RootStore.js';
import DomainCard from '../../components/DomainCard.jsx';
import Button from '../../components/Button.jsx';

const DomainSelectionPage = observer(() => {
  const projectStore = useProjectStore();
  const navigate = useNavigate();
  const [selectedDomainId, setSelectedDomainId] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  
  useEffect(() => {
    // Load domains when component mounts
    projectStore.loadDomains();
  }, [projectStore]);
  
  const handleSelectDomain = (domainId) => {
    setSelectedDomainId(domainId);
    projectStore.selectDomain(domainId);
  };
  
  const handleViewDetails = (domainId) => {
    setShowDetails(domainId);
  };
  
  const handleCloseDetails = () => {
    setShowDetails(null);
  };
  
  const handleProceedToProjects = () => {
    if (selectedDomainId) {
      navigate('/projects');
    }
  };
  
  // Find the selected domain for details modal
  const selectedDomain = projectStore.domains.find(d => d.id === showDetails);
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Select Your AI Domain</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Choose a domain that aligns with your interests and career goals. Each domain offers different projects and learning paths.
        </p>
      </div>
      
      {projectStore.isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : projectStore.domains.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No domains available at the moment.</p>
          <Button variant="primary" onClick={() => projectStore.loadDomains()}>
            Refresh
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projectStore.domains.map((domain) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                selected={domain.id === selectedDomainId}
                onSelect={handleSelectDomain}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
          
          {selectedDomainId && (
            <div className="flex justify-center mt-8">
              <Button
                variant="primary"
                size="lg"
                onClick={handleProceedToProjects}
              >
                Proceed with Selected Domain
              </Button>
            </div>
          )}
        </>
      )}
      
      {/* Domain details modal */}
      {showDetails && selectedDomain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedDomain.name}</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedDomain.description}
                </p>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDomain.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Potential Job Titles</h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                    {selectedDomain.jobTitles.map((title, index) => (
                      <li key={index}>{title}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Industry Demand</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This domain is in high demand across industries like finance, healthcare, and technology.
                    Companies are actively seeking professionals with these skills for both entry-level and senior positions.
                  </p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Learning Path</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    The learning path for this domain starts with foundational projects and gradually introduces more
                    complex concepts and techniques. You'll build practical skills through hands-on projects.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={handleCloseDetails}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleSelectDomain(selectedDomain.id);
                    handleCloseDetails();
                  }}
                >
                  Select This Domain
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default DomainSelectionPage;
