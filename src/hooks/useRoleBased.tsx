import { useAuth } from "@/context/authContext";
export function useRole(role: string) { 
    const { user } = useAuth(); 
    return user?.roles?.includes(role); 
}