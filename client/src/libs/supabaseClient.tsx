import { createClient, type Session, type User } from '@supabase/supabase-js';

const supabaseUrl = 'https://lqxrdsayuzjybccsuhmb.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeHJkc2F5dXpqeWJjY3N1aG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODU0MTMsImV4cCI6MjA3NzU2MTQxM30.MLnPxJtX1CGOIz3YFdHHdxJckeKvIM7lvbK6mGS80MI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type { Session, User };
