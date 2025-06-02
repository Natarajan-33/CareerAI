import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useIkigaiStore, useAuthStore } from '../../stores/RootStore.js';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';

const IkigaiResults = observer(({ result, onReset }) => {
  const navigate = useNavigate();
  const ikigaiStore = useIkigaiStore();
  const authStore = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
  // Navigate to domain selection
  const handleProceedToExecution = () => {
    navigate('/domains');
  };
  
  // Save ikigai result
  const handleSaveResult = async () => {
    if (!authStore.isAuthenticated) {
      setSaveError('You must be logged in to save results');
      return;
    }
    
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      const success = await ikigaiStore.saveIkigaiResult();
      setIsSaving(false);
      
      if (success) {
        setSaveSuccess(true);
      } else {
        setSaveError(ikigaiStore.error || 'Failed to save result');
      }
    } catch (error) {
      setIsSaving(false);
      setSaveError(error.message || 'An unexpected error occurred');
    }
  };
  
  // Get sentiment color
  const getSentimentColor = (score) => {
    if (score >= 0.7) return 'text-green-500';
    if (score >= 0.4) return 'text-blue-500';
    if (score >= 0) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Ikigai Results</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Based on our conversation, here's your personalized AI career path analysis.
        </p>
      </div>
      
      {/* Ikigai Diagram */}
      <div className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Your Ikigai</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Passion */}
          <Card className="h-full">
            <div className="flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Passion</h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                {result.passion}
              </p>
            </div>
          </Card>
          
          {/* Strengths */}
          <Card className="h-full">
            <div className="flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Strengths</h3>
              </div>
              
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="mb-2">{strength}</li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>
      
      {/* AI Career Suggestion */}
      <div className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">AI Career Suggestion</h2>
        
        <div className="text-center mb-6">
          <div className="inline-block p-4 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">{result.ai_suggestion}</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Based on your passions and strengths, this career path aligns well with your Ikigai.
          </p>
        </div>
      </div>
      
      {/* Recommended Domains */}
      <div className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Recommended Domains</h2>
        
        <div className="space-y-4">
          {result.domains.map((domain, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{domain.name}</h3>
                <span className="px-2 py-1 text-sm rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  {Math.round(domain.match_score * 100)}% Match
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">{domain.description}</p>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {domain.required_skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Suggested Projects */}
      <div className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Suggested Projects</h2>
        
        <div className="space-y-4">
          {result.projects && result.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.projects.map((project, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{project}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">No project suggestions available.</p>
          )}
        </div>
      </div>
      
      {/* Sentiment Analysis */}
      <div className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Conversation Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Overall Sentiment</h3>
            <p className={`text-2xl font-bold ${getSentimentColor(result.sentiment.overall)}`}>
              {Math.round(result.sentiment.overall * 100)}%
            </p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Confidence</h3>
            <p className={`text-2xl font-bold ${getSentimentColor(result.sentiment.confidence)}`}>
              {Math.round(result.sentiment.confidence * 100)}%
            </p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Excitement</h3>
            <p className={`text-2xl font-bold ${getSentimentColor(result.sentiment.excitement)}`}>
              {Math.round(result.sentiment.excitement * 100)}%
            </p>
          </div>
        </div>
      </div>
      
      {/* Save status messages */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg text-center">
          <p className="font-medium">Your Ikigai results have been saved successfully!</p>
        </div>
      )}
      
      {saveError && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg text-center">
          <p className="font-medium">{saveError}</p>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
        <Button variant="outline" onClick={onReset}>
          Restart Conversation
        </Button>
        
        <Button 
          variant="secondary" 
          onClick={handleSaveResult} 
          isLoading={isSaving}
          disabled={isSaving || saveSuccess}
        >
          {saveSuccess ? 'Saved' : 'Save Results'}
        </Button>
        
        <Button variant="primary" onClick={handleProceedToExecution}>
          Proceed to Execution Hub
        </Button>
      </div>
    </div>
  );
});

export default IkigaiResults;
