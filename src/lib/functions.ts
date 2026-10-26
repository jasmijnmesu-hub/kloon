import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "./supabase";

interface FunctionResult {
  ok: boolean;
  error?: string;
}

// Edge Functions geven bij fouten { ok: false, error } terug; die tekst willen we tonen.
export async function invokeFunction<T extends FunctionResult>(
  name: "ingest" | "chat",
  body: Record<string, unknown>,
): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>(name, { body });

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const payload: unknown = await error.context.json().catch(() => null);
      if (payload && typeof payload === "object" && "error" in payload) {
        throw new Error(String((payload as { error: unknown }).error));
      }
    }
    throw new Error(error.message || `De functie ${name} gaf een fout.`);
  }

  if (!data) throw new Error(`De functie ${name} gaf geen antwoord.`);
  if (!data.ok) throw new Error(data.error ?? `De functie ${name} gaf een fout.`);
  return data;
}
