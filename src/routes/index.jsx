import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import { useAuth } from "../features/auth/useAuth.js";
import { navForRole } from "../features/platform-admin/nav.js";
import LoginPage from "../pages/login/LoginPage.jsx";
import HousesPage from "../pages/platform-admin/HousesPage.jsx";
import OverviewPage from "../pages/platform-admin/OverviewPage.jsx";
import UsersPage from "../pages/platform-admin/UsersPage.jsx";
import AuditLogRoute from "./AuditLogRoute.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { isPlatformAdmin } from "./roleHome.js";
import { availableRoles } from "../features/auth/roles.js";
import RoleChoicePage from "./RoleChoicePage.jsx";
const ROLE_LABELS = { super_admin: "Super Admin", admin: "Admin" };

export default function AppRoutes() {
  const { user, role } = useAuth();

  if (user && !role && availableRoles(user).length > 1) {
    return <RoleChoicePage />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allow={isPlatformAdmin} />}>
        <Route
          path="/admin"
          element={
            <AppShell
              roleLabel={ROLE_LABELS[role] ?? "Platform Admin"}
              nav={navForRole(role)}
            />
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="houses" element={<HousesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="audit-log" element={<AuditLogRoute />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
