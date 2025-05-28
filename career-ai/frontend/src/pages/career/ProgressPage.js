import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/rootStore';

const ProgressPage = observer(() => {
  const { projectStore } = useStores();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    hours_spent: 0,
    tasks_completed: '',
    challenges: '',
    learnings: '',
    next_steps: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Load projects when component mounts
  useEffect(() => {
    if (!projectStore.projects.length) {
      projectStore.loadProjects();
    }
  }, [projectStore]);
  
  // Load progress entries when selected project changes
  useEffect(() => {
    if (projectStore.selectedProject) {
      projectStore.loadProjectProgress(projectStore.selectedProject.id);
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
      // Format tasks completed as an array
      const tasks = formData.tasks_completed
        .split('\n')
        .filter(task => task.trim() !== '')
        .map(task => task.trim());
      
      // Create progress entry
      const success = await projectStore.createProgressEntry({
        ...formData,
        tasks_completed: tasks,
        hours_spent: parseFloat(formData.hours_spent)
      });
      
      if (success) {
        // Reset form
        setFormData({
          date: new Date().toISOString().split('T')[0],
          hours_spent: 0,
          tasks_completed: '',
          challenges: '',
          learnings: '',
          next_steps: ''
        });
        
        // Show success message
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting progress:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate total hours spent
  const totalHours = projectStore.progressEntries.reduce(
    (total, entry) => total + (entry.hours_spent || 0),
    0
  );
  
  // Calculate progress percentage (assuming 100 hours to complete a project)
  const progressPercentage = Math.min(Math.round((totalHours / 100) * 100), 100);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Progress Tracking
        </h1>
        <p className="text-lg text-gray-600">
          Track your progress on your selected project and reflect on your learning journey.
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
      
      {/* Progress overview */}
      {projectStore.selectedProject && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Progress Overview: {projectStore.selectedProject.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Total Hours</h3>
              <p className="text-3xl font-bold text-blue-600">{totalHours.toFixed(1)}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Completion</h3>
              <p className="text-3xl font-bold text-green-600">{progressPercentage}%</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Entries</h3>
              <p className="text-3xl font-bold text-purple-600">{projectStore.progressEntries.length}</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => projectStore.updateProjectStatus(projectStore.selectedProject.id, 'in_progress')}
              disabled={projectStore.selectedProject.status === 'in_progress'}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 transition-colors"
            >
              Mark as In Progress
            </button>
            
            <button
              onClick={() => projectStore.updateProjectStatus(projectStore.selectedProject.id, 'completed')}
              disabled={projectStore.selectedProject.status === 'completed'}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300 transition-colors"
            >
              Mark as Completed
            </button>
          </div>
        </div>
      )}
      
      {/* Progress entry form */}
      {projectStore.selectedProject && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Log Your Progress</h2>
          
          {showSuccessMessage && (
            <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md">
              Progress entry saved successfully!
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Hours Spent
                </label>
                <input
                  type="number"
                  name="hours_spent"
                  value={formData.hours_spent}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Tasks Completed (one per line)
              </label>
              <textarea
                name="tasks_completed"
                value={formData.tasks_completed}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="- Implemented feature X\n- Fixed bug Y\n- Researched topic Z"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Challenges Faced
              </label>
              <textarea
                name="challenges"
                value={formData.challenges}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What difficulties did you encounter?"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                What You Learned
              </label>
              <textarea
                name="learnings"
                value={formData.learnings}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What new skills or insights did you gain?"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Next Steps
              </label>
              <textarea
                name="next_steps"
                value={formData.next_steps}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What will you work on next?"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Save Progress'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Progress history */}
      {projectStore.selectedProject && projectStore.progressEntries.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Progress History</h2>
          
          <div className="space-y-4">
            {projectStore.progressEntries
              .slice()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((entry, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">
                      {new Date(entry.date).toLocaleDateString()}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {entry.hours_spent} hours
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Tasks Completed</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {entry.tasks_completed.map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {entry.challenges && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Challenges</h4>
                      <p className="text-gray-600">{entry.challenges}</p>
                    </div>
                  )}
                  
                  {entry.learnings && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Learnings</h4>
                      <p className="text-gray-600">{entry.learnings}</p>
                    </div>
                  )}
                  
                  {entry.next_steps && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Next Steps</h4>
                      <p className="text-gray-600">{entry.next_steps}</p>
                    </div>
                  )}
                </div>
              ))}
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

export default ProgressPage;
