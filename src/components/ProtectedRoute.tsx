import { Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-store";
import type { Role } from "@/lib/types";

export function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: Role;
}) {
  const { user, token, fetchMe } = useAuth();

  useEffect(() => { if (token && !user) fetchMe(); }, [token, user, fetchMe]);

  if (!token) return <Navigate to="/login" />;
  if (role && user && user.role !== role) return <Navigate to="/dashboard" />;
  return <>{children}</>;
}
