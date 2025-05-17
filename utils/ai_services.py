import os
from dotenv import load_dotenv
from groq import Groq
import re


# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))



def remove_think_tags(text: str) -> str:
    """
    Removes content inside <think>...</think> tags including the tags themselves.
    
    Args:
        text (str): Input string possibly containing <think>...</think> blocks.

    Returns:
        str: Cleaned string without the <think> blocks.
    """
    return re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL).strip()



def generate_domain_suggestion(passion, strengths):
    """
    Generate domain suggestions based on user's passion and strengths.
    """
    prompt = f"""
    Based on the following information about a person interested in AI/ML careers,
    suggest the most suitable domain specialization for them.
    
    Their passion/interests: {passion}
    
    Their strengths/skills: {strengths}
    
    Provide your response in the following format:
    1. Recommended domain (e.g., NLP, Computer Vision, etc.)
    2. 3-4 bullet points explaining potential areas within this domain
    3. A brief explanation of why this domain aligns with their interests and market demand
    """
    
    try:
        response = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {"role": "system", "content": "You are a career advisor specializing in AI/ML career paths."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        return remove_think_tags(response.choices[0].message.content)
    
    except Exception as e:
        print(f"Error generating domain suggestion: {e}")
        # Fallback response in case of API issues
        return f"""
        Based on your interests and strengths, Natural Language Processing (NLP) seems like an excellent domain match for you.
        
        Potential areas within NLP:
        - Conversational AI and chatbots
        - Sentiment analysis for customer feedback
        - Content generation and summarization
        - Information extraction from documents
        
        This domain aligns well with current market demands, as companies increasingly seek to automate customer interactions and extract insights from text data.
        """

def generate_social_media_post(project_title, domain, tasks_completed, progress_percentage):
    """
    Generate social media posts for LinkedIn/Twitter based on project progress.
    """
    prompt = f"""
    Generate a concise, engaging social media post about progress on an AI/ML project.
    
    Project details:
    - Title: {project_title}
    - Domain: {domain}
    - Progress: {progress_percentage}% complete
    - Recent completed tasks: {tasks_completed}
    
    The post should be motivational, professional, and include relevant hashtags.
    Keep it under 280 characters for Twitter compatibility.
    """
    
    try:
        response = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {"role": "system", "content": "You are a professional social media content creator who specializes in tech and AI."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        # Fallback response in case of API issues
        milestone = "just started" if progress_percentage < 30 else "making good progress on" if progress_percentage < 60 else "nearly finished with" if progress_percentage < 100 else "just completed"
        
        return f"""I've {milestone} my {project_title} project! ({progress_percentage}% complete)

This project helps me build skills in {domain}.

Key accomplishments:
{tasks_completed}

#buildinpublic #careerAI #100DaysOfCode""" 

def generate_daily_post(project_title, domain, day_number, goals_for_today, learnings, target_firms=None):
    """
    Generate a daily build-in-public post for consistent sharing.
    
    Args:
        project_title (str): The title of the project
        domain (str): The domain of the project (e.g., NLP, Computer Vision)
        day_number (int): The day number of the project (e.g., Day 5 of 100)
        goals_for_today (str): What the user planned to accomplish today
        learnings (str): What the user learned or accomplished
        target_firms (list, optional): List of target companies to mention
    
    Returns:
        str: A formatted social media post
    """
    firms_text = ""
    if target_firms and len(target_firms) > 0:
        firms_list = ", ".join(target_firms[:-1]) + f" and {target_firms[-1]}" if len(target_firms) > 1 else target_firms[0]
        firms_text = f"\n\nBuilding skills relevant for roles at {firms_list}."
    
    prompt = f"""
    Generate a daily build-in-public post for an AI career journey.
    
    Details:
    - Project: {project_title}
    - Domain: {domain}
    - Day: {day_number}
    - Today's goals: {goals_for_today}
    - Learnings/Accomplishments: {learnings}
    {f"- Target Companies: {', '.join(target_firms)}" if target_firms else ""}
    
    The post should:
    1. Be engaging, professional, and honest about challenges
    2. Include a clear day number (#Day{day_number})
    3. Share specific learnings or insights
    4. Include relevant hashtags
    5. Be optimized for LinkedIn's format (paragraphs, emojis ok)
    """
    
    try:
        response = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {"role": "system", "content": "You are a professional content creator specializing in tech career development content."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        return remove_think_tags(response.choices[0].message.content)
    
    except Exception as e:
        print(f"Error generating daily post: {e}")
        # Fallback response in case of API issues
        fallback_post = f"""#Day{day_number} of my #100DaysOfCode journey in {domain} 🚀

Today I focused on: {goals_for_today}

What I learned:
- {learnings.replace('\n', '\n- ')}

{firms_text}

#buildinpublic #careerAI #{domain.replace(' ', '')}"""
        
        return fallback_post 

def analyze_delta4(project_description, current_status, challenges, goals):
    """
    Use the Delta 4 framework to analyze friction and delight points in a project.
    
    The Delta 4 framework examines:
    - Technical Friction: Technical challenges and bottlenecks
    - Cultural Friction: Team dynamics, communication issues
    - Process Friction: Workflow and methodology problems
    - Expectation Friction: Misalignment between expectations and reality
    
    As well as corresponding delight points in each area.
    
    Args:
        project_description (str): Brief description of the project
        current_status (str): Current status and progress of the project
        challenges (str): Current challenges and issues faced
        goals (str): Goals and expectations for the project
    
    Returns:
        dict: Analysis results with friction and delight points categorized
    """
    prompt = f"""
    Analyze the following project using the Delta 4 framework to identify friction and delight points:
    
    Project Description: {project_description}
    Current Status: {current_status}
    Challenges: {challenges}
    Goals: {goals}
    
    For each of the four dimensions (Technical, Cultural, Process, and Expectation),
    identify:
    
    1. Friction Points: Issues, challenges, or bottlenecks
    2. Delight Points: Successes, positive aspects, or opportunities
    
    Analyze deeply, providing specific, actionable insights rather than generic observations.
    
    Format your response as JSON with the following structure:
    {{
        "technical": {{
            "friction": ["point 1", "point 2", ...],
            "delight": ["point 1", "point 2", ...],
            "recommendations": ["recommendation 1", "recommendation 2", ...]
        }},
        "cultural": {{
            "friction": ["point 1", "point 2", ...],
            "delight": ["point 1", "point 2", ...],
            "recommendations": ["recommendation 1", "recommendation 2", ...]
        }},
        "process": {{
            "friction": ["point 1", "point 2", ...],
            "delight": ["point 1", "point 2", ...],
            "recommendations": ["recommendation 1", "recommendation 2", ...]
        }},
        "expectation": {{
            "friction": ["point 1", "point 2", ...],
            "delight": ["point 1", "point 2", ...],
            "recommendations": ["recommendation 1", "recommendation 2", ...]
        }},
        "summary": "Brief overall assessment of the project's health"
    }}
    """
    
    try:
        response = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {"role": "system", "content": "You are an expert project analyst specializing in identifying friction and delight points in technical projects."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        response_content = remove_think_tags(response.choices[0].message.content)
        
        # Parse the JSON response
        import json
        return json.loads(response_content)
    
    except Exception as e:
        print(f"Error analyzing project: {e}")
        # Fallback response in case of API issues
        return {
            "technical": {
                "friction": ["API integration challenges", "Performance bottlenecks"],
                "delight": ["Core functionality works well"],
                "recommendations": ["Review API documentation", "Implement caching"]
            },
            "cultural": {
                "friction": ["Communication gaps"],
                "delight": ["Team enthusiasm for the project"],
                "recommendations": ["Regular check-ins", "Document decisions"]
            },
            "process": {
                "friction": ["Unclear task priorities"],
                "delight": ["Regular commits"],
                "recommendations": ["Implement project board", "Define milestone criteria"]
            },
            "expectation": {
                "friction": ["Timeline may be optimistic"],
                "delight": ["Clear project vision"],
                "recommendations": ["Revisit timeline", "Break down large tasks"]
            },
            "summary": "Project shows promise but faces some technical and process challenges. With better task prioritization and addressing technical bottlenecks, progress should improve."
        } 

def get_company_insights(company_name, domain=None, skills=None):
    """
    Get recent news, job openings, and strategic insights for a target company.
    
    Args:
        company_name (str): The name of the target company
        domain (str, optional): The user's domain of interest (e.g., NLP, Computer Vision)
        skills (list, optional): List of skills the user is developing
        
    Returns:
        dict: Company insights including news, jobs, and alignment analysis
    """
    skills_str = ", ".join(skills) if skills else "AI/ML"
    domain_str = domain if domain else "AI/ML"
    
    prompt = f"""
    Research and provide insights on {company_name} as a target employer for someone 
    specializing in {domain_str} with skills in {skills_str}.
    
    Provide your response in JSON format with the following structure:
    {{
        "company_overview": "Brief overview of the company's work in AI/ML",
        "recent_developments": [
            {{
                "title": "Title of news or development",
                "description": "Brief description of the news item",
                "relevance": "Why this matters for someone with the specified skills"
            }},
            ...
        ],
        "job_trends": [
            {{
                "role_type": "Common role type at this company",
                "skills_sought": ["skill1", "skill2", ...],
                "typical_requirements": "Brief description of typical requirements"
            }},
            ...
        ],
        "skill_alignment": {{
            "aligned_skills": ["skill that aligns with company needs", ...],
            "skill_gaps": ["skill that might be worth developing", ...],
            "recommendations": ["specific recommendation", ...]
        }},
        "projects_to_showcase": [
            {{
                "project_idea": "Project that would impress this company",
                "why_effective": "Why this project would stand out to the company"
            }},
            ...
        ]
    }}
    
    Focus on providing accurate, current information that would be useful for someone 
    targeting this company for employment opportunities.
    """
    
    try:
        response = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {"role": "system", "content": "You are a career research specialist with expertise in technology companies and hiring trends in AI and machine learning."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            response_format={"type": "json_object"}
        )
        
        response_content = remove_think_tags(response.choices[0].message.content)
        
        # Parse the JSON response
        import json
        return json.loads(response_content)
    
    except Exception as e:
        print(f"Error retrieving company insights: {e}")
        # Fallback response
        return {
            "company_overview": f"{company_name} is known for its work in AI and machine learning technologies.",
            "recent_developments": [
                {
                    "title": f"{company_name} Expands AI Research Team",
                    "description": f"{company_name} has recently announced expansion of its AI research division.",
                    "relevance": "This indicates growth and investment in AI technologies, creating potential job opportunities."
                }
            ],
            "job_trends": [
                {
                    "role_type": "Machine Learning Engineer",
                    "skills_sought": ["Python", "TensorFlow/PyTorch", "Data processing"],
                    "typical_requirements": "Bachelor's or Master's in Computer Science or related field, 2+ years experience with ML frameworks."
                }
            ],
            "skill_alignment": {
                "aligned_skills": ["Python", "Machine Learning"],
                "skill_gaps": ["Cloud deployment", "MLOps"],
                "recommendations": ["Develop projects showcasing end-to-end ML pipelines", "Gain experience with cloud deployment of ML models"]
            },
            "projects_to_showcase": [
                {
                    "project_idea": "End-to-end ML application with deployment",
                    "why_effective": "Demonstrates both technical ML knowledge and practical implementation skills"
                }
            ]
        } 