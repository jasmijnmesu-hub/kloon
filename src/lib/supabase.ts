import { createClient } from "@supabase/supabase-js";

function requireEnv(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_PUBLISHABLE_KEY"): string {
  const value = import.meta.env[name];
  if (typeof value !== "string" || value.length === 0) {
    // Ontbrekende config = duidelijke fout, geen stille fallback (AGENTS.md §7)
    throw new Error(`Configuratie ontbreekt: ${name}. Vul deze in in .env.`);
  }
  return value;
}

export const supabase = createClient(
  requireEnv("VITE_SUPABASE_URL"),
  requireEnv("VITE_SUPABASE_PUBLISHABLE_KEY"),
);

export const DOCUMENT_BUCKET = "clone-documents";
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt", "md", "csv"] as const;
