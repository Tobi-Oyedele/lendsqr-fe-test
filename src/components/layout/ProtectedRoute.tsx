import { Navigate } from "react-router-dom";
import { getSession } from "../../utils/authStorage";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
