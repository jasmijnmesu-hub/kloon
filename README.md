# Kloon van Jasmijn

Een AI-kloon (RAG) die antwoordt uit mijn eigen documenten, met bronnen erbij. Gemaakt voor de minor Future Proof met AI (week 8: Bouw je eigen kloon).

## Hoe het werkt

- **Frontend:** React + Vite + TypeScript, styling met tokens uit `design/DESIGN.md` (`src/index.css`).
- **Supabase:** Auth, Postgres + pgvector (`documents`, `chunks`, `clone_settings`), Storage (`clone-documents`) en de Edge Functions `ingest` en `chat`.
- **LLM:** Gemini (`gemini-embedding-001`, 768 dimensies, en `gemini-flash-latest`). De key staat alleen als Edge Function secret `GEMINI_API_KEY`.

De website praat alleen met Supabase, nooit rechtstreeks met Gemini.

## Lokaal starten

```bash
cp .env.example .env   # vul VITE_SUPABASE_URL en VITE_SUPABASE_PUBLISHABLE_KEY in
npm install
npm run dev
```

## Online zetten

`npm run build` maakt de map `dist/`. Op Netlify: build command `npm run build`, publish directory `dist`, en zet de twee `VITE_`-variabelen bij *Environment variables*.
