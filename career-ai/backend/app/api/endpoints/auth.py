from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

# Import Supabase client
from app.db.supabase import get_supabase_client

# Create router
router = APIRouter()

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class User(BaseModel):
    email: str
    id: str

class UserCreate(BaseModel):
    email: str
    password: str

# Authentication endpoints
@router.post("/signup", response_model=Token)
async def signup(user: UserCreate):
    """Register a new user"""
    try:
        supabase = get_supabase_client()
        response = supabase.auth.sign_up({"email": user.email, "password": user.password})
        
        # Generate token
        access_token = create_access_token(data={"sub": response.user.email})
        
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login a user"""
    try:
        supabase = get_supabase_client()
        response = supabase.auth.sign_in_with_password({"email": form_data.username, "password": form_data.password})
        
        # Generate token
        access_token = create_access_token(data={"sub": response.user.email})
        
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/logout")
async def logout(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token"))):
    """Logout a user"""
    try:
        supabase = get_supabase_client()
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Logout failed: {str(e)}"
        )

# Helper functions for JWT token creation and verification
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    # In a real application, use a secure secret key
    encoded_jwt = jwt.encode(to_encode, "SECRET_KEY", algorithm="HS256")
    return encoded_jwt
