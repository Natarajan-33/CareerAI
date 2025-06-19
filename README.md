# CareerAI 🚀
![CareerAI](https://github.com/user-attachments/assets/6a802027-d4b8-4cb8-af1c-00976acba399)


CareerAI is a personalized AI-powered career companion that guides students and professionals through a structured journey toward AI/ML and robotics roles. It helps users align personal interests with market demand, identify the right domain, execute meaningful projects, and build in public — all in one place.

## Features

### Core Features
- **🎯 Ikigai Discovery**: AI-assisted journaling to assess passion, strengths, and goals, with market-aligned domain suggestions powered by Groq AI
- **🧩 Domain Selection**: Choose and refine your AI/ML specialization from options including NLP, Computer Vision, Reinforcement Learning, and more
- **🛠️ Project Selection**: Access curated projects with step-by-step task breakdowns tailored to your selected domain and skill level
- **📊 Progress Tracking**: Monitor your learning journey with visual indicators and percentage completion metrics
- **🌐 Build in Public**: Generate professional social media posts to share your progress on platforms like LinkedIn and Twitter

### Advanced Features
- **📝 Daily Build in Public**: Create consistent daily updates about your learning journey with AI-generated content templates
- **🏆 Project Milestones**: Set and track key milestones for your projects with due dates and status tracking
- **🔄 Friction & Delight Points**: Analyze project challenges and successes using the Delta 4 framework (Technical, Cultural, Process, and Expectation dimensions)
- **🎯 Target Firm Alerts**: Research and track companies you're interested in working for, with AI-generated insights about their recent developments and skill requirements

## Getting Started

### Prerequisites

- Python 3.7+
- Streamlit
- Supabase account (for database and authentication)
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/CareerAI.git
cd CareerAI
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with your API keys:
```
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the application:
```bash
streamlit run app.py
```

## Supabase Setup

For the database functionality to work, you need to set up the following tables in your Supabase project:

1. **user_profiles**:
   - user_id (UUID, primary key)
   - profile_type (text)
   - skill_level (text)
   - immediate_goals (JSON)
   - created_at (timestamp with timezone)

2. **ikigai_logs**:
   - id (UUID, primary key)
   - user_id (UUID, foreign key)
   - passion (text)
   - strengths (text)
   - ai_suggestion (text)
   - final_domain (text)
   - domain_selected (text)
   - created_at (timestamp with timezone)

3. **projects**:
   - id (UUID, primary key)
   - user_id (UUID, foreign key)
   - title (text)
   - description (text)
   - difficulty (text)
   - time_estimate (text)
   - tasks (JSON)
   - domain (text)
   - created_at (timestamp with timezone)

4. **progress_entries**:
   - id (UUID, primary key)
   - user_id (UUID, foreign key)
   - project_id (text)
   - project_title (text)
   - progress_percentage (integer)
   - completed_tasks (JSON)
   - timestamp (timestamp with timezone)
   
5. **project_milestones**:
   - id (UUID, primary key)
   - user_id (UUID, foreign key)
   - project_id (text)
   - title (text)
   - description (text)
   - due_date (date)
   - status (text) - e.g., "not_started", "in_progress", "completed"
   - created_at (timestamp with timezone)
   - updated_at (timestamp with timezone)
   
6. **friction_points**:
   - id (UUID, primary key)
   - user_id (UUID, foreign key)
   - project_id (text)
   - project_title (text)
   - analysis (JSON) - stores Delta 4 framework analysis
   - timestamp (timestamp with timezone)
   
7. **target_firms**:
   - id (UUID, primary key)
   - user_id (UUID, foreign key)
   - company_name (text)
   - insights (JSON) - stores company insights and analysis
   - domain_relevance (text)
   - created_at (timestamp with timezone)
   - updated_at (timestamp with timezone)

## Project Structure

- `app.py`: Main Streamlit application with all UI components and page logic
- `utils/`
  - `supabase.py`: Supabase client and database operations for user authentication and data storage
  - `ai_services.py`: AI service integrations for domain suggestions, social media posts, and analysis
  - `__init__.py`: Package initialization file
- `static/images/`: Static assets for the application
- `requirements.txt`: Project dependencies
- `.env`: Environment variables (API keys)
- `.env-example`: Example environment file template

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Streamlit](https://streamlit.io/) for the web framework and UI components
- [Supabase](https://supabase.io/) for database and authentication services
- [Groq](https://groq.com/) for fast AI inference capabilities
- [Pandas](https://pandas.pydata.org/) for data manipulation and analysis
- [Plotly](https://plotly.com/) for interactive data visualizations
- [Python-dotenv](https://github.com/theskumar/python-dotenv) for environment variable management
