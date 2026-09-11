import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL) {
  throw new Error(
    "Falta la variable SUPABASE_URL en el archivo .env",
  );
}

if (!process.env.SUPABASE_SECRET_KEY) {
  throw new Error(
    "Falta la variable SUPABASE_SECRET_KEY en el archivo .env",
  );
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: "public",
    },
  },
);

export default supabase;