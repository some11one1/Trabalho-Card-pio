import React, { createContext, useState } from "react";

import "react-native-get-random-values";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hszlasqgdgkyxnybgyog.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzemxhc3FnZGdreXhueWJneW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODkzMDQsImV4cCI6MjA3NzI2NTMwNH0.YAJqeVxpApOnLkVFo5ORODNw1PJfmZkdNTy9EjGa25c";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
