from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any


class ResourceLink(BaseModel):
    title: str
    url: HttpUrl


class Task(BaseModel):
    id: str
    title: str
    description: str
    order: int


class ProjectBase(BaseModel):
    domain: str
    title: str
    description: str
    difficulty: str = Field(..., description="Project difficulty: beginner, intermediate, advanced")
    skills_required: List[str]
    resource_links: List[ResourceLink]
    estimated_hours: Optional[int] = None


class ProjectCreate(ProjectBase):
    tasks: Optional[List[Dict[str, Any]]] = None


class ProjectResponse(ProjectBase):
    id: str
    tasks: List[Task]
    
    class Config:
        orm_mode = True


class DomainResponse(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    color: str
    required_skills: List[str]
    job_titles: List[str]
    
    class Config:
        orm_mode = True
