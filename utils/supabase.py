import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

# Initialize Supabase client
def get_supabase_client():
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        raise ValueError("Supabase URL and key must be set as environment variables")
    
    return create_client(supabase_url, supabase_key)

# User authentication functions
def register_user(email, password):
    supabase = get_supabase_client()
    return supabase.auth.sign_up({"email": email, "password": password})

def login_user(email, password):
    supabase = get_supabase_client()
    return supabase.auth.sign_in_with_password({"email": email, "password": password})

def logout_user():
    supabase = get_supabase_client()
    return supabase.auth.sign_out()

# Database operations
def save_user_profile(user_id, profile_data):
    supabase = get_supabase_client()
    return supabase.table("user_profiles").upsert(
        {"user_id": user_id, **profile_data}
    ).execute()

def save_ikigai_data(user_id, ikigai_data):
    supabase = get_supabase_client()
    return supabase.table("ikigai_logs").insert(
        {"user_id": user_id, **ikigai_data}
    ).execute()

def save_project_selection(user_id, project_data):
    supabase = get_supabase_client()
    return supabase.table("projects").insert(
        {"user_id": user_id, **project_data}
    ).execute()

def save_progress(user_id, project_id, progress_data):
    supabase = get_supabase_client()
    return supabase.table("progress_entries").insert(
        {"user_id": user_id, "project_id": project_id, **progress_data}
    ).execute()

def get_user_projects(user_id):
    supabase = get_supabase_client()
    return supabase.table("projects").select("*").eq("user_id", user_id).execute()

def get_user_progress(user_id, project_id):
    supabase = get_supabase_client()
    return supabase.table("progress_entries").select("*").eq("user_id", user_id).eq("project_id", project_id).execute()

# Milestone tracking functions
def save_project_milestone(user_id, project_id, milestone_data):
    """
    Save a project milestone to the database.
    
    Args:
        user_id (str): The user ID
        project_id (str): The project ID
        milestone_data (dict): Milestone data including title, description, due_date, status
    
    Returns:
        Response: Supabase response
    """
    supabase = get_supabase_client()
    return supabase.table("project_milestones").insert(
        {"user_id": user_id, "project_id": project_id, **milestone_data}
    ).execute()

def update_milestone_status(milestone_id, status):
    """
    Update the status of a milestone.
    
    Args:
        milestone_id (str): The milestone ID
        status (str): The new status (e.g., "not_started", "in_progress", "completed")
    
    Returns:
        Response: Supabase response
    """
    supabase = get_supabase_client()
    return supabase.table("project_milestones").update(
        {"status": status, "updated_at": "now()"}
    ).eq("id", milestone_id).execute()

def get_project_milestones(user_id, project_id=None):
    """
    Get all milestones for a user, optionally filtered by project.
    
    Args:
        user_id (str): The user ID
        project_id (str, optional): The project ID to filter by
    
    Returns:
        Response: Supabase response containing milestones
    """
    supabase = get_supabase_client()
    query = supabase.table("project_milestones").select("*").eq("user_id", user_id)
    
    if project_id:
        query = query.eq("project_id", project_id)
    
    return query.order("due_date").execute() 