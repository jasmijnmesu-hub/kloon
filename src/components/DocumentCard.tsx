import { useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import type { CloneDocument } from "../types";
import { StatusChip } from "./StatusChip";

interface Props {
  doc: CloneDocument;
  busy: boolean;
  onRetry?: (doc: CloneDocument) => void;
  onDelete?: (doc: CloneDocument) => void;
}

const dateFormat = new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short", year: "numeric" });

export function DocumentCard({ doc, busy, onRetry, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);

  return (
    <article className={confirming ? "doc-card doc-card--confirm" : "doc-card"}>
      <div className="doc-card__row">
        <FileText size={24} strokeWidth={1.8} className="doc-card__icon" aria-hidden="true" />
        <div className="doc-card__body">
          <span className="doc-card__title" title={doc.title}>
            {doc.title}
          </span>
          <span className="doc-card__meta">
            <StatusChip status={doc.status} />
            {dateFormat.format(new Date(doc.created_at))}
          </span>
        </div>
        {onDelete && !confirming && (
          <button
            type="button"
            className="icon-btn"
            aria-label={`Verwijder ${doc.title}`}
            disabled={busy}
            onClick={() => setConfirming(true)}
          >
            <Trash2 size={22} strokeWidth={1.8} aria-hidden="true" />
          </button>
        )}
      </div>

      {doc.status === "error" && !confirming && (
        <>
          {doc.error_message && <p className="doc-card__error">{doc.error_message}</p>}
          {onRetry && (
            <button type="button" className="link-btn" disabled={busy} onClick={() => onRetry(doc)}>
              Opnieuw proberen
            </button>
          )}
        </>
      )}

      {confirming && onDelete && (
        <>
          <p className="doc-card__confirm-text">
            Weet je zeker dat je dit document wilt verwijderen? Het bestand en alle stukjes tekst gaan weg. Dit kan
            niet ongedaan worden gemaakt.
          </p>
          <div className="doc-card__actions">
            <button type="button" className="btn btn--secondary" onClick={() => setConfirming(false)}>
              Annuleren
            </button>
            <button
              type="button"
              className="btn btn--danger"
              disabled={busy}
              onClick={() => {
                setConfirming(false);
                onDelete(doc);
              }}
            >
              Ja, verwijder
            </button>
          </div>
        </>
      )}
    </article>
  );
}
