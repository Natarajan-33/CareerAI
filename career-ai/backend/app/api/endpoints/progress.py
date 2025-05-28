from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, date

# Import services
from app.db.supabase import get_supabase_client
from app.services.ai_services import generate_social_media_post, generate_daily_post

# Create router
router = APIRouter()

# Models
class ProgressEntry(BaseModel):
    user_id: str
    project_id: str
    date: date = date.today()
    hours_spent: float
    tasks_completed: List[str]
    challenges: Optional[str] = None
    learnings: Optional[str] = None
    next_steps: Optional[str] = None

class Milestone(BaseModel):
    user_id: str
    project_id: str
    title: str
    description: Optional[str] = None
    status: str = "not_started"  # not_started, in_progress, completed
    due_date: Optional[date] = None
    completed_at: Optional[datetime] = None

class SocialPost(BaseModel):
    user_id: str
    project_id: str
    content: str
    platform: str
    scheduled_for: Optional[datetime] = None

class DailyPost(BaseModel):
    user_id: str
    project_id: str
    day_number: int
    goals_for_today: str
    learnings: str
    target_firms: Optional[List[str]] = None

# Progress tracking endpoints
@router.post("/entry")
async def create_progress_entry(entry: ProgressEntry):
    """Create a new progress entry"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("progress_entries").insert({
            "user_id": entry.user_id,
            "project_id": entry.project_id,
            "date": entry.date.isoformat(),
            "hours_spent": entry.hours_spent,
            "tasks_completed": entry.tasks_completed,
            "challenges": entry.challenges,
            "learnings": entry.learnings,
            "next_steps": entry.next_steps
        }).execute()
        
        return {"message": "Progress entry created successfully", "id": result.data[0]["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating progress entry: {str(e)}"
        )

@router.get("/entries/{user_id}/{project_id}")
async def get_progress_entries(user_id: str, project_id: str):
    """Get all progress entries for a project"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("progress_entries").select("*").eq("user_id", user_id).eq("project_id", project_id).order("date").execute()
        
        return result.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving progress entries: {str(e)}"
        )

# Milestone endpoints
@router.post("/milestone")
async def create_milestone(milestone: Milestone):
    """Create a new project milestone"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("project_milestones").insert({
            "user_id": milestone.user_id,
            "project_id": milestone.project_id,
            "title": milestone.title,
            "description": milestone.description,
            "status": milestone.status,
            "due_date": milestone.due_date.isoformat() if milestone.due_date else None,
            "completed_at": milestone.completed_at.isoformat() if milestone.completed_at else None
        }).execute()
        
        return {"message": "Milestone created successfully", "id": result.data[0]["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating milestone: {str(e)}"
        )

@router.put("/milestone/{milestone_id}")
async def update_milestone_status(milestone_id: str, status: str):
    """Update the status of a milestone"""
    try:
        supabase = get_supabase_client()
        
        # Check if status is valid
        valid_statuses = ["not_started", "in_progress", "completed"]
        if status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        # Update milestone
        update_data = {"status": status}
        if status == "completed":
            update_data["completed_at"] = datetime.now().isoformat()
        
        result = supabase.table("project_milestones").update(update_data).eq("id", milestone_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Milestone not found")
        
        return {"message": "Milestone updated successfully", "milestone": result.data[0]}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating milestone: {str(e)}"
        )

@router.get("/milestones/{user_id}/{project_id}")
async def get_milestones(user_id: str, project_id: str):
    """Get all milestones for a project"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("project_milestones").select("*").eq("user_id", user_id).eq("project_id", project_id).order("due_date").execute()
        
        return result.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving milestones: {str(e)}"
        )

# Social media post generation endpoints
@router.post("/social-post")
async def generate_social_post(project_title: str, domain: str, tasks_completed: str, progress_percentage: int):
    """Generate a social media post for project progress"""
    try:
        post_content = generate_social_media_post(project_title, domain, tasks_completed, progress_percentage)
        return {"post_content": post_content}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating social media post: {str(e)}"
        )

@router.post("/daily-post")
async def create_daily_post(post_request: DailyPost):
    """Generate a daily build-in-public post"""
    try:
        post_content = generate_daily_post(
            post_request.project_id,
            post_request.day_number,
            post_request.goals_for_today,
            post_request.learnings,
            post_request.target_firms
        )
        
        # Save post to database if needed
        # This would be implemented in a real system
        
        return {"post_content": post_content}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating daily post: {str(e)}"
        )
