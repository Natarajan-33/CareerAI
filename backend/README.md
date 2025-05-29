# CareerAI Backend API

This is the FastAPI backend for the CareerAI application, an AI-powered career discovery and execution platform.

## Features

- User authentication and profile management
- Ikigai discovery for career path identification
- Project selection and tracking
- Progress tracking with social media post generation
- Project milestone tracking
- Delta 4 analysis for project friction and delight points
- Target firm insights and analysis
- AI-powered content generation

## Getting Started

### Prerequisites

- Python 3.8+
- PostgreSQL database (via Supabase)
- Groq API key

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd CareerAI/backend
   ```
3. Create a virtual environment:
   ```
   python -m venv venv
   ```
4. Activate the virtual environment:
   - Windows:
     ```
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source venv/bin/activate
     ```
5. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
6. Create a `.env` file based on `.env.example` and fill in your credentials:
   ```
   cp .env.example .env
   ```

### Running the API

Start the FastAPI server:

```
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

API documentation will be available at http://localhost:8000/docs

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get access token
- `POST /api/v1/auth/logout` - Logout and invalidate token

### Ikigai Discovery

- `POST /api/v1/ikigai` - Save ikigai data
- `GET /api/v1/ikigai` - Get user's ikigai data

### Projects

- `POST /api/v1/projects` - Create a new project
- `GET /api/v1/projects` - Get all user projects
- `GET /api/v1/projects/{project_id}` - Get a specific project
- `PATCH /api/v1/projects/{project_id}` - Update a project
- `DELETE /api/v1/projects/{project_id}` - Delete a project

### Progress Tracking

- `POST /api/v1/progress` - Save progress entry
- `GET /api/v1/progress/project/{project_id}` - Get progress for a project

### Milestones

- `POST /api/v1/milestones` - Create a new milestone
- `GET /api/v1/milestones/project/{project_id}` - Get milestones for a project
- `PATCH /api/v1/milestones/{milestone_id}` - Update a milestone
- `DELETE /api/v1/milestones/{milestone_id}` - Delete a milestone

### Delta 4 Analysis

- `POST /api/v1/delta4/analyze` - Analyze a project using Delta 4 framework
- `GET /api/v1/delta4/project/{project_id}` - Get analyses for a project
- `GET /api/v1/delta4/{analysis_id}` - Get a specific analysis
- `DELETE /api/v1/delta4/{analysis_id}` - Delete an analysis

### Target Firms

- `POST /api/v1/target-firms` - Add a target firm
- `GET /api/v1/target-firms` - Get all target firms
- `DELETE /api/v1/target-firms/{company_id}` - Delete a target firm
- `GET /api/v1/target-firms/{company_id}/insights` - Get insights for a firm

### AI Services

- `POST /api/v1/ai/domain-suggestion` - Generate domain suggestions
- `POST /api/v1/ai/social-media-post` - Generate social media post
- `POST /api/v1/ai/daily-post` - Generate daily build-in-public post
- `POST /api/v1/ai/delta4-analysis` - Analyze project with Delta 4 framework
- `GET /api/v1/ai/company-insights/{company_name}` - Get company insights

## Database Structure

The application uses Supabase (PostgreSQL) with the following tables:

- `user_profiles` - User profile information
- `ikigai_logs` - User ikigai discovery data
- `projects` - User projects
- `progress_entries` - Project progress tracking
- `project_milestones` - Project milestones
- `delta4_analysis` - Delta 4 analysis results
- `target_firms` - User's target companies
- `company_insights` - Cached company insights

## Environment Variables

- `API_V1_STR` - API version prefix
- `PROJECT_NAME` - Project name
- `PROJECT_DESCRIPTION` - Project description
- `VERSION` - API version
- `SECRET_KEY` - Secret key for JWT token generation
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time
- `CORS_ORIGINS` - Allowed CORS origins
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase API key
- `OPENAI_API_KEY` - OpenAI API key
- `GROQ_API_KEY` - Groq API key
