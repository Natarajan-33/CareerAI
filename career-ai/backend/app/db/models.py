from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date

# User models
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserProfile(UserBase):
    id: str
    profile_type: Optional[str] = None  # beginner, intermediate, expert
    skill_level: Optional[str] = None
    immediate_goals: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

# Ikigai models
class IkigaiBase(BaseModel):
    user_id: str
    passion: str
    strengths: str
    ai_suggestion: str
    final_domain: str

class Ikigai(IkigaiBase):
    id: str
    created_at: datetime
    updated_at: datetime

class IkigaiCreate(IkigaiBase):
    pass

class ConversationMessage(BaseModel):
    role: str  # system, user, assistant
    content: str
    timestamp: datetime = Field(default_factory=datetime.now)

class IkigaiConversation(BaseModel):
    id: str
    user_id: str
    ikigai_id: Optional[str] = None
    conversation_data: List[Dict[str, Any]]
    insights_extracted: Dict[str, Any]
    started_at: datetime
    last_message_at: datetime
    completed: bool = False

# Project models
class ProjectBase(BaseModel):
    user_id: str
    domain: str
    title: str
    description: str
    difficulty: str
    skills: List[str]
    resources: Optional[List[Dict[str, str]]] = None

class Project(ProjectBase):
    id: str
    selected_at: datetime
    status: str  # not_started, in_progress, completed

class ProjectCreate(ProjectBase):
    pass

# Progress models
class ProgressEntryBase(BaseModel):
    user_id: str
    project_id: str
    date: date = Field(default_factory=date.today)
    hours_spent: float
    tasks_completed: List[str]
    challenges: Optional[str] = None
    learnings: Optional[str] = None
    next_steps: Optional[str] = None

class ProgressEntry(ProgressEntryBase):
    id: str

class ProgressEntryCreate(ProgressEntryBase):
    pass

# Milestone models
class MilestoneBase(BaseModel):
    user_id: str
    project_id: str
    title: str
    description: Optional[str] = None
    status: str = "not_started"  # not_started, in_progress, completed
    due_date: Optional[date] = None

class Milestone(MilestoneBase):
    id: str
    completed_at: Optional[datetime] = None

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneUpdate(BaseModel):
    status: str

# Social media post models
class PostBase(BaseModel):
    user_id: str
    project_id: str
    content: str
    platform: str
    scheduled_for: Optional[datetime] = None

class Post(PostBase):
    id: str
    posted_at: Optional[datetime] = None
    engagement_metrics: Optional[Dict[str, Any]] = None

class PostCreate(PostBase):
    pass

# Challenge models
class ChallengeBase(BaseModel):
    title: str
    description: str
    points: int
    start_date: date
    end_date: date
    type: str  # daily, weekly, monthly

class Challenge(ChallengeBase):
    id: str

class ChallengeCreate(ChallengeBase):
    pass

class UserChallengeBase(BaseModel):
    user_id: str
    challenge_id: str
    status: str  # not_started, in_progress, completed

class UserChallenge(UserChallengeBase):
    id: str
    completed_at: Optional[datetime] = None
    points_earned: int = 0

class UserChallengeCreate(UserChallengeBase):
    pass
