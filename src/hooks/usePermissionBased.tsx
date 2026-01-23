import { useAuth } from "@/context/authContext";
import { AppPermissions } from "@/security/constant/permissions";
import { useMemo } from "react";

/**
 * @param key - The string key, e.g., "CREATE_USER"
 */
const getPermissionValue = (key: string): string | undefined => {
    // We cast the string as a key of the Enum to allow access
    return AppPermissions[key as keyof typeof AppPermissions];
};

// hooks/usePermissionBased.ts
export function usePermission(permission: keyof typeof AppPermissions) {
    const slug = AppPermissions[permission]; 
    const { user } = useAuth();
    
    return useMemo(() => {
        return user?.permissions?.includes(slug);
    }, [user, slug]);
}
