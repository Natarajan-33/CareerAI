from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

# Import services
from app.db.supabase import get_supabase_client

# Create router
router = APIRouter()

# Models
class Project(BaseModel):
    id: Optional[str] = None
    user_id: str
    domain: str
    title: str
    description: str
    difficulty: str
    skills: List[str]
    resources: Optional[List[Dict[str, str]]] = None
    selected_at: Optional[datetime] = None
    status: str = "not_started"

class ProjectResponse(BaseModel):
    id: str
    user_id: str
    domain: str
    title: str
    description: str
    difficulty: str
    skills: List[str]
    resources: Optional[List[Dict[str, str]]] = None
    selected_at: datetime
    status: str

# Project endpoints
@router.get("/", response_model=List[ProjectResponse])
async def get_projects(user_id: str):
    """Get all projects for a user"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("projects").select("*").eq("user_id", user_id).execute()
        
        return result.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving projects: {str(e)}"
        )

@router.post("/", response_model=ProjectResponse)
async def create_project(project: Project):
    """Create a new project for a user"""
    try:
        supabase = get_supabase_client()
        
        # Set selected_at to current time
        if not project.selected_at:
            project.selected_at = datetime.now()
        
        # Insert project into database
        result = supabase.table("projects").insert({
            "user_id": project.user_id,
            "domain": project.domain,
            "title": project.title,
            "description": project.description,
            "difficulty": project.difficulty,
            "skills": project.skills,
            "resources": project.resources,
            "selected_at": project.selected_at.isoformat() if project.selected_at else datetime.now().isoformat(),
            "status": project.status
        }).execute()
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating project: {str(e)}"
        )

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str):
    """Get a specific project"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("projects").select("*").eq("id", project_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return result.data[0]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving project: {str(e)}"
        )

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: str, project: Project):
    """Update a project"""
    try:
        supabase = get_supabase_client()
        
        # Check if project exists
        existing = supabase.table("projects").select("*").eq("id", project_id).execute()
        
        if not existing.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Update project
        result = supabase.table("projects").update({
            "domain": project.domain,
            "title": project.title,
            "description": project.description,
            "difficulty": project.difficulty,
            "skills": project.skills,
            "resources": project.resources,
            "status": project.status
        }).eq("id", project_id).execute()
        
        return result.data[0]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating project: {str(e)}"
        )

@router.get("/suggestions/{domain}")
async def get_project_suggestions(domain: str):
    """Get project suggestions for a domain"""
    try:
        # This would be implemented with a more sophisticated system in production
        # For now, return some placeholder suggestions
        suggestions = [
            {
                "title": "Sentiment Analysis for Product Reviews",
                "description": "Build a sentiment analysis model to analyze product reviews and extract insights.",
                "difficulty": "intermediate",
                "skills": ["NLP", "Python", "Machine Learning"],
                "resources": [
                    {"type": "tutorial", "url": "https://example.com/sentiment-tutorial"},
                    {"type": "dataset", "url": "https://example.com/reviews-dataset"}
                ]
            },
            {
                "title": "Object Detection for Retail Analytics",
                "description": "Create an object detection system for retail shelf analytics.",
                "difficulty": "advanced",
                "skills": ["Computer Vision", "Deep Learning", "Python"],
                "resources": [
                    {"type": "tutorial", "url": "https://example.com/cv-tutorial"},
                    {"type": "framework", "url": "https://example.com/cv-framework"}
                ]
            },
            {
                "title": "Recommendation System for E-commerce",
                "description": "Build a recommendation system for an e-commerce platform.",
                "difficulty": "intermediate",
                "skills": ["Recommender Systems", "Python", "Machine Learning"],
                "resources": [
                    {"type": "tutorial", "url": "https://example.com/recsys-tutorial"},
                    {"type": "dataset", "url": "https://example.com/ecommerce-dataset"}
                ]
            }
        ]
        
        # Filter by domain if needed
        if domain.lower() == "nlp":
            return [s for s in suggestions if "NLP" in s["skills"]]
        elif domain.lower() == "computer vision":
            return [s for s in suggestions if "Computer Vision" in s["skills"]]
        elif domain.lower() == "recommender systems":
            return [s for s in suggestions if "Recommender Systems" in s["skills"]]
        else:
            return suggestions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting project suggestions: {str(e)}"
        )
