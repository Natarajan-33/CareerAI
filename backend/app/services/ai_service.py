import os
import json
import re
from typing import List, Dict, Any, Optional

from groq import Groq
from app.core.config import settings
from app.models.ikigai import ChatMessage, SentimentAnalysis, IkigaiResponse


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
        """Generate a response from the AI assistant based on conversation history."""
        # Convert our ChatMessage objects to the format expected by OpenAI
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
            2. Ask at least 15 open-ended questions (with follow-up questions when needed) in a natural flow. The goal is to understand:
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
        """Generate Ikigai results based on conversation history."""
        # Convert our ChatMessage objects to the format expected by OpenAI
        openai_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in conversation_history
        ]
        
        # Add the system prompt for Ikigai analysis
        ikigai_system_prompt = """
        You are an expert Ikigai career guide chatbot.

        Your job is to help a user discover their Ikigai (reason for being) by engaging in a natural, personalized, and conversational dialogue. You should act like a career coach who is deeply trained in the Ikigai framework and also aware of global trends in skills, jobs, and industries.

        Based on the conversation history provided, analyze:
        1. What they love
        2. What they are good at
        3. What the world needs
        4. What they can be paid for

        Then provide:
        - Their likely Ikigai
        - A career domain that fits their Ikigai (e.g., AI, marketing, design, education, environment, tech, social impact, etc.)
        - Justify why you chose this domain with references to their answers
        - Predict future job demand for this domain (based on trends and logical reasoning)
        - Suggest 10-15 specific projects in that domain to help them become job-ready (real-world, practical, and skill-building)

        Format your response as a structured JSON object with the following fields:
        - passion: A string describing what they love
        - strengths: An array of strings listing what they're good at
        - ai_suggestion: A string with their likely Ikigai career path
        - domains: An array of domain objects, each with id, name, description, match_score, and required_skills
        - projects: An array of project suggestions for their chosen domain
        - sentiment: An object with overall sentiment scores
        """
        
        openai_messages.insert(0, {"role": "system", "content": ikigai_system_prompt})
        
        try:
            response = self.client.chat.completions.create(
                model="deepseek-r1-distill-llama-70b",
                messages=openai_messages,
                temperature=0.7
            )
            
            # Extract the assistant's response and remove think tags
            content = remove_think_tags(response.choices[0].message.content)
            
            # Parse the JSON response
            import json
            try:
                # Make sure content is valid JSON
                result = json.loads(content)
                
                # Extract domains from the result
                domains = []
                for i, domain in enumerate(result.get("domains", [])):
                    domains.append({
                        "id": domain.get("id", f"domain_{i}"),
                        "name": domain.get("name", "Unknown Domain"),
                        "description": domain.get("description", "No description available"),
                        "match_score": domain.get("match_score", 0.7),
                        "required_skills": domain.get("required_skills", [])
                    })
                
                # If no domains were provided, create a default one
                if not domains and result.get("ai_suggestion"):
                    domains.append({
                        "id": "default_domain",
                        "name": result.get("ai_suggestion"),
                        "description": f"Career path in {result.get('ai_suggestion')}",
                        "match_score": 0.9,
                        "required_skills": result.get("strengths", [])
                    })
                
                # Create sentiment summary
                sentiment = result.get("sentiment", {})
                sentiment_summary = {
                    "overall": sentiment.get("overall", 0.7),
                    "confidence": sentiment.get("confidence", 0.8),
                    "excitement": sentiment.get("excitement", 0.75)
                }
                
                return IkigaiResponse(
                    passion=result.get("passion", "No passion identified"),
                    strengths=result.get("strengths", []),
                    ai_suggestion=result.get("ai_suggestion", "No suggestion available"),
                    domains=domains,
                    sentiment=sentiment_summary,
                    projects=result.get("projects", [])
                )
                
            except json.JSONDecodeError:
                # If JSON parsing fails, create a default response
                print(f"Error parsing JSON response: {content}")
                return self._create_default_ikigai_response()
            
        except Exception as e:
            print(f"Error generating Ikigai response: {e}")
            return self._create_default_ikigai_response()
    
    def _create_default_ikigai_response(self) -> IkigaiResponse:
        """Create a default Ikigai response when analysis fails."""
        return IkigaiResponse(
            passion="Building AI systems that solve real-world problems",
            strengths=["Problem solving", "Logical thinking", "Programming"],
            ai_suggestion="Machine Learning Engineering",
            domains=[
                {
                    "id": "mlops",
                    "name": "MLOps",
                    "description": "Machine Learning Operations focuses on deploying and maintaining ML models in production.",
                    "match_score": 0.92,
                    "required_skills": ["Python", "Docker", "CI/CD", "Cloud Platforms"]
                },
                {
                    "id": "nlp",
                    "name": "Natural Language Processing",
                    "description": "NLP focuses on enabling computers to understand and process human language.",
                    "match_score": 0.85,
                    "required_skills": ["Python", "Linguistics", "Deep Learning", "Transformers"]
                }
            ],
            sentiment={
                "overall": 0.8,
                "confidence": 0.9,
                "excitement": 0.85
            },
            projects=[
                "Build a sentiment analysis model",
                "Create a chatbot with NLP capabilities",
                "Develop a recommendation system",
                "Implement a CI/CD pipeline for ML models",
                "Create a data visualization dashboard"
            ]
        )
    
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
