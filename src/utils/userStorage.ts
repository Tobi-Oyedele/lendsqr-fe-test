import type { User } from "../types/users";

const USERS_KEY = "lendsqr_users_v1";

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loadUsers(): User[] | null {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : null;
  } catch {
    return null;
  }
}
