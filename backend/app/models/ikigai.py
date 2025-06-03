from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class ChatMessage(BaseModel):
    role: str = Field(..., description="Role of the message sender: 'user' or 'assistant'")
    content: str = Field(..., description="Content of the message")
    sentiment: Optional[Any] = Field(None, description="Sentiment analysis of the message")


class SentimentAnalysis(BaseModel):
    score: float = Field(..., description="Sentiment score from -1 (negative) to 1 (positive)")
    label: str = Field(..., description="Sentiment label: negative, neutral, positive")
    keywords: List[str] = Field(..., description="Keywords extracted from the message")


class DomainMatch(BaseModel):
    id: str
    name: str
    description: str
    match_score: float = Field(..., description="Match score from 0 to 1")
    required_skills: List[str]


class SentimentSummary(BaseModel):
    overall: float = Field(..., description="Overall sentiment from -1 to 1")
    confidence: float = Field(..., description="Confidence in the sentiment analysis from 0 to 1")
    excitement: float = Field(..., description="Excitement level from 0 to 1")


class IkigaiResponse(BaseModel):
    passion: str
    strengths: List[str]
    ai_suggestion: str
    domains: List[DomainMatch]
    sentiment: SentimentSummary
    projects: List[str] = Field(default_factory=list, description="Suggested projects for skill development")
