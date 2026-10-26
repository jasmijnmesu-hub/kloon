import { supabase } from "./supabase";

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(
      error.message === "Invalid login credentials"
        ? "E-mailadres of wachtwoord klopt niet."
        : error.message === "Email not confirmed"
          ? "Bevestig eerst je e-mailadres via de link in je mail."
          : error.message,
    );
  }
}

// Geeft true terug als de gebruiker meteen is ingelogd, false als er eerst een bevestigingsmail is.
export async function signUp(email: string, password: string): Promise<boolean> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin },
  });
  if (error) throw new Error(error.message);
  return data.session !== null;
}

export async function sendPasswordReset(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });
  if (error) throw new Error(error.message);
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
