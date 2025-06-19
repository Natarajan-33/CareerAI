from fastapi import APIRouter

from app.api.routes import auth, ikigai, projects, progress, milestones, ai_services, target_firms, delta4

api_router = APIRouter()

# Include all route modules
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(ikigai.router, prefix="/ikigai", tags=["ikigai"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
api_router.include_router(milestones.router, prefix="/milestones", tags=["milestones"])
# api_router.include_router(friction_points.router, prefix="/friction-points", tags=["friction_points"])
api_router.include_router(ai_services.router, prefix="/ai", tags=["ai_services"])
# api_router.include_router(target_firms.router, prefix="/target-firms", tags=["target_firms"])
# api_router.include_router(delta4.router, prefix="/delta4", tags=["delta4"])
