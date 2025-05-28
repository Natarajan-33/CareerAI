from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

# Import services
from app.services.ai_services import generate_domain_suggestion
from app.db.supabase import get_supabase_client

# Create router
router = APIRouter()

# Models
class Message(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = datetime.now()

class ConversationRequest(BaseModel):
    user_id: str
    message: str
    conversation_id: Optional[str] = None

class ConversationResponse(BaseModel):
    conversation_id: str
    message: Message
    insights: Optional[Dict[str, Any]] = None

class IkigaiData(BaseModel):
    user_id: str
    passion: str
    strengths: str
    ai_suggestion: str
    final_domain: str

# Ikigai endpoints
@router.post("/conversation", response_model=ConversationResponse)
async def process_conversation(request: ConversationRequest):
    """Process a conversation message and generate a response"""
    try:
        # Get or create conversation
        conversation_id = request.conversation_id
        supabase = get_supabase_client()
        
        # If no conversation ID, create a new conversation
        if not conversation_id:
            # Create new conversation in database
            result = supabase.table("ikigai_conversations").insert({
                "user_id": request.user_id,
                "conversation_data": [{"role": "system", "content": "I am an AI career advisor helping you discover your ikigai."}],
                "insights_extracted": {},
                "started_at": datetime.now().isoformat(),
                "last_message_at": datetime.now().isoformat(),
                "completed": False
            }).execute()
            
            conversation_id = result.data[0]["id"]
        
        # Get existing conversation
        conversation = supabase.table("ikigai_conversations").select("*").eq("id", conversation_id).execute()
        
        if not conversation.data:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Add user message to conversation
        conversation_data = conversation.data[0]["conversation_data"]
        conversation_data.append({"role": "user", "content": request.message, "timestamp": datetime.now().isoformat()})
        
        # Process message with AI and extract insights
        # This would be a more complex implementation in a real system
        # For now, we'll use a simplified approach
        
        # Extract insights based on conversation context
        insights = extract_insights_from_conversation(conversation_data)
        
        # Generate AI response
        ai_response = generate_ai_response(conversation_data, insights)
        
        # Add AI response to conversation
        conversation_data.append({"role": "assistant", "content": ai_response, "timestamp": datetime.now().isoformat()})
        
        # Update conversation in database
        supabase.table("ikigai_conversations").update({
            "conversation_data": conversation_data,
            "insights_extracted": insights,
            "last_message_at": datetime.now().isoformat()
        }).eq("id", conversation_id).execute()
        
        # Return response
        return {
            "conversation_id": conversation_id,
            "message": Message(role="assistant", content=ai_response),
            "insights": insights
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing conversation: {str(e)}"
        )

@router.post("/save-ikigai")
async def save_ikigai(ikigai_data: IkigaiData):
    """Save Ikigai data for a user"""
    try:
        supabase = get_supabase_client()
        result = supabase.table("ikigai").insert({
            "user_id": ikigai_data.user_id,
            "passion": ikigai_data.passion,
            "strengths": ikigai_data.strengths,
            "ai_suggestion": ikigai_data.ai_suggestion,
            "final_domain": ikigai_data.final_domain,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }).execute()
        
        return {"message": "Ikigai data saved successfully", "id": result.data[0]["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving Ikigai data: {str(e)}"
        )

@router.get("/domain-suggestion")
async def get_domain_suggestion(passion: str, strengths: str):
    """Generate domain suggestions based on passion and strengths"""
    try:
        suggestion = generate_domain_suggestion(passion, strengths)
        return {"suggestion": suggestion}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating domain suggestion: {str(e)}"
        )

# Helper functions
def extract_insights_from_conversation(conversation_data):
    """Extract insights from conversation data"""
    # This would be implemented with NLP in a real system
    # For now, return a simplified placeholder
    return {
        "passions": ["AI", "helping others", "solving problems"],
        "strengths": ["analytical thinking", "programming", "communication"],
        "interests": ["machine learning", "data science", "robotics"],
        "confidence": 0.85
    }

def generate_ai_response(conversation_data, insights):
    """Generate AI response based on conversation context and insights"""
    # This would be implemented with a language model in a real system
    # For now, return a simplified placeholder response
    
    # Get the last user message
    last_user_message = next((msg["content"] for msg in reversed(conversation_data) if msg["role"] == "user"), None)
    
    if "passion" in last_user_message.lower() or "enjoy" in last_user_message.lower():
        return "That's great! Your passions can be a strong indicator of where you'll find fulfillment. Can you tell me more about your technical skills and strengths?"
    elif "strength" in last_user_message.lower() or "good at" in last_user_message.lower():
        return "Thanks for sharing your strengths. Now, let's think about how these align with market demands. What kinds of AI or ML applications are you most interested in working on?"
    elif "domain" in last_user_message.lower() or "field" in last_user_message.lower():
        return "Based on what you've shared, you might be well-suited for Natural Language Processing or Computer Vision. These fields align with your interests and strengths. Does either of these resonate with you?"
    else:
        return "I'm here to help you discover your ideal path in AI and ML. Can you tell me more about what aspects of technology you're most passionate about?"
