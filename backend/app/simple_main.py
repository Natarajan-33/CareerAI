from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from dotenv import load_dotenv

# Load environment variables directly
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="CareerAI",
    description="AI-powered career discovery and execution platform",
    version="0.1.0",
    openapi_url="/api/v1/openapi.json"
)

# Set up CORS middleware with hardcoded values
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to CareerAI API",
        "version": "0.1.0",
        "docs": "/docs"
    }

@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok", "api_keys": {
        "groq": bool(os.environ.get("GROQ_API_KEY")),
        "supabase": bool(os.environ.get("SUPABASE_KEY"))
    }}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting simplified CareerAI API...")
    uvicorn.run("app.simple_main:app", host="0.0.0.0", port=8000, reload=True)
