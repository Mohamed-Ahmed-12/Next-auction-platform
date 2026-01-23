import { usePermission } from "@/hooks/usePermissionBased";
import { AppPermissions } from "@/security/constant/permissions";

// components/security/Guard.tsx
interface GuardProps {
    permission: keyof typeof AppPermissions;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const Guard = ({ permission, children, fallback = null }: GuardProps) => {
    const hasPermission = usePermission(permission);
    return hasPermission ? <>{children}</> : <>{fallback}</>;
};