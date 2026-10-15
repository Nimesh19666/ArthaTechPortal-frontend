import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./components/ui/ToastProvider.jsx";
import { AuthProvider } from "./features/auth/AuthProvider.jsx";
import AppRoutes from "./routes/index.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
