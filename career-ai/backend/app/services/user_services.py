from typing import Dict, Any, Optional, List
from datetime import datetime

# Import Supabase client
from app.db.supabase import get_supabase_client

# User profile services
async def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    """Get user profile data"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("user_profiles").select("*").eq("user_id", user_id).execute()
        
        if result.data:
            return result.data[0]
        return None
    except Exception as e:
        print(f"Error getting user profile: {e}")
        return None

async def save_user_profile(user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Save or update user profile data"""
    try:
        supabase = get_supabase_client()
        
        # Check if profile exists
        existing = await get_user_profile(user_id)
        
        if existing:
            # Update existing profile
            profile_data["updated_at"] = datetime.now().isoformat()
            result = supabase.table("user_profiles").update(profile_data).eq("user_id", user_id).execute()
        else:
            # Create new profile
            profile_data["user_id"] = user_id
            profile_data["created_at"] = datetime.now().isoformat()
            profile_data["updated_at"] = datetime.now().isoformat()
            result = supabase.table("user_profiles").insert(profile_data).execute()
        
        return result.data[0]
    except Exception as e:
        print(f"Error saving user profile: {e}")
        raise e

# Ikigai services
async def get_user_ikigai(user_id: str) -> Optional[Dict[str, Any]]:
    """Get user's Ikigai data"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("ikigai").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(1).execute()
        
        if result.data:
            return result.data[0]
        return None
    except Exception as e:
        print(f"Error getting user ikigai: {e}")
        return None

async def get_user_conversations(user_id: str) -> List[Dict[str, Any]]:
    """Get user's Ikigai conversations"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("ikigai_conversations").select("*").eq("user_id", user_id).order("started_at", desc=True).execute()
        
        return result.data
    except Exception as e:
        print(f"Error getting user conversations: {e}")
        return []

# Project services
async def get_user_projects(user_id: str) -> List[Dict[str, Any]]:
    """Get all projects for a user"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("projects").select("*").eq("user_id", user_id).execute()
        
        return result.data
    except Exception as e:
        print(f"Error getting user projects: {e}")
        return []

async def get_project_details(project_id: str) -> Optional[Dict[str, Any]]:
    """Get details for a specific project"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("projects").select("*").eq("id", project_id).execute()
        
        if result.data:
            return result.data[0]
        return None
    except Exception as e:
        print(f"Error getting project details: {e}")
        return None

# Progress tracking services
async def get_project_progress(project_id: str) -> List[Dict[str, Any]]:
    """Get progress entries for a project"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("progress_entries").select("*").eq("project_id", project_id).order("date").execute()
        
        return result.data
    except Exception as e:
        print(f"Error getting project progress: {e}")
        return []

async def get_project_milestones(project_id: str) -> List[Dict[str, Any]]:
    """Get milestones for a project"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("project_milestones").select("*").eq("project_id", project_id).order("due_date").execute()
        
        return result.data
    except Exception as e:
        print(f"Error getting project milestones: {e}")
        return []

# Challenge services
async def get_available_challenges() -> List[Dict[str, Any]]:
    """Get all available challenges"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("challenges").select("*").execute()
        
        return result.data
    except Exception as e:
        print(f"Error getting available challenges: {e}")
        return []

async def get_user_challenges(user_id: str) -> List[Dict[str, Any]]:
    """Get challenges accepted by a user"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("user_challenges").select("*, challenges(*)").eq("user_id", user_id).execute()
        
        return result.data
    except Exception as e:
        print(f"Error getting user challenges: {e}")
        return []

async def accept_challenge(user_id: str, challenge_id: str) -> Dict[str, Any]:
    """Accept a challenge for a user"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("user_challenges").insert({
            "user_id": user_id,
            "challenge_id": challenge_id,
            "status": "in_progress",
            "points_earned": 0
        }).execute()
        
        return result.data[0]
    except Exception as e:
        print(f"Error accepting challenge: {e}")
        raise e

async def complete_challenge(user_challenge_id: str, points_earned: int) -> Dict[str, Any]:
    """Mark a challenge as completed for a user"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("user_challenges").update({
            "status": "completed",
            "completed_at": datetime.now().isoformat(),
            "points_earned": points_earned
        }).eq("id", user_challenge_id).execute()
        
        return result.data[0]
    except Exception as e:
        print(f"Error completing challenge: {e}")
        raise e
