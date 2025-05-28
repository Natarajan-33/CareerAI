import os
from typing import Optional

from supabase import create_client, Client

from app.core.config import settings


class SupabaseClient:
    _instance: Optional[Client] = None
    
    @classmethod
    def get_client(cls) -> Client:
        """Get or create a Supabase client instance."""
        if cls._instance is None:
            if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
                raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")
            
            cls._instance = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        
        return cls._instance


def get_supabase() -> Client:
    """Dependency for FastAPI to get Supabase client."""
    return SupabaseClient.get_client()
