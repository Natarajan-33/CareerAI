import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/rootStore';

const MilestonePage = observer(() => {
  const { projectStore } = useStores();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'not_started'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  
  // Load projects when component mounts
  useEffect(() => {
    if (!projectStore.projects.length) {
      projectStore.loadProjects();
    }
  }, [projectStore]);
  
  // Load milestones when selected project changes
  useEffect(() => {
    if (projectStore.selectedProject) {
      projectStore.loadProjectMilestones(projectStore.selectedProject.id);
    }
  }, [projectStore.selectedProject]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create milestone
      const success = await projectStore.createMilestone(formData);
      
      if (success) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          due_date: '',
          status: 'not_started'
        });
        
        // Close modal
        setMilestoneModalOpen(false);
        
        // Show success message
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (error) {
      console.error('Error creating milestone:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateMilestoneStatus = async (milestoneId, status) => {
    await projectStore.updateMilestoneStatus(milestoneId, status);
  };
  
  // Group milestones by status
  const groupedMilestones = projectStore.milestones.reduce(
    (groups, milestone) => {
      if (!groups[milestone.status]) {
        groups[milestone.status] = [];
      }
      groups[milestone.status].push(milestone);
      return groups;
    },
    { not_started: [], in_progress: [], completed: [] }
  );
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Project Milestones
        </h1>
        <p className="text-lg text-gray-600">
          Track and manage key milestones for your project to stay organized and motivated.
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
      
      {/* Success message */}
      {showSuccessMessage && (
        <div className="mb-8 p-4 bg-green-50 text-green-800 rounded-md">
          Milestone created successfully!
        </div>
      )}
      
      {/* Milestones board */}
      {projectStore.selectedProject && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Milestones for {projectStore.selectedProject.title}
            </h2>
            <button
              onClick={() => setMilestoneModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Add Milestone
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Not Started column */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-4 border-b">
                <h3 className="font-medium text-gray-900">Not Started</h3>
              </div>
              <div className="p-4 space-y-4 min-h-[200px]">
                {groupedMilestones.not_started.length > 0 ? (
                  groupedMilestones.not_started.map(milestone => (
                    <MilestoneCard
                      key={milestone.id}
                      milestone={milestone}
                      onUpdateStatus={handleUpdateMilestoneStatus}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No milestones</p>
                )}
              </div>
            </div>
            
            {/* In Progress column */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="bg-blue-100 p-4 border-b">
                <h3 className="font-medium text-gray-900">In Progress</h3>
              </div>
              <div className="p-4 space-y-4 min-h-[200px]">
                {groupedMilestones.in_progress.length > 0 ? (
                  groupedMilestones.in_progress.map(milestone => (
                    <MilestoneCard
                      key={milestone.id}
                      milestone={milestone}
                      onUpdateStatus={handleUpdateMilestoneStatus}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No milestones</p>
                )}
              </div>
            </div>
            
            {/* Completed column */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="bg-green-100 p-4 border-b">
                <h3 className="font-medium text-gray-900">Completed</h3>
              </div>
              <div className="p-4 space-y-4 min-h-[200px]">
                {groupedMilestones.completed.length > 0 ? (
                  groupedMilestones.completed.map(milestone => (
                    <MilestoneCard
                      key={milestone.id}
                      milestone={milestone}
                      onUpdateStatus={handleUpdateMilestoneStatus}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No milestones</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add milestone modal */}
      {milestoneModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Milestone</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setMilestoneModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 transition-colors"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Milestone'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// Milestone card component
const MilestoneCard = ({ milestone, onUpdateStatus }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const getDaysRemaining = (dateString) => {
    if (!dateString) return null;
    
    const dueDate = new Date(dateString);
    const today = new Date();
    
    // Reset time component for accurate day calculation
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const getDueDateLabel = () => {
    if (!milestone.due_date) return null;
    
    const daysRemaining = getDaysRemaining(milestone.due_date);
    
    if (daysRemaining < 0) {
      return (
        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
          Overdue by {Math.abs(daysRemaining)} days
        </span>
      );
    } else if (daysRemaining === 0) {
      return (
        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          Due today
        </span>
      );
    } else if (daysRemaining <= 3) {
      return (
        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          Due in {daysRemaining} days
        </span>
      );
    } else {
      return (
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          Due in {daysRemaining} days
        </span>
      );
    }
  };
  
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-900">{milestone.title}</h4>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                {milestone.status !== 'not_started' && (
                  <button
                    onClick={() => {
                      onUpdateStatus(milestone.id, 'not_started');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mark as Not Started
                  </button>
                )}
                
                {milestone.status !== 'in_progress' && (
                  <button
                    onClick={() => {
                      onUpdateStatus(milestone.id, 'in_progress');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mark as In Progress
                  </button>
                )}
                
                {milestone.status !== 'completed' && (
                  <button
                    onClick={() => {
                      onUpdateStatus(milestone.id, 'completed');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {milestone.description && (
        <p className="text-sm text-gray-600 mt-2">{milestone.description}</p>
      )}
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Due: {formatDate(milestone.due_date)}
        </div>
        {getDueDateLabel()}
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

export default MilestonePage;
