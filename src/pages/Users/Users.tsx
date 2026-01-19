import { useUsers } from "../../hooks/useUSers";

export default function Users() {
  const { data, loading, error } = useUsers();

  if (loading) return <div style={{ padding: 18 }}>Loading users…</div>;
  if (error) return <div style={{ padding: 18 }}>Error: {error}</div>;
  if (!data) return null;

  return (
    <div style={{ padding: 18 }}>
      <h1>Users</h1>
      <p>Records: {data.length}</p>
      <pre style={{ fontSize: 12, overflow: "auto" }}>
        {JSON.stringify(data[0], null, 2)}
      </pre>
    </div>
  );
}
