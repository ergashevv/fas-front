import { ReactNode } from "react";
import { useAuth } from "@/store/useAuth";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Array<"admin" | "moderator" | "user">;
  fallback?: ReactNode;
  requireAll?: boolean; // Agar true bo'lsa, barcha rollar kerak
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null, 
  requireAll = false 
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  const hasAccess = requireAll 
    ? allowedRoles.every(role => user.role === role)
    : allowedRoles.includes(user.role);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Specific role components for convenience
export const AdminOnly = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <RoleGuard allowedRoles={["admin"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const ModeratorOrAdmin = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <RoleGuard allowedRoles={["admin", "moderator"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const UserOnly = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <RoleGuard allowedRoles={["user"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

// Hook for checking permissions
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  const can = (action: string, resource?: string) => {
    if (!isAuthenticated || !user) return false;

    // Admin can do everything
    if (user.role === "admin") return true;

    // Define permissions based on role
    const permissions = {
      moderator: {
        // Moderator permissions
        users: ["read", "list"],
        products: ["create", "read", "update", "list"],
        categories: ["read", "list"],
        orders: ["read", "update", "list", "manage"],
        comments: ["read", "update", "delete", "moderate"],
        analytics: ["view"],
        delivery: ["manage", "assign", "track"]
      },
      user: {
        // User permissions
        users: [], // Only their own profile
        products: ["read", "list"],
        categories: ["read", "list"],
        orders: [], // Only their own orders
        comments: ["create", "read", "update"], // Only their own comments
        analytics: [],
        delivery: ["track"] // Only their own orders
      }
    };

    if (user.role === "user" || user.role === "moderator") {
      const userPermissions = permissions[user.role] as any;
      if (!resource) return false;
      return userPermissions[resource]?.includes(action) || false;
    }

    return false;
  };

  const isAdmin = () => user?.role === "admin";
  const isModerator = () => user?.role === "moderator";
  const isUser = () => user?.role === "user";
  const isAdminOrModerator = () => user?.role === "admin" || user?.role === "moderator";

  return {
    can,
    isAdmin,
    isModerator,
    isUser,
    isAdminOrModerator,
    role: user?.role,
    user
  };
};