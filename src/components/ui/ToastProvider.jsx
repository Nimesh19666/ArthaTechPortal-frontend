import { useCallback, useState } from "react";
import { ToastContext } from "./toastContext.js";

const tones = {
  ok: "bg-ok",
  bad: "bg-bad",
  default: "bg-ink",
};

const SHOW_FOR_MS = 5000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, tone = "default") => {
    const id = crypto.randomUUID();
    setToasts((list) => [...list, { id, message, tone }]);
    setTimeout(
      () => setToasts((list) => list.filter((t) => t.id !== id)),
      SHOW_FOR_MS,
    );
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="fixed right-4 bottom-4 z-60 grid max-w-[calc(100%-2rem)] gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-105 rounded-[10px] px-3.5 py-2.5 text-white shadow-lg ${tones[t.tone]}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
