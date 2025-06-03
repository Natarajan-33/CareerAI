from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class FrictionPointBase(BaseModel):
    project_id: str
    task_id: Optional[str] = None
    dimension: str = Field(..., description="One of: technical, cultural, process, expectation")
    point_type: str = Field(..., description="One of: friction, delight")
    description: str
    impact_level: int = Field(..., ge=1, le=5, description="Impact level from 1-5")
    recommendations: Optional[List[str]] = None


class FrictionPointCreate(FrictionPointBase):
    pass


class FrictionPointUpdate(BaseModel):
    dimension: Optional[str] = None
    point_type: Optional[str] = None
    description: Optional[str] = None
    impact_level: Optional[int] = None
    recommendations: Optional[List[str]] = None


class FrictionPointInDB(FrictionPointBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None


class FrictionPointResponse(FrictionPointBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None


class Delta4Analysis(BaseModel):
    project_id: str
    summary: str
    technical: dict
    cultural: dict
    process: dict
    expectation: dict
    created_at: datetime = Field(default_factory=datetime.now)


class Delta4AnalysisCreate(BaseModel):
    project_id: str
    project_description: str
    current_status: str
    challenges: str
    goals: str
