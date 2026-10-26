import { useState } from "react";
import { sendPasswordReset, signIn, signUp } from "../lib/auth";
import { useToast } from "../contexts/ToastContext";

export type LoginMode = "login" | "signup";

const MIN_PASSWORD = 8;

export function useLogin() {
  const toast = useToast();
  const [mode, setMode] = useState<LoginMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), "error");
    } finally {
      setBusy(false);
    }
  };

  const submit = () =>
    run(async () => {
      if (!email.trim()) throw new Error("Vul je e-mailadres in.");
      if (password.length < MIN_PASSWORD) throw new Error(`Je wachtwoord moet minimaal ${MIN_PASSWORD} tekens hebben.`);
      if (mode === "login") {
        await signIn(email.trim(), password);
        return;
      }
      const loggedIn = await signUp(email.trim(), password);
      if (!loggedIn) {
        toast("Account gemaakt. Klik op de link in je mail om het te bevestigen en log daarna in.");
        setMode("login");
      }
    });

  const forgotPassword = () =>
    run(async () => {
      if (!email.trim()) throw new Error("Vul eerst je e-mailadres in.");
      await sendPasswordReset(email.trim());
      toast("Als dit e-mailadres bekend is, krijg je een mail om je wachtwoord te herstellen.");
    });

  return { mode, setMode, email, setEmail, password, setPassword, busy, submit, forgotPassword };
}
