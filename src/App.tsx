import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import DashBoard from "./components/dashboard/DashBoard";
import Users from "./pages/Users/Users";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/users" element={<Users />} />

        {/* later */}
        {/* <Route path="/users/:id" element={<UserDetails />} /> */}
      </Route>

      {/* optional fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
