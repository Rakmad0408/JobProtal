import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Debugging logs
console.log("Supabase URL:", supabaseUrl || "Missing");
console.log("Supabase Key:", supabaseKey ? "Loaded" : "Missing");

const supabaseClient = async (supabaseAccessToken) => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL or SUPABASE_KEY is missing");
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        apikey: supabaseKey,
      },
    },
  });

  return supabase;
};

export default supabaseClient;