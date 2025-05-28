import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/rootStore';

const WelcomePage = observer(() => {
  const { authStore } = useStores();
  const navigate = useNavigate();
  
  const [profileType, setProfileType] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [immediateGoals, setImmediateGoals] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save user profile data
      if (authStore.user && authStore.user.id !== 'guest') {
        await authStore.updateProfile({
          profile_type: profileType,
          skill_level: skillLevel,
          immediate_goals: immediateGoals
        });
      }
      
      // Navigate to Ikigai discovery
      navigate('/ikigai');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-6">
          Welcome to CareerAI <span className="ml-2">🚀</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
          Your personalized AI-powered career companion that guides you through a structured journey 
          toward AI/ML and robotics roles. Let's start by understanding a bit about you.
        </p>
      </div>
      
      <div className="card border border-gray-100">
        <h2 className="text-2xl font-semibold mb-6 text-text-primary">Tell us about yourself</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="label text-lg mb-3">
              What best describes you?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProfileTypeCard
                type="student"
                title="Student"
                description="Currently studying and looking to build skills for future roles"
                selected={profileType === 'student'}
                onClick={() => setProfileType('student')}
              />
              <ProfileTypeCard
                type="career_changer"
                title="Career Changer"
                description="Looking to transition from another field into AI/ML"
                selected={profileType === 'career_changer'}
                onClick={() => setProfileType('career_changer')}
              />
              <ProfileTypeCard
                type="professional"
                title="AI Professional"
                description="Already working in AI and looking to advance skills"
                selected={profileType === 'professional'}
                onClick={() => setProfileType('professional')}
              />
            </div>
          </div>
          
          <div className="mb-8">
            <label className="label text-lg mb-3">
              What is your current skill level in AI/ML?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SkillLevelCard
                level="beginner"
                title="Beginner"
                description="New to AI/ML concepts and programming"
                selected={skillLevel === 'beginner'}
                onClick={() => setSkillLevel('beginner')}
              />
              <SkillLevelCard
                level="intermediate"
                title="Intermediate"
                description="Familiar with basics and some practical experience"
                selected={skillLevel === 'intermediate'}
                onClick={() => setSkillLevel('intermediate')}
              />
              <SkillLevelCard
                level="advanced"
                title="Advanced"
                description="Strong understanding and significant project experience"
                selected={skillLevel === 'advanced'}
                onClick={() => setSkillLevel('advanced')}
              />
            </div>
          </div>
          
          <div className="mb-8">
            <label className="label text-lg mb-3">
              What are your immediate goals?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GoalCard
                goal="learn_fundamentals"
                title="Learn Fundamentals"
                description="Build a strong foundation in AI/ML concepts"
                selected={immediateGoals === 'learn_fundamentals'}
                onClick={() => setImmediateGoals('learn_fundamentals')}
              />
              <GoalCard
                goal="build_portfolio"
                title="Build Portfolio"
                description="Create projects to showcase skills to employers"
                selected={immediateGoals === 'build_portfolio'}
                onClick={() => setImmediateGoals('build_portfolio')}
              />
              <GoalCard
                goal="prepare_interviews"
                title="Prepare for Interviews"
                description="Get ready for technical interviews in AI/ML roles"
                selected={immediateGoals === 'prepare_interviews'}
                onClick={() => setImmediateGoals('prepare_interviews')}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-10">
            <button
              type="submit"
              disabled={!profileType || !skillLevel || !immediateGoals || isSubmitting}
              className="btn btn-primary px-8 py-3 text-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Continue to Ikigai Discovery'}
              {!isSubmitting && <span>→</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

// Profile type card component
const ProfileTypeCard = ({ type, title, description, selected, onClick }) => {
  return (
    <div
      className={`border-2 rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${selected 
        ? 'border-primary bg-primary/5 shadow-md' 
        : 'border-gray-200 hover:border-primary/30'}`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-lg text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
};

// Skill level card component
const SkillLevelCard = ({ level, title, description, selected, onClick }) => {
  return (
    <div
      className={`border-2 rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${selected 
        ? 'border-primary bg-primary/5 shadow-md' 
        : 'border-gray-200 hover:border-primary/30'}`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-lg text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
};

// Goal card component
const GoalCard = ({ goal, title, description, selected, onClick }) => {
  return (
    <div
      className={`border-2 rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${selected 
        ? 'border-primary bg-primary/5 shadow-md' 
        : 'border-gray-200 hover:border-primary/30'}`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-lg text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
};

export default WelcomePage;
