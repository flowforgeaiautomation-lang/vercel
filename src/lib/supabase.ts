import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type InsightCategory = 'Startup' | 'Investment' | 'Research' | 'Technology' | 'Marketing' | 'Operations' | 'Leadership' | 'Product' | 'Growth' | 'AI';
export type InsightStatus = 'draft' | 'published' | 'archived' | 'scheduled';
export type InsightVisibility = 'public' | 'connections_only' | 'private';

export interface Insight {
  id: string;
  user_id: string;
  title: string;
  subtitle: string;
  cover_image: string;
  category: InsightCategory;
  content: any[];
  tags: string[];
  status: InsightStatus;
  visibility: InsightVisibility;
  reading_time: number;
  views: number;
  reads: number;
  saves_count: number;
  likes_count: number;
  comments_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InsightComment {
  id: string;
  insight_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
}
