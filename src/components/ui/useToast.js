import { useContext } from "react";
import { ToastContext } from "./toastContext.js";

// const toast = useToast(); toast('Saved', 'ok')   tones: 'ok' | 'bad' | nothing
export function useToast() {
  return useContext(ToastContext);
}
