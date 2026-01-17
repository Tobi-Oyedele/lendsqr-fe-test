export type AuthSession = {
  token: string;
  email: string;
  createdAt: number;
};

const KEY = "auth_session";

export function setSession(session: AuthSession) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
