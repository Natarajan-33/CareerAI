import os
from dotenv import load_dotenv
from groq import Groq
import re
from typing import List, Dict, Any, Optional

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Helper function to clean AI responses
def remove_think_tags(text: str) -> str:
    """Removes content inside <think>...</think> tags including the tags themselves."""
    return re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL).strip()

# Ikigai discovery services
def generate_domain_suggestion(passion: str, strengths: str) -> str:
    """Generate domain suggestions based on user's passion and strengths."""
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

# Conversational AI for Ikigai discovery
def process_ikigai_conversation(conversation_history: List[Dict[str, Any]], user_message: str) -> Dict[str, Any]:
    """Process a conversation message and generate a response with insights."""
    # Prepare conversation history for the AI model
    messages = [
        {"role": "system", "content": "You are a career advisor helping users discover their ikigai in AI/ML fields."}
    ]
    
    # Add conversation history
    for msg in conversation_history:
        messages.append({"role": msg["role"], "content": msg["content"]})
    
    # Add the new user message
    messages.append({"role": "user", "content": user_message})
    
    try:
        # Generate AI response
        response = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=messages,
            temperature=0.7
        )
        
        ai_response = remove_think_tags(response.choices[0].message.content)
        
        # Extract insights from the conversation
        # In a real implementation, this would use more sophisticated NLP
        insights = extract_insights_from_conversation(conversation_history + [
            {"role": "user", "content": user_message},
            {"role": "assistant", "content": ai_response}
        ])
        
        return {
            "response": ai_response,
            "insights": insights
        }
    
    except Exception as e:
        print(f"Error processing conversation: {e}")
        return {
            "response": "I'm here to help you discover your ideal path in AI and ML. Can you tell me more about what aspects of technology you're most passionate about?",
            "insights": {}
        }

def extract_insights_from_conversation(conversation: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Extract insights from conversation history."""
    # This would be implemented with more sophisticated NLP in a real system
    # For now, we'll use a simplified approach with keyword matching
    
    passions = []
    strengths = []
    interests = []
    
    # Keywords to look for
    passion_keywords = ["enjoy", "love", "passionate", "excited", "interest"]
    strength_keywords = ["good at", "skilled", "expertise", "experience", "strength"]
    interest_keywords = ["want to learn", "curious about", "interested in"]
    
    # Domain-specific keywords
    domains = {
        "nlp": ["language", "text", "nlp", "chatbot", "translation", "sentiment"],
        "computer_vision": ["image", "vision", "object detection", "recognition", "computer vision"],
        "robotics": ["robot", "automation", "control", "mechanical", "hardware"],
        "data_science": ["data", "analytics", "statistics", "visualization", "prediction"],
        "reinforcement_learning": ["reinforcement", "rl", "agent", "reward", "game"]
    }
    
    # Extract user messages
    user_messages = [msg["content"] for msg in conversation if msg["role"] == "user"]
    
    # Simple keyword extraction (in a real system, use NLP)
    for message in user_messages:
        message_lower = message.lower()
        
        # Extract passions
        for keyword in passion_keywords:
            if keyword in message_lower:
                # Extract the sentence containing the keyword
                sentences = message.split('.')
                for sentence in sentences:
                    if keyword in sentence.lower():
                        passions.append(sentence.strip())
        
        # Extract strengths
        for keyword in strength_keywords:
            if keyword in message_lower:
                sentences = message.split('.')
                for sentence in sentences:
                    if keyword in sentence.lower():
                        strengths.append(sentence.strip())
        
        # Extract interests
        for keyword in interest_keywords:
            if keyword in message_lower:
                sentences = message.split('.')
                for sentence in sentences:
                    if keyword in sentence.lower():
                        interests.append(sentence.strip())
    
    # Identify potential domains
    domain_scores = {domain: 0 for domain in domains}
    for message in user_messages:
        message_lower = message.lower()
        for domain, keywords in domains.items():
            for keyword in keywords:
                if keyword in message_lower:
                    domain_scores[domain] += 1
    
    # Get top domains
    top_domains = sorted(domain_scores.items(), key=lambda x: x[1], reverse=True)[:2]
    top_domains = [domain for domain, score in top_domains if score > 0]
    
    return {
        "passions": passions,
        "strengths": strengths,
        "interests": interests,
        "potential_domains": top_domains,
        "confidence": 0.7  # Placeholder confidence score
    }

# Social media and build-in-public services
def generate_social_media_post(project_title: str, domain: str, tasks_completed: str, progress_percentage: int) -> str:
    """Generate social media posts for LinkedIn/Twitter based on project progress."""
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

def generate_daily_post(project_title: str, domain: str, day_number: int, goals_for_today: str, learnings: str, target_firms: Optional[List[str]] = None) -> str:
    """Generate a daily build-in-public post for consistent sharing."""
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

# Analysis services
def analyze_delta4(project_description: str, current_status: str, challenges: str, goals: str) -> Dict[str, Any]:
    """Use the Delta 4 framework to analyze friction and delight points in a project."""
    prompt = f"""
    Analyze the following project using the Delta 4 framework to identify friction and delight points.
    
    Project Description: {project_description}
    Current Status: {current_status}
    Challenges: {challenges}
    Goals: {goals}
    
    The Delta 4 framework examines four dimensions:
    1. Technical Friction/Delight: Technical challenges and successes
    2. Cultural Friction/Delight: Team dynamics and communication
    3. Process Friction/Delight: Workflow and methodology issues/successes
    4. Expectation Friction/Delight: Misalignment/alignment between expectations and reality
    
    For each dimension, provide:
    - Friction points (problems and challenges)
    - Delight points (successes and positive aspects)
    - Recommendations for improvement
    
    Format your response as JSON with the following structure:
    {{
        "technical": {{
            "friction": ["point 1", "point 2"],
            "delight": ["point 1", "point 2"],
            "recommendations": ["recommendation 1", "recommendation 2"]
        }},
        "cultural": {{
            "friction": ["point 1", "point 2"],
            "delight": ["point 1", "point 2"],
            "recommendations": ["recommendation 1", "recommendation 2"]
        }},
        "process": {{
            "friction": ["point 1", "point 2"],
            "delight": ["point 1", "point 2"],
            "recommendations": ["recommendation 1", "recommendation 2"]
        }},
        "expectation": {{
            "friction": ["point 1", "point 2"],
            "delight": ["point 1", "point 2"],
            "recommendations": ["recommendation 1", "recommendation 2"]
        }}
    }}
    """
    
    try:
        response = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {"role": "system", "content": "You are an AI project analyst specializing in identifying friction and delight points in projects."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        # Parse JSON response
        import json
        analysis = json.loads(response.choices[0].message.content)
        return analysis
    
    except Exception as e:
        print(f"Error analyzing Delta4: {e}")
        # Fallback response in case of API issues
        return {
            "technical": {
                "friction": ["Technical complexity beyond current skill level", "Dependency issues with libraries"],
                "delight": ["Successfully implemented core functionality", "Learned new technical skills"],
                "recommendations": ["Break down complex tasks into smaller steps", "Seek mentorship for technical challenges"]
            },
            "cultural": {
                "friction": ["Working alone limits perspective", "Lack of feedback on approach"],
                "delight": ["Freedom to explore solutions independently", "Building confidence in decision-making"],
                "recommendations": ["Join online communities for your domain", "Share progress to get feedback"]
            },
            "process": {
                "friction": ["Inconsistent work schedule", "Unclear milestones"],
                "delight": ["Flexibility to adapt approach as needed", "Learning through experimentation"],
                "recommendations": ["Establish a regular work routine", "Define clear, achievable milestones"]
            },
            "expectation": {
                "friction": ["Project scope may be too ambitious", "Timeline expectations may be unrealistic"],
                "delight": ["Clear vision of desired outcome", "Enthusiasm for project goals"],
                "recommendations": ["Reassess scope based on progress", "Celebrate small wins along the way"]
            }
        }

def get_company_insights(company_name: str, domain: Optional[str] = None, skills: Optional[List[str]] = None) -> Dict[str, Any]:
    """Get recent news, job openings, and strategic insights for a target company."""
    prompt = f"""
    Provide insights about {company_name} for someone interested in AI/ML careers.
    
    {f"The person specializes in {domain}." if domain else ""}
    {f"The person has skills in: {', '.join(skills)}." if skills else ""}
    
    Include the following sections:
    1. Company Overview: Brief description of the company and its focus areas
    2. AI/ML Initiatives: Current AI/ML projects or focus areas at the company
    3. Job Market Analysis: Types of AI/ML roles typically available and skills in demand
    4. Strategic Advice: How someone could position themselves for a role at this company
    
    Format your response as JSON with the following structure:
    {{
        "company_name": "{company_name}",
        "overview": "Company description...",
        "ai_initiatives": ["Initiative 1", "Initiative 2"],
        "job_roles": ["Role 1", "Role 2"],
        "required_skills": ["Skill 1", "Skill 2"],
        "strategic_advice": ["Advice 1", "Advice 2"]
    }}
    """
    
    try:
        response = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {"role": "system", "content": "You are an AI career and company analyst with expertise in the tech industry."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        # Parse JSON response
        import json
        insights = json.loads(response.choices[0].message.content)
        return insights
    
    except Exception as e:
        print(f"Error getting company insights: {e}")
        # Fallback response in case of API issues
        return {
            "company_name": company_name,
            "overview": f"{company_name} is a technology company operating in the AI/ML space.",
            "ai_initiatives": ["AI research and development", "Machine learning applications", "Data science projects"],
            "job_roles": ["Machine Learning Engineer", "Data Scientist", "AI Research Scientist", "ML Ops Engineer"],
            "required_skills": ["Python", "TensorFlow/PyTorch", "Data analysis", "Cloud platforms", "Software engineering"],
            "strategic_advice": [
                "Build projects that demonstrate skills relevant to their business domain",
                "Contribute to open source projects related to their technology stack",
                "Network with current employees through industry events and LinkedIn",
                "Tailor your resume to highlight skills that match their job descriptions"
            ]
        }
