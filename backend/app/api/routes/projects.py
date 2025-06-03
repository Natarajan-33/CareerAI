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


@router.get("/domain/{domain_id}/projects", response_model=List[ProjectResponse])
async def get_domain_projects(domain_id: str, generate: bool = Query(False)):
    """Get projects for a specific domain. Optionally generate new projects if none exist."""
    # First try to get existing projects for this domain
    projects = await get_projects(domain=domain_id)
    
    # If no projects found and generate flag is true, generate new projects
    if not projects and generate:
        try:
            # Get the domain details first
            domain = None
            try:
                domain = await get_domain(domain_id)
            except HTTPException:
                # If domain not found, create a minimal domain object
                domain = {
                    "id": domain_id,
                    "name": domain_id.capitalize(),
                    "description": f"Domain related to {domain_id}"
                }
            
            # Try to generate projects using AI service
            try:
                projects = await ai_service.generate_projects_for_domain(
                    domain_id=domain["id"],
                    domain_name=domain["name"],
                    domain_description=domain["description"]
                )
            except Exception as e:
                print(f"Error generating projects for domain: {str(e)}")
                # Fallback to default projects if AI generation fails
                projects = [
                    {
                        "id": f"{domain_id}_project_1",
                        "domain": domain_id,
                        "title": f"Beginner {domain['name']} Project",
                        "description": f"A beginner-friendly project to introduce you to the basics of {domain['name']}.",
                        "difficulty": "beginner",
                        "skills_required": ["Basic Programming", "Problem Solving"],
                        "tasks": [
                            {"id": "task1", "title": "Set up your development environment", "description": "Install the necessary tools and libraries", "order": 1},
                            {"id": "task2", "title": "Learn the fundamentals", "description": "Study the core concepts of the domain", "order": 2},
                            {"id": "task3", "title": "Build a simple application", "description": "Create a basic project to apply what you've learned", "order": 3},
                            {"id": "task4", "title": "Test your application", "description": "Ensure your project works as expected", "order": 4},
                            {"id": "task5", "title": "Document your work", "description": "Create documentation for your project", "order": 5}
                        ],
                        "resource_links": [
                            {"title": "Getting Started Guide", "url": "https://example.com/getting-started"},
                            {"title": "Best Practices", "url": "https://example.com/best-practices"}
                        ],
                        "estimated_hours": 15
                    },
                    {
                        "id": f"{domain_id}_project_2",
                        "domain": domain_id,
                        "title": f"Intermediate {domain['name']} Challenge",
                        "description": f"Build on your knowledge with this intermediate-level project in {domain['name']}.",
                        "difficulty": "intermediate",
                        "skills_required": ["Programming", "Data Structures", "Problem Solving"],
                        "tasks": [
                            {"id": "task1", "title": "Project planning", "description": "Define the scope and requirements of your project", "order": 1},
                            {"id": "task2", "title": "Design the architecture", "description": "Create a solid architecture for your application", "order": 2},
                            {"id": "task3", "title": "Implement core functionality", "description": "Build the main features of your project", "order": 3},
                            {"id": "task4", "title": "Add advanced features", "description": "Enhance your project with more complex functionality", "order": 4},
                            {"id": "task5", "title": "Testing and optimization", "description": "Test your project thoroughly and optimize performance", "order": 5},
                            {"id": "task6", "title": "Documentation and deployment", "description": "Document your project and deploy it", "order": 6}
                        ],
                        "resource_links": [
                            {"title": "Advanced Techniques", "url": "https://example.com/advanced-techniques"},
                            {"title": "Performance Optimization", "url": "https://example.com/optimization"}
                        ],
                        "estimated_hours": 25
                    },
                    {
                        "id": f"{domain_id}_project_3",
                        "domain": domain_id,
                        "title": f"Advanced {domain['name']} Implementation",
                        "description": f"Demonstrate mastery of {domain['name']} with this advanced project.",
                        "difficulty": "advanced",
                        "skills_required": ["Advanced Programming", "System Design", "Performance Optimization", "Testing"],
                        "tasks": [
                            {"id": "task1", "title": "Research and planning", "description": "Research advanced techniques and plan your implementation", "order": 1},
                            {"id": "task2", "title": "Design system architecture", "description": "Create a scalable and efficient architecture", "order": 2},
                            {"id": "task3", "title": "Implement core system", "description": "Build the foundation of your advanced system", "order": 3},
                            {"id": "task4", "title": "Add specialized features", "description": "Implement domain-specific advanced features", "order": 4},
                            {"id": "task5", "title": "Optimization and scaling", "description": "Optimize your system for performance and scalability", "order": 5},
                            {"id": "task6", "title": "Comprehensive testing", "description": "Create and run extensive tests for your system", "order": 6},
                            {"id": "task7", "title": "Documentation and presentation", "description": "Create detailed documentation and prepare a presentation", "order": 7}
                        ],
                        "resource_links": [
                            {"title": "Expert Guides", "url": "https://example.com/expert-guides"},
                            {"title": "Research Papers", "url": "https://example.com/research-papers"},
                            {"title": "Industry Standards", "url": "https://example.com/standards"}
                        ],
                        "estimated_hours": 40
                    }
                ]
        except Exception as e:
            print(f"Error in domain projects endpoint: {str(e)}")
            # Return empty list instead of raising an exception
            projects = []
    
    return projects


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


@router.post("/generate", response_model=List[ProjectResponse])
async def generate_projects(data: Dict[str, Any] = Body(...)):
    """Generate projects for a specific domain."""
    domain_id = data.get("domain_id")
    domain_name = data.get("domain_name")
    domain_description = data.get("domain_description")
    
    if not domain_id or not domain_name:
        raise HTTPException(status_code=400, detail="Domain ID and name are required")
    
    if not domain_description:
        domain_description = f"Domain related to {domain_name}"
    
    try:
        # Generate projects using AI service
        projects = await ai_service.generate_projects_for_domain(domain_id, domain_name, domain_description)
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate projects: {str(e)}")


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
