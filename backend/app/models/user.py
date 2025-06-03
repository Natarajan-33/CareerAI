from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    name: str
    skill_level: str = Field(..., description="User's skill level: beginner, intermediate, advanced")
    profile_type: str = Field(..., description="User's profile type: student, professional, career-switcher")


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    skill_level: Optional[str] = None
    profile_type: Optional[str] = None
    password: Optional[str] = None


class UserInDB(UserBase):
    id: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    is_active: bool = True

    class Config:
        orm_mode = True


class UserResponse(UserBase):
    id: str
    
    class Config:
        orm_mode = True
