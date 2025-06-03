from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

from app.models.friction_point import (
    FrictionPointCreate,
    FrictionPointUpdate,
    FrictionPointResponse,
    Delta4AnalysisCreate,
    Delta4Analysis
)
from app.services.ai_service import AIService
from app.api.deps import get_supabase_client, get_ai_service

router = APIRouter()


@router.post("/friction-points", response_model=FrictionPointResponse)
async def create_friction_point(
    friction_point: FrictionPointCreate,
    project_id: str = Query(...),
    user_id: str = Query(...),
    supabase=Depends(get_supabase_client)
):
    """Create a new friction or delight point"""
    friction_point_id = str(uuid4())
    now = datetime.now().isoformat()
    
    friction_point_data = {
        "id": friction_point_id,
        "user_id": user_id,
        "project_id": project_id,
        "task_id": friction_point.task_id,
        "dimension": friction_point.dimension,
        "point_type": friction_point.point_type,
        "description": friction_point.description,
        "impact_level": friction_point.impact_level,
        "recommendations": friction_point.recommendations,
        "created_at": now,
        "updated_at": now
    }
    
    try:
        response = supabase.table("friction_points").insert(friction_point_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create friction point: {str(e)}")


@router.get("/friction-points/{friction_point_id}", response_model=FrictionPointResponse)
async def get_friction_point(
    friction_point_id: str,
    supabase=Depends(get_supabase_client)
):
    """Get a specific friction point by ID"""
    try:
        response = supabase.table("friction_points").select("*").eq("id", friction_point_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Friction point not found")
        return response.data[0]
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to get friction point: {str(e)}")


@router.get("/friction-points/project/{project_id}", response_model=List[FrictionPointResponse])
async def get_project_friction_points(
    project_id: str,
    dimension: Optional[str] = None,
    point_type: Optional[str] = None,
    supabase=Depends(get_supabase_client)
):
    """Get all friction points for a specific project"""
    try:
        query = supabase.table("friction_points").select("*").eq("project_id", project_id)
        
        if dimension:
            query = query.eq("dimension", dimension)
        if point_type:
            query = query.eq("point_type", point_type)
            
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get project friction points: {str(e)}")


@router.patch("/friction-points/{friction_point_id}", response_model=FrictionPointResponse)
async def update_friction_point(
    friction_point_id: str,
    friction_point: FrictionPointUpdate,
    supabase=Depends(get_supabase_client)
):
    """Update a friction point"""
    try:
        # Check if friction point exists
        check_response = supabase.table("friction_points").select("id").eq("id", friction_point_id).execute()
        if not check_response.data:
            raise HTTPException(status_code=404, detail="Friction point not found")
        
        # Prepare update data
        update_data = friction_point.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.now().isoformat()
        
        # Update friction point
        response = supabase.table("friction_points").update(update_data).eq("id", friction_point_id).execute()
        return response.data[0]
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to update friction point: {str(e)}")


@router.delete("/friction-points/{friction_point_id}", status_code=204)
async def delete_friction_point(
    friction_point_id: str,
    supabase=Depends(get_supabase_client)
):
    """Delete a friction point"""
    try:
        # Check if friction point exists
        check_response = supabase.table("friction_points").select("id").eq("id", friction_point_id).execute()
        if not check_response.data:
            raise HTTPException(status_code=404, detail="Friction point not found")
        
        # Delete friction point
        supabase.table("friction_points").delete().eq("id", friction_point_id).execute()
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to delete friction point: {str(e)}")


@router.post("/analyze-delta4", response_model=Delta4Analysis)
async def analyze_project_delta4(
    analysis_request: Delta4AnalysisCreate,
    user_id: str = Query(...),
    ai_service: AIService = Depends(get_ai_service)
):
    """Analyze a project using the Delta 4 framework"""
    try:
        # Generate analysis using AI service
        analysis = await ai_service.generate_delta4_analysis(
            analysis_request.project_description,
            analysis_request.current_status,
            analysis_request.challenges,
            analysis_request.goals
        )
        
        # Create response
        response = Delta4Analysis(
            project_id=analysis_request.project_id,
            summary=analysis.get("summary", "Analysis complete."),
            technical=analysis.get("technical", {}),
            cultural=analysis.get("cultural", {}),
            process=analysis.get("process", {}),
            expectation=analysis.get("expectation", {})
        )
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze project: {str(e)}")
