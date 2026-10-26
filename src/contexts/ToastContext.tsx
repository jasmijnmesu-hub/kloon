import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import type { Toast, ToastKind } from "../types";

type ShowToast = (text: string, kind?: ToastKind) => void;

const ToastContext = createContext<ShowToast>(() => undefined);

const TOAST_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback<ShowToast>(
    (text, kind = "info") => {
      const id = nextId.current++;
      setToasts((list) => [...list, { id, kind, text }]);
      window.setTimeout(() => dismiss(id), TOAST_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={t.kind === "error" ? "toast toast--error" : "toast"}>
            <p className="toast__text">{t.text}</p>
            <button type="button" className="toast__close" aria-label="Melding sluiten" onClick={() => dismiss(t.id)}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ShowToast {
  return useContext(ToastContext);
}
