from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Optional, Dict, Any
import uuid

from app.models.ikigai import ChatMessage, IkigaiResponse, SentimentAnalysis
from pydantic import BaseModel, Field
from app.services.ai_service import AIService
from app.db.supabase import get_supabase_client

router = APIRouter()

# Initialize AI service
ai_service = AIService()


# Define a standard request model for chat messages
class ChatRequest(BaseModel):
    message: str = Field(..., description="The user's message")
    conversation_id: Optional[str] = Field(None, description="Optional conversation ID for tracking")

@router.post("/chat", response_model=ChatMessage)
async def chat_message(request: Optional[ChatRequest] = None, body: Optional[Dict[str, Any]] = Body(None)):
    """Process a chat message and return AI response using a standardized format."""
    try:
        # Print the raw request body for debugging
        print(f"Raw request body: {body}")
        
        # Handle different request formats
        user_message = None
        
        # If we got a ChatRequest object
        if request is not None:
            user_message = ChatMessage(role="user", content=request.message)
            print(f"Using ChatRequest format: {request.message}")
        
        # If we got a raw body
        elif body is not None:
            # Try different formats that might be coming from the frontend
            if isinstance(body, dict):
                # Format 1: {"message": "Hello"}
                if "message" in body and isinstance(body["message"], str):
                    user_message = ChatMessage(role="user", content=body["message"])
                    print(f'Using message string format: {body["message"]}')
                
                # Format 2: {"content": "Hello"}
                elif "content" in body and isinstance(body["content"], str):
                    user_message = ChatMessage(role="user", content=body["content"])
                    print(f'Using content string format: {body["content"]}')
                
                # Format 3: {"message": {"role": "user", "content": "Hello"}}
                elif "message" in body and isinstance(body["message"], dict) and "content" in body["message"]:
                    msg_dict = body["message"]
                    user_message = ChatMessage(
                        role=msg_dict.get("role", "user"),
                        content=msg_dict["content"]
                    )
                    print(f'Using message object format: {msg_dict["content"]}')
        
        # If we still don't have a user message, create a default one
        if user_message is None:
            user_message = ChatMessage(role="user", content="Hello")
            print("Using default message")
        
        # Initialize conversation history with just the user message
        conversation_history = [user_message]
        
        # Generate response using AI service
        response = await ai_service.generate_chat_response(conversation_history)
        
        return response
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        # Return a default response in case of error
        return ChatMessage(
            role="assistant",
            content="I'm sorry, I encountered an error processing your request. Please try again."
        )


@router.post("/chat-simple", response_model=ChatMessage)
async def chat_message_simple(request: Dict[str, Any]):
    """Process a chat message with a simpler request format and return AI response."""
    # Extract message content and role from the request
    content = request.get("message", "")
    role = request.get("role", "user")
    
    # Create a ChatMessage object
    message = ChatMessage(role=role, content=content)
    
    # Extract conversation history if provided
    history_data = request.get("conversation_history", [])
    conversation_history = []
    
    # Convert history data to ChatMessage objects
    for msg in history_data:
        if isinstance(msg, dict) and "role" in msg and "content" in msg:
            conversation_history.append(ChatMessage(role=msg["role"], content=msg["content"]))
    
    # If no conversation history, use just the current message
    if not conversation_history:
        conversation_history = [message]
    else:
        conversation_history.append(message)
    
    # Generate response using AI service
    response = await ai_service.generate_chat_response(conversation_history)
    
    return response


@router.post("/debug")
async def debug_request(request: Dict[str, Any] = Body(...)):
    """Debug endpoint to log the raw request body."""
    print("==== DEBUG REQUEST ====")
    print(f"Request type: {type(request)}")
    print(f"Request content: {request}")
    print("=====================")
    
    # Return the request as-is for debugging
    return {
        "received": request,
        "message": "Request logged for debugging"
    }


@router.post("/analyze-sentiment", response_model=SentimentAnalysis)
async def analyze_sentiment(message: ChatMessage):
    """Analyze sentiment from user message."""
    # Use AI service to analyze sentiment
    sentiment = await ai_service.analyze_sentiment(message.content)
    return sentiment


@router.post("/generate-ikigai", response_model=IkigaiResponse)
async def generate_ikigai(conversation_data: Dict[str, Any]):
    """Generate Ikigai results based on conversation history."""
    # Extract conversation history from request
    conversation_id = conversation_data.get("conversation_id")
    messages = conversation_data.get("messages", [])
    
    # Log the request for debugging
    print(f"Generating Ikigai with {len(messages)} messages")
    if conversation_id:
        print(f"Conversation ID: {conversation_id}")
    
    # Convert dictionary messages to ChatMessage objects
    chat_messages = []
    for msg in messages:
        try:
            if isinstance(msg, dict):
                # Clean up the message data to ensure it's compatible with the model
                cleaned_msg = {
                    'role': msg.get('role', 'user'),
                    'content': msg.get('content', '')
                }
                # Only include sentiment if it exists and is properly structured
                if 'sentiment' in msg and msg['sentiment'] is not None:
                    cleaned_msg['sentiment'] = msg['sentiment']
                    
                chat_messages.append(ChatMessage(**cleaned_msg))
            else:
                chat_messages.append(msg)
        except Exception as e:
            print(f"Error converting message to ChatMessage: {e}")
            # Create a basic message without problematic fields
            chat_messages.append(ChatMessage(
                role=msg.get('role', 'user') if isinstance(msg, dict) else 'user',
                content=msg.get('content', '') if isinstance(msg, dict) else str(msg)
            ))
    
    # Generate Ikigai results
    if not chat_messages:
        raise HTTPException(status_code=400, detail="No conversation history provided")
    
    ikigai_response = await ai_service.generate_ikigai(chat_messages)
    
    # In a full implementation, we would save results to the database here
    # But we're keeping it simple without database interactions for now
    user_id = conversation_data.get("user_id")
    if user_id:
        print(f"Would save Ikigai results for user {user_id} (database disabled)")
    
    return ikigai_response


@router.post("/save-conversation", status_code=status.HTTP_201_CREATED)
async def save_conversation(user_id: str, conversation_data: List[ChatMessage], conversation_id: Optional[str] = None, insights: Optional[dict] = None):
    """Save the Ikigai conversation and extracted insights."""
    try:
        # Generate a new conversation ID if not provided
        if not conversation_id:
            conversation_id = str(uuid.uuid4())
        
        # In a full implementation, we would save to the database here
        # But we're keeping it simple without database interactions for now
        print(f"Would save conversation for user {user_id} with ID {conversation_id} (database disabled)")
        print(f"Conversation contains {len(conversation_data)} messages")
        
        return {"success": True, "conversation_id": conversation_id}
        
    except Exception as e:
        print(f"Error in save_conversation: {e}")
        raise HTTPException(status_code=500, detail="Failed to process conversation")


@router.get("/conversations/{user_id}", status_code=status.HTTP_200_OK)
async def get_user_conversations(user_id: str):
    """Get all Ikigai conversations for a user."""
    try:
        # In a full implementation, we would fetch from the database here
        # But we're keeping it simple without database interactions for now
        print(f"Would fetch conversations for user {user_id} (database disabled)")
        
        # Return mock data for testing
        return {"conversations": [
            {"id": "mock-conversation-1", "user_id": user_id, "created_at": "2025-05-30T00:00:00"},
            {"id": "mock-conversation-2", "user_id": user_id, "created_at": "2025-05-29T00:00:00"}
        ]}
        
    except Exception as e:
        print(f"Error in get_user_conversations: {e}")
        raise HTTPException(status_code=500, detail="Failed to process request")


@router.get("/conversation/{conversation_id}", status_code=status.HTTP_200_OK)
async def get_conversation(conversation_id: str):
    """Get a specific Ikigai conversation."""
    try:
        # In a full implementation, we would fetch from the database here
        # But we're keeping it simple without database interactions for now
        print(f"Would fetch conversation with ID {conversation_id} (database disabled)")
        
        # Return mock data for testing
        if conversation_id == "mock-conversation-1" or conversation_id == "mock-conversation-2":
            return {
                "id": conversation_id,
                "user_id": "test-user",
                "created_at": "2025-05-30T00:00:00",
                "messages": [
                    {"role": "user", "content": "Hello, I want to find my ikigai"},
                    {"role": "assistant", "content": "That's great! I'd love to help you discover your ikigai."}
                ]
            }
        else:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error in get_conversation: {e}")
        raise HTTPException(status_code=500, detail="Failed to process request")


@router.get("/results/{user_id}", status_code=status.HTTP_200_OK)
async def get_user_ikigai_results(user_id: str):
    """Get all Ikigai results for a user."""
    try:
        # In a full implementation, we would fetch from the database here
        # But we're keeping it simple without database interactions for now
        print(f"Would fetch Ikigai results for user {user_id} (database disabled)")
        
        # Return mock data for testing
        return {"results": [
            {
                "id": "mock-result-1",
                "user_id": user_id,
                "created_at": "2025-05-30T00:00:00",
                "passion": "Building AI systems that solve real-world problems",
                "strengths": ["Problem solving", "Logical thinking", "Programming"],
                "ai_suggestion": "Machine Learning Engineering",
                "domains": [
                    {
                        "id": "mlops",
                        "name": "MLOps",
                        "description": "Machine Learning Operations",
                        "match_score": 0.92
                    }
                ],
                "sentiment": {
                    "overall": 0.8,
                    "confidence": 0.9,
                    "excitement": 0.85
                }
            }
        ]}
        
    except Exception as e:
        print(f"Error in get_user_ikigai_results: {e}")
        raise HTTPException(status_code=500, detail="Failed to process request")
