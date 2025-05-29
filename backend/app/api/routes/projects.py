from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional

from app.models.project import ProjectCreate, ProjectResponse, DomainResponse

router = APIRouter()


@router.get("/domains", response_model=List[DomainResponse])
async def get_domains():
    """Get all available AI/ML domains."""
    # This is a placeholder - will be implemented with Supabase integration
    return [
        {
            "id": "mlops",
            "name": "MLOps",
            "description": "Machine Learning Operations focuses on deploying and maintaining ML models in production.",
            "icon": "server",
            "color": "blue",
            "required_skills": ["Python", "Docker", "CI/CD", "Cloud Platforms"],
            "job_titles": ["MLOps Engineer", "ML Platform Engineer", "DevOps for ML"]
        },
        {
            "id": "nlp",
            "name": "Natural Language Processing",
            "description": "NLP focuses on enabling computers to understand and process human language.",
            "icon": "chat",
            "color": "purple",
            "required_skills": ["Python", "Linguistics", "Deep Learning", "Transformers"],
            "job_titles": ["NLP Engineer", "Conversational AI Developer", "Text Analytics Specialist"]
        },
        {
            "id": "cv",
            "name": "Computer Vision",
            "description": "Computer Vision involves teaching computers to gain high-level understanding from digital images or videos.",
            "icon": "eye",
            "color": "green",
            "required_skills": ["Python", "OpenCV", "Deep Learning", "Image Processing"],
            "job_titles": ["Computer Vision Engineer", "Image Processing Specialist", "Video Analytics Engineer"]
        },
        {
            "id": "robotics",
            "name": "Robotics",
            "description": "Robotics combines mechanical engineering, electrical engineering, and computer science to create autonomous systems.",
            "icon": "robot",
            "color": "orange",
            "required_skills": ["ROS", "Python/C++", "Control Systems", "Sensor Fusion"],
            "job_titles": ["Robotics Engineer", "Automation Specialist", "Robotics Software Developer"]
        }
    ]


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
