import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashBoard from "./components/dashboard/DashBoard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashBoard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
