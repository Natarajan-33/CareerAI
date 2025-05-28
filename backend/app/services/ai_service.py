import os
from typing import List, Dict, Any, Optional

import openai
from app.core.config import settings
from app.models.ikigai import ChatMessage, SentimentAnalysis, IkigaiResponse


class AIService:
    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY must be set in environment variables")
        
        openai.api_key = settings.OPENAI_API_KEY
    
    async def generate_chat_response(self, messages: List[ChatMessage]) -> ChatMessage:
        """Generate a response from the AI assistant based on conversation history."""
        # Convert our ChatMessage objects to the format expected by OpenAI
        openai_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in messages
        ]
        
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",  # or another appropriate model
                messages=openai_messages,
                temperature=0.7,
                max_tokens=500
            )
            
            # Extract the assistant's response
            content = response.choices[0].message.content
            
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
            
            response = await openai.Completion.acreate(
                model="gpt-3.5-turbo-instruct",
                prompt=prompt,
                temperature=0,
                max_tokens=150,
                top_p=1.0,
                frequency_penalty=0.0,
                presence_penalty=0.0
            )
            
            # Parse the response as JSON
            import json
            result = json.loads(response.choices[0].text.strip())
            
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
        # This would be a more complex implementation in production
        # Here we're just returning a placeholder
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
            }
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
