import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lahinfodbprtocyavgod.supabase.co";

const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaGluZm9kYnBydG9jeWF2Z29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4ODQyNzgsImV4cCI6MjA5NDQ2MDI3OH0.6lDlu_eGXqYNbHh4a6WrkHBWcC91nILI4iJWNYtYyFQ";

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});