# DESIGN.md — Kloon van Jasmijn

Rustig, warm, academisch en toegankelijk. Mobile-first (ontworpen op 390 × 844 px). Alle teksten in eenvoudig Nederlands.

## Colors

| Token | Hex | Gebruik |
|---|---|---|
| `--color-bg` | `#F6F2EA` | Achtergrond van de app |
| `--color-surface` | `#FFFFFF` | Kaarten, navigatiebalk |
| `--color-surface-soft` | `#FBF9F4` | Invoervelden in de chat, uploadvak |
| `--color-ink` | `#1E2B2D` | Gewone tekst |
| `--color-muted` | `#5B6B6D` | Ondertitels, hulptekst |
| `--color-nav-inactive` | `#4A5A5C` | Inactieve menu-items en iconen |
| `--color-primary` | `#1F5F5B` | Hoofdknoppen, links, actief menu-item, bubbel van de gebruiker |
| `--color-primary-hover` | `#14403D` | Hover op links |
| `--color-primary-ink` | `#FFFFFF` | Tekst op primary |
| `--color-primary-soft` | `#E3EFEC` | AI-kloon-label, uitlegblokken |
| `--color-primary-soft-ink` | `#17403D` | Tekst op primary-soft |
| `--color-line` | `#DDD6C8` | Scheidingslijnen |
| `--color-border` | `#CFC7B6` | Rand van invoervelden en knoppen |
| `--color-segment` | `#EAE4D7` | Achtergrond van de tab-schakelaar |
| `--color-status-ready-bg` / `-ink` | `#DDEEDF` / `#1F5A2C` | Status "Klaar" |
| `--color-status-busy-bg` / `-ink` | `#FBEBC8` / `#6B4500` | Status "Bezig" |
| `--color-status-error-bg` / `-ink` | `#F8DFDF` / `#8A1F1F` | Status "Fout" |
| `--color-danger` | `#9B2C2C` | Knop "Ja, verwijder" |
| `--color-danger-border` | `#D9A3A3` | Rand van het bevestigingsblok |

Status wordt nooit alleen met kleur getoond: er staat altijd een icoon en een woord bij.

## Typography

- Koppen: **Source Serif 4**, gewicht 600. H1 28–34 px (regelhoogte 34–40), kleine kop in chat 20 px.
- Gewone tekst: **Inter**, gewicht 400/500/600. Basis 15–16 px, regelhoogte 22–24 px.
- Hulptekst en labels: 13–14 px. Label boven lijst: 14 px, hoofdletters, letterafstand 0.04em, kleur muted.
- Invoervelden: altijd 16 px, zodat iOS niet inzoomt.

## Spacing & shape

- Raster van 8 px. Schermmarge links en rechts 24 px. Ruimte tussen blokken 12, 16, 24 of 32 px.
- Radius: kaarten en knoppen 14 px, grote kaarten 18 px, chips en bubbels 999 px / 18 px (met een scherpe hoek van 4 px bij de afzender).
- Minimale tikgrootte 44 px; knoppen en invoervelden zijn 48–52 px hoog.
- Onderste menu: 3 items, 56 px hoog, 24 px extra ruimte onderaan voor de veilige zone (safe area).

## Components

- **Hoofdknop:** primary, wit, 52 px hoog (48 px in kleinere blokken), radius 14, gewicht 600.
- **Tweede knop:** wit met rand `--color-border`, tekst ink.
- **Gevaarknop:** `--color-danger`, wit. Alleen in het bevestigingsblok.
- **Invoerveld:** wit, rand 1.5 px `--color-border`, radius 14, 52 px hoog, label erboven (14 px, gewicht 600).
- **Tab-schakelaar (Inloggen / Account maken):** grijsbeige balk met twee knoppen, de actieve is wit.
- **Statuschip:** pil van 22–28 px hoog, kleurvlak, icoon plus woord.
- **Documentkaart:** wit, radius 14, bestandsicoon, titel (afgekapt met …), status en datum, verwijderknop van 48 px.
- **Chatbubbel gebruiker:** primary, wit, rechts, max. 280 px breed.
- **Chatbubbel kloon:** wit, links, max. 310 px breed.
- **Bronnenchip:** pil met rand, bestandsicoon, nummer en titel, minimaal 36 px hoog. Staat onder het antwoord. Geen bronnen? Toon "Geen bronnen gevonden".
- **Navigatie onderaan:** Chat, Kennisbank, Uploaden. Het actieve item is primary met een dikkere icoonlijn en `aria-current="page"`.
- **Iconen:** Lucide, lijnstijl, 24 px, lijndikte 1.8 (2.2 voor actief).

## Screens

### 1. Inloggen (`Main`)
Logo-blokje (primary, afgerond, chat-icoon), titel "Kloon van Jasmijn", korte uitleg. Tab-schakelaar Inloggen / Account maken. Velden e-mailadres en wachtwoord (hulptekst "Minimaal 8 tekens"). Hoofdknop "Inloggen", link "Wachtwoord vergeten?". Onderaan een uitlegblok (primary-soft): "Dit is een AI-kloon en geen echt mens. Weet de kloon iets niet, dan zegt hij dat eerlijk."

### 2. Documenten uploaden (`Upload`)
Titel, uitleg met toegestane typen (pdf, docx, txt, md, csv; max. 10 MB). Uploadvak met stippellijn, icoon, tekst en knop "Kies een bestand". Daaronder "Zojuist geüpload": kaarten met status Klaar, Bezig… (met voortgangsbalk) of Fout (met uitleg in rood en link "Opnieuw proberen"). Voorbeeldfout: "Geen tekst gevonden in het bestand (misschien een scan of afbeelding?)".

### 3. Kennisbank (`Kennisbank`)
Titel en uitleg ("Verwijder je een document, dan is het echt weg."). Lijst met documentkaarten. Verwijderen vraagt **altijd bevestiging**: de kaart klapt open met de tekst "Weet je zeker dat je dit document wilt verwijderen? Het bestand en alle stukjes tekst gaan weg. Dit kan niet ongedaan worden gemaakt." en de knoppen "Annuleren" en "Ja, verwijder".

### 4. Chat (`Chat`)
Kop met avatar-cirkel, "Kloon van Jasmijn" en het label "AI-kloon". Daaronder altijd de zin "Je praat met een AI, niet met Jasmijn zelf. Antwoorden komen uit haar documenten." Berichtenlijst met bubbels en bronnenchips. Weet de kloon het niet, dan staat er een eerlijk antwoord zonder bronnen. Onderaan een invoerbalk (pil) met verzendknop van 48 px.

### 5. Instellingen van de kloon (`Instellingen`)
Link "Terug naar de chat" bovenaan, titel en uitleg. Veld "Naam van de kloon" en groot tekstvak "Systeemprompt" (9 regels) met hulptekst dat `{naam}` en `{chunks}` door de kloon zelf worden ingevuld en moeten blijven staan. Onderaan de hoofdknop "Opslaan" en een tweede knop "Terug naar de standaardprompt". Bereikbaar via een tandwiel-icoon (48 px, `aria-label` "Instellingen van de kloon") rechts in de kop van de chat. Dit scherm staat niet in het onderste menu.

## Regels voor de bouwer

- Kleuren en maten alleen via tokens in `src/index.css`. Geen hex in componenten, geen inline styles.
- Gebruik echte `<button>`, `<a>`, `<label>` en `<input>`. Iconen zonder tekst krijgen een `aria-label`.
- Meldingen via toasts, niet via `alert()`.
- Contrast: tekst minimaal 4.5 : 1. Behoud de combinaties hierboven.
