import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useProjectStore, useProgressStore, useFrictionPointStore } from '../../stores';
import Button from '../../components/Button.jsx';

const FrictionPointsPage = observer(() => {
  const navigate = useNavigate();
  const projectStore = useProjectStore();
  const progressStore = useProgressStore();
  const frictionPointStore = useFrictionPointStore();
  
  // State for the Delta 4 analysis form
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');
  const [challenges, setChallenges] = useState('');
  const [goals, setGoals] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('technical');
  
  // Check if we have a projectId from navigation state
  useEffect(() => {
    // Get location state from React Router v6
    const location = window.location;
    const searchParams = new URLSearchParams(location.search);
    const stateProjectId = searchParams.get('projectId');
    
    if (stateProjectId) {
      setSelectedProjectId(stateProjectId);
      
      // Find the project and set its description
      const project = projectStore.projects.find(p => p.id === stateProjectId);
      if (project) {
        setProjectDescription(project.description || '');
      }
    }
  }, [projectStore.projects]);
  
  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      if (!projectStore.projects.length) {
        await projectStore.loadProjects();
      }
    };
    
    loadProjects();
  }, [projectStore]);
  
  // Handle project selection
  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProjectId(projectId);
    
    // Auto-fill project description if available
    if (projectId) {
      const selectedProject = projectStore.projects.find(p => p.id === projectId);
      if (selectedProject) {
        setProjectDescription(selectedProject.description || '');
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProjectId) {
      alert('Please select a project to analyze');
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const result = await frictionPointStore.analyzeDelta4(
        selectedProjectId,
        projectDescription,
        currentStatus,
        challenges,
        goals
      );
      
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing project:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Navigate to progress page for a project
  const navigateToProgress = (projectId) => {
    navigate(`/progress/${projectId}`);
  };
  
  // Save a friction point from the analysis
  const saveFrictionPoint = async (dimension, pointType, description) => {
    if (!selectedProjectId) return;
    
    try {
      await frictionPointStore.createFrictionPoint({
        project_id: selectedProjectId,
        dimension,
        point_type: pointType,
        description,
        impact_level: 3, // Default medium impact
      });
      
      alert(`${pointType === 'friction' ? 'Friction' : 'Delight'} point saved successfully!`);
    } catch (error) {
      console.error('Error saving friction point:', error);
      alert('Failed to save point. Please try again.');
    }
  };
  
  // Generate a downloadable report
  const generateReport = () => {
    if (!analysis) return;
    
    const selectedProject = projectStore.projects.find(p => p.id === selectedProjectId);
    const projectTitle = selectedProject?.title || 'Project';
    
    let report = `DELTA 4 ANALYSIS REPORT\n`;
    report += `Project: ${projectTitle}\n`;
    report += `Date: ${new Date().toLocaleDateString()}\n\n`;
    
    report += `SUMMARY\n${analysis.summary}\n\n`;
    
    // Add each dimension
    const dimensions = ['technical', 'cultural', 'process', 'expectation'];
    dimensions.forEach(dim => {
      const dimData = analysis[dim] || {};
      
      report += `${dim.toUpperCase()} DIMENSION\n`;
      
      report += `Friction Points:\n`;
      if (dimData.friction && dimData.friction.length) {
        dimData.friction.forEach(point => {
          report += `- ${point}\n`;
        });
      } else {
        report += `- None identified.\n`;
      }
      report += `\n`;
      
      report += `Delight Points:\n`;
      if (dimData.delight && dimData.delight.length) {
        dimData.delight.forEach(point => {
          report += `- ${point}\n`;
        });
      } else {
        report += `- None identified.\n`;
      }
      report += `\n`;
      
      report += `Recommendations:\n`;
      if (dimData.recommendations && dimData.recommendations.length) {
        dimData.recommendations.forEach(rec => {
          report += `- ${rec}\n`;
        });
      } else {
        report += `- None provided.\n`;
      }
      report += `\n`;
    });
    
    report += `Generated by CareerAI - Delta 4 Analyzer\n`;
    
    // Create and download the file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delta4_analysis_${projectTitle.toLowerCase().replace(/ /g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Render dimension analysis
  const renderDimensionAnalysis = (dimension) => {
    if (!analysis || !analysis[dimension]) {
      return <p className="text-gray-500 dark:text-gray-400">No analysis available for this dimension.</p>;
    }
    
    const dimensionData = analysis[dimension];
    
    return (
      <div>
        {/* Friction Points */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Friction Points 🔴</h3>
          {dimensionData.friction && dimensionData.friction.length > 0 ? (
            <ul className="space-y-2">
              {dimensionData.friction.map((point, index) => (
                <li key={`friction-${index}`} className="flex items-start">
                  <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-lg flex-grow">
                    {point}
                  </span>
                  <button
                    onClick={() => saveFrictionPoint(dimension, 'friction', point)}
                    className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title="Save as friction point"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No friction points identified.</p>
          )}
        </div>
        
        {/* Delight Points */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">Delight Points 🟢</h3>
          {dimensionData.delight && dimensionData.delight.length > 0 ? (
            <ul className="space-y-2">
              {dimensionData.delight.map((point, index) => (
                <li key={`delight-${index}`} className="flex items-start">
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-lg flex-grow">
                    {point}
                  </span>
                  <button
                    onClick={() => saveFrictionPoint(dimension, 'delight', point)}
                    className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title="Save as delight point"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No delight points identified.</p>
          )}
        </div>
        
        {/* Recommendations */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">Recommendations 💡</h3>
          {dimensionData.recommendations && dimensionData.recommendations.length > 0 ? (
            <ul className="space-y-2">
              {dimensionData.recommendations.map((rec, index) => (
                <li key={`rec-${index}`} className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-3 rounded-lg">
                  {rec}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No recommendations available.</p>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Friction & Delight Points Analyzer 🔍</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/journey')}
        >
          Back to Journey
        </Button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Delta 4 framework helps identify friction and delight points in your project across four dimensions:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <li className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300">Technical</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">Tools, technologies, and technical challenges</p>
          </li>
          <li className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 dark:text-purple-300">Cultural</h3>
            <p className="text-sm text-purple-600 dark:text-purple-400">Team dynamics, communication, and collaboration</p>
          </li>
          <li className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 dark:text-green-300">Process</h3>
            <p className="text-sm text-green-600 dark:text-green-400">Workflows, methodologies, and project management</p>
          </li>
          <li className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-700 dark:text-yellow-300">Expectation</h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Alignment between goals, timelines, and reality</p>
          </li>
        </ul>
        
        {/* Project selection and analysis form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select a project to analyze:
            </label>
            <div className="flex space-x-2">
              <select
                id="project-select"
                value={selectedProjectId}
                onChange={handleProjectChange}
                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">-- Select a project --</option>
                {projectStore.projects.map(project => (
                  <option key={project.id} value={project.id}>{project.title}</option>
                ))}
              </select>
              {selectedProjectId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToProgress(selectedProjectId)}
                  type="button"
                >
                  View Progress
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Description
            </label>
            <textarea
              id="project-description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              rows="3"
              required
            />
          </div>
          
          <div>
            <label htmlFor="current-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Status
            </label>
            <textarea
              id="current-status"
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              rows="3"
              placeholder="Describe the current state of your project. What has been accomplished? What's in progress?"
              required
            />
          </div>
          
          <div>
            <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Challenges
            </label>
            <textarea
              id="challenges"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              rows="3"
              placeholder="What difficulties are you facing? What's slowing you down?"
              required
            />
          </div>
          
          <div>
            <label htmlFor="goals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Goals & Expectations
            </label>
            <textarea
              id="goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              rows="3"
              placeholder="What are your goals for this project? What do you expect to achieve?"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Project'}
            </Button>
          </div>
        </form>
      </div>
      
      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Delta 4 Analysis Results</h2>
          
          {/* Summary */}
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6">
            <p className="text-blue-800 dark:text-blue-200">{analysis.summary}</p>
          </div>
          
          {/* Tabs for each dimension */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'technical' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('technical')}
              >
                Technical
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'cultural' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('cultural')}
              >
                Cultural
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'process' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('process')}
              >
                Process
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'expectation' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('expectation')}
              >
                Expectation
              </button>
            </div>
            
            <div className="mt-6">
              {renderDimensionAnalysis(activeTab)}
            </div>
          </div>
          
          {/* Download report button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="md"
              onClick={generateReport}
            >
              Download Analysis Report
            </Button>
          </div>
        </div>
      )}
      
      {/* Learn More section */}
      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <details>
          <summary className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer">
            Learn More About the Delta 4 Framework
          </summary>
          <div className="mt-4 prose dark:prose-invert max-w-none">
            <h3>The Delta 4 Framework</h3>
            <p>
              The Delta 4 framework was developed to provide a comprehensive analysis of project health by identifying both friction (challenges) and delight (successes) points across four key dimensions:
            </p>
            
            <h4>1. Technical Dimension</h4>
            <ul>
              <li><strong>Friction:</strong> Technical debt, bugs, performance issues, integration problems</li>
              <li><strong>Delight:</strong> Working features, successful integrations, technical innovations</li>
            </ul>
            
            <h4>2. Cultural Dimension</h4>
            <ul>
              <li><strong>Friction:</strong> Communication issues, siloed knowledge, collaboration challenges</li>
              <li><strong>Delight:</strong> Team synergy, knowledge sharing, shared ownership</li>
            </ul>
            
            <h4>3. Process Dimension</h4>
            <ul>
              <li><strong>Friction:</strong> Workflow bottlenecks, unclear responsibilities, inefficient procedures</li>
              <li><strong>Delight:</strong> Smooth workflows, clear task management, effective planning</li>
            </ul>
            
            <h4>4. Expectation Dimension</h4>
            <ul>
              <li><strong>Friction:</strong> Unrealistic timelines, scope creep, misaligned stakeholder expectations</li>
              <li><strong>Delight:</strong> Clear project vision, aligned expectations, satisfied stakeholders</li>
            </ul>
            
            <p>
              By analyzing all four dimensions, you can identify not just what's going wrong, but also what's going right and how to leverage those successes.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
});

export default FrictionPointsPage;
