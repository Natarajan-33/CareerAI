# CareerAI: Streamlit to React + FastAPI Migration

This project is a migration of the CareerAI application from Streamlit to a modern React frontend with FastAPI backend architecture. The new application maintains all existing functionality while adding improved UI/UX, better state management with MobX, and a more scalable architecture.

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │◄────►│ FastAPI Backend │◄────►│    Database     │
│   (with MobX)   │     │                 │     │   (Supabase)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Project Structure

```
career-ai/
├── frontend/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/            # Static assets (images, etc.)
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/        # Common UI elements
│   │   │   ├── ikigai/        # Ikigai-specific components
│   │   │   └── career/        # Career path components
│   │   ├── pages/             # Page components
│   │   │   ├── auth/          # Authentication pages
│   │   │   ├── ikigai/        # Ikigai discovery section
│   │   │   └── career/        # Career development section
│   │   ├── stores/            # MobX stores
│   │   │   ├── authStore.js   # Authentication state
│   │   │   ├── ikigaiStore.js # Ikigai data state
│   │   │   ├── projectStore.js# Project selection state
│   │   │   └── rootStore.js   # Root store composition
│   │   ├── services/          # API service layer
│   │   ├── utils/             # Utility functions
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   ├── package.json
│   └── README.md
├── backend/                   # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/     # API route handlers
│   │   │   │   ├── auth.py    # Authentication routes
│   │   │   │   ├── ikigai.py  # Ikigai-related routes
│   │   │   │   ├── projects.py# Project-related routes
│   │   │   │   └── progress.py# Progress tracking routes
│   │   │   └── api.py         # API router composition
│   │   ├── core/              # Core application code
│   │   │   ├── config.py      # Configuration
│   │   │   └── security.py    # Security utilities
│   │   ├── db/                # Database models and utilities
│   │   │   ├── models.py      # Pydantic models
│   │   │   └── supabase.py    # Supabase client
│   │   ├── services/          # Business logic services
│   │   │   ├── ai_services.py # AI integration services
│   │   │   └── user_services.py# User-related services
│   │   └── main.py            # FastAPI application entry point
│   ├── requirements.txt       # Python dependencies
│   └── README.md
└── README.md                  # Project overview
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8 or higher
- Supabase account and project
- Groq API key for AI services

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd career-ai/backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the backend directory with the following variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   GROQ_API_KEY=your_groq_api_key
   SECRET_KEY=your_jwt_secret_key
   ```

6. Run the FastAPI server:
   ```
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd career-ai/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```
   npm start
   ```

## Key Features

### Authentication
- JWT-based authentication
- User registration and login
- Guest mode with data persistence

### Ikigai Discovery
- Conversational AI chatbot interface
- Natural conversation flow instead of rigid forms
- Context-aware follow-up questions
- Sentiment analysis to detect user enthusiasm
- Guided discovery through conversation

### Career Development
- Domain selection with detailed information
- Project selection based on domain
- Progress tracking with visualizations
- Daily build-in-public post generation
- Project milestone management
- Delta4 analysis for friction and delight points
- Target firm insights and skill alignment

### Gamification and Motivation
- Achievement tracking
- Progress visualization
- Social sharing integration

## Migration Benefits

1. **Improved User Experience**
   - Modern, responsive UI with Tailwind CSS
   - Better navigation with React Router
   - More interactive components

2. **Better State Management**
   - Centralized state with MobX
   - Reactive UI updates
   - Improved data flow

3. **Scalable Architecture**
   - Clear separation of concerns
   - Modular component design
   - RESTful API endpoints
   - Better code organization

4. **Enhanced Performance**
   - Faster page loads
   - Optimized API calls
   - Better caching

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
