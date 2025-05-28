from fastapi import APIRouter

# Import endpoint routers
from app.api.endpoints import auth, ikigai, projects, progress

# Create main API router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(ikigai.router, prefix="/ikigai", tags=["ikigai"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
