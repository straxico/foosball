import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your own Supabase project URL and anon key.
const supabaseUrl = 'https://qvmnkdlcfyxmwnaggktl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bW5rZGxjZnl4bXduYWdna3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NjE2NDUsImV4cCI6MjA3ODMzNzY0NX0.yB4qEiM5pBaJIBWTwqMIvHD2iaJXNS0pjGyXtyisNNc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)