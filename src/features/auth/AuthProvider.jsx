import { useCallback, useEffect, useMemo, useState } from "react";
import { clearRole, saveRole } from "../../lib/roleStore.js";
import { getRefreshToken } from "../../lib/tokenStore.js";
import { AuthContext } from "./authContext.js";
import * as authApi from "./api.js";
import { availableRoles, resolveRole } from "./roles.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  // If a refresh token exists, we first check with the backend who the user is.
  const [loading, setLoading] = useState(() => Boolean(getRefreshToken()));

  // Used after a page reload: the server's saved role (or the stored one) decides.
  const applyUser = useCallback((nextUser) => {
    const nextRole = resolveRole(nextUser);
    if (nextRole) saveRole(nextRole);
    setUser(nextUser);
    setRole(nextRole);
  }, []);

  useEffect(() => {
    if (!getRefreshToken()) return;
    let cancelled = false;
    authApi
      .fetchMe()
      .then((me) => !cancelled && applyUser(me))
      .catch(() => {
        // Session ended or token is old. The user simply sees the login page.
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [applyUser]);

  const signIn = useCallback(async (identifier, password) => {
    const loggedInUser = await authApi.login(identifier, password);
    const roles = availableRoles(loggedInUser);

    if (roles.length > 1) {
      // Two or more roles: the person picks. The role screen shows until chooseRole runs.
      clearRole();
      setUser(loggedInUser);
      setRole(null);
      return loggedInUser;
    }

    if (roles.length === 1) {
      // One role: no screen, but the backend still has to be told.
      // Only when the backend sends a roles list (the server superuser account has none).
      if (Array.isArray(loggedInUser.roles)) {
        try {
          await authApi.setActiveRole(roles[0]);
        } catch (error) {
          await authApi.logout();
          throw error;
        }
      }
      saveRole(roles[0]);
      setRole(roles[0]);
    } else {
      setRole(null);
    }
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  // Called from the role screen. Saves the pick on the server, then in the browser.
  const chooseRole = useCallback(
    async (nextRole) => {
      await authApi.setActiveRole(nextRole);
      saveRole(nextRole);
      setUser({ ...user, active_role: nextRole });
      setRole(nextRole);
    },
    [user],
  );

  const signOut = useCallback(async () => {
    setUser(null);
    setRole(null);
    clearRole();
    await authApi.logout();
  }, []);

  const value = useMemo(
    () => ({ user, role, loading, signIn, chooseRole, signOut }),
    [user, role, loading, signIn, chooseRole, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
