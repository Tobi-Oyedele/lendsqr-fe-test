import type { ApiUser, User } from "../types/users";
import { mapApiUser } from "./userMapper";
import { loadUsers, saveUsers } from "../utils/userStorage";

const USERS_URL = "https://mocki.io/v1/c4622f50-ce50-4404-b7ba-418d178e1a6b";

export async function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  const cached = loadUsers();
  if (cached?.length) return cached;

  const res = await fetch(USERS_URL, { signal });
  if (!res.ok) throw new Error(`Failed to fetch users (${res.status})`);

  const json = await res.json();
  const raw: ApiUser[] = Array.isArray(json) ? json : (json?.data ?? []);

  const users: User[] = raw.map(mapApiUser);
  saveUsers(users);
  return users;
}
