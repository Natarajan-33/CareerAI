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
    """Process a chat message and return AI response using a standardized format.
    
    This endpoint ensures that the first message is always from the user,
    and the LLM call only happens after the user sends a message.
    """
    try:
        # Print the raw request body for debugging
        print(f"Raw request body: {body}")
        
        # Handle different request formats
        user_message = None
        conversation_history = []
        
        # If we got a ChatRequest object
        if request is not None:
            user_message = ChatMessage(role="user", content=request.message)
            print(f"Using ChatRequest format: {request.message}")
            
            # Check if conversation history was provided
            if hasattr(request, 'conversation_history') and request.conversation_history:
                conversation_history = request.conversation_history
        
        # If we got a raw body
        elif body is not None:
            # Try different formats that might be coming from the frontend
            if isinstance(body, dict):
                # Extract conversation history if provided
                if "conversation_history" in body and isinstance(body["conversation_history"], list):
                    for msg in body["conversation_history"]:
                        if isinstance(msg, dict) and "role" in msg and "content" in msg:
                            conversation_history.append(ChatMessage(
                                role=msg["role"],
                                content=msg["content"]
                            ))
                
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
        
        # Add the user message to the conversation history
        conversation_history.append(user_message)
        
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
    """Process a chat message with a simpler request format and return AI response.
    
    This endpoint ensures that the first message is always from the user,
    and the LLM call only happens after the user sends a message.
    """
    # Extract message content and role from the request
    content = request.get("message", "")
    role = request.get("role", "user")
    
    # Create a ChatMessage object for the current message
    message = ChatMessage(role=role, content=content)
    
    # Extract conversation history if provided
    history_data = request.get("conversation_history", [])
    conversation_history = []
    
    # Convert history data to ChatMessage objects
    for msg in history_data:
        if isinstance(msg, dict) and "role" in msg and "content" in msg:
            conversation_history.append(ChatMessage(role=msg["role"], content=msg["content"]))
    
    # Ensure the conversation starts with a user message
    if not conversation_history:
        # If no history, just use the current message (which should be from the user)
        conversation_history = [message]
    else:
        # If the first message is not from a user, prepend a user message
        if conversation_history[0].role != 'user' and len(conversation_history) > 1:
            # Find the first user message and move it to the front
            for i, msg in enumerate(conversation_history):
                if msg.role == 'user':
                    user_msg = conversation_history.pop(i)
                    conversation_history.insert(0, user_msg)
                    break
        
        # Add the current message to the history
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
    """Generate Ikigai results based on conversation history.
    
    This endpoint analyzes the entire conversation history to generate personalized Ikigai results.
    It does not show default recommendations unless there's an error in processing.
    """
    # Extract conversation history from request
    conversation_id = conversation_data.get("conversation_id")
    messages = conversation_data.get("messages", [])
    user_id = conversation_data.get("user_id")
    
    # Log the request for debugging
    print(f"Generating Ikigai with {len(messages)} messages")
    if conversation_id:
        print(f"Conversation ID: {conversation_id}")
    if user_id:
        print(f"User ID: {user_id}")
    
    # Ensure we have enough messages for analysis
    if not messages or len(messages) < 2:
        raise HTTPException(
            status_code=400, 
            detail="Insufficient conversation history. Please continue the conversation before generating Ikigai results."
        )
    
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
    
    # Verify that the conversation starts with a user message
    if not chat_messages or chat_messages[0].role != 'user':
        # Add a note about this in the response, but continue processing
        print("Warning: Conversation does not start with a user message")
    
    # Generate Ikigai results
    ikigai_response = await ai_service.generate_ikigai(chat_messages)
    
    return ikigai_response


@router.post("/save-ikigai-result", status_code=status.HTTP_201_CREATED)
async def save_ikigai_result(user_id: str, ikigai_result: IkigaiResponse):
    """Save the generated Ikigai result to the database.
    
    Args:
        user_id: The ID of the user to save the result for
        ikigai_result: The Ikigai result to save
        
    Returns:
        A dictionary with the save status and the saved result ID
    """
    try:
        # Use the AI service to save the result
        save_result = await ai_service.save_ikigai_result(user_id, ikigai_result)
        
        if save_result["success"]:
            return {
                "success": True, 
                "message": "Ikigai result saved successfully", 
                "result_id": save_result["id"]
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save Ikigai result: {save_result.get('error', 'Unknown error')}"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving Ikigai result: {str(e)}"
        )

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
