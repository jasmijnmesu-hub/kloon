import { useRef, useState, type DragEvent } from "react";
import { Upload } from "lucide-react";
import type { CloneDocument } from "../types";
import { DocumentCard } from "./DocumentCard";

const RECENT_COUNT = 5;
const ACCEPT = ".pdf,.docx,.txt,.md,.csv";

interface Props {
  documents: CloneDocument[];
  busyIds: Set<string>;
  onUpload: (files: File[]) => void;
  onRetry: (doc: CloneDocument) => void;
}

export function UploadScreen({ documents, busyIds, onUpload, onRetry }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    onUpload(Array.from(e.dataTransfer.files));
  };

  const recent = documents.slice(0, RECENT_COUNT);

  return (
    <main className="screen screen--with-nav">
      <header className="screen__header">
        <h1 className="title">Documenten uploaden</h1>
        <p className="lead">
          Hoe meer van mijzelf erin staat, hoe beter de kloon antwoordt. Pdf, docx, txt, md of csv, maximaal 10 MB.
        </p>
      </header>

      <div
        className={dragging ? "dropzone dropzone--active" : "dropzone"}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <div className="dropzone__icon" aria-hidden="true">
          <Upload size={24} strokeWidth={1.8} />
        </div>
        <p>Sleep een bestand hierheen of kies er een</p>
        <button type="button" className="btn btn--primary btn--auto" onClick={() => inputRef.current?.click()}>
          Kies een bestand
        </button>
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept={ACCEPT}
          multiple
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            onUpload(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </div>

      <section className="stack" aria-labelledby="recent-label">
        <h2 id="recent-label" className="section-label">
          Zojuist geüpload
        </h2>
        {recent.length === 0 ? (
          <p className="empty">Nog niets geüpload. Begin bijvoorbeeld met je cv of een stuk over wie je bent.</p>
        ) : (
          recent.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} busy={busyIds.has(doc.id)} onRetry={onRetry} />
          ))
        )}
      </section>
    </main>
  );
}
