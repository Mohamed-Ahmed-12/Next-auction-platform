import { useRouter } from '@/i18n/navigation';
import { axiosInstance } from '@/lib/network';
import { AuthProviderProps, LoginCredentials, User } from '@/types/auth';
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from 'react';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginCredentials) => Promise<void>;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isAuthenticated = useMemo(() => user !== null, [user]);
    const router = useRouter();
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userData: User = JSON.parse(storedUser);
            setUser(userData);
        } else {
            setUser(null);
        }
        setIsLoading(false)
    }, []);


    const login = useCallback(async (data: LoginCredentials): Promise<void> => {
        setIsLoading(true)
        const response = await axiosInstance.post<User>('auth/login/', data);
        setUser(response.data)
        const user = JSON.stringify(response.data);
        localStorage.setItem("user", user);
        setIsLoading(false)
    }, []);

    const logout = useCallback(() => {
        setIsLoading(true)
        try {
            localStorage.removeItem('user')
            setUser(null)
            router.push('/');
        } catch {
            throw new Error('Logout failed.');

        } finally {
            setIsLoading(false)
        }

    }, [router]);
    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
    }), [user, isAuthenticated, isLoading, login, logout,]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
