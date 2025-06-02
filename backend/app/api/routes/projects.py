from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from typing import List, Optional, Dict, Any

from app.models.project import ProjectCreate, ProjectResponse, DomainResponse
from app.services.ai_service import AIService

router = APIRouter()

# Initialize AI service
ai_service = AIService()


@router.get("/domains", response_model=List[DomainResponse])
async def get_domains():
    """Get all available AI/ML domains."""
    # This is a placeholder - will be implemented with Supabase integration
    return []


@router.post("/domains/generate", response_model=List[DomainResponse])
async def generate_domains(data: Dict[str, Any] = Body(...)):
    """Generate domains based on ikigai summary."""
    ikigai_summary = data.get("ikigai_summary", "")
    
    if not ikigai_summary:
        raise HTTPException(status_code=400, detail="Ikigai summary is required")
    
    try:
        # Generate domains using AI service
        domains = await ai_service.generate_domains_from_ikigai(ikigai_summary)
        return domains
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate domains: {str(e)}")


@router.get("/domain/{domain_id}", response_model=DomainResponse)
async def get_domain(domain_id: str):
    """Get a specific domain by ID."""
    # This is a placeholder - will be implemented with Supabase integration
    domains = await get_domains()
    for domain in domains:
        if domain["id"] == domain_id:
            return domain
    raise HTTPException(status_code=404, detail="Domain not found")


@router.get("/", response_model=List[ProjectResponse])
async def get_projects(domain: Optional[str] = None, difficulty: Optional[str] = None):
    """Get all projects, optionally filtered by domain and/or difficulty."""
    # This is a placeholder - will be implemented with Supabase integration
    projects = [
        {
            "id": "nlp-sentiment",
            "domain": "nlp",
            "title": "Sentiment Analysis API",
            "description": "Build a REST API that analyzes sentiment in text using transformer models.",
            "tasks": [
                {"id": "task1", "title": "Set up FastAPI project", "description": "Initialize a FastAPI project with proper structure", "order": 1},
                {"id": "task2", "title": "Implement sentiment model", "description": "Integrate a pre-trained sentiment analysis model", "order": 2},
                {"id": "task3", "title": "Create API endpoints", "description": "Design and implement the REST API endpoints", "order": 3},
                {"id": "task4", "title": "Add testing", "description": "Write unit and integration tests", "order": 4},
                {"id": "task5", "title": "Deploy to cloud", "description": "Deploy the API to a cloud provider", "order": 5}
            ],
            "difficulty": "intermediate",
            "skills_required": ["Python", "FastAPI", "Hugging Face", "Docker"],
            "resource_links": [
                {"title": "FastAPI Documentation", "url": "https://fastapi.tiangolo.com/"},
                {"title": "Hugging Face Transformers", "url": "https://huggingface.co/docs/transformers/"}
            ],
            "estimated_hours": 20
        },
        {
            "id": "cv-object",
            "domain": "cv",
            "title": "Real-time Object Detection",
            "description": "Create a real-time object detection system using a webcam and pre-trained models.",
            "tasks": [
                {"id": "task1", "title": "Set up development environment", "description": "Install necessary libraries and dependencies", "order": 1},
                {"id": "task2", "title": "Integrate webcam capture", "description": "Set up video capture from webcam", "order": 2},
                {"id": "task3", "title": "Implement object detection", "description": "Integrate a pre-trained object detection model", "order": 3},
                {"id": "task4", "title": "Add bounding box visualization", "description": "Draw bounding boxes around detected objects", "order": 4},
                {"id": "task5", "title": "Optimize for real-time performance", "description": "Improve performance for real-time processing", "order": 5}
            ],
            "difficulty": "intermediate",
            "skills_required": ["Python", "OpenCV", "PyTorch/TensorFlow"],
            "resource_links": [
                {"title": "OpenCV Documentation", "url": "https://docs.opencv.org/"},
                {"title": "YOLOv5 Documentation", "url": "https://docs.ultralytics.com/"}
            ],
            "estimated_hours": 25
        }
    ]
    
    if domain:
        projects = [p for p in projects if p["domain"] == domain]
    if difficulty:
        projects = [p for p in projects if p["difficulty"] == difficulty]
    
    return projects


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str):
    """Get a specific project by ID."""
    # This is a placeholder - will be implemented with Supabase integration
    projects = await get_projects()
    for project in projects:
        if project["id"] == project_id:
            return project
    raise HTTPException(status_code=404, detail="Project not found")


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(project: ProjectCreate):
    """Create a new project."""
    # This is a placeholder - will be implemented with Supabase integration
    return {
        "id": "new-project-id",
        **project.dict(),
        "tasks": []
    }
