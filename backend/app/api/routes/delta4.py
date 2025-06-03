from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
import uuid
from datetime import datetime
import json

from app.models.delta4 import Delta4Request, Delta4Analysis
from app.db.supabase import get_supabase_client
from app.api.deps import get_current_user
from app.services.ai_services import analyze_delta4

router = APIRouter()

@router.post("/analyze", response_model=Delta4Analysis)
async def create_delta4_analysis(
    request: Delta4Request,
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Analyze a project using the Delta 4 framework and save the results.
    """
    supabase = get_supabase_client()
    user_id = current_user["id"]
    
    try:
        # Call AI service to perform analysis
        analysis = analyze_delta4(
            request.project_description,
            request.current_status,
            request.challenges,
            request.goals
        )
        
        # Save analysis to database
        analysis_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        analysis_data = {
            "id": analysis_id,
            "user_id": user_id,
            "project_id": project_id,
            "project_description": request.project_description,
            "current_status": request.current_status,
            "challenges": request.challenges,
            "goals": request.goals,
            "analysis": json.dumps(analysis),
            "created_at": now
        }
        
        response = supabase.table("delta4_analysis").insert(analysis_data).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to save Delta 4 analysis")
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error performing Delta 4 analysis: {str(e)}")

@router.get("/project/{project_id}", response_model=List[Delta4Analysis])
async def get_project_analyses(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get all Delta 4 analyses for a specific project.
    """
    supabase = get_supabase_client()
    user_id = current_user["id"]
    
    try:
        response = supabase.table("delta4_analysis").select("*").eq("project_id", project_id).eq("user_id", user_id).order("created_at", desc=True).execute()
        analyses = []
        
        for item in response.data:
            analysis = json.loads(item["analysis"])
            analyses.append(analysis)
        
        return analyses
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving Delta 4 analyses: {str(e)}")

@router.get("/{analysis_id}", response_model=Delta4Analysis)
async def get_analysis(
    analysis_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific Delta 4 analysis by ID.
    """
    supabase = get_supabase_client()
    user_id = current_user["id"]
    
    try:
        response = supabase.table("delta4_analysis").select("*").eq("id", analysis_id).eq("user_id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        analysis = json.loads(response.data[0]["analysis"])
        return analysis
    except Exception as e:
        if "not found" not in str(e):
            raise HTTPException(status_code=500, detail=f"Error retrieving Delta 4 analysis: {str(e)}")
        else:
            raise e

@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_analysis(
    analysis_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a Delta 4 analysis.
    """
    supabase = get_supabase_client()
    user_id = current_user["id"]
    
    # Check if analysis exists and belongs to user
    try:
        check_response = supabase.table("delta4_analysis").select("*").eq("id", analysis_id).eq("user_id", user_id).execute()
        if not check_response.data:
            raise HTTPException(status_code=404, detail="Analysis not found")
    except Exception as e:
        if "not found" not in str(e):
            raise HTTPException(status_code=500, detail=f"Error checking analysis: {str(e)}")
        else:
            raise e
    
    try:
        supabase.table("delta4_analysis").delete().eq("id", analysis_id).execute()
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting analysis: {str(e)}")
