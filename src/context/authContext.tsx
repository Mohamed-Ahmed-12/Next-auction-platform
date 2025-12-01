import { axiosInstance } from '@/lib/network';
import { AuthProviderProps, LoginCredentials, Tokens } from '@/types/auth';
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    ReactNode
} from 'react';

interface AuthContextType {
    user: Tokens | null;
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
    const [user, setUser] = useState<Tokens | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isAuthenticated = useMemo(() => user !== null, [user]);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userData: Tokens = JSON.parse(storedUser);
            setUser(userData);
        }
    }, []);

    const login = async (data: LoginCredentials): Promise<void> => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post<Tokens>('auth/login/', data);
            setUser(response.data)
            const user = JSON.stringify(response.data);
            localStorage.setItem("user", user);
        } catch (error:any) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error("Server Error:", error.response.data);
                throw new Error(error.response.data?.detail || "Authentication Failed");
            } else if (error.request) {
                // Request was made but no response
                console.error("Network Error:", error.request);
                throw new Error("Network error. Please check your connection.");
            } else {
                // Something else happened
                console.error("Unexpected Error:", error.message);
                throw new Error("Unexpected error occurred.");
            }
        } finally {
            setIsLoading(false)
        }
    };
    const logout = () => {
        setIsLoading(true)
        try {
            localStorage.removeItem('user')
            setUser(null)
        } catch {
            throw new Error('Logout failed.');

        } finally {
            setIsLoading(false)
        }

    }
    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
    }), [user, isAuthenticated, isLoading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
