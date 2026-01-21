import type { User } from "../types/users";

const KEY = "lendsqr_selected_user";

export function cacheUser(user: User) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function readCachedUser(): User | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
