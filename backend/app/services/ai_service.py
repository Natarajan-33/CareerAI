import os
import json
import re
import uuid
from typing import List, Dict, Any, Optional

from groq import Groq
from app.core.config import settings
from app.models.ikigai import ChatMessage, SentimentAnalysis, IkigaiResponse
from app.db.supabase import get_supabase_client


def remove_think_tags(text):
    """Remove <think></think> tags from LLM responses if present."""
    if not text:
        return text
    # Remove <think>...</think> blocks
    return re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)


class AIService:
    def __init__(self):
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY must be set in environment variables")
        
        self.client = Groq(api_key=settings.GROQ_API_KEY)
    
    async def generate_chat_response(self, messages: List[ChatMessage]) -> ChatMessage:
        """Generate a response from the AI assistant based on conversation history.
        
        This function is only called after the user has sent a message, ensuring that
        the first message is always from the user and the LLM is only called when needed.
        """
        # Ensure we have at least one user message before generating a response
        if not messages or len(messages) == 0:
            print("No messages provided for chat response generation")
            return ChatMessage(
                role="assistant",
                content="Hello! I'm your Ikigai career guide. Please share a bit about yourself and your career interests to get started.",
                sentiment=None
            )
        
        # Convert our ChatMessage objects to the format expected by the LLM
        openai_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in messages
        ]
        
        # Check if there's already a system message in the conversation
        has_system_message = False
        for msg in openai_messages:
            if msg["role"] == "system":
                has_system_message = True
                break
        
        # If no system message is present, use our default one
        if not has_system_message:
            # Comprehensive Ikigai system prompt
            ikigai_system_prompt = """
            You are an expert Ikigai career guide chatbot.

            Your job is to help a user discover their Ikigai (reason for being) by engaging in a natural, personalized, and conversational dialogue. You should act like a career coach who is deeply trained in the Ikigai framework and also aware of global trends in skills, jobs, and industries.

            Your goals:
            1. Build rapport and trust with the user through friendly and engaging questions.
            2. Ask open-ended questions (with follow-up questions when needed) in a natural flow. Keep your responses concise and focused. The goal is to understand:
               - Childhood hobbies and interests
               - Current passions and joyful activities
               - Skills and strengths (natural and learned)
               - Core values and personality traits
               - Things they care about and problems they want to solve
               - Tasks that feel effortless and fulfilling
               - How they spend their time outside of work
               - Career dreams and hidden desires
               - Any constraints (like family, location, education)
               - Existing job or field (if any)
            3. After the full conversation, summarize everything you've learned about the user in a structured way (like a profile).
            4. Use your Ikigai knowledge to analyze:
               - What they love
               - What they are good at
               - What the world needs
               - What they can be paid for
            5. Recommend:
               - Their likely **Ikigai**
               - A **career domain** that fits their Ikigai (e.g., AI, marketing, design, education, environment, tech, social impact, etc.)
               - Justify **why** you chose this domain with references to their answers
               - Predict future **job demand** for this domain (based on trends and logical reasoning)
               - Suggest **10–15 specific projects** in that domain to help them become job-ready (real-world, practical, and skill-building)
            6. Output all this in a warm, inspiring tone — make the user feel seen, motivated, and guided.

            Make sure:
            - You ask clarifying follow-up questions wherever needed.
            - You remember past responses from the user to ask smarter questions.
            - You are empathetic and do not rush the process.
            - You never give vague advice — always explain your reasoning clearly.

            Keep everything focused on helping the user align with their Ikigai while also becoming future-proof in terms of skills and job market.
            """
            
            # Insert system prompt at the beginning
            openai_messages.insert(0, {"role": "system", "content": ikigai_system_prompt})
        
        try:
            # Only make the LLM call if we have a user message to respond to
            response = self.client.chat.completions.create(
                model="deepseek-r1-distill-llama-70b",
                messages=openai_messages,
                temperature=0.7
            )
            
            # Extract the assistant's response and remove think tags
            content = remove_think_tags(response.choices[0].message.content)
            
            return ChatMessage(
                role="assistant",
                content=content,
                sentiment=None  # We'll analyze sentiment separately if needed
            )
        
        except Exception as e:
            # In a production environment, you'd want better error handling
            print(f"Error generating chat response: {e}")
            return ChatMessage(
                role="assistant",
                content="I'm sorry, I encountered an error processing your request. Please try again.",
                sentiment=None
            )
    
    async def analyze_sentiment(self, text: str) -> SentimentAnalysis:
        """Analyze the sentiment of a text using OpenAI."""
        try:
            prompt = f"""Analyze the sentiment of the following text and extract key emotional keywords. 
            Return a JSON object with three fields: 
            - 'score': a float from -1 (very negative) to 1 (very positive)
            - 'label': one of 'negative', 'neutral', or 'positive'
            - 'keywords': an array of emotional keywords from the text

            Text: "{text}"
            """
            
            response = self.client.chat.completions.create(
                model="deepseek-r1-distill-llama-70b",
                messages=[
                    {"role": "system", "content": "You are a sentiment analysis expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0
            )
            
            # Parse the response as JSON
            import json
            cleaned_content = remove_think_tags(response.choices[0].message.content.strip())
            result = json.loads(cleaned_content)
            
            return SentimentAnalysis(
                score=result["score"],
                label=result["label"],
                keywords=result["keywords"]
            )
        
        except Exception as e:
            print(f"Error analyzing sentiment: {e}")
            return SentimentAnalysis(
                score=0,
                label="neutral",
                keywords=[]
            )
    
    async def generate_ikigai(self, conversation_history: List[ChatMessage]) -> IkigaiResponse:
        """Generate Ikigai results based on conversation history.
        
        This function analyzes the entire conversation history to generate personalized Ikigai results.
        It provides a simplified and more reliable response format.
        """
        # Ensure we have conversation history to analyze
        if not conversation_history or len(conversation_history) < 2:
            print("Insufficient conversation history for Ikigai analysis")
            return self._create_default_ikigai_response()
            
        # Convert our ChatMessage objects to the format expected by the LLM
        openai_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in conversation_history
        ]
        
        # Add the system prompt for Ikigai analysis - simplified for reliability
        ikigai_system_prompt = """
        You are an expert Ikigai career guide chatbot.

        Your job is to analyze the provided conversation history and identify the user's Ikigai (reason for being).
        You should act like a career coach who is deeply trained in the Ikigai framework and also aware of global trends in skills, jobs, and industries.

        Based on the conversation history provided, carefully analyze:
        1. What they love (their passions and interests)
        2. What they are good at (their skills and strengths)
        3. What the world needs (market demands and societal needs)
        4. What they can be paid for (viable career options)

        Then provide:
        - Their likely Ikigai - the intersection of all four elements above
        - A career domain that fits their Ikigai (e.g., AI, marketing, design, education, environment, tech, social impact, etc.)
        - Suggest 3-5 specific projects in that domain to help them become job-ready (real-world, practical, and skill-building)

        Format your response as a structured JSON object with the following fields:
        - passion: A string describing what they love (keep this concise, 1-2 sentences)
        - strengths: An array of strings listing what they're good at (limit to 3-5 key strengths)
        - ai_suggestion: A string with their likely Ikigai career path (keep this concise, 1-2 sentences)
        - domains: An array with just one domain object containing: id, name, description, match_score, and required_skills
        - projects: An array of 3-5 project suggestions for their chosen domain (keep each project description short and actionable)
        - sentiment: An object with overall sentiment scores (overall, confidence, excitement)
        """
        
        openai_messages.insert(0, {"role": "system", "content": ikigai_system_prompt})
        
        try:
            # Use a more reliable model with a lower temperature for more consistent outputs
            response = self.client.chat.completions.create(
                model="deepseek-r1-distill-llama-70b",
                messages=openai_messages,
                temperature=0.5  # Lower temperature for more consistent results
            )
            
            # Extract the assistant's response and remove think tags
            content = remove_think_tags(response.choices[0].message.content)
            
            # Parse the JSON response
            import json
            try:
                # Try to extract JSON from the content if it's not already valid JSON
                # This handles cases where the LLM might wrap the JSON in markdown or add extra text
                json_match = re.search(r'```json\s*([\s\S]*?)\s*```|\{[\s\S]*\}', content)
                if json_match:
                    json_content = json_match.group(1) if json_match.group(1) else json_match.group(0)
                    # Clean up any remaining markdown or extra characters
                    json_content = re.sub(r'^```json\s*|\s*```$', '', json_content)
                    # Try to parse the extracted JSON
                    result = json.loads(json_content)
                else:
                    # If no JSON pattern found, try parsing the whole content
                    result = json.loads(content)
                
                # Create a default domain if none is provided
                default_domain = {
                    "id": "default_domain",
                    "name": result.get("ai_suggestion", "Career Path"),
                    "description": f"Career path in {result.get('ai_suggestion', 'your field of interest')}",
                    "match_score": 0.9,
                    "required_skills": result.get("strengths", [])
                }
                
                # Extract domains from the result or use default
                domains = []
                if "domains" in result and isinstance(result["domains"], list) and len(result["domains"]) > 0:
                    for i, domain in enumerate(result["domains"]):
                        if isinstance(domain, dict):
                            domains.append({
                                "id": domain.get("id", f"domain_{i}"),
                                "name": domain.get("name", "Unknown Domain"),
                                "description": domain.get("description", "No description available"),
                                "match_score": domain.get("match_score", 0.7),
                                "required_skills": domain.get("required_skills", [])
                            })
                
                # If no valid domains were found, use the default domain
                if not domains:
                    domains.append(default_domain)
                
                # Create sentiment summary with default values if not provided
                sentiment = result.get("sentiment", {})
                sentiment_summary = {
                    "overall": sentiment.get("overall", 0.7),
                    "confidence": sentiment.get("confidence", 0.8),
                    "excitement": sentiment.get("excitement", 0.75)
                }
                
                # Ensure we have projects, even if empty
                projects = result.get("projects", [])
                if not isinstance(projects, list):
                    projects = []
                
                # Create the Ikigai response
                ikigai_response = IkigaiResponse(
                    passion=result.get("passion", "No passion identified"),
                    strengths=result.get("strengths", []),
                    ai_suggestion=result.get("ai_suggestion", "No suggestion available"),
                    domains=domains,
                    sentiment=sentiment_summary,
                    projects=projects
                )
                
                print(f"Successfully generated Ikigai response with {len(domains)} domains and {len(projects)} projects")
                return ikigai_response
                
            except json.JSONDecodeError:
                # If JSON parsing fails, log the error and content
                print(f"Error parsing JSON response: {content}")
                return self._create_default_ikigai_response()
            
        except Exception as e:
            print(f"Error generating Ikigai response: {e}")
            return self._create_default_ikigai_response()
    
    def _create_default_ikigai_response(self) -> IkigaiResponse:
        """Create a default Ikigai response when analysis fails.
        
        This is only used as a fallback when the actual analysis cannot be completed.
        """
        return IkigaiResponse(
            passion="Unable to determine passion from conversation",
            strengths=["Please continue the conversation to identify your strengths"],
            ai_suggestion="More conversation needed for accurate suggestion",
            domains=[
                {
                    "id": "more_data_needed",
                    "name": "More Conversation Needed",
                    "description": "We need more conversation data to provide accurate domain recommendations.",
                    "match_score": 0.5,
                    "required_skills": ["Continue conversation to identify skills"]
                }
            ],
            sentiment={
                "overall": 0.5,
                "confidence": 0.5,
                "excitement": 0.5
            },
            projects=[
                "Continue the conversation to get personalized project recommendations"
            ]
        )
    
    async def save_ikigai_result(self, user_id: str, ikigai_result: IkigaiResponse) -> Dict[str, Any]:
        """Save the Ikigai result to the database.
        
        Args:
            user_id: The ID of the user to save the result for
            ikigai_result: The Ikigai result to save
            
        Returns:
            A dictionary with the save status and the saved result ID
        """
        try:
            # Get Supabase client
            supabase = get_supabase_client()
            if not supabase:
                return {"success": False, "error": "Database connection failed", "id": None}
            
            # Generate a unique ID for the result
            result_id = str(uuid.uuid4())
            
            # Convert the Ikigai result to a dictionary
            result_data = {
                "id": result_id,
                "user_id": user_id,
                "created_at": "now()",  # Supabase will convert this to the current timestamp
                "passion": ikigai_result.passion,
                "strengths": ikigai_result.strengths,
                "ai_suggestion": ikigai_result.ai_suggestion,
                "domains": ikigai_result.domains,
                "sentiment": ikigai_result.sentiment,
                "projects": ikigai_result.projects
            }
            
            # Insert the result into the database
            response = supabase.table("ikigai_results").insert(result_data).execute()
            
            # Check if the insert was successful
            if response.data and len(response.data) > 0:
                return {"success": True, "id": result_id, "result": ikigai_result}
            else:
                return {"success": False, "error": "Failed to save result", "id": None}
                
        except Exception as e:
            print(f"Error saving Ikigai result: {e}")
            return {"success": False, "error": str(e), "id": None}
    
    async def generate_projects_for_domain(self, domain_id: str, domain_name: str, domain_description: str) -> List[Dict[str, Any]]:
        """Generate project recommendations for a specific domain.
        
        Args:
            domain_id: The ID of the domain
            domain_name: The name of the domain
            domain_description: The description of the domain
            
        Returns:
            A list of project objects with id, title, description, difficulty, skills_required, tasks, etc.
        """
        try:
            # Prepare the prompt for project generation
            prompt = f"""Based on the following domain information, generate 3-5 project ideas that would help someone build skills in this domain.
            For each project, provide:
            1. A unique ID (lowercase, no spaces, prefixed with the domain_id)
            2. A title for the project
            3. A detailed description of the project and what it involves
            4. A difficulty level (beginner, intermediate, or advanced)
            5. A list of 3-6 required skills for the project
            6. A list of 5-7 specific tasks that need to be completed for the project, each with an ID, title, description, and order
            7. A list of 2-3 resource links (title and URL) that would be helpful for completing the project
            8. An estimated number of hours to complete the project
            
            Format your response as a valid JSON array of project objects.
            
            Domain ID: {domain_id}
            Domain Name: {domain_name}
            Domain Description: {domain_description}
            """
            
            # Make the LLM call
            response = self.client.chat.completions.create(
                model="deepseek-r1-distill-llama-70b",
                messages=[
                    {"role": "system", "content": "You are an expert project designer who specializes in creating educational projects for skill development in various domains."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            
            # Extract and parse the response
            content = remove_think_tags(response.choices[0].message.content)
            
            # Try to extract JSON from the content
            import json
            import re
            
            # Look for JSON pattern in the response
            json_match = re.search(r'```json\s*([\s\S]*?)\s*```|\{[\s\S]*\}|\[[\s\S]*\]', content)
            if json_match:
                json_content = json_match.group(1) if json_match.group(1) else json_match.group(0)
                # Clean up any remaining markdown or extra characters
                json_content = re.sub(r'^```json\s*|\s*```$', '', json_content)
                # Parse the extracted JSON
                projects = json.loads(json_content)
            else:
                # If no JSON pattern found, try parsing the whole content
                projects = json.loads(content)
            
            # Ensure we have a list of projects
            if not isinstance(projects, list):
                if isinstance(projects, dict):
                    # If we got a single project object, wrap it in a list
                    projects = [projects]
                else:
                    # If we got something else, return an empty list
                    projects = []
            
            # Validate and clean up each project
            valid_projects = []
            for i, project in enumerate(projects):
                if not isinstance(project, dict):
                    continue
                
                # Ensure all required fields are present
                valid_project = {
                    "id": project.get("id", f"{domain_id}_project_{i}"),
                    "domain": domain_id,
                    "title": project.get("title", "Untitled Project"),
                    "description": project.get("description", "No description available"),
                    "difficulty": project.get("difficulty", "intermediate"),
                    "skills_required": project.get("skills_required", []),
                    "estimated_hours": project.get("estimated_hours", 20)
                }
                
                # Process tasks
                tasks = project.get("tasks", [])
                if not isinstance(tasks, list):
                    tasks = []
                
                valid_tasks = []
                for j, task in enumerate(tasks):
                    if not isinstance(task, dict):
                        continue
                    
                    valid_task = {
                        "id": task.get("id", f"task_{j}"),
                        "title": task.get("title", f"Task {j+1}"),
                        "description": task.get("description", "No description available"),
                        "order": task.get("order", j+1)
                    }
                    
                    valid_tasks.append(valid_task)
                
                valid_project["tasks"] = valid_tasks
                
                # Process resource links
                resource_links = project.get("resource_links", [])
                if not isinstance(resource_links, list):
                    resource_links = []
                
                valid_resource_links = []
                for resource in resource_links:
                    if not isinstance(resource, dict):
                        continue
                    
                    # Ensure the URL is valid
                    url = resource.get("url", "")
                    if not url.startswith("http"):
                        url = "https://" + url
                    
                    valid_resource = {
                        "title": resource.get("title", "Resource"),
                        "url": url
                    }
                    
                    valid_resource_links.append(valid_resource)
                
                valid_project["resource_links"] = valid_resource_links
                
                valid_projects.append(valid_project)
            
            return valid_projects
            
        except Exception as e:
            print(f"Error generating projects for domain: {e}")
            # Return a default project as fallback
            return [
                {
                    "id": f"{domain_id}_default_project",
                    "domain": domain_id,
                    "title": f"Introduction to {domain_name}",
                    "description": f"A beginner-friendly project to introduce you to the basics of {domain_name}.",
                    "difficulty": "beginner",
                    "skills_required": ["Basic Programming", "Problem Solving"],
                    "tasks": [
                        {"id": "task1", "title": "Set up your development environment", "description": "Install the necessary tools and libraries", "order": 1},
                        {"id": "task2", "title": "Learn the fundamentals", "description": "Study the core concepts of the domain", "order": 2},
                        {"id": "task3", "title": "Build a simple application", "description": "Create a basic project to apply what you've learned", "order": 3},
                        {"id": "task4", "title": "Test your application", "description": "Ensure your project works as expected", "order": 4},
                        {"id": "task5", "title": "Document your work", "description": "Create documentation for your project", "order": 5}
                    ],
                    "resource_links": [
                        {"title": "Getting Started Guide", "url": "https://example.com/getting-started"},
                        {"title": "Best Practices", "url": "https://example.com/best-practices"}
                    ],
                    "estimated_hours": 15
                }
            ]
    
    async def generate_domains_from_ikigai(self, ikigai_summary: str) -> List[Dict[str, Any]]:
        """Generate domain recommendations based on ikigai summary.
        
        Args:
            ikigai_summary: A text summary of the user's ikigai profile
            
        Returns:
            A list of domain objects with id, name, description, icon, color, required_skills, and job_titles
        """
        try:
            # Prepare the prompt for domain generation
            prompt = f"""Based on the following ikigai summary, generate 3-5 career domains that would be a good fit for this person.
            For each domain, provide:
            1. A unique ID (lowercase, no spaces)
            2. A name for the domain
            3. A detailed description of the domain and why it fits the person
            4. An appropriate icon name (e.g., 'server', 'chat', 'eye', 'robot', 'code', 'chart', 'brain')
            5. A color (e.g., 'blue', 'purple', 'green', 'orange', 'red', 'teal')
            6. A list of 4-6 required skills for the domain
            7. A list of 3-5 potential job titles in this domain
            
            Format your response as a valid JSON array of domain objects.
            
            Ikigai Summary:
            {ikigai_summary}
            """
            
            # Make the LLM call
            response = self.client.chat.completions.create(
                model="deepseek-r1-distill-llama-70b",
                messages=[
                    {"role": "system", "content": "You are an expert career counselor who specializes in matching people's skills and interests to appropriate career domains."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            
            # Extract and parse the response
            content = remove_think_tags(response.choices[0].message.content)
            
            # Try to extract JSON from the content
            import json
            import re
            
            # Look for JSON pattern in the response
            json_match = re.search(r'```json\s*([\s\S]*?)\s*```|\{[\s\S]*\}|\[[\s\S]*\]', content)
            if json_match:
                json_content = json_match.group(1) if json_match.group(1) else json_match.group(0)
                # Clean up any remaining markdown or extra characters
                json_content = re.sub(r'^```json\s*|\s*```$', '', json_content)
                # Parse the extracted JSON
                domains = json.loads(json_content)
            else:
                # If no JSON pattern found, try parsing the whole content
                domains = json.loads(content)
            
            # Ensure we have a list of domains
            if not isinstance(domains, list):
                if isinstance(domains, dict):
                    # If we got a single domain object, wrap it in a list
                    domains = [domains]
                else:
                    # If we got something else, return an empty list
                    domains = []
            
            # Validate and clean up each domain
            valid_domains = []
            for i, domain in enumerate(domains):
                if not isinstance(domain, dict):
                    continue
                
                # Ensure all required fields are present
                valid_domain = {
                    "id": domain.get("id", f"domain_{i}"),
                    "name": domain.get("name", "Unknown Domain"),
                    "description": domain.get("description", "No description available"),
                    "icon": domain.get("icon", "star"),
                    "color": domain.get("color", "blue"),
                    "required_skills": domain.get("required_skills", []),
                    "job_titles": domain.get("job_titles", [])
                }
                
                # Ensure lists are actually lists
                if not isinstance(valid_domain["required_skills"], list):
                    valid_domain["required_skills"] = []
                if not isinstance(valid_domain["job_titles"], list):
                    valid_domain["job_titles"] = []
                
                valid_domains.append(valid_domain)
            
            return valid_domains
            
        except Exception as e:
            print(f"Error generating domains from ikigai: {e}")
            # Return a default domain as fallback
            return [
                {
                    "id": "default_domain",
                    "name": "General AI/ML",
                    "description": "A general domain covering various aspects of artificial intelligence and machine learning.",
                    "icon": "brain",
                    "color": "blue",
                    "required_skills": ["Python", "Machine Learning", "Data Analysis", "Problem Solving"],
                    "job_titles": ["AI Engineer", "ML Engineer", "Data Scientist"]
                }
            ]
    
    async def generate_social_post(self, project_info: Dict[str, Any], progress_info: Dict[str, Any], platform: str) -> str:
        """Generate a social media post based on project progress."""
        try:
            prompt = f"""Generate a short, engaging social media post for {platform} about progress on an AI/ML project. 
            Include relevant hashtags.
            
            Project: {project_info['title']}
            Description: {project_info['description']}
            Current progress: {progress_info['percent_complete']}% complete
            Recent achievement: {progress_info['notes']}
            """
            
            response = await openai.Completion.acreate(
                model="gpt-3.5-turbo-instruct",
                prompt=prompt,
                temperature=0.7,
                max_tokens=150,
                top_p=1.0,
                frequency_penalty=0.0,
                presence_penalty=0.0
            )
            
            return response.choices[0].text.strip()
        
        except Exception as e:
            print(f"Error generating social post: {e}")
            return f"Just made progress on my {project_info['title']} project! Now at {progress_info['percent_complete']}% complete. #AILearning #CareerAI"
