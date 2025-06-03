from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Dict, Any, Optional
import logging
import uuid
import jwt
import time
from datetime import datetime, timedelta

from app.db.supabase import get_supabase_client
from app.models.token import Token
from app.models.user import UserCreate, UserResponse, UserInDB
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_data: UserCreate):
    """Create a new user in Supabase."""
    try:
        supabase = get_supabase_client()
        
        # Create user in Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "name": user_data.name,
                    "skill_level": user_data.skill_level,
                    "profile_type": user_data.profile_type
                }
            }
        })
        
        if auth_response.error:
            logger.error(f"Supabase signup error: {auth_response.error}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=auth_response.error.message
            )
        
        user = auth_response.data.user
        
        return {
            "id": user.id,
            "email": user.email,
            "name": user_data.name,
            "skill_level": user_data.skill_level,
            "profile_type": user_data.profile_type
        }
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """OAuth2 compatible token login, get an access token for future requests."""
    try:
        supabase = get_supabase_client()
        
        # Sign in with Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": form_data.username,  # OAuth2 form uses 'username' field
            "password": form_data.password
        })
        
        if auth_response.error:
            logger.error(f"Supabase login error: {auth_response.error}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Return the access token
        return {
            "access_token": auth_response.data.session.access_token,
            "token_type": "bearer"
        }
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login error: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user(token: str):
    """Get current user profile."""
    try:
        supabase = get_supabase_client()
        
        # Verify token and get user
        auth_response = supabase.auth.get_user(token)
        
        if auth_response.error:
            logger.error(f"Error getting user: {auth_response.error}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user = auth_response.data.user
        user_metadata = user.user_metadata or {}
        
        return {
            "id": user.id,
            "email": user.email,
            "name": user_metadata.get("name", "User"),
            "skill_level": user_metadata.get("skill_level", "beginner"),
            "profile_type": user_metadata.get("profile_type", "professional")
        }
    except Exception as e:
        logger.error(f"Error getting current user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting user profile: {str(e)}"
        )