import type { FormEvent } from "react";
import { Info, Loader2, MessageCircle } from "lucide-react";
import { useLogin } from "../hooks/useLogin";

export function LoginScreen() {
  const { mode, setMode, email, setEmail, password, setPassword, busy, submit, forgotPassword } = useLogin();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit();
  };

  return (
    <main className="screen">
      <header className="screen__header">
        <div className="logo" aria-hidden="true">
          <MessageCircle size={28} strokeWidth={1.8} />
        </div>
        <h1 className="title title--hero">Kloon van Jasmijn</h1>
        <p className="lead">Praat met mijn AI-kloon. Elk antwoord komt uit mijn eigen documenten, met bronnen erbij.</p>
      </header>

      <div className="segment" role="group" aria-label="Kies inloggen of account maken">
        <button type="button" className="segment__item" aria-pressed={mode === "login"} onClick={() => setMode("login")}>
          Inloggen
        </button>
        <button type="button" className="segment__item" aria-pressed={mode === "signup"} onClick={() => setMode("signup")}>
          Account maken
        </button>
      </div>

      <form className="stack stack--lg" onSubmit={onSubmit} noValidate>
        <label className="field">
          E-mailadres
          <input
            className="input"
            type="email"
            autoComplete="email"
            placeholder="naam@voorbeeld.nl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="field">
          Wachtwoord
          <input
            className="input"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="Minimaal 8 tekens"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy && <Loader2 size={20} className="spin" aria-hidden="true" />}
          {mode === "login" ? "Inloggen" : "Account maken"}
        </button>
        {mode === "login" && (
          <button type="button" className="link-btn link-btn--center" onClick={() => void forgotPassword()} disabled={busy}>
            Wachtwoord vergeten?
          </button>
        )}
      </form>

      <div className="notice push-down">
        <Info size={22} strokeWidth={1.8} aria-hidden="true" />
        <p>Dit is een AI-kloon en geen echt mens. Weet de kloon iets niet, dan zegt hij dat eerlijk.</p>
      </div>
    </main>
  );
}
