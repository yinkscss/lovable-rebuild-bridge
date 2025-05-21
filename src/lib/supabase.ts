
import { createClient } from '@supabase/supabase-js';

// Use the values from the automatically generated client file
const SUPABASE_URL = "https://inowequchkiqgleluule.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub3dlcXVjaGtpcWdsZWx1dWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDE0NjMsImV4cCI6MjA2MzI3NzQ2M30.3zodoCcCC6yCQCVPnPFLUGZs8gXJjkZuA-8xp5hoGn8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
