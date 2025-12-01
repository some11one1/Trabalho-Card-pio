// Supabase.js
import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eqwmffyfofezbgmwbeuu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxd21mZnlmb2ZlemJnbXdiZXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTQxMzgsImV4cCI6MjA3NjczMDEzOH0.fZOvZyuIArfC0atNj10CxxnTxzV5kwXL0ZY08ySBz44";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: { eventsPerSecond: 30 },
  },
});
