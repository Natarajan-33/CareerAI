import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/rootStore';

const FirmAlertsPage = observer(() => {
  const { projectStore } = useStores();
  
  const [companyName, setCompanyName] = useState('');
  const [companyInsights, setCompanyInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load projects when component mounts
  useEffect(() => {
    if (!projectStore.projects.length) {
      projectStore.loadProjects();
    }
  }, [projectStore]);
  
  const handleGetInsights = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call API to get company insights
      const response = await fetch(`/api/progress/company-insights?company_name=${encodeURIComponent(companyName)}&domain=${projectStore.selectedProject?.domain || ''}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get company insights');
      }
      
      const data = await response.json();
      setCompanyInsights(data);
    } catch (error) {
      console.error('Error getting company insights:', error);
      setError('Failed to get company insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadReport = () => {
    if (!companyInsights) return;
    
    // Create report content
    const reportContent = generateCompanyReport(companyInsights);
    
    // Create download link
    const element = document.createElement('a');
    const file = new Blob([reportContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${companyInsights.company_name}_insights_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Target Firm Alerts
        </h1>
        <p className="text-lg text-gray-600">
          Get insights about companies you're interested in and how your skills align with their needs.
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
      
      {/* Company search form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Search for a Company</h2>
        
        <form onSubmit={handleGetInsights} className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name (e.g., Google, Microsoft, OpenAI)"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !companyName.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              'Get Insights'
            )}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {/* Company insights */}
      {companyInsights && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Insights for {companyInsights.company_name}
            </h2>
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Download Report
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Company overview */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Overview</h3>
              <p className="text-gray-700">{companyInsights.overview}</p>
            </div>
            
            {/* AI initiatives */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI/ML Initiatives</h3>
              <ul className="list-disc list-inside space-y-1">
                {companyInsights.ai_initiatives.map((initiative, index) => (
                  <li key={index} className="text-gray-700">{initiative}</li>
                ))}
              </ul>
            </div>
            
            {/* Job roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Common Job Roles</h3>
                <ul className="list-disc list-inside space-y-1">
                  {companyInsights.job_roles.map((role, index) => (
                    <li key={index} className="text-gray-700">{role}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {companyInsights.required_skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Strategic advice */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Strategic Advice</h3>
              <ul className="list-disc list-inside space-y-2">
                {companyInsights.strategic_advice.map((advice, index) => (
                  <li key={index} className="text-gray-700">{advice}</li>
                ))}
              </ul>
            </div>
            
            {/* Skill alignment */}
            {projectStore.selectedProject && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Skill Alignment</h3>
                <p className="text-gray-700 mb-4">
                  Based on your selected project <strong>{projectStore.selectedProject.title}</strong> in the domain of <strong>{projectStore.selectedProject.domain}</strong>, here's how your skills align with {companyInsights.company_name}'s needs:
                </p>
                
                <SkillAlignmentChart 
                  projectSkills={projectStore.selectedProject.skills || []}
                  companySkills={companyInsights.required_skills}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

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

// Skill alignment chart component
const SkillAlignmentChart = ({ projectSkills, companySkills }) => {
  // Find matching skills
  const matchingSkills = projectSkills.filter(skill => 
    companySkills.some(companySkill => 
      companySkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(companySkill.toLowerCase())
    )
  );
  
  // Calculate match percentage
  const matchPercentage = Math.round((matchingSkills.length / companySkills.length) * 100);
  
  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="w-full bg-gray-200 rounded-full h-4 mr-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${Math.min(matchPercentage, 100)}%` }}
          ></div>
        </div>
        <span className="text-lg font-bold text-blue-600">{matchPercentage}%</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Matching Skills</h4>
          {matchingSkills.length > 0 ? (
            <ul className="list-disc list-inside">
              {matchingSkills.map((skill, index) => (
                <li key={index} className="text-green-700">{skill}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No direct skill matches found.</p>
          )}
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Skills to Develop</h4>
          <ul className="list-disc list-inside">
            {companySkills
              .filter(skill => 
                !projectSkills.some(projectSkill => 
                  projectSkill.toLowerCase().includes(skill.toLowerCase()) ||
                  skill.toLowerCase().includes(projectSkill.toLowerCase())
                )
              )
              .map((skill, index) => (
                <li key={index} className="text-red-700">{skill}</li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
};

// Generate company report function
const generateCompanyReport = (insights) => {
  return `COMPANY INSIGHTS REPORT
${new Date().toLocaleDateString()}

Company: ${insights.company_name}

========================================
COMPANY OVERVIEW
========================================
${insights.overview}

========================================
AI/ML INITIATIVES
========================================
${insights.ai_initiatives.map(initiative => `- ${initiative}`).join('\n')}

========================================
JOB ROLES
========================================
${insights.job_roles.map(role => `- ${role}`).join('\n')}

========================================
REQUIRED SKILLS
========================================
${insights.required_skills.map(skill => `- ${skill}`).join('\n')}

========================================
STRATEGIC ADVICE
========================================
${insights.strategic_advice.map(advice => `- ${advice}`).join('\n')}

========================================
Generated by CareerAI
`;
};

export default FirmAlertsPage;
