import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API base URL
BASE_URL = "http://localhost:8000/api/v1"

# Test user credentials
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "testpassword123"

# Global access token
access_token = None

def print_response(response, message=""):
    """Print response in a formatted way"""
    print(f"\n{'-'*50}")
    print(f"{message} - Status Code: {response.status_code}")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)
    print(f"{'-'*50}\n")

def test_auth():
    """Test authentication endpoints"""
    global access_token
    
    print("Testing authentication endpoints...")
    
    # Register user
    register_data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    print_response(response, "Register User")
    
    # Login user
    login_data = {
        "username": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    print_response(response, "Login User")
    
    if response.status_code == 200:
        access_token = response.json().get("access_token")
        print(f"Access token obtained: {access_token[:20]}...")
    else:
        print("Failed to obtain access token. Exiting tests.")
        exit(1)

def test_ikigai():
    """Test ikigai endpoints"""
    print("Testing ikigai endpoints...")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Save ikigai data
    ikigai_data = {
        "passion": "I'm fascinated by how AI can understand human language.",
        "strengths": "I have experience with Python programming and data analysis.",
        "ai_suggestion": "Natural Language Processing (NLP) seems like an excellent domain match for you.",
        "final_domain": "Natural Language Processing (NLP)"
    }
    
    response = requests.post(f"{BASE_URL}/ikigai", json=ikigai_data, headers=headers)
    print_response(response, "Save Ikigai Data")
    
    # Get ikigai data
    response = requests.get(f"{BASE_URL}/ikigai", headers=headers)
    print_response(response, "Get Ikigai Data")

def test_projects():
    """Test project endpoints"""
    print("Testing project endpoints...")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Create project
    project_data = {
        "title": "Sentiment Analysis Dashboard",
        "description": "Build a web app that analyzes sentiment from tweets or product reviews in real-time.",
        "difficulty": "Intermediate",
        "time_estimate": "2-4 weeks",
        "tasks": [
            "Set up a Streamlit or Flask web application",
            "Connect to Twitter API or scrape product reviews",
            "Implement a sentiment analysis model using NLTK or Transformers",
            "Create visualizations for sentiment trends",
            "Add filtering options by keywords or time period",
            "Deploy the application to a cloud platform"
        ],
        "domain": "Natural Language Processing (NLP)",
        "status": "in_progress"
    }
    
    response = requests.post(f"{BASE_URL}/projects", json=project_data, headers=headers)
    print_response(response, "Create Project")
    
    if response.status_code == 201:
        project_id = response.json().get("id")
        
        # Get project
        response = requests.get(f"{BASE_URL}/projects/{project_id}", headers=headers)
        print_response(response, "Get Project")
        
        # Update project
        update_data = {
            "status": "in_progress",
            "progress_percentage": 25
        }
        
        response = requests.patch(f"{BASE_URL}/projects/{project_id}", json=update_data, headers=headers)
        print_response(response, "Update Project")
        
        return project_id
    else:
        print("Failed to create project. Skipping related tests.")
        return None

def test_milestones(project_id):
    """Test milestone endpoints"""
    if not project_id:
        print("Skipping milestone tests due to missing project_id")
        return
    
    print("Testing milestone endpoints...")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Create milestone
    milestone_data = {
        "title": "Complete Data Collection Phase",
        "description": "Set up data collection pipeline and gather initial dataset",
        "due_date": "2025-06-15",
        "status": "not_started"
    }
    
    response = requests.post(f"{BASE_URL}/milestones?project_id={project_id}", json=milestone_data, headers=headers)
    print_response(response, "Create Milestone")
    
    if response.status_code == 201:
        milestone_id = response.json().get("id")
        
        # Get milestone
        response = requests.get(f"{BASE_URL}/milestones/{milestone_id}", headers=headers)
        print_response(response, "Get Milestone")
        
        # Get project milestones
        response = requests.get(f"{BASE_URL}/milestones/project/{project_id}", headers=headers)
        print_response(response, "Get Project Milestones")
        
        # Update milestone
        update_data = {
            "status": "in_progress"
        }
        
        response = requests.patch(f"{BASE_URL}/milestones/{milestone_id}", json=update_data, headers=headers)
        print_response(response, "Update Milestone")
        
        return milestone_id
    else:
        print("Failed to create milestone. Skipping related tests.")
        return None

def test_ai_services(project_id):
    """Test AI services endpoints"""
    print("Testing AI services endpoints...")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Generate domain suggestion
    params = {
        "passion": "I'm fascinated by how AI can understand human language.",
        "strengths": "I have experience with Python programming and data analysis."
    }
    
    response = requests.post(f"{BASE_URL}/ai/domain-suggestion", params=params, headers=headers)
    print_response(response, "Generate Domain Suggestion")
    
    # Generate social media post
    params = {
        "project_title": "Sentiment Analysis Dashboard",
        "domain": "Natural Language Processing (NLP)",
        "tasks_completed": "Set up Flask application, Implemented sentiment analysis model",
        "progress_percentage": 40
    }
    
    response = requests.post(f"{BASE_URL}/ai/social-media-post", params=params, headers=headers)
    print_response(response, "Generate Social Media Post")
    
    # Generate daily post
    params = {
        "project_title": "Sentiment Analysis Dashboard",
        "domain": "Natural Language Processing (NLP)",
        "day_number": 5,
        "goals_for_today": "Implement sentiment analysis model",
        "learnings": "Learned about BERT model fine-tuning for sentiment analysis"
    }
    
    response = requests.post(f"{BASE_URL}/ai/daily-post", params=params, headers=headers)
    print_response(response, "Generate Daily Post")
    
    # Delta 4 analysis
    if project_id:
        delta4_data = {
            "project_description": "Sentiment Analysis Dashboard for analyzing customer feedback",
            "current_status": "Implemented basic Flask app and data collection",
            "challenges": "Having trouble with model accuracy and API rate limits",
            "goals": "Create a real-time dashboard with high accuracy sentiment analysis"
        }
        
        response = requests.post(f"{BASE_URL}/delta4/analyze?project_id={project_id}", json=delta4_data, headers=headers)
        print_response(response, "Delta 4 Analysis")

def test_target_firms():
    """Test target firms endpoints"""
    print("Testing target firms endpoints...")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Add target firm
    firm_data = {
        "name": "OpenAI"
    }
    
    response = requests.post(f"{BASE_URL}/target-firms", json=firm_data, headers=headers)
    print_response(response, "Add Target Firm")
    
    if response.status_code == 201:
        company_id = response.json().get("id")
        
        # Get target firms
        response = requests.get(f"{BASE_URL}/target-firms", headers=headers)
        print_response(response, "Get Target Firms")
        
        # Get company insights
        response = requests.get(f"{BASE_URL}/target-firms/{company_id}/insights", headers=headers)
        print_response(response, "Get Company Insights")
        
        return company_id
    else:
        print("Failed to add target firm. Skipping related tests.")
        return None

def cleanup(project_id, milestone_id, company_id):
    """Clean up test data"""
    print("Cleaning up test data...")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Delete milestone
    if milestone_id:
        response = requests.delete(f"{BASE_URL}/milestones/{milestone_id}", headers=headers)
        print_response(response, "Delete Milestone")
    
    # Delete project
    if project_id:
        response = requests.delete(f"{BASE_URL}/projects/{project_id}", headers=headers)
        print_response(response, "Delete Project")
    
    # Delete target firm
    if company_id:
        response = requests.delete(f"{BASE_URL}/target-firms/{company_id}", headers=headers)
        print_response(response, "Delete Target Firm")
    
    # Logout
    response = requests.post(f"{BASE_URL}/auth/logout", headers=headers)
    print_response(response, "Logout")

def main():
    """Run all tests"""
    print("Starting API tests...")
    
    try:
        # Test authentication
        test_auth()
        
        # Test ikigai
        test_ikigai()
        
        # Test projects
        project_id = test_projects()
        
        # Test milestones
        milestone_id = test_milestones(project_id)
        
        # Test AI services
        test_ai_services(project_id)
        
        # Test target firms
        company_id = test_target_firms()
        
        # Clean up
        cleanup(project_id, milestone_id, company_id)
        
        print("All tests completed!")
    except Exception as e:
        print(f"Error during tests: {str(e)}")

if __name__ == "__main__":
    main()
