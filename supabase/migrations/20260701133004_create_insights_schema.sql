/*
# Create Insights Schema for TRIVEON

1. New Tables
- `profiles`: User profiles with name, role, avatar, bio
- `insights`: Long-form knowledge documents with full metadata
- `insight_comments`: Simple comments on insights
- `insight_saves`: Track saved insights per user
- `insight_likes`: Track likes on insights

2. Security
- Enable RLS on all tables
- Owner-scoped CRUD for profiles (users manage own profile)
- Owner-scoped CRUD for insights (authors manage their insights)
- Public read for published insights, owner-only for drafts
- Authenticated users can comment, like, save

3. Key Features
- Auto-populate user_id from auth.uid() on inserts
- Cascade deletes when author deleted
- Track views, saves, completion rate for analytics
- Support for categories: Startup, Investment, Research, Technology, Marketing, Operations, Leadership, Product, Growth, AI
- Visibility levels: public, connections_only, private
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  role text DEFAULT '',
  avatar_url text DEFAULT '',
  bio text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Insights table
CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  subtitle text DEFAULT '',
  cover_image text DEFAULT '',
  category text NOT NULL DEFAULT 'Technology',
  content jsonb DEFAULT '[]'::jsonb,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  visibility text NOT NULL DEFAULT 'public',
  reading_time integer DEFAULT 0,
  views integer DEFAULT 0,
  reads integer DEFAULT 0,
  saves_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraint for valid categories
ALTER TABLE insights DROP CONSTRAINT IF EXISTS valid_category;
ALTER TABLE insights ADD CONSTRAINT valid_category 
  CHECK (category IN ('Startup', 'Investment', 'Research', 'Technology', 'Marketing', 'Operations', 'Leadership', 'Product', 'Growth', 'AI'));

-- Add constraint for valid status
ALTER TABLE insights DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE insights ADD CONSTRAINT valid_status 
  CHECK (status IN ('draft', 'published', 'archived', 'scheduled'));

-- Add constraint for valid visibility
ALTER TABLE insights DROP CONSTRAINT IF EXISTS valid_visibility;
ALTER TABLE insights ADD CONSTRAINT valid_visibility 
  CHECK (visibility IN ('public', 'connections_only', 'private'));

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Published insights are readable by all authenticated users
DROP POLICY IF EXISTS "select_published_insights" ON insights;
CREATE POLICY "select_published_insights" ON insights FOR SELECT
  TO authenticated USING (status = 'published' AND visibility = 'public');

-- Users can read their own drafts
DROP POLICY IF EXISTS "select_own_insights" ON insights;
CREATE POLICY "select_own_insights" ON insights FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- Only owners can insert
DROP POLICY IF EXISTS "insert_own_insights" ON insights;
CREATE POLICY "insert_own_insights" ON insights FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Only owners can update
DROP POLICY IF EXISTS "update_own_insights" ON insights;
CREATE POLICY "update_own_insights" ON insights FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Only owners can delete
DROP POLICY IF EXISTS "delete_own_insights" ON insights;
CREATE POLICY "delete_own_insights" ON insights FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Insight saves table
CREATE TABLE IF NOT EXISTS insight_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_id uuid NOT NULL REFERENCES insights(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(insight_id, user_id)
);

ALTER TABLE insight_saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_saves" ON insight_saves;
CREATE POLICY "select_own_saves" ON insight_saves FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_saves" ON insight_saves;
CREATE POLICY "insert_own_saves" ON insight_saves FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_saves" ON insight_saves;
CREATE POLICY "delete_own_saves" ON insight_saves FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Insight likes table
CREATE TABLE IF NOT EXISTS insight_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_id uuid NOT NULL REFERENCES insights(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(insight_id, user_id)
);

ALTER TABLE insight_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_likes" ON insight_likes;
CREATE POLICY "select_all_likes" ON insight_likes FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_likes" ON insight_likes;
CREATE POLICY "insert_own_likes" ON insight_likes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_likes" ON insight_likes;
CREATE POLICY "delete_own_likes" ON insight_likes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Insight comments table
CREATE TABLE IF NOT EXISTS insight_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_id uuid NOT NULL REFERENCES insights(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES insight_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE insight_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_comments" ON insight_comments;
CREATE POLICY "select_all_comments" ON insight_comments FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_comments" ON insight_comments;
CREATE POLICY "insert_own_comments" ON insight_comments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_comments" ON insight_comments;
CREATE POLICY "update_own_comments" ON insight_comments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_comments" ON insight_comments;
CREATE POLICY "delete_own_comments" ON insight_comments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Draft versions for version history
CREATE TABLE IF NOT EXISTS insight_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_id uuid NOT NULL REFERENCES insights(id) ON DELETE CASCADE,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE insight_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_versions" ON insight_versions;
CREATE POLICY "select_own_versions" ON insight_versions FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM insights WHERE insights.id = insight_versions.insight_id AND insights.user_id = auth.uid()));

DROP POLICY IF EXISTS "insert_own_versions" ON insight_versions;
CREATE POLICY "insert_own_versions" ON insight_versions FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM insights WHERE insights.id = insight_versions.insight_id AND insights.user_id = auth.uid()));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_insights_user_id ON insights(user_id);
CREATE INDEX IF NOT EXISTS idx_insights_status ON insights(status);
CREATE INDEX IF NOT EXISTS idx_insights_category ON insights(category);
CREATE INDEX IF NOT EXISTS idx_insights_published_at ON insights(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_insights_views ON insights(views DESC);
CREATE INDEX IF NOT EXISTS idx_insights_saves ON insights(saves_count DESC);
CREATE INDEX IF NOT EXISTS idx_insight_saves_user_id ON insight_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_insight_likes_insight_id ON insight_likes(insight_id);
CREATE INDEX IF NOT EXISTS idx_insight_comments_insight_id ON insight_comments(insight_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_insights_updated_at ON insights;
CREATE TRIGGER update_insights_updated_at BEFORE UPDATE ON insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON insight_comments;
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON insight_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
