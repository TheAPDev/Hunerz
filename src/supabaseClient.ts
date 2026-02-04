import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sqapaiksbtvmiueckxdi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxYXBhaWtzYnR2bWl1ZWNreGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNDQzNDcsImV4cCI6MjA4NTcyMDM0N30.Km_v-li8AAGLqoFZ5gqHyzC4G30UXJ7UZ-nabQpDmSE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
