from fastapi import APIRouter

from app.api.routes import auth, ikigai, projects, progress

api_router = APIRouter()

# Include all route modules
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(ikigai.router, prefix="/ikigai", tags=["ikigai"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
