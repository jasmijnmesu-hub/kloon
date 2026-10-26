import type { ChatResponse, ChatSource, ChatTurn, CloneSettings } from "../types";
import { supabase } from "./supabase";
import { invokeFunction } from "./functions";

const SETTINGS_COLUMNS = "clone_name, system_prompt";

// Haalt de instellingen op; bestaan ze nog niet, dan maakt de database ze aan met de standaardwaarden.
export async function fetchOrCreateSettings(): Promise<CloneSettings> {
  const { data, error } = await supabase
    .from("clone_settings")
    .select(SETTINGS_COLUMNS)
    .maybeSingle<CloneSettings>();
  if (error) throw new Error(`Instellingen ophalen mislukt: ${error.message}`);
  if (data) return data;

  const { data: created, error: insertError } = await supabase
    .from("clone_settings")
    .insert({})
    .select(SETTINGS_COLUMNS)
    .single<CloneSettings>();
  if (insertError || !created) {
    throw new Error(`Instellingen aanmaken mislukt: ${insertError?.message ?? "onbekende fout"}`);
  }
  return created;
}

export async function saveSettings(userId: string, settings: CloneSettings): Promise<CloneSettings> {
  const { data, error } = await supabase
    .from("clone_settings")
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select(SETTINGS_COLUMNS)
    .single<CloneSettings>();
  if (error || !data) throw new Error(`Opslaan mislukt: ${error?.message ?? "onbekende fout"}`);
  return data;
}

export async function resetPrompt(): Promise<CloneSettings> {
  const { data, error } = await supabase.rpc("reset_clone_prompt").single<CloneSettings>();
  if (error || !data) throw new Error(`Terugzetten mislukt: ${error?.message ?? "onbekende fout"}`);
  return { clone_name: data.clone_name, system_prompt: data.system_prompt };
}

export async function askClone(
  question: string,
  history: ChatTurn[],
): Promise<{ answer: string; sources: ChatSource[] }> {
  const result = await invokeFunction<ChatResponse>("chat", { question, history });
  return { answer: result.answer ?? "", sources: result.sources ?? [] };
}
