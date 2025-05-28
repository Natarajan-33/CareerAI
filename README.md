# CareerAI

An AI-powered career discovery and execution platform that guides users through a personalized journey into high-demand AI/ML and robotics roles.

## 🚀 Overview

CareerAI enables users to uncover their Ikigai through a chatbot interface and then guides them through structured project-based execution in their chosen domain. With an intuitive and engaging UI, it provides a seamless experience from career discovery to execution.

## 🌟 Key Features

* **Ikigai Chatbot** – A conversational, sentiment-aware assistant to identify personal passion and strengths
* **Execution Hub** – Suggests AI/ML domains, projects, tasks, and tracks progress visually
* **Build in Public** – Generate and share progress on social media
* **Progress Tracking** – Visual representation of milestones and achievements

## 💻 Tech Stack

| Layer        | Stack                         |
| ------------ | ----------------------------- |
| Frontend     | React, TailwindCSS, MobX      |
| Backend      | FastAPI, Pydantic             |
| DB/Auth      | Supabase (PostgreSQL + Auth)  |
| LLM Services | OpenAI / Gemini               |
| Hosting      | Vercel (frontend), Render API |

## 🏗️ Project Structure

```
careerai/
├── frontend/                  # React App
│   ├── public/
│   ├── src/
│   │   ├── assets/            # SVGs, images
│   │   ├── components/        # Atomic components (buttons, cards, forms)
│   │   ├── layout/            # Layout components (navbar, footer, containers)
│   │   ├── modules/           # Page-level modules
│   │   │   ├── ikigai/        # Ikigai chatbot, sentiment analysis
│   │   │   └── journey/       # Domain selection, project view, task tracker
│   │   ├── stores/            # MobX stores (auth, ikigai, progress, project)
│   │   ├── services/          # Axios API clients
│   │   ├── utils/             # Helper functions, constants
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.js
│   └── index.html
├── backend/                   # FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/        # ikigai.py, auth.py, projects.py, progress.py
│   │   │   └── api.py
│   │   ├── models/            # Pydantic & DB models
│   │   ├── core/              # Settings, config, CORS, security
│   │   ├── db/                # Supabase integration, queries
│   │   ├── services/          # AI, domain suggestion, post generation
│   │   └── main.py
```

## 🚀 Getting Started

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload
```

## 📄 License

MIT
