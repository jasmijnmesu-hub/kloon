import { Check, Clock, Loader2, X } from "lucide-react";
import type { DocumentStatus } from "../types";

const CONFIG: Record<DocumentStatus, { label: string; className: string }> = {
  ready: { label: "Klaar", className: "chip chip--ready" },
  processing: { label: "Bezig…", className: "chip chip--busy" },
  uploaded: { label: "Wacht", className: "chip chip--neutral" },
  error: { label: "Fout", className: "chip chip--error" },
};

export function StatusChip({ status }: { status: DocumentStatus }) {
  const { label, className } = CONFIG[status];
  return (
    <span className={className}>
      {status === "ready" && <Check size={14} strokeWidth={2.6} aria-hidden="true" />}
      {status === "processing" && <Loader2 size={14} strokeWidth={2.4} className="spin" aria-hidden="true" />}
      {status === "uploaded" && <Clock size={14} strokeWidth={2.4} aria-hidden="true" />}
      {status === "error" && <X size={14} strokeWidth={2.6} aria-hidden="true" />}
      {label}
    </span>
  );
}
