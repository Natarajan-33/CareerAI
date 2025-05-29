from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.api.api import api_router
from app.core.config import settings
from app.db.setup import setup_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.on_event("startup")
async def startup_event():
    """Initialize services on application startup"""
    logger.info("Starting up CareerAI API...")
    try:
        # Initialize database
        setup_db()
        logger.info("Database setup complete")
    except Exception as e:
        logger.error(f"Error during startup: {e}")
        logger.info("Continuing without database connection for testing purposes")
        # Continue without database connection for testing purposes


@app.get("/")
async def root():
    return {
        "message": "Welcome to CareerAI API",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/api/v1/test-connection")
async def test_connection():
    return {
        "status": "success",
        "message": "Backend connection successful!",
        "timestamp": "2025-05-29T16:21:15+05:30"
    }
