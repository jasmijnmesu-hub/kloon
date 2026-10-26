import { useEffect, useState, type FormEvent } from "react";
import { ChevronLeft, Loader2, LogOut } from "lucide-react";
import type { CloneSettings } from "../types";

interface Props {
  settings: CloneSettings | null;
  saving: boolean;
  onSave: (settings: CloneSettings) => void;
  onReset: () => void;
  onBack: () => void;
  onSignOut: () => void;
}

export function SettingsScreen({ settings, saving, onSave, onReset, onBack, onSignOut }: Props) {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    if (settings) {
      setName(settings.clone_name);
      setPrompt(settings.system_prompt);
    }
  }, [settings]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ clone_name: name.trim(), system_prompt: prompt });
  };

  return (
    <main className="screen">
      <header className="screen__header">
        <button type="button" className="link-btn" onClick={onBack}>
          <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
          Terug naar de chat
        </button>
        <h1 className="title">Instellingen van de kloon</h1>
        <p className="lead">Hier bepaal je hoe de kloon zich voorstelt en hoe hij antwoordt.</p>
      </header>

      {!settings ? (
        <p className="empty">Instellingen laden…</p>
      ) : (
        <form className="stack stack--lg" onSubmit={submit}>
          <label className="field">
            Naam van de kloon
            <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <div className="field">
            <label htmlFor="systeemprompt">Systeemprompt</label>
            <textarea
              id="systeemprompt"
              className="textarea"
              rows={9}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <p className="hint">
              De kloon vult {"{naam}"} en {"{chunks}"} zelf in. Laat ze staan, anders weet hij niet wie hij is of
              waar hij het over moet hebben.
            </p>
          </div>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving && <Loader2 size={20} className="spin" aria-hidden="true" />}
            Opslaan
          </button>
          <button type="button" className="btn btn--secondary" disabled={saving} onClick={onReset}>
            Terug naar de standaardprompt
          </button>
        </form>
      )}

      <button type="button" className="link-btn push-down" onClick={onSignOut}>
        <LogOut size={20} strokeWidth={2} aria-hidden="true" />
        Uitloggen
      </button>
    </main>
  );
}
