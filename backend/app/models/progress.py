from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProgressBase(BaseModel):
    user_id: str
    project_id: str
    task_id: str
    percent_complete: int = Field(..., ge=0, le=100, description="Percentage of task completion")
    notes: Optional[str] = None


class ProgressUpdate(ProgressBase):
    pass


class ProgressResponse(ProgressBase):
    id: str
    updated_at: datetime
    
    class Config:
        orm_mode = True


class SocialPostBase(BaseModel):
    user_id: str
    project_id: str
    content: str
    platform: str = Field(..., description="Social media platform: twitter, linkedin, etc.")


class SocialPostCreate(SocialPostBase):
    pass


class SocialPostResponse(SocialPostBase):
    id: str
    created_at: datetime
    
    class Config:
        orm_mode = True
