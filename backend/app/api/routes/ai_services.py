from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional, Dict, Any

from app.models.delta4 import Delta4Request, Delta4Analysis
from app.services.ai_services import (
    generate_domain_suggestion,
    generate_social_media_post,
    generate_daily_post,
    analyze_delta4,
    get_company_insights
)
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/domain-suggestion", response_model=str)
async def get_domain_suggestion(
    passion: str,
    strengths: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate domain suggestions based on user's passion and strengths.
    """
    try:
        suggestion = generate_domain_suggestion(passion, strengths)
        return suggestion
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating domain suggestion: {str(e)}"
        )

@router.post("/social-media-post", response_model=str)
async def get_social_media_post(
    project_title: str,
    domain: str,
    tasks_completed: str,
    progress_percentage: int,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate social media posts for LinkedIn/Twitter based on project progress.
    """
    try:
        post = generate_social_media_post(
            project_title,
            domain,
            tasks_completed,
            progress_percentage
        )
        return post
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating social media post: {str(e)}"
        )

@router.post("/daily-post", response_model=str)
async def get_daily_post(
    project_title: str,
    domain: str,
    day_number: int,
    goals_for_today: str,
    learnings: str,
    target_firms: Optional[List[str]] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate a daily build-in-public post for consistent sharing.
    """
    try:
        post = generate_daily_post(
            project_title,
            domain,
            day_number,
            goals_for_today,
            learnings,
            target_firms
        )
        return post
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating daily post: {str(e)}"
        )

@router.post("/delta4-analysis", response_model=Delta4Analysis)
async def get_delta4_analysis(
    request: Delta4Request,
    current_user: dict = Depends(get_current_user)
):
    """
    Analyze a project using the Delta 4 framework.
    """
    try:
        analysis = analyze_delta4(
            request.project_description,
            request.current_status,
            request.challenges,
            request.goals
        )
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error performing Delta 4 analysis: {str(e)}"
        )

@router.get("/company-insights/{company_name}", response_model=Dict[str, Any])
async def get_insights_for_company(
    company_name: str,
    domain: Optional[str] = None,
    skills: Optional[List[str]] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Get insights for a target company.
    """
    try:
        insights = get_company_insights(
            company_name,
            domain,
            skills
        )
        return insights
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving company insights: {str(e)}"
        )
