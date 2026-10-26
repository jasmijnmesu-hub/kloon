import { useEffect, useRef, useState, type FormEvent } from "react";
import { Loader2, SendHorizontal, Settings } from "lucide-react";
import type { ChatMessage } from "../types";
import { ChatMessageView } from "./ChatMessageView";

interface Props {
  cloneName: string;
  messages: ChatMessage[];
  sending: boolean;
  onSend: (question: string) => void;
  onOpenSettings: () => void;
  onOpenSource: () => void;
}

export function ChatScreen({ cloneName, messages, sending, onSend, onOpenSettings, onOpenSource }: Props) {
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    onSend(draft);
    setDraft("");
  };

  return (
    <main className="chat">
      <header className="chat__head">
        <div className="chat__identity">
          <div className="avatar" aria-hidden="true">
            {cloneName.charAt(0).toUpperCase()}
          </div>
          <div className="chat__name">
            <h1 className="title title--small">Kloon van {cloneName}</h1>
            <span className="chip chip--ai">AI-kloon</span>
          </div>
          <button type="button" className="icon-btn" aria-label="Instellingen van de kloon" onClick={onOpenSettings}>
            <Settings size={24} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
        <p className="chat__disclaimer">
          Je praat met een AI, niet met {cloneName} zelf. Antwoorden komen uit de eigen documenten.
        </p>
      </header>

      <div className="chat__messages" aria-live="polite">
        {messages.length === 0 && (
          <p className="empty">Stel een vraag, bijvoorbeeld: &ldquo;Wat studeer je?&rdquo;</p>
        )}
        {messages.map((m) => (
          <ChatMessageView key={m.id} message={m} onOpenSource={onOpenSource} />
        ))}
        {sending && (
          <span className="typing">
            <Loader2 size={16} className="spin" aria-hidden="true" />
            De kloon zoekt in de documenten…
          </span>
        )}
        <div ref={endRef} />
      </div>

      <form className="composer" onSubmit={submit}>
        <label className="sr-only" htmlFor="question">
          Je vraag
        </label>
        <input
          id="question"
          className="composer__input"
          type="text"
          autoComplete="off"
          placeholder="Stel een vraag aan de kloon"
          value={draft}
          maxLength={2000}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="composer__send" aria-label="Verstuur" disabled={sending || !draft.trim()}>
          <SendHorizontal size={22} strokeWidth={2} aria-hidden="true" />
        </button>
      </form>
    </main>
  );
}
