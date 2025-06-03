-- Create ikigai_conversations table to store chat history
CREATE TABLE IF NOT EXISTS ikigai_conversations (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    insights JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ikigai_results table to store analysis results
CREATE TABLE IF NOT EXISTS ikigai_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    passion TEXT,
    strengths JSONB DEFAULT '[]'::jsonb,
    ai_suggestion TEXT,
    domains JSONB DEFAULT '[]'::jsonb,
    sentiment JSONB DEFAULT '{}'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    conversation_id UUID REFERENCES ikigai_conversations(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ikigai_conversations_user_id ON ikigai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ikigai_results_user_id ON ikigai_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ikigai_results_conversation_id ON ikigai_results(conversation_id);

-- Create or replace function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_ikigai_conversations_updated_at ON ikigai_conversations;
CREATE TRIGGER update_ikigai_conversations_updated_at
BEFORE UPDATE ON ikigai_conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ikigai_results_updated_at ON ikigai_results;
CREATE TRIGGER update_ikigai_results_updated_at
BEFORE UPDATE ON ikigai_results
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
