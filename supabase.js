import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://rvcsutokdfgfytaugjyw.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  autoConnect: true
});

export default supabase;
