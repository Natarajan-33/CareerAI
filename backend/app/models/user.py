from pydantic import BaseModel, EmailStr, Field
from typing import Optional


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


class UserResponse(UserBase):
    id: str
    
    class Config:
        orm_mode = True
