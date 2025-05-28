import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/rootStore';

const FrictionPointsPage = observer(() => {
  const { projectStore } = useStores();
  
  const [formData, setFormData] = useState({
    project_description: '',
    current_status: '',
    challenges: '',
    goals: ''
  });
  
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('technical');
  
  // Load projects when component mounts
  useEffect(() => {
    if (!projectStore.projects.length) {
      projectStore.loadProjects();
    }
  }, [projectStore]);
  
  // Pre-fill form data when selected project changes
  useEffect(() => {
    if (projectStore.selectedProject) {
      setFormData(prev => ({
        ...prev,
        project_description: projectStore.selectedProject.description || ''
      }));
    }
  }, [projectStore.selectedProject]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAnalyze = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    try {
      // Call API to analyze project using Delta4 framework
      const response = await fetch('/api/progress/analyze-delta4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze project');
      }
      
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing project:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleDownloadReport = () => {
    if (!analysis) return;
    
    // Create report content
    const reportContent = generateReport(projectStore.selectedProject?.title || 'Project', analysis);
    
    // Create download link
    const element = document.createElement('a');
    const file = new Blob([reportContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `delta4_analysis_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Friction & Delight Points
        </h1>
        <p className="text-lg text-gray-600">
          Analyze your project using the Delta 4 framework to identify friction and delight points.
        </p>
      </div>
      
      {/* Project selection */}
      {projectStore.projects.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Project</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectStore.projects.map(project => (
              <div
                key={project.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${projectStore.selectedProject?.id === project.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                onClick={() => projectStore.selectProject(project)}
              >
                <h3 className="font-medium text-gray-900">{project.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{project.domain}</p>
                <div className="mt-2">
                  <StatusBadge status={project.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-6 rounded-lg mb-8">
          <p className="text-yellow-800">
            You haven't selected any projects yet. Please go to the Project Selection page to choose a project.
          </p>
        </div>
      )}
      
      {/* Analysis form */}
      {projectStore.selectedProject && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Delta 4 Analysis for {projectStore.selectedProject.title}
          </h2>
          
          <form onSubmit={handleAnalyze}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Project Description
              </label>
              <textarea
                name="project_description"
                value={formData.project_description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your project and its objectives"
                required
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Current Status
              </label>
              <textarea
                name="current_status"
                value={formData.current_status}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the current status and progress of your project"
                required
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Challenges
              </label>
              <textarea
                name="challenges"
                value={formData.challenges}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the challenges and issues you're facing"
                required
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Goals & Expectations
              </label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your goals and expectations for the project"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 transition-colors"
              >
                {isAnalyzing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze with Delta 4'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Analysis results */}
      {analysis && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Download Report
            </button>
          </div>
          
          {/* Tabs */}
          <div className="border-b mb-6">
            <nav className="-mb-px flex space-x-8">
              <TabButton
                label="Technical"
                isActive={activeTab === 'technical'}
                onClick={() => setActiveTab('technical')}
              />
              <TabButton
                label="Cultural"
                isActive={activeTab === 'cultural'}
                onClick={() => setActiveTab('cultural')}
              />
              <TabButton
                label="Process"
                isActive={activeTab === 'process'}
                onClick={() => setActiveTab('process')}
              />
              <TabButton
                label="Expectation"
                isActive={activeTab === 'expectation'}
                onClick={() => setActiveTab('expectation')}
              />
            </nav>
          </div>
          
          {/* Tab content */}
          <div className="space-y-6">
            {activeTab === 'technical' && (
              <DimensionAnalysis dimension="technical" analysis={analysis.technical} />
            )}
            
            {activeTab === 'cultural' && (
              <DimensionAnalysis dimension="cultural" analysis={analysis.cultural} />
            )}
            
            {activeTab === 'process' && (
              <DimensionAnalysis dimension="process" analysis={analysis.process} />
            )}
            
            {activeTab === 'expectation' && (
              <DimensionAnalysis dimension="expectation" analysis={analysis.expectation} />
            )}
          </div>
        </div>
      )}
    </div>
  );
});

// Tab button component
const TabButton = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

// Dimension analysis component
const DimensionAnalysis = ({ dimension, analysis }) => {
  const dimensionTitles = {
    technical: 'Technical Dimension',
    cultural: 'Cultural Dimension',
    process: 'Process Dimension',
    expectation: 'Expectation Dimension'
  };
  
  const dimensionDescriptions = {
    technical: 'Technical challenges, tools, and implementation details',
    cultural: 'Team dynamics, communication, and collaboration',
    process: 'Workflow, methodology, and project management',
    expectation: 'Alignment between expectations and reality'
  };
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {dimensionTitles[dimension]}
      </h3>
      <p className="text-gray-600 mb-4">{dimensionDescriptions[dimension]}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Friction points */}
        <div className="bg-red-50 rounded-lg p-4">
          <h4 className="font-medium text-red-800 mb-2">Friction Points</h4>
          <ul className="list-disc list-inside space-y-2">
            {analysis.friction.map((point, index) => (
              <li key={index} className="text-gray-700">{point}</li>
            ))}
          </ul>
        </div>
        
        {/* Delight points */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Delight Points</h4>
          <ul className="list-disc list-inside space-y-2">
            {analysis.delight.map((point, index) => (
              <li key={index} className="text-gray-700">{point}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
        <ul className="list-disc list-inside space-y-2">
          {analysis.recommendations.map((recommendation, index) => (
            <li key={index} className="text-gray-700">{recommendation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }) => {
  const getBadgeColor = () => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };
  
  return (
    <span className={`text-xs px-2 py-1 rounded ${getBadgeColor()}`}>
      {getStatusText()}
    </span>
  );
};

// Generate report function
const generateReport = (projectTitle, analysis) => {
  return `DELTA 4 ANALYSIS REPORT
${new Date().toLocaleDateString()}

Project: ${projectTitle}

========================================
TECHNICAL DIMENSION
========================================

Friction Points:
${analysis.technical.friction.map(point => `- ${point}`).join('\n')}

Delight Points:
${analysis.technical.delight.map(point => `- ${point}`).join('\n')}

Recommendations:
${analysis.technical.recommendations.map(rec => `- ${rec}`).join('\n')}

========================================
CULTURAL DIMENSION
========================================

Friction Points:
${analysis.cultural.friction.map(point => `- ${point}`).join('\n')}

Delight Points:
${analysis.cultural.delight.map(point => `- ${point}`).join('\n')}

Recommendations:
${analysis.cultural.recommendations.map(rec => `- ${rec}`).join('\n')}

========================================
PROCESS DIMENSION
========================================

Friction Points:
${analysis.process.friction.map(point => `- ${point}`).join('\n')}

Delight Points:
${analysis.process.delight.map(point => `- ${point}`).join('\n')}

Recommendations:
${analysis.process.recommendations.map(rec => `- ${rec}`).join('\n')}

========================================
EXPECTATION DIMENSION
========================================

Friction Points:
${analysis.expectation.friction.map(point => `- ${point}`).join('\n')}

Delight Points:
${analysis.expectation.delight.map(point => `- ${point}`).join('\n')}

Recommendations:
${analysis.expectation.recommendations.map(rec => `- ${rec}`).join('\n')}

========================================
Generated by CareerAI
`;
};

export default FrictionPointsPage;
