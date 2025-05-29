from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field

class MilestoneBase(BaseModel):
    title: str
    description: str
    due_date: date
    status: str = Field(default="not_started")  # not_started, in_progress, completed, delayed, at_risk

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None
    status: Optional[str] = None

class MilestoneInDB(MilestoneBase):
    id: str
    user_id: str
    project_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

class MilestoneResponse(MilestoneBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
