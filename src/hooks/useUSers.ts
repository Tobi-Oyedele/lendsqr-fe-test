import { useEffect, useMemo, useState } from "react";
import type { User } from "../types/users";
import { fetchUsers } from "../services/usersApi";

export function useUsers() {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    fetchUsers(ac.signal)
      .then((users: User[]) => setData(users))
      .catch((e) => {
        if (ac.signal.aborted) return;
        setError(e instanceof Error ? e.message : "Failed to load users");
      })
      .finally(() => {
        if (ac.signal.aborted) return;
        setLoading(false);
      });

    return () => ac.abort();
  }, []);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
}
