import { useCallback, useEffect, useState } from "react";
import type { CloneSettings } from "../types";
import { fetchOrCreateSettings, resetPrompt, saveSettings } from "../lib/clone";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export function useCloneSettings() {
  const { session } = useAuth();
  const toast = useToast();
  const [settings, setSettings] = useState<CloneSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    fetchOrCreateSettings()
      .then((s) => active && setSettings(s))
      .catch((e: unknown) => toast(e instanceof Error ? e.message : String(e), "error"));
    return () => {
      active = false;
    };
  }, [toast]);

  const save = useCallback(
    async (next: CloneSettings) => {
      const userId = session?.user.id;
      if (!userId) return;
      if (!next.clone_name.trim()) {
        toast("Geef je kloon een naam.", "error");
        return;
      }
      if (!next.system_prompt.includes("{chunks}")) {
        toast("Laat {chunks} in de systeemprompt staan, anders vindt de kloon zijn kennis niet.", "error");
        return;
      }
      setSaving(true);
      try {
        setSettings(await saveSettings(userId, next));
        toast("Opgeslagen.");
      } catch (e) {
        toast(e instanceof Error ? e.message : String(e), "error");
      } finally {
        setSaving(false);
      }
    },
    [session, toast],
  );

  const reset = useCallback(async () => {
    setSaving(true);
    try {
      setSettings(await resetPrompt());
      toast("De standaardprompt staat er weer.");
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), "error");
    } finally {
      setSaving(false);
    }
  }, [toast]);

  return { settings, saving, save, reset };
}
