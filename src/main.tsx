import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Element #root ontbreekt in index.html");

// App wordt pas geladen als de configuratie klopt; anders tonen we een duidelijke fout i.p.v. een lege pagina.
async function start(container: HTMLElement) {
  try {
    const [{ App }, { AuthProvider }, { ToastProvider }] = await Promise.all([
      import("./App"),
      import("./contexts/AuthContext"),
      import("./contexts/ToastContext"),
    ]);
    createRoot(container).render(
      <StrictMode>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </StrictMode>,
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    createRoot(container).render(
      <main className="screen">
        <h1 className="title">De app kan niet starten</h1>
        <p className="lead">{message}</p>
      </main>,
    );
  }
}

void start(root);
