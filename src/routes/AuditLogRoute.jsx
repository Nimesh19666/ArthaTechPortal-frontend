import { Navigate } from "react-router-dom";
import { canSeeAuditLog } from "../features/platform-admin/permissions.js";
import { useAuth } from "../features/auth/useAuth.js";
import AuditLogPage from "../pages/platform-admin/AuditLogPage.jsx";

export default function AuditLogRoute() {
  const { role } = useAuth();
  if (!canSeeAuditLog(role)) return <Navigate to="/admin" replace />;
  return <AuditLogPage />;
}
