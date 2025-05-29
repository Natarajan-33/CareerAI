import os
import logging
from app.db.supabase import get_supabase_client

logger = logging.getLogger(__name__)

def create_milestone_table():
    """Create the project_milestones table if it doesn't exist."""
    supabase = get_supabase_client()
    
    # SQL for creating the project_milestones table
    sql = """
    -- Create project_milestones table if it doesn't exist
    CREATE TABLE IF NOT EXISTS project_milestones (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        project_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        due_date DATE NOT NULL,
        status TEXT NOT NULL DEFAULT 'not_started',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE,
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
    );

    -- Add RLS policies if they don't exist
    DO $$
    BEGIN
        -- Enable RLS
        ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can view their own milestones" ON project_milestones;
        DROP POLICY IF EXISTS "Users can insert their own milestones" ON project_milestones;
        DROP POLICY IF EXISTS "Users can update their own milestones" ON project_milestones;
        DROP POLICY IF EXISTS "Users can delete their own milestones" ON project_milestones;
        
        -- Create policies
        CREATE POLICY "Users can view their own milestones" ON project_milestones
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own milestones" ON project_milestones
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own milestones" ON project_milestones
            FOR UPDATE USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own milestones" ON project_milestones
            FOR DELETE USING (auth.uid() = user_id);
    EXCEPTION
        WHEN others THEN
            RAISE NOTICE 'Error creating RLS policies: %', SQLERRM;
    END $$;

    -- Create indexes if they don't exist
    CREATE INDEX IF NOT EXISTS project_milestones_user_id_idx ON project_milestones (user_id);
    CREATE INDEX IF NOT EXISTS project_milestones_project_id_idx ON project_milestones (project_id);
    """
    
    try:
        # Execute the SQL
        supabase.table("project_milestones").select("id").limit(1).execute()
        logger.info("project_milestones table already exists")
    except Exception:
        logger.info("Creating project_milestones table")
        result = supabase.rpc("exec_sql", {"query": sql}).execute()
        logger.info(f"Table creation result: {result}")

def create_company_insights_table():
    """Create the company_insights table if it doesn't exist."""
    supabase = get_supabase_client()
    
    # SQL for creating the company_insights table
    sql = """
    -- Create company_insights table if it doesn't exist
    CREATE TABLE IF NOT EXISTS company_insights (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        company_name TEXT NOT NULL,
        insights JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE,
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
    );

    -- Add RLS policies if they don't exist
    DO $$
    BEGIN
        -- Enable RLS
        ALTER TABLE company_insights ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can view their own company insights" ON company_insights;
        DROP POLICY IF EXISTS "Users can insert their own company insights" ON company_insights;
        DROP POLICY IF EXISTS "Users can update their own company insights" ON company_insights;
        DROP POLICY IF EXISTS "Users can delete their own company insights" ON company_insights;
        
        -- Create policies
        CREATE POLICY "Users can view their own company insights" ON company_insights
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own company insights" ON company_insights
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own company insights" ON company_insights
            FOR UPDATE USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own company insights" ON company_insights
            FOR DELETE USING (auth.uid() = user_id);
    EXCEPTION
        WHEN others THEN
            RAISE NOTICE 'Error creating RLS policies: %', SQLERRM;
    END $$;

    -- Create indexes if they don't exist
    CREATE INDEX IF NOT EXISTS company_insights_user_id_idx ON company_insights (user_id);
    CREATE INDEX IF NOT EXISTS company_insights_company_name_idx ON company_insights (company_name);
    """
    
    try:
        # Execute the SQL
        supabase.table("company_insights").select("id").limit(1).execute()
        logger.info("company_insights table already exists")
    except Exception:
        logger.info("Creating company_insights table")
        result = supabase.rpc("exec_sql", {"query": sql}).execute()
        logger.info(f"Table creation result: {result}")

def create_delta4_analysis_table():
    """Create the delta4_analysis table if it doesn't exist."""
    supabase = get_supabase_client()
    
    # SQL for creating the delta4_analysis table
    sql = """
    -- Create delta4_analysis table if it doesn't exist
    CREATE TABLE IF NOT EXISTS delta4_analysis (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        project_id TEXT NOT NULL,
        project_description TEXT NOT NULL,
        current_status TEXT NOT NULL,
        challenges TEXT NOT NULL,
        goals TEXT NOT NULL,
        analysis JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
    );

    -- Add RLS policies if they don't exist
    DO $$
    BEGIN
        -- Enable RLS
        ALTER TABLE delta4_analysis ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can view their own delta4 analysis" ON delta4_analysis;
        DROP POLICY IF EXISTS "Users can insert their own delta4 analysis" ON delta4_analysis;
        DROP POLICY IF EXISTS "Users can delete their own delta4 analysis" ON delta4_analysis;
        
        -- Create policies
        CREATE POLICY "Users can view their own delta4 analysis" ON delta4_analysis
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own delta4 analysis" ON delta4_analysis
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own delta4 analysis" ON delta4_analysis
            FOR DELETE USING (auth.uid() = user_id);
    EXCEPTION
        WHEN others THEN
            RAISE NOTICE 'Error creating RLS policies: %', SQLERRM;
    END $$;

    -- Create indexes if they don't exist
    CREATE INDEX IF NOT EXISTS delta4_analysis_user_id_idx ON delta4_analysis (user_id);
    CREATE INDEX IF NOT EXISTS delta4_analysis_project_id_idx ON delta4_analysis (project_id);
    """
    
    try:
        # Execute the SQL
        supabase.table("delta4_analysis").select("id").limit(1).execute()
        logger.info("delta4_analysis table already exists")
    except Exception:
        logger.info("Creating delta4_analysis table")
        result = supabase.rpc("exec_sql", {"query": sql}).execute()
        logger.info(f"Table creation result: {result}")

def create_target_firms_table():
    """Create the target_firms table if it doesn't exist."""
    supabase = get_supabase_client()
    
    # SQL for creating the target_firms table
    sql = """
    -- Create target_firms table if it doesn't exist
    CREATE TABLE IF NOT EXISTS target_firms (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        company_name TEXT NOT NULL,
        domain TEXT,
        skills JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE,
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
        UNIQUE (user_id, company_name)
    );

    -- Add RLS policies if they don't exist
    DO $$
    BEGIN
        -- Enable RLS
        ALTER TABLE target_firms ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can view their own target firms" ON target_firms;
        DROP POLICY IF EXISTS "Users can insert their own target firms" ON target_firms;
        DROP POLICY IF EXISTS "Users can update their own target firms" ON target_firms;
        DROP POLICY IF EXISTS "Users can delete their own target firms" ON target_firms;
        
        -- Create policies
        CREATE POLICY "Users can view their own target firms" ON target_firms
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own target firms" ON target_firms
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own target firms" ON target_firms
            FOR UPDATE USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own target firms" ON target_firms
            FOR DELETE USING (auth.uid() = user_id);
    EXCEPTION
        WHEN others THEN
            RAISE NOTICE 'Error creating RLS policies: %', SQLERRM;
    END $$;

    -- Create indexes if they don't exist
    CREATE INDEX IF NOT EXISTS target_firms_user_id_idx ON target_firms (user_id);
    """
    
    try:
        # Execute the SQL
        supabase.table("target_firms").select("id").limit(1).execute()
        logger.info("target_firms table already exists")
    except Exception:
        logger.info("Creating target_firms table")
        result = supabase.rpc("exec_sql", {"query": sql}).execute()
        logger.info(f"Table creation result: {result}")

def init_db():
    """Initialize the database with all required tables."""
    logger.info("Creating tables if they don't exist")
    
    # Create tables
    create_milestone_table()
    create_company_insights_table()
    create_delta4_analysis_table()
    create_target_firms_table()
    
    logger.info("Database initialization complete")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    init_db()
