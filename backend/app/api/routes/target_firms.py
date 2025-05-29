from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
import uuid
from datetime import datetime
import json

from app.models.company import CompanyBase, CompanyResponse
from app.db.supabase import get_supabase_client
from app.api.deps import get_current_user
from app.services.ai_services import get_company_insights

router = APIRouter()

@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def add_target_firm(
    company: CompanyBase,
    domain: Optional[str] = None,
    skills: Optional[List[str]] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Add a new target firm for the user.
    """
    supabase = get_supabase_client()
    user_id = current_user["id"]
    
    # Check if company already exists for this user
    try:
        check_response = supabase.table("target_firms").select("*").eq("user_id", user_id).eq("company_name", company.name).execute()
        if check_response.data:
            raise HTTPException(status_code=400, detail="This company is already in your target firms list")
    except Exception as e:
        if "already in your target firms" not in str(e):
            raise HTTPException(status_code=500, detail=f"Error checking target firm: {str(e)}")
        else:
            raise e
    
    company_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    company_data = {
        "id": company_id,
        "user_id": user_id,
        "company_name": company.name,
        "domain": domain,
        "skills": json.dumps(skills) if skills else None,
        "created_at": now,
        "updated_at": now
    }
    
    try:
        response = supabase.table("target_firms").insert(company_data).execute()
        if response.data:
            return {"id": company_id, "name": company.name, "insights": None}
        else:
            raise HTTPException(status_code=500, detail="Failed to add target firm")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding target firm: {str(e)}")

@router.get("/", response_model=List[CompanyResponse])
async def get_target_firms(
    current_user: dict = Depends(get_current_user)
):
    """
    Get all target firms for the user.
    """
    supabase = get_supabase_client()
    user_id = current_user["id"]
    
    try:
        response = supabase.table("target_firms").select("*").eq("user_id", user_id).execute()
        firms = response.data
        
        # Format response
        result = []
        for firm in firms:
            result.append({
                "id": firm["id"],
                "name": firm["company_name"],
                "insights": None
            })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving target firms: {str(e)}")

@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_target_firm(
    company_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a target firm.
    """
    supabase = get_supabase_client()
    user_id = current_user["id"]
    
    # Check if company exists and belongs to user
    try:
        check_response = supabase.table("target_firms").select("*").eq("id", company_id).eq("user_id", user_id).execute()
        if not check_response.data:
            raise HTTPException(status_code=404, detail="Target firm not found")
    except Exception as e:
        if "not found" not in str(e):
            raise HTTPException(status_code=500, detail=f"Error checking target firm: {str(e)}")
        else:
            raise e
    
    try:
        supabase.table("target_firms").delete().eq("id", company_id).execute()
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting target firm: {str(e)}")

@router.get("/{company_id}/insights", response_model=CompanyResponse)
async def get_company_insights_endpoint(
    company_id: str,
    refresh: bool = False,
    current_user: dict = Depends(get_current_user)
):
    """
    Get insights for a target company. If refresh is True, fetch new insights from the AI service.
    """
    supabase = get_supabase_client()
    user_id = current_user["id"]
    
    # Get company details
    try:
        company_response = supabase.table("target_firms").select("*").eq("id", company_id).eq("user_id", user_id).execute()
        if not company_response.data:
            raise HTTPException(status_code=404, detail="Target firm not found")
        
        company_data = company_response.data[0]
        company_name = company_data["company_name"]
        domain = company_data.get("domain")
        skills = json.loads(company_data["skills"]) if company_data.get("skills") else None
    except Exception as e:
        if "not found" not in str(e):
            raise HTTPException(status_code=500, detail=f"Error retrieving target firm: {str(e)}")
        else:
            raise e
    
    # Check if we have cached insights and refresh is False
    if not refresh:
        try:
            insights_response = supabase.table("company_insights").select("*").eq("user_id", user_id).eq("company_name", company_name).execute()
            if insights_response.data:
                insights = insights_response.data[0]["insights"]
                return {"id": company_id, "name": company_name, "insights": insights}
        except Exception as e:
            # If there's an error retrieving cached insights, continue to fetch new ones
            pass
    
    # Fetch new insights from AI service
    try:
        insights = get_company_insights(company_name, domain, skills)
        
        # Save insights to database
        insight_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        insight_data = {
            "id": insight_id,
            "user_id": user_id,
            "company_name": company_name,
            "insights": json.dumps(insights),
            "created_at": now,
            "updated_at": now
        }
        
        # Check if insights exist for this company
        check_response = supabase.table("company_insights").select("*").eq("user_id", user_id).eq("company_name", company_name).execute()
        
        if check_response.data:
            # Update existing insights
            supabase.table("company_insights").update({"insights": json.dumps(insights), "updated_at": now}).eq("id", check_response.data[0]["id"]).execute()
        else:
            # Insert new insights
            supabase.table("company_insights").insert(insight_data).execute()
        
        return {"id": company_id, "name": company_name, "insights": insights}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving company insights: {str(e)}")
