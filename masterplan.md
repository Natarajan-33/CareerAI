# CareerAI - Masterplan (React + FastAPI)

## 🚀 App Overview & Objective

CareerAI is a visually stunning, AI-powered career discovery and execution platform that guides users through a personalized journey into high-demand AI/ML and robotics roles. With an intuitive and engaging UI, it enables users to uncover their Ikigai through a chatbot interface and then guides them through structured project-based execution in their chosen domain.

This version is built **directly with React (Tailwind CSS + MobX)** for frontend and **FastAPI** for backend, with Supabase as the database and authentication service.

---

## 🌟 Key Highlights

* React frontend with TailwindCSS + MobX
* FastAPI backend
* Supabase for authentication and data storage
* Two main experiences:

  1. **Ikigai Chatbot Page** – A conversational, sentiment-aware assistant to identify personal passion and strengths
  2. **Execution Hub Page** – Suggests AI/ML domains, projects, tasks, and tracks progress visually
* Pixel-perfect modern UI & smooth UX interactions

---

## 💪 Target Users

* AI-curious students and professionals
* Career-switchers exploring future-proof tech roles
* Self-learners needing a roadmap and execution system

---

## 📄 Project Structure (Efficient & Modern)

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
├── README.md
```

---

## 📊 Main Pages & UX Flow

### 1. 🔍 Ikigai Chatbot Page

* LLM-powered natural chat interface
* Detects user values, passions, interests
* Sentiment analysis to measure excitement
* Suggests domains (NLP, CV, MLOps, etc.) based on insights
* Beautiful message bubbles, typewriter animation, and persona
* Visualization of user's Ikigai result
* CTA: "Proceed to Execution Hub"

### 2. ⚖️ Execution Hub Page

#### 2.1 Domain Selection Page

* Domain cards component
* Domain details modal
* Domain selection confirmation

#### 2.2 Project Selection Page

* Project cards component
* Project details modal
* Project selection and tracking

#### 2.3 Progress Tracking Page

* Progress charts and visualizations
* Milestone tracking
* Achievement badges

#### 2.4 "Build in Public" Feature

* Daily post generator
* Social media integration
* Progress sharing

#### 2.5 Project Milestones Page

* Milestone creation and editing
* Status tracking
* Completion celebrations

#### 2.6 Friction & Delight Points Page

* Delta4 analysis visualization
* Report generation

#### 2.7 Target Firm Alerts Page

* Company insights
* Job matching

---

## 📉 Database Models (Supabase)

### Users

* id, email, name, skill_level, profile_type

### IkigaiLogs

* user_id, passion, strengths, ai_suggestion, final_domain, sentiment

### IkigaiConversations

* user_id, conversation_data (JSON), insights_extracted (JSON)

### Projects

* id, domain, title, tasks[], difficulty, skills_required, resource_links

### Progress

* user_id, project_id, task_id, notes, percent_complete, updated_at

### SocialPosts

* user_id, project_id, content, platform, created_at

---

## 📆 Milestones

### Week 1-2: Setup & Core Flow

* React + Tailwind + MobX setup
* FastAPI backend initialized, CORS, Supabase linked
* Auth flow (signup, guest, token refresh)

### Week 3-4: Ikigai Chat Module

* Chat component UI + typewriter effect
* Sentiment & intent detection from LLM
* Domain suggestion engine
* Visualization of Ikigai match

### Week 5-6: Execution Hub

* Domain & project cards
* Project task breakdown (Kanban or checklist)
* Save/update task progress
* Generate social post based on task content
* Implement friction/delight prompts, milestone creation, and target firm alerts

### Week 7-8: Polish + Deployment

* UI refinements
* CI/CD + Vercel + FastAPI host (Render or Fly.io)
* User testing & feedback loop

---

## 🌟 UI/UX Design Principles

* Minimal, focused layout with modern fonts
* Smooth animations, subtle transitions
* Emotionally engaging (chatbot feedback, celebratory micro-interactions)
* Light/dark theme toggle
* Mobile responsiveness with fixed CTA zones

---

## ⚡️ Tech Stack Summary

| Layer        | Stack                         |
| ------------ | ----------------------------- |
| Frontend     | React, TailwindCSS, MobX      |
| Backend      | FastAPI, Pydantic             |
| DB/Auth      | Supabase (PostgreSQL + Auth)  |
| LLM Services | OpenAI / Gemini               |
| Hosting      | Vercel (frontend), Render API |

---

## 📊 Future Additions (Post-MVP)

* Interactive Learning Path with skill-based checkpoints
* Mentor feedback panel
* ATS board with saved jobs & outreach generator
* Challenge-based learning gamification

---

## 📅 Closing Note

CareerAI isn't just a tool to build a career in AI—it's an experience to build **clarity, momentum, and belief**. With this modern stack, you now have a powerful architecture ready to scale both tech and impact.
