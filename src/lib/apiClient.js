import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "./tokenStore.js";

const BASE_URL = import.meta.env.VITE_API_URL;

// Every backend error becomes one of these: { status, code, message, details }
export class ApiError extends Error {
  constructor(status, body) {
    super(
      body?.message ||
        body?.detail ||
        "Something went wrong. Please try again.",
    );
    this.status = status;
    this.code = body?.code ?? "SERVER_ERROR";
    // Field errors come as { email: ["..."] } with no code, message or detail.
    const isFieldErrors =
      body &&
      typeof body === "object" &&
      !Array.isArray(body) &&
      !body.code &&
      !body.message &&
      !body.detail;
    this.details = body?.details ?? (isFieldErrors ? body : null);
  }
}

async function send(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  const isFile = body instanceof FormData;
  // For file uploads the browser sets the Content-Type itself.
  if (body && !isFile) headers["Content-Type"] = "application/json";
  const token = getAccessToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? (isFile ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new ApiError(0, {
      code: "NETWORK_ERROR",
      message: "Cannot reach the server. Please try again.",
    });
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, data);
  return data;
}

// Gets a new access token. If the backend also sends a NEW refresh token, we save both.
// If several calls fail at once, they share one refresh.
let refreshing = null;
function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh)
    return Promise.reject(new ApiError(401, { code: "TOKEN_INVALID" }));

  refreshing ??= send("/accounts/token/refresh/", {
    method: "POST",
    body: { refresh },
    auth: false,
  })
    .then((tokens) => saveTokens(tokens))
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

export async function api(path, options) {
  // After a page refresh we have no access token yet. Get one first, instead of failing once.
  if (options?.auth !== false && !getAccessToken() && getRefreshToken()) {
    try {
      await refreshAccessToken();
    } catch {
      clearTokens();
    }
  }

  try {
    return await send(path, options);
  } catch (error) {
    if (error.status !== 401 || options?.auth === false) throw error;

    // The 15-minute access token ran out. Refresh once, then try the same call again.
    try {
      await refreshAccessToken();
    } catch {
      clearTokens();
      throw error;
    }
    return send(path, options);
  }
}
