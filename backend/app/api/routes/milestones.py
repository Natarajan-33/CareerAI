from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import uuid
from datetime import datetime

from app.models.milestone import MilestoneCreate, MilestoneResponse, MilestoneUpdate
from app.db.supabase import get_supabase as get_supabase_client
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=MilestoneResponse, status_code=status.HTTP_201_CREATED)
async def create_milestone(
    milestone: MilestoneCreate,
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new project milestone.
    """
    supabase = get_supabase_client()
    user_id = current_user["id"]
    
    milestone_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    milestone_data = {
        "id": milestone_id,
        "user_id": user_id,
        "project_id": project_id,
        "title": milestone.title,
        "description": milestone.description,
        "due_date": milestone.due_date.isoformat(),
        "status": milestone.status,
        "created_at": now,
        "updated_at": now
    }
    
    try:
        response = supabase.table("project_milestones").insert(milestone_data).execute()
        if response.data:
            return {**milestone_data, "due_date": milestone.due_date, "created_at": datetime.fromisoformat(now), "updated_at": datetime.fromisoformat(now)}
        else:
            raise HTTPException(status_code=500, detail="Failed to create milestone")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating milestone: {str(e)}")

@router.get("/{milestone_id}", response_model=MilestoneResponse)
async def get_milestone(
    milestone_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific milestone by ID.
    """
    supabase = get_supabase_client()
    user_id = current_user["id"]
    
    try:
        response = supabase.table("project_milestones").select("*").eq("id", milestone_id).eq("user_id", user_id).execute()
        if response.data:
            milestone = response.data[0]
            # Convert string dates to datetime objects
            milestone["created_at"] = datetime.fromisoformat(milestone["created_at"].replace("Z", ""))
            if milestone["updated_at"]:
                milestone["updated_at"] = datetime.fromisoformat(milestone["updated_at"].replace("Z", ""))
            milestone["due_date"] = datetime.fromisoformat(milestone["due_date"]).date()
            return milestone
        else:
            raise HTTPException(status_code=404, detail="Milestone not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving milestone: {str(e)}")

@router.get("/project/{project_id}", response_model=List[MilestoneResponse])
async def get_project_milestones(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get all milestones for a specific project.
    """
    supabase = get_supabase_client()
    user_id = current_user["id"]
    
    try:
        response = supabase.table("project_milestones").select("*").eq("project_id", project_id).eq("user_id", user_id).order("due_date").execute()
        milestones = response.data
        
        # Convert string dates to datetime objects
        for milestone in milestones:
            milestone["created_at"] = datetime.fromisoformat(milestone["created_at"].replace("Z", ""))
            if milestone["updated_at"]:
                milestone["updated_at"] = datetime.fromisoformat(milestone["updated_at"].replace("Z", ""))
            milestone["due_date"] = datetime.fromisoformat(milestone["due_date"]).date()
        
        return milestones
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving milestones: {str(e)}")

@router.patch("/{milestone_id}", response_model=MilestoneResponse)
async def update_milestone(
    milestone_id: str,
    milestone_update: MilestoneUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update a milestone.
    """
    supabase = get_supabase_client()
    user_id = current_user["id"]
    
    # Check if milestone exists and belongs to user
    try:
        check_response = supabase.table("project_milestones").select("*").eq("id", milestone_id).eq("user_id", user_id).execute()
        if not check_response.data:
            raise HTTPException(status_code=404, detail="Milestone not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking milestone: {str(e)}")
    
    # Prepare update data
    update_data = milestone_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow().isoformat()
    
    # Convert date to string if present
    if "due_date" in update_data and update_data["due_date"]:
        update_data["due_date"] = update_data["due_date"].isoformat()
    
    try:
        response = supabase.table("project_milestones").update(update_data).eq("id", milestone_id).execute()
        updated_milestone = response.data[0]
        
        # Convert string dates to datetime objects
        updated_milestone["created_at"] = datetime.fromisoformat(updated_milestone["created_at"].replace("Z", ""))
        if updated_milestone["updated_at"]:
            updated_milestone["updated_at"] = datetime.fromisoformat(updated_milestone["updated_at"].replace("Z", ""))
        updated_milestone["due_date"] = datetime.fromisoformat(updated_milestone["due_date"]).date()
        
        return updated_milestone
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating milestone: {str(e)}")

@router.delete("/{milestone_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_milestone(
    milestone_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a milestone.
    """
    supabase = get_supabase_client()
    user_id = current_user["id"]
    
    # Check if milestone exists and belongs to user
    try:
        check_response = supabase.table("project_milestones").select("*").eq("id", milestone_id).eq("user_id", user_id).execute()
        if not check_response.data:
            raise HTTPException(status_code=404, detail="Milestone not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking milestone: {str(e)}")
    
    try:
        supabase.table("project_milestones").delete().eq("id", milestone_id).execute()
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting milestone: {str(e)}")
