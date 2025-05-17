# CareerAI 🚀

CareerAI is a personalized AI-powered career companion that guides students and professionals through a structured journey toward AI/ML and robotics roles. It helps users align personal interests with market demand, identify the right domain, execute meaningful projects, and build in public — all in one place.

## Features

- **🎯 Ikigai Discovery**: AI-assisted journaling to assess passion, strengths, and goals, with market-aligned domain suggestions
- **🧩 Domain Selection**: Choose and refine your AI/ML specialization
- **🛠️ Project Selection**: Access curated projects with step-by-step task breakdowns
- **📊 Progress Tracking**: Monitor your learning journey with visual indicators
- **🌐 Build in Public**: Generate social media posts to share your progress

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

## Project Structure

- `app.py`: Main Streamlit application
- `utils/supabase.py`: Supabase client and database operations
- `utils/ai_services.py`: OpenAI integration for domain suggestions and social posts
- `requirements.txt`: Project dependencies
- `.env`: Environment variables (API keys)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Streamlit](https://streamlit.io/) for the web framework
- [Supabase](https://supabase.io/) for database and authentication
- [OpenAI](https://openai.com/) for AI services 