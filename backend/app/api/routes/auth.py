from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.models.token import Token
from app.models.user import UserCreate, UserResponse

router = APIRouter()


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_data: UserCreate):
    """Create a new user."""
    # This is a placeholder - will be implemented with Supabase integration
    return {
        "id": "placeholder-id",
        "email": user_data.email,
        "name": user_data.name,
        "skill_level": user_data.skill_level,
        "profile_type": user_data.profile_type
    }


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """OAuth2 compatible token login, get an access token for future requests."""
    # This is a placeholder - will be implemented with Supabase integration
    return {
        "access_token": "placeholder-token",
        "token_type": "bearer"
    }


@router.post("/refresh-token", response_model=Token)
async def refresh_token(token: str):
    """Refresh access token."""
    # This is a placeholder - will be implemented with Supabase integration
    return {
        "access_token": "new-placeholder-token",
        "token_type": "bearer"
    }
