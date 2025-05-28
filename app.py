import streamlit as st
import os
from dotenv import load_dotenv
import json
import pandas as pd
from utils.supabase import (
    register_user, login_user, logout_user, 
    save_user_profile, save_ikigai_data, 
    save_project_selection, save_progress, save_project_milestone, update_milestone_status
)
from utils.ai_services import generate_domain_suggestion, generate_social_media_post, generate_daily_post, analyze_delta4, get_company_insights

# Load environment variables
load_dotenv()

# Helper function to handle both dictionary and Pydantic model user objects
def get_user_property(user_obj, property_name, default=None):
    if user_obj is None:
        return default
    
    if hasattr(user_obj, property_name):
        # Pydantic model case
        return getattr(user_obj, property_name)
    else:
        # Dictionary case
        return user_obj.get(property_name, default)

def is_guest_user(user_obj):
    return get_user_property(user_obj, "id") == "guest"

# Set page configuration
st.set_page_config(
    page_title="CareerAI - Your AI Career Companion",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize session state variables if they don't exist
if "user_logged_in" not in st.session_state:
    st.session_state.user_logged_in = False
if "user_info" not in st.session_state:
    st.session_state.user_info = None
if "user_data" not in st.session_state:
    st.session_state.user_data = {
        "profile_type": None,
        "skill_level": None,
        "immediate_goals": None,
        "domain_selected": None,
        "ikigai": {
            "passion": "",
            "strengths": "",
            "ai_suggestion": "",
            "final_domain": ""
        }
    }
if "projects" not in st.session_state:
    st.session_state.projects = []

# Authentication functions
def show_login_form():
    st.subheader("Login")
    email = st.text_input("Email", key="login_email")
    password = st.text_input("Password", type="password", key="login_password")
    
    if st.button("Login", key="login_button"):
        try:
            response = login_user(email, password)
            st.session_state.user_logged_in = True
            st.session_state.user_info = response.user
            st.success("Logged in successfully!")
            st.rerun()
        except Exception as e:
            st.error(f"Login failed: {str(e)}")

def show_signup_form():
    st.subheader("Create an Account")
    email = st.text_input("Email", key="signup_email")
    password = st.text_input("Password", type="password", key="signup_password")
    
    if st.button("Sign Up", key="signup_button"):
        try:
            response = register_user(email, password)
            st.success("Account created! Please log in.")
            st.session_state.show_login = True
            st.rerun()
        except Exception as e:
            st.error(f"Signup failed: {str(e)}")

def authenticate():
    if not st.session_state.user_logged_in:
        tab1, tab2 = st.tabs(["Login", "Sign Up"])
        
        with tab1:
            show_login_form()
        
        with tab2:
            show_signup_form()
        
        st.markdown("---")
        if st.button("Continue as Guest"):
            st.session_state.user_logged_in = True
            st.session_state.user_info = {"id": "guest", "email": "guest"}
            st.rerun()
        
        return False
    
    return True

# Main navigation
def main():
    # Sidebar
    with st.sidebar:
        st.image("static\images\careerAI.png", width=150)
        st.title("CareerAI")
        st.caption("Your AI-powered career companion")
        
        # Show user info if logged in
        if st.session_state.user_logged_in and st.session_state.user_info:
            if is_guest_user(st.session_state.user_info):
                st.write("Welcome, Guest!")
                st.caption("Sign up to save your progress")
            else:
                email = get_user_property(st.session_state.user_info, "email", "")
                st.write(f"Welcome, {email}")
        
        st.divider()
        
        # Login/Logout button
        if st.session_state.user_logged_in:
            if st.button("Logout"):
                if not is_guest_user(st.session_state.user_info):
                    logout_user()
                st.session_state.user_logged_in = False
                st.session_state.user_info = None
                st.rerun()
        
        st.caption("© 2025 CareerAI")

    # Content
    if not st.session_state.user_logged_in:
        authenticate()
    else:
        # Tab-based navigation
        tab_names = [
            "Welcome & Onboarding",
            "Ikigai Discovery",
            "Domain Selection",
            "Project Selection",
            "Progress Tracking",
            "Daily Build in Public", 
            "Project Milestones",
            "Friction & Delight Points",
            "Target Firm Alerts"
        ]
        
        tabs = st.tabs(tab_names)
        
        with tabs[0]:
            show_welcome_page()
        
        with tabs[1]:
            show_ikigai_page()
        
        with tabs[2]:
            show_domain_page()
        
        with tabs[3]:
            show_project_page()
        
        with tabs[4]:
            # Check if we have projects before showing progress page
            if len(st.session_state.projects) > 0:
                show_progress_page()
            else:
                st.error("No projects selected yet. Please select a project in the Project Selection tab first.")
        
        with tabs[5]:
            show_daily_post_page()
        
        with tabs[6]:
            show_milestone_page()
        
        with tabs[7]:
            show_friction_points_page()
        
        with tabs[8]:
            show_firm_alerts_page()

# Welcome & Onboarding Page
def show_welcome_page():
    st.title("Welcome to CareerAI 🚀")
    st.write("""
    CareerAI is your personalized AI-powered career companion that guides you through a structured journey toward AI/ML and robotics roles.
    Let's start by understanding a bit about you.
    """)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Tell us about yourself")
        profile_options = ["Student", "Working Professional", "Bootcamp Learner", "Self-taught Developer", "Other"]
        profile_type = st.selectbox("I am a:", profile_options, index=None, placeholder="Select your background")
        
        skill_options = ["Beginner", "Intermediate", "Advanced"]
        skill_level = st.selectbox("My skill level in AI/ML is:", skill_options, index=None, placeholder="Select your skill level")
        
        goal_options = ["Entrepreneurship","Learn AI/ML concepts", "Build projects for portfolio", "Transition to AI career", "Upskill in current role", "Explore career options"]
        immediate_goals = st.multiselect("My immediate goals are:", goal_options)
    
    with col2:
        st.subheader("Why CareerAI?")
        st.write("""
        📊 **Market Alignment**: Discover domains that match your interests with market demand
        
        🛠️ **Project-Based Learning**: Apply your skills to real-world projects
        
        🚀 **Structured Progress**: Follow a clear path from learning to career launch
        
        🌐 **Build in Public**: Share your journey and get feedback from the community
        """)
    
    if profile_type and skill_level and immediate_goals:
        # Save user input to session state
        st.session_state.user_data["profile_type"] = profile_type
        st.session_state.user_data["skill_level"] = skill_level
        st.session_state.user_data["immediate_goals"] = immediate_goals
        
        # Save to database if logged in (not as guest)
        if st.session_state.user_logged_in and not is_guest_user(st.session_state.user_info):
            try:
                save_user_profile(
                    get_user_property(st.session_state.user_info, "id"),
                    {
                        "profile_type": profile_type,
                        "skill_level": skill_level,
                        "immediate_goals": json.dumps(immediate_goals)
                    }
                )
            except Exception as e:
                st.warning(f"Could not save profile to database: {str(e)}")
        
        # Guide to next tab
        st.success("Profile information saved! Please proceed to the Ikigai Discovery tab.")
    else:
        st.info("Please fill out the information above to continue.")

# Ikigai Discovery Page
def show_ikigai_page():
    st.title("Ikigai Discovery 🧠")
    st.write("""
    Ikigai is the Japanese concept of finding purpose through the intersection of:
    - What you love (Passion)
    - What you're good at (Strength)
    - What the world needs (Vocation)
    - What you can be paid for (Profession)
    
    Let's find your AI/ML Ikigai!
    """)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Reflect on these questions")
        passion = st.text_area(
            "What AI/ML topics excite you the most? What problems would you love to solve?",
            height=150,
            placeholder="E.g., I'm fascinated by how AI can understand human language. I enjoy working with text data and building systems that can analyze sentiment or generate creative content."
        )
        
        strengths = st.text_area(
            "What technical or soft skills do you already have that could be valuable in AI/ML?",
            height=150,
            placeholder="E.g., I have experience with Python programming and data analysis. I'm good at explaining complex concepts and enjoy teaching others."
        )
    
    with col2:
        st.subheader("Your AI Domain Suggestion")
        if passion and strengths:
            # Save to session state
            st.session_state.user_data["ikigai"]["passion"] = passion
            st.session_state.user_data["ikigai"]["strengths"] = strengths
            
            # Get AI suggestion
            with st.spinner("Analyzing your responses..."):
                try:
                    ai_suggestion = generate_domain_suggestion(passion, strengths)
                    st.session_state.user_data["ikigai"]["ai_suggestion"] = ai_suggestion
                    st.markdown(f"**AI Suggestion:**\n{ai_suggestion}")
                    
                    # Save to database if logged in (not as guest)
                    if st.session_state.user_logged_in and not is_guest_user(st.session_state.user_info):
                        try:
                            save_ikigai_data(
                                get_user_property(st.session_state.user_info, "id"),
                                {
                                    "passion": passion,
                                    "strengths": strengths,
                                    "ai_suggestion": ai_suggestion
                                }
                            )
                        except Exception as e:
                            st.warning(f"Could not save ikigai data to database: {str(e)}")
                    
                    # Guide to next tab
                    st.success("Ikigai information saved! Please proceed to the Domain Selection tab.")
                        
                except Exception as e:
                    st.error(f"Error generating domain suggestion: {str(e)}")
        else:
            st.info("Please reflect on the questions to receive an AI-powered domain suggestion.")

# Domain Selection Page
def show_domain_page():
    st.title("Domain Selection & Refinement 🎯")
    
    if st.session_state.user_data["ikigai"]["ai_suggestion"]:
        st.write("Based on your Ikigai discovery, we've suggested a domain that matches your interests and strengths.")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("AI Suggested Domain")
            st.write(st.session_state.user_data["ikigai"]["ai_suggestion"])
        
        with col2:
            st.subheader("Refine Your Domain")
            domain_options = [
                "Natural Language Processing (NLP)",
                "Computer Vision",
                "Reinforcement Learning",
                "Time Series/Forecasting",
                "Recommender Systems",
                "MLOps/ML Engineering",
                "Robotics",
                "Other"
            ]
            
            selected_domain = st.selectbox(
                "Select your preferred domain:",
                domain_options,
                index=0,
                placeholder="Choose a domain"
            )
            
            domain_notes = st.text_area(
                "Add any specific areas or applications you're interested in:",
                placeholder="E.g., I want to focus on building conversational agents for customer service"
            )
        
        # Save domain selection
        if selected_domain:
            final_domain = f"{selected_domain}: {domain_notes}" if domain_notes else selected_domain
            st.session_state.user_data["domain_selected"] = selected_domain
            st.session_state.user_data["ikigai"]["final_domain"] = final_domain
            
            # Save to database if logged in (not as guest)
            if st.session_state.user_logged_in and not is_guest_user(st.session_state.user_info):
                try:
                    # Save ikigai final domain to ikigai_logs table
                    save_ikigai_data(
                        get_user_property(st.session_state.user_info, "id"),
                        {
                            "final_domain": final_domain,
                            "domain_selected": selected_domain
                        }
                    )
                except Exception as e:
                    st.warning(f"Could not save domain selection to database: {str(e)}")
            
            # Guide to next tab
            st.success("Domain selection saved! Please proceed to the Project Selection tab.")
    else:
        st.error("Please complete the Ikigai Discovery step first.")
        st.info("Go to the Ikigai Discovery tab to complete that step first.")

# Project Selection Page
def show_project_page():
    st.title("Project Selection & Breakdown 🛠️")
    
    if st.session_state.user_data["domain_selected"]:
        st.write(f"Now let's choose a project in your selected domain: **{st.session_state.user_data['domain_selected']}**")
        
        # Example projects based on domain
        projects = generate_project_suggestions(st.session_state.user_data["domain_selected"])
        
        # Display project options
        st.subheader("Choose a Project")
        
        cols = st.columns(len(projects))
        selected_project = None
        
        for i, (col, project) in enumerate(zip(cols, projects)):
            with col:
                st.write(f"**{project['title']}**")
                st.write(project["description"])
                st.write(f"**Difficulty:** {project['difficulty']}")
                st.write(f"**Est. Time:** {project['time_estimate']}")
                
                if st.button(f"Select Project", key=f"select_project_{i}"):
                    selected_project = project
        
        # If a project is selected
        if selected_project:
            # Add project to session state if not already there
            if not any(p.get("title") == selected_project["title"] for p in st.session_state.projects):
                st.session_state.projects.append(selected_project)
            
            # Save project selection to database if logged in (not as guest)
            if st.session_state.user_logged_in and not is_guest_user(st.session_state.user_info):
                try:
                    save_project_selection(
                        get_user_property(st.session_state.user_info, "id"),
                        {
                            "title": selected_project["title"],
                            "description": selected_project["description"],
                            "difficulty": selected_project["difficulty"],
                            "time_estimate": selected_project["time_estimate"],
                            "tasks": json.dumps(selected_project["tasks"]),
                            "domain": st.session_state.user_data["domain_selected"],
                            "status": "in_progress"
                        }
                    )
                except Exception as e:
                    st.warning(f"Could not save project selection to database: {str(e)}")
            
            st.success(f"Project '{selected_project['title']}' selected successfully!")
            st.subheader(f"Project: {selected_project['title']}")
            st.write(selected_project["description"])
            
            # Display project tasks
            st.subheader("Project Tasks")
            for i, task in enumerate(selected_project["tasks"]):
                st.checkbox(task, key=f"task_{len(st.session_state.projects)-1}_{i}")
            
            # Guide to next tab
            st.success("You can now track your progress in the Progress Tracking tab.")
    else:
        st.error("Please select a domain first.")
        st.info("Go to the Domain Selection tab to select a domain first.")

# Progress Tracking Page
def show_progress_page():
    st.title("Progress Tracking Dashboard 📊")
    
    # Check if user has selected any projects
    if len(st.session_state.projects) == 0:
        st.error("You haven't selected any projects yet.")
        st.info("Please go to the Project Selection tab first to select a project.")
        return
    
    # Display all selected projects
    for i, project in enumerate(st.session_state.projects):
        with st.expander(f"Project: {project['title']}", expanded=True):
            st.write(project["description"])
            
            # Calculate progress
            task_count = len(project["tasks"])
            completed_tasks = sum(1 for j in range(task_count) if st.session_state.get(f"task_{i}_{j}", False))
            progress = completed_tasks / task_count if task_count > 0 else 0
            
            # Progress bar
            st.progress(progress)
            st.write(f"Progress: {int(progress * 100)}% ({completed_tasks}/{task_count} tasks completed)")
            
            # Task list with save button
            st.subheader("Tasks")
            
            # Create a dataframe to display tasks in a more organized way
            task_data = []
            for j, task in enumerate(project["tasks"]):
                task_key = f"task_{i}_{j}"
                completed = st.checkbox(task, value=st.session_state.get(task_key, False), key=f"task_checkbox_{i}_{j}")
                
                if completed:
                    task_data.append({"Task": task, "Status": "Completed", "Notes": ""})
                else:
                    task_data.append({"Task": task, "Status": "In Progress", "Notes": ""})
            
            # Save progress
            if st.button("Save Progress", key=f"save_progress_{i}"):
                # Prepare progress data
                progress_data = {
                    "project_title": project["title"],
                    "completed_tasks": json.dumps([task["Task"] for task in task_data if task["Status"] == "Completed"]),
                    "progress_percentage": int(progress * 100),
                    "timestamp": pd.Timestamp.now().isoformat(),
                    "milestones": json.dumps([]),
                    "next_steps": ""
                }
                
                # Save to database if logged in (not as guest)
                if st.session_state.user_logged_in and not is_guest_user(st.session_state.user_info):
                    try:
                        save_progress(
                            get_user_property(st.session_state.user_info, "id"),
                            f"project_{i}",  # Using a simple project ID for demo
                            progress_data
                        )
                        st.success("Progress saved!")
                    except Exception as e:
                        st.warning(f"Could not save progress to database: {str(e)}")
                else:
                    st.success("Progress saved locally! Sign up to sync your progress across devices.")
            
            # Build-in-Public Post Generator
            st.subheader("Build in Public")
            if completed_tasks > 0:
                # Get completed tasks
                completed_task_list = [project["tasks"][j] for j in range(task_count) 
                                      if st.session_state.get(f"task_{i}_{j}", False)]
                completed_tasks_str = "\n".join([f"- {task}" for task in completed_task_list[:3]])
                
                # Generate social media post
                try:
                    post_text = generate_social_media_post(
                        project["title"],
                        st.session_state.user_data["domain_selected"],
                        completed_tasks_str,
                        int(progress * 100)
                    )
                except Exception as e:
                    # Fallback to simple post generation
                    milestone = "just started" if progress < 0.3 else "making good progress on" if progress < 0.6 else "nearly finished with" if progress < 1 else "just completed"
                    post_text = f"""I've {milestone} my {project['title']} project! ({int(progress * 100)}% complete)

This project helps me build skills in {st.session_state.user_data['domain_selected']}.

Key accomplishments:
{completed_tasks_str}

#buildinpublic #careerAI #100DaysOfCode"""
                
                st.text_area("Share your progress on social media:", value=post_text, height=150, key=f"post_text_{i}")
                
                col1, col2 = st.columns(2)
                with col1:
                    st.button("Copy for LinkedIn", key=f"linkedin_{i}")
                with col2:
                    st.button("Copy for Twitter", key=f"twitter_{i}")
            else:
                st.info("Complete some tasks to generate a social media post.")

# Daily Build in Public Post Generator Page
def show_daily_post_page():
    st.title("Daily Build in Public Post Generator 📣")
    
    st.write("""
    Consistency is key when building in public. Use this tool to create daily posts about your progress, 
    challenges, and learning journey.
    """)
    
    # Initialize session state for target firms if it doesn't exist
    if "target_firms" not in st.session_state:
        st.session_state.target_firms = []
    
    # Project selection (if projects exist)
    project_title = ""
    domain = ""
    
    if st.session_state.projects:
        project_titles = [p["title"] for p in st.session_state.projects]
        selected_project_index = st.selectbox("Select a project:", range(len(project_titles)), format_func=lambda i: project_titles[i])
        project_title = st.session_state.projects[selected_project_index]["title"]
        domain = st.session_state.user_data.get("domain_selected", "AI/ML")
    else:
        st.warning("You don't have any projects yet.")
        st.info("Consider visiting the Project Selection tab first to select a project.")
        project_title = st.text_input("Project title:")
        domain = st.session_state.user_data.get("domain_selected", "")
        if not domain:
            domain = st.text_input("Domain/field:")
    
    # Day number
    day_number = st.number_input("Day number:", min_value=1, max_value=100, value=1)
    
    # Goals and learnings
    goals_for_today = st.text_area("What were your goals for today?", placeholder="e.g., Implement user authentication, debug API calls")
    learnings = st.text_area("What did you learn or accomplish?", placeholder="e.g., Learned about JWT token security, solved a tricky bug with async functions")
    
    # Target firms
    with st.expander("Target Companies"):
        # Display existing target firms
        for i, firm in enumerate(st.session_state.target_firms):
            col1, col2 = st.columns([0.9, 0.1])
            with col1:
                st.text(firm)
            with col2:
                if st.button("❌", key=f"remove_{i}"):
                    st.session_state.target_firms.pop(i)
                    st.rerun()
        
        # Add new target firm
        new_firm = st.text_input("Add a target company:", placeholder="e.g., Google, OpenAI, NVIDIA", key="add_company_firm_alerts_3")
        if st.button("Add Company", key="add_company_firm_alerts_2") and new_firm:
            st.session_state.target_firms.append(new_firm)
            st.rerun()
    
    # Generate post button
    if st.button("Generate Post", type="primary") and project_title and goals_for_today and learnings:
        with st.spinner("Generating your daily post..."):
            post = generate_daily_post(
                project_title, 
                domain, 
                day_number, 
                goals_for_today, 
                learnings, 
                st.session_state.target_firms if st.session_state.target_firms else None
            )
            st.text_area("Your daily build-in-public post:", value=post, height=300)
            
            col1, col2, col3 = st.columns(3)
            with col1:
                if st.button("Copy for LinkedIn"):
                    st.success("Copied to clipboard!")
            with col2:
                if st.button("Copy for Twitter"):
                    st.success("Copied to clipboard!")
            with col3:
                if st.button("Schedule Post"):
                    st.info("Post scheduling feature coming soon!")
    
    st.divider()
    
    # Tips for effective building in public
    with st.expander("Tips for Effective Building in Public"):
        st.markdown("""
        ### Best Practices for Building in Public
        
        1. **Be consistent** - Post updates regularly (daily is ideal)
        2. **Be authentic** - Share both successes and challenges
        3. **Be specific** - Detailed updates are more engaging than generic ones
        4. **Be visual** - Include screenshots, diagrams, or code snippets when possible
        5. **Be interactive** - Ask questions and encourage feedback
        6. **Be strategic** - Mention technologies and skills relevant to your target roles
        
        ### Benefits of Building in Public
        
        - Creates accountability and motivation
        - Builds your personal brand
        - Attracts like-minded people and potential employers
        - Documents your learning journey
        - Helps others learn from your experience
        """)

# Add placeholder functions for the other new pages
def show_milestone_page():
    st.title("Project Milestone Tracker 🏆")
    
    if "milestones" not in st.session_state:
        st.session_state.milestones = {}
    
    # Project selection
    if not st.session_state.projects:
        st.error("You need to create projects first before setting milestones.")
        st.info("Please go to the Project Selection tab first to select a project.")
        return
    
    project_titles = [p["title"] for p in st.session_state.projects]
    selected_project_index = st.selectbox(
        "Select a project:",
        range(len(project_titles)),
        format_func=lambda i: project_titles[i],
        key="milestone_project_selection"
    )
    
    selected_project = st.session_state.projects[selected_project_index]
    project_id = f"project_{selected_project_index}"
    
    # Initialize milestones for this project if not exist
    if project_id not in st.session_state.milestones:
        st.session_state.milestones[project_id] = []
        
        # If user is logged in (not guest), fetch milestones from database
        if st.session_state.user_logged_in and not is_guest_user(st.session_state.user_info):
            try:
                user_id = get_user_property(st.session_state.user_info, "id")
                milestone_data = get_project_milestones(user_id, project_id)
                if milestone_data and hasattr(milestone_data, "data"):
                    st.session_state.milestones[project_id] = milestone_data.data
            except Exception as e:
                st.warning(f"Could not load milestones: {str(e)}")
    
    # Display project info
    st.subheader(f"Project: {selected_project['title']}")
    st.write(selected_project['description'])
    
    # Create milestone view & status options
    status_options = {
        "not_started": "📝 Not Started",
        "in_progress": "🚧 In Progress",
        "completed": "✅ Completed",
        "delayed": "⏰ Delayed",
        "at_risk": "⚠️ At Risk"
    }
    
    # Add new milestone
    with st.expander("Add New Milestone", expanded=not st.session_state.milestones.get(project_id, [])):
        with st.form("add_milestone_form"):
            milestone_title = st.text_input("Milestone Title", placeholder="e.g., Complete Data Collection Phase")
            milestone_description = st.text_area("Description", placeholder="What needs to be accomplished in this milestone?")
            milestone_due_date = st.date_input("Due Date")
            milestone_status = st.selectbox("Status", options=list(status_options.keys()), format_func=lambda x: status_options[x])
            
            submitted = st.form_submit_button("Add Milestone")
            
            if submitted and milestone_title:
                new_milestone = {
                    "title": milestone_title,
                    "description": milestone_description,
                    "due_date": milestone_due_date.isoformat(),
                    "status": milestone_status,
                    "created_at": pd.Timestamp.now().isoformat()
                }
                
                # Save to database if logged in
                if st.session_state.user_logged_in and not is_guest_user(st.session_state.user_info):
                    try:
                        save_project_milestone(
                            get_user_property(st.session_state.user_info, "id"),
                            project_id,
                            new_milestone
                        )
                        st.success("Milestone saved to database!")
                    except Exception as e:
                        st.warning(f"Could not save milestone to database: {str(e)}")
                
                # Add to session state
                if "id" not in new_milestone:
                    import uuid
                    new_milestone["id"] = str(uuid.uuid4())
                
                st.session_state.milestones[project_id].append(new_milestone)
                st.rerun()
    
    # Display milestones
    if not st.session_state.milestones.get(project_id, []):
        st.info("No milestones added yet. Add your first milestone above.")
    else:
        st.subheader("Project Milestones")
        
        # Group milestones by status
        milestones_by_status = {}
        for status in status_options:
            milestones_by_status[status] = [m for m in st.session_state.milestones[project_id] if m["status"] == status]
        
        # Create tabs for different status views
        all_tab, not_started_tab, in_progress_tab, completed_tab = st.tabs([
            "All Milestones", 
            f"Not Started ({len(milestones_by_status['not_started'])})",
            f"In Progress ({len(milestones_by_status['in_progress'])})",
            f"Completed ({len(milestones_by_status['completed'])})"
        ])
        
        # Display milestones in each tab
        with all_tab:
            display_milestones(st.session_state.milestones[project_id], project_id, status_options, "all_tab")
        
        with not_started_tab:
            if milestones_by_status["not_started"]:
                display_milestones(milestones_by_status["not_started"], project_id, status_options, "not_started_tab")
            else:
                st.info("No milestones in this category.")
        
        with in_progress_tab:
            if milestones_by_status["in_progress"]:
                display_milestones(milestones_by_status["in_progress"], project_id, status_options, "in_progress_tab")
            else:
                st.info("No milestones in this category.")
        
        with completed_tab:
            if milestones_by_status["completed"]:
                display_milestones(milestones_by_status["completed"], project_id, status_options, "completed_tab")
            else:
                st.info("No milestones in this category.")
        
        # Calculate overall project progress
        total_milestones = len(st.session_state.milestones[project_id])
        completed_milestones = len(milestones_by_status["completed"])
        progress = completed_milestones / total_milestones if total_milestones > 0 else 0
        
        st.subheader("Overall Milestone Progress")
        st.progress(progress)
        st.write(f"{int(progress * 100)}% complete ({completed_milestones}/{total_milestones} milestones)")

# Helper function to display milestones
def display_milestones(milestones, project_id, status_options, tab_name):
    for i, milestone in enumerate(milestones):
        with st.container():
            col1, col2 = st.columns([0.7, 0.3])
            
            with col1:
                st.markdown(f"### {milestone['title']}")
                st.write(milestone['description'])
                
                # Format the due date
                due_date = pd.to_datetime(milestone['due_date']).date()
                today = pd.Timestamp.now().date()
                days_remaining = (due_date - today).days
                
                if days_remaining < 0:
                    st.error(f"Due date passed {abs(days_remaining)} days ago ({due_date})")
                elif days_remaining == 0:
                    st.warning(f"Due TODAY! ({due_date})")
                elif days_remaining <= 7:
                    st.warning(f"Due in {days_remaining} days ({due_date})")
                else:
                    st.info(f"Due in {days_remaining} days ({due_date})")
            
            with col2:
                current_status = milestone.get('status', 'not_started')
                milestone_id = milestone.get('id', str(i))
                
                # Create a unique key using all available unique identifiers including tab_name
                status_key = f"status_{project_id}_{milestone_id}_{tab_name}_{i}"
                
                new_status = st.selectbox(
                    "Status",
                    options=list(status_options.keys()),
                    format_func=lambda x: status_options[x],
                    index=list(status_options.keys()).index(current_status),
                    key=status_key
                )
                
                # If status changed, update it
                if new_status != current_status:
                    milestone['status'] = new_status
                    
                    # Update in database if logged in
                    if st.session_state.user_logged_in and not is_guest_user(st.session_state.user_info) and 'id' in milestone:
                        try:
                            update_milestone_status(milestone['id'], new_status)
                            st.success("Status updated in database!")
                        except Exception as e:
                            st.warning(f"Could not update status in database: {str(e)}")
            
            st.divider()

def show_friction_points_page():
    st.title("Friction & Delight Points Analyzer 🔍")
    
    st.write("""
    The Delta 4 framework helps identify friction and delight points in your project across four dimensions:
    - **Technical**: Tools, technologies, and technical challenges
    - **Cultural**: Team dynamics, communication, and collaboration
    - **Process**: Workflows, methodologies, and project management
    - **Expectation**: Alignment between goals, timelines, and reality
    """)
    
    # Project selection
    if not st.session_state.projects:
        st.error("You need to create projects first before analyzing them.")
        st.info("Please go to the Project Selection tab first to select a project.")
        return
    
    project_titles = [p["title"] for p in st.session_state.projects]
    selected_project_index = st.selectbox(
        "Select a project to analyze:",
        range(len(project_titles)),
        format_func=lambda i: project_titles[i],
        key="delta4_project_selection"
    )
    
    selected_project = st.session_state.projects[selected_project_index]
    
    # Project analysis form
    with st.form("delta4_analysis_form"):
        st.subheader("Project Context")
        
        # Auto-fill project description
        project_description = st.text_area(
            "Project Description",
            value=selected_project.get("description", ""),
            height=100
        )
        
        current_status = st.text_area(
            "Current Status",
            placeholder="Describe the current state of your project. What has been accomplished? What's in progress?",
            height=100
        )
        
        challenges = st.text_area(
            "Current Challenges",
            placeholder="What difficulties are you facing? What's slowing you down?",
            height=100
        )
        
        goals = st.text_area(
            "Goals & Expectations",
            placeholder="What are your goals for this project? What do you expect to achieve?",
            height=100
        )
        
        analyze_button = st.form_submit_button("Analyze Project", type="primary")
    
    # If form is submitted, perform analysis
    if analyze_button and project_description and current_status and challenges and goals:
        with st.spinner("Analyzing your project with Delta 4 framework..."):
            try:
                analysis = analyze_delta4(
                    project_description,
                    current_status,
                    challenges,
                    goals
                )
                
                # Display analysis results
                st.subheader("Delta 4 Analysis Results")
                
                # Summary
                st.info(analysis.get("summary", "Analysis complete."))
                
                # Create tabs for each dimension
                tech_tab, culture_tab, process_tab, expectation_tab = st.tabs([
                    "Technical", 
                    "Cultural", 
                    "Process", 
                    "Expectation"
                ])
                
                # Technical dimension
                with tech_tab:
                    display_dimension_analysis(analysis, "technical")
                
                # Cultural dimension
                with culture_tab:
                    display_dimension_analysis(analysis, "cultural")
                
                # Process dimension
                with process_tab:
                    display_dimension_analysis(analysis, "process")
                
                # Expectation dimension
                with expectation_tab:
                    display_dimension_analysis(analysis, "expectation")
                
                # Save analysis button
                if st.button("Save Analysis to Project", key="save_analysis_button"):
                    # Logic to save analysis to project data
                    st.success("Analysis saved to project!")
                    
                # Option to download as report
                st.download_button(
                    label="Download Analysis Report",
                    data=generate_delta4_report(selected_project["title"], analysis),
                    file_name=f"delta4_analysis_{selected_project['title'].lower().replace(' ', '_')}.txt",
                    mime="text/plain"
                )
                
            except Exception as e:
                st.error(f"Error analyzing project: {str(e)}")
    
    # Display Delta 4 framework information
    with st.expander("Learn More About the Delta 4 Framework"):
        st.markdown("""
        ### The Delta 4 Framework
        
        The Delta 4 framework was developed to provide a comprehensive analysis of project health by identifying both friction (challenges) and delight (successes) points across four key dimensions:
        
        #### 1. Technical Dimension
        - **Friction**: Technical debt, bugs, performance issues, integration problems
        - **Delight**: Working features, successful integrations, technical innovations
        
        #### 2. Cultural Dimension
        - **Friction**: Communication issues, siloed knowledge, collaboration challenges
        - **Delight**: Team synergy, knowledge sharing, shared ownership
        
        #### 3. Process Dimension
        - **Friction**: Workflow bottlenecks, unclear responsibilities, inefficient procedures
        - **Delight**: Smooth workflows, clear task management, effective planning
        
        #### 4. Expectation Dimension
        - **Friction**: Unrealistic timelines, scope creep, misaligned stakeholder expectations
        - **Delight**: Clear project vision, aligned expectations, satisfied stakeholders
        
        By analyzing all four dimensions, you can identify not just what's going wrong, but also what's going right and how to leverage those successes.
        """)

# Helper function for the Delta 4 analysis display
def display_dimension_analysis(analysis, dimension):
    dimension_data = analysis.get(dimension, {})
    
    # Display friction points
    st.subheader("Friction Points 🔴")
    if dimension_data.get("friction"):
        for point in dimension_data["friction"]:
            st.markdown(f"- {point}")
    else:
        st.write("No friction points identified.")
    
    # Display delight points
    st.subheader("Delight Points 🟢")
    if dimension_data.get("delight"):
        for point in dimension_data["delight"]:
            st.markdown(f"- {point}")
    else:
        st.write("No delight points identified.")
    
    # Display recommendations
    st.subheader("Recommendations 💡")
    if dimension_data.get("recommendations"):
        for rec in dimension_data["recommendations"]:
            st.markdown(f"- {rec}")
    else:
        st.write("No recommendations available.")

# Helper function to generate a downloadable report
def generate_delta4_report(project_title, analysis):
    report = f"""DELTA 4 ANALYSIS REPORT
Project: {project_title}
Date: {pd.Timestamp.now().strftime('%Y-%m-%d')}

SUMMARY
{analysis.get('summary', 'No summary available.')}

TECHNICAL DIMENSION
Friction Points:
{chr(10).join(['- ' + point for point in analysis.get('technical', {}).get('friction', ['None identified.'])])}

Delight Points:
{chr(10).join(['- ' + point for point in analysis.get('technical', {}).get('delight', ['None identified.'])])}

Recommendations:
{chr(10).join(['- ' + rec for rec in analysis.get('technical', {}).get('recommendations', ['None provided.'])])}

CULTURAL DIMENSION
Friction Points:
{chr(10).join(['- ' + point for point in analysis.get('cultural', {}).get('friction', ['None identified.'])])}

Delight Points:
{chr(10).join(['- ' + point for point in analysis.get('cultural', {}).get('delight', ['None identified.'])])}

Recommendations:
{chr(10).join(['- ' + rec for rec in analysis.get('cultural', {}).get('recommendations', ['None provided.'])])}

PROCESS DIMENSION
Friction Points:
{chr(10).join(['- ' + point for point in analysis.get('process', {}).get('friction', ['None identified.'])])}

Delight Points:
{chr(10).join(['- ' + point for point in analysis.get('process', {}).get('delight', ['None identified.'])])}

Recommendations:
{chr(10).join(['- ' + rec for rec in analysis.get('process', {}).get('recommendations', ['None provided.'])])}

EXPECTATION DIMENSION
Friction Points:
{chr(10).join(['- ' + point for point in analysis.get('expectation', {}).get('friction', ['None identified.'])])}

Delight Points:
{chr(10).join(['- ' + point for point in analysis.get('expectation', {}).get('delight', ['None identified.'])])}

Recommendations:
{chr(10).join(['- ' + rec for rec in analysis.get('expectation', {}).get('recommendations', ['None provided.'])])}

Generated by CareerAI - Delta 4 Analyzer
"""
    return report
    
def show_firm_alerts_page():
    st.title("Target Firm Alerts 🔔")
    
    st.write("""
    Stay updated on your target companies' AI initiatives, job openings, and skill requirements. 
    This tool helps you align your projects and skills with what your target companies are looking for.
    """)
    
    # Initialize session state for target firms if it doesn't exist
    if "target_firms" not in st.session_state:
        st.session_state.target_firms = []
    
    # Initialize session state for firm insights
    if "firm_insights" not in st.session_state:
        st.session_state.firm_insights = {}
    
    # Get user skills
    if "user_skills" not in st.session_state:
        st.session_state.user_skills = []
    
    # Add target company and skills
    col1, col2 = st.columns([2, 1])
    
    with col1:
        with st.expander("Manage Target Companies", expanded=not st.session_state.target_firms):
            # Display existing target firms
            for i, firm in enumerate(st.session_state.target_firms):
                col_a, col_b = st.columns([0.9, 0.1])
                with col_a:
                    st.text(firm)
                with col_b:
                    if st.button("❌", key=f"remove_firm_{i}"):
                        st.session_state.target_firms.pop(i)
                        # Remove insights for this firm if they exist
                        if firm in st.session_state.firm_insights:
                            del st.session_state.firm_insights[firm]
                        st.rerun()
            
            # Add new target firm
            new_firm = st.text_input("Add a target company:", placeholder="e.g., Google, OpenAI, NVIDIA", key="add_company_firm_alerts_1")
            if st.button("Add Company", key="add_company_firm_alerts") and new_firm:
                st.session_state.target_firms.append(new_firm)
                st.rerun()
    
    with col2:
        with st.expander("Your Skills", expanded=not st.session_state.user_skills):
            # Display existing skills
            for i, skill in enumerate(st.session_state.user_skills):
                col_a, col_b = st.columns([0.9, 0.1])
                with col_a:
                    st.text(skill)
                with col_b:
                    if st.button("❌", key=f"remove_skill_{i}"):
                        st.session_state.user_skills.pop(i)
                        st.rerun()
            
            # Add new skill
            new_skill = st.text_input("Add a skill:", placeholder="e.g., Python, PyTorch, NLP", key="add_skill_button_1")
            if st.button("Add Skill", key="add_skill_button") and new_skill:
                st.session_state.user_skills.append(new_skill)
                st.rerun()
    
    # If no target firms, display message
    if not st.session_state.target_firms:
        st.warning("Add target companies above to receive insights and alerts.")
        return
    
    # Display domain information
    domain = st.session_state.user_data.get("domain_selected", "")
    
    # Tabs for each target firm
    tabs = st.tabs(st.session_state.target_firms)
    
    for i, tab in enumerate(tabs):
        company = st.session_state.target_firms[i]
        
        with tab:
            # Check if we already have insights for this company
            if company not in st.session_state.firm_insights:
                with st.spinner(f"Gathering insights for {company}..."):
                    try:
                        insights = get_company_insights(
                            company,
                            domain=domain,
                            skills=st.session_state.user_skills
                        )
                        st.session_state.firm_insights[company] = insights
                    except Exception as e:
                        st.error(f"Error retrieving insights: {str(e)}")
                        continue
            
            insights = st.session_state.firm_insights[company]
            
            # Company overview
            st.subheader("Company Overview")
            st.write(insights.get("company_overview", f"No overview available for {company}."))
            
            # Recent developments
            st.subheader("Recent Developments")
            developments = insights.get("recent_developments", [])
            if developments:
                for dev in developments:
                    with st.container():
                        st.write(f"**{dev.get('title', 'News item')}**")
                        st.write(dev.get('description', 'No description available.'))
                        st.info(f"**Relevance:** {dev.get('relevance', 'No relevance information available.')}")
                        st.divider()
            else:
                st.write("No recent developments found.")
            
            # Job trends
            st.subheader("Job Trends")
            job_trends = insights.get("job_trends", [])
            if job_trends:
                for job in job_trends:
                    with st.container():
                        st.write(f"**{job.get('role_type', 'Role')}**")
                        st.write(f"**Skills sought:** {', '.join(job.get('skills_sought', ['No skills listed']))}")
                        st.write(f"**Requirements:** {job.get('typical_requirements', 'No requirements listed')}")
                        st.divider()
            else:
                st.write("No job trend information available.")
            
            # Skill alignment
            st.subheader("Your Skill Alignment")
            skill_alignment = insights.get("skill_alignment", {})
            if skill_alignment:
                col1, col2 = st.columns(2)
                
                with col1:
                    st.write("**Aligned Skills** ✅")
                    for skill in skill_alignment.get("aligned_skills", ["None"]):
                        st.markdown(f"- {skill}")
                
                with col2:
                    st.write("**Skill Gaps** 🔍")
                    for skill in skill_alignment.get("skill_gaps", ["None"]):
                        st.markdown(f"- {skill}")
                
                st.write("**Recommendations**")
                for rec in skill_alignment.get("recommendations", ["No recommendations available."]):
                    st.markdown(f"- {rec}")
            else:
                st.write("No skill alignment information available.")
            
            # Project ideas
            st.subheader("Projects to Showcase")
            projects = insights.get("projects_to_showcase", [])
            if projects:
                for project in projects:
                    with st.container():
                        st.write(f"**{project.get('project_idea', 'Project idea')}**")
                        st.write(f"**Why effective:** {project.get('why_effective', 'No information available.')}")
                        
                        # Add to projects button
                        if st.button(f"Create This Project", key=f"create_project_{company}_{projects.index(project)}"):
                            if "projects" not in st.session_state:
                                st.session_state.projects = []
                            
                            new_project = {
                                "title": project.get('project_idea', 'New Project'),
                                "description": f"Project to showcase skills for {company}: {project.get('why_effective', '')}",
                                "difficulty": "Intermediate",
                                "time_estimate": "3-5 weeks",
                                "tasks": ["Plan project scope", "Set up development environment", "Implement core features", "Test and validate", "Document and present"],
                                "domain": domain
                            }
                            
                            st.session_state.projects.append(new_project)
                            st.success(f"Project '{project.get('project_idea')}' added to your projects!")
                        
                        st.divider()
            else:
                st.write("No project ideas available.")
            
            # Refresh data button
            if st.button("Refresh Insights", key=f"refresh_{company}"):
                if company in st.session_state.firm_insights:
                    del st.session_state.firm_insights[company]
                st.rerun()
            
            # Set reminder
            st.download_button(
                "Export Insights as PDF",
                data=generate_company_report(company, insights),
                file_name=f"{company.lower().replace(' ', '_')}_insights.txt",
                mime="text/plain"
            )

# Helper function to generate a company report
def generate_company_report(company_name, insights):
    report = f"""COMPANY INSIGHTS REPORT
Company: {company_name}
Date: {pd.Timestamp.now().strftime('%Y-%m-%d')}

COMPANY OVERVIEW
{insights.get('company_overview', 'No overview available.')}

RECENT DEVELOPMENTS
{chr(10).join([f'- {dev.get("title", "News item")}: {dev.get("description", "No description.")}' for dev in insights.get('recent_developments', [])])}

JOB TRENDS
{chr(10).join([f'- {job.get("role_type", "Role")}: {", ".join(job.get("skills_sought", ["No skills listed"]))}' for job in insights.get('job_trends', [])])}

SKILL ALIGNMENT
Aligned Skills:
{chr(10).join(['- ' + skill for skill in insights.get('skill_alignment', {}).get('aligned_skills', ['None identified.'])])}

Skill Gaps:
{chr(10).join(['- ' + skill for skill in insights.get('skill_alignment', {}).get('skill_gaps', ['None identified.'])])}

Recommendations:
{chr(10).join(['- ' + rec for rec in insights.get('skill_alignment', {}).get('recommendations', ['None provided.'])])}

PROJECTS TO SHOWCASE
{chr(10).join([f'- {project.get("project_idea", "Project")}: {project.get("why_effective", "No description.")}' for project in insights.get('projects_to_showcase', [])])}

Generated by CareerAI - Target Firm Analyzer
"""
    return report

# Utility function to generate project suggestions based on domain
def generate_project_suggestions(domain):
    if "Natural Language Processing" in domain:
        return [
            {
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
                ]
            },
            {
                "title": "Conversational AI Chatbot",
                "description": "Create a domain-specific chatbot that can answer questions and have meaningful conversations.",
                "difficulty": "Advanced",
                "time_estimate": "4-6 weeks",
                "tasks": [
                    "Define the chatbot's domain and knowledge scope",
                    "Set up a conversational framework using Rasa or a custom solution",
                    "Implement intent recognition and entity extraction",
                    "Create dialogue management and response generation",
                    "Integrate with a messaging platform or web interface",
                    "Add context management for multi-turn conversations",
                    "Test and improve the chatbot with user feedback"
                ]
            }
        ]
    elif "Computer Vision" in domain:
        return [
            {
                "title": "Object Detection App",
                "description": "Build an application that can detect and classify objects in images or video streams.",
                "difficulty": "Intermediate",
                "time_estimate": "3-5 weeks",
                "tasks": [
                    "Set up a development environment with CV libraries",
                    "Choose and implement an object detection model (YOLO, SSD, etc.)",
                    "Create an interface for uploading images or connecting to a camera",
                    "Implement real-time detection and bounding box visualization",
                    "Add classification labels and confidence scores",
                    "Optimize the model for performance",
                    "Deploy as a web or mobile application"
                ]
            },
            {
                "title": "Facial Recognition System",
                "description": "Create a system that can recognize faces and identify people from a database.",
                "difficulty": "Advanced",
                "time_estimate": "4-6 weeks",
                "tasks": [
                    "Set up face detection using a pre-trained model",
                    "Implement face alignment and normalization",
                    "Create a feature extraction pipeline using embeddings",
                    "Build a database to store known face encodings",
                    "Implement matching algorithms for identification",
                    "Add user interface for enrollment and recognition",
                    "Ensure privacy considerations and consent mechanisms",
                    "Test with diverse datasets for accuracy and bias"
                ]
            }
        ]
    elif "Reinforcement Learning" in domain:
        return [
            {
                "title": "Game-Playing Agent",
                "description": "Build an agent that learns to play a simple game using reinforcement learning.",
                "difficulty": "Intermediate",
                "time_estimate": "3-5 weeks",
                "tasks": [
                    "Choose a game environment (e.g., OpenAI Gym)",
                    "Implement a basic RL algorithm (e.g., Q-learning, DQN)",
                    "Create a training loop for the agent",
                    "Visualize the agent's performance", 
                    "Experiment with different hyperparameters",
                    "Implement advanced algorithms for comparison",
                    "Create a web interface to play against your agent"
                ]
            },
            {
                "title": "Robotic Control Simulation",
                "description": "Develop a system that learns to control a simulated robot using RL techniques.",
                "difficulty": "Advanced",
                "time_estimate": "5-8 weeks",
                "tasks": [
                    "Set up a robotic simulation environment",
                    "Define the state and action spaces",
                    "Implement policy gradient methods",
                    "Train the agent to perform a specific task",
                    "Visualize the training progress",
                    "Implement advanced RL techniques like PPO or SAC",
                    "Transfer the learned policy to a different environment",
                    "Document the results and insights"
                ]
            }
        ]
    elif "Robotics" in domain:
        return [
            {
                "title": "Autonomous Mobile Robot",
                "description": "Build a mobile robot that can navigate autonomously using sensors and path planning.",
                "difficulty": "Intermediate",
                "time_estimate": "4-6 weeks", 
                "tasks": [
                    "Set up the robot hardware platform",
                    "Implement sensor data processing",
                    "Create mapping and localization system",
                    "Develop path planning algorithms",
                    "Add obstacle avoidance capabilities",
                    "Implement autonomous navigation",
                    "Test and optimize performance",
                    "Document build process and results"
                ]
            },
            {
                "title": "Robotic Arm Controller",
                "description": "Develop a control system for a robotic arm to perform pick-and-place tasks.",
                "difficulty": "Advanced",
                "time_estimate": "6-8 weeks",
                "tasks": [
                    "Set up robotic arm and control interface",
                    "Implement forward/inverse kinematics",
                    "Create motion planning algorithms",
                    "Add computer vision for object detection",
                    "Develop pick-and-place logic",
                    "Implement safety features and constraints",
                    "Create user interface for control",
                    "Test accuracy and repeatability"
                ]
            }
        ]
    else:
        # Default projects for other domains
        return [
            {
                "title": "Beginner Project",
                "description": f"A starter project in {domain} to build foundational skills.",
                "difficulty": "Beginner",
                "time_estimate": "1-2 weeks",
                "tasks": [
                    "Set up development environment",
                    "Study domain fundamentals",
                    "Implement basic features",
                    "Test with sample data",
                    "Document your approach"
                ]
            },
            {
                "title": "Advanced Project",
                "description": f"A comprehensive project in {domain} to showcase expertise.",
                "difficulty": "Advanced",
                "time_estimate": "4-8 weeks",
                "tasks": [
                    "Define project requirements and architecture",
                    "Set up infrastructure and development environment",
                    "Implement core functionality",
                    "Add advanced features",
                    "Optimize performance",
                    "Create tests and documentation",
                    "Deploy to production"
                ]
            }
        ]

# Run the application
if __name__ == "__main__":
    main() 