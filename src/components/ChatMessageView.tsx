import { FileText } from "lucide-react";
import type { ChatMessage } from "../types";

interface Props {
  message: ChatMessage;
  onOpenSource: () => void;
}

export function ChatMessageView({ message, onOpenSource }: Props) {
  if (message.role === "user") {
    return <div className="bubble bubble--user">{message.text}</div>;
  }

  const sources = message.sources ?? [];
  return (
    <div className="reply">
      <div className={message.isError ? "bubble bubble--clone bubble--error" : "bubble bubble--clone"}>
        {message.text}
      </div>
      {!message.isError &&
        (sources.length > 0 ? (
          <div className="sources">
            <span className="sources__label">Bronnen</span>
            <div className="sources__list">
              {sources.map((s) => (
                <button
                  key={`${s.nr}-${s.document_id}`}
                  type="button"
                  className="source-chip"
                  title={s.snippet}
                  onClick={onOpenSource}
                >
                  <FileText size={14} strokeWidth={2} aria-hidden="true" />
                  {s.nr} · {s.title}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <span className="sources__none">Geen bronnen gevonden</span>
        ))}
    </div>
  );
}
