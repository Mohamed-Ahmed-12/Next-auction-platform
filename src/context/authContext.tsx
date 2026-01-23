import { useRouter } from '@/i18n/navigation';
import { authEvents, axiosInstance } from '@/lib/network';
import { AuthProviderProps, LoginCredentials, User } from '@/types/auth';
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
} from 'react';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginCredentials, redirectURL?: string | null | undefined) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("user");
            return saved ? JSON.parse(saved) : null;
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();
    const isInitialMount = useRef(true); // 🎯 Robust check for mount

    /**
     * SYNC SESSION
     * On mount, we verify the HttpOnly cookie by calling /me.
     * This is safer than trusting localStorage, which can be stale.
     */

    const syncSession = useCallback(async () => {
        // If we have a user in state, we don't need to block the UI with loading
        try {
            const response = await axiosInstance.get<User>('auth/me/', {
                _skipInterceptor: true // 🎯 Don't let 401s trigger a logout here
            } as any);

            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error: any) {
            // Only clear if the status is explicitly 401 (Not 500, not Network Error)
            if (error.response?.status === 401) {
                setUser(null);
                localStorage.removeItem("user");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (data: LoginCredentials, redirectURL?: string | null): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post<User>('auth/login/', data);

            // 1. Update State & Storage
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));

            // 2. Robust Redirect Logic
            // If redirectURL is undefined, use default '/dashboard'
            // If redirectURL is a string, use that string
            // If redirectURL is explicitly null, do nothing
            const targetPath = redirectURL === undefined ? '/dashboard' : redirectURL;

            if (targetPath !== null) {
                router.push(targetPath);
            }

        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await axiosInstance.post('auth/logout/', {}, {
                _skipInterceptor: true
            } as any);

        } catch (error) {
            console.warn('Server-side session already cleared or unreachable.');
        } finally {
            // 1. Clear sensitive data
            localStorage.removeItem('user');

            // 2. Reset React State
            setUser(null);
            setIsLoading(false);

            // 3. Force navigation and prevent "Back" button access to private pages
            router.replace('/');
        }
    }, [router]);

    useEffect(() => {
        // 🎯 Avoid double-running in Strict Mode/Dev
        if (isInitialMount.current) {
            syncSession();
            isInitialMount.current = false;
        }
    }, [syncSession]);

    // Handle the global unauthorized event separately
    useEffect(() => {
        const handleUnauthorized = () => {
            // Only logout if we are NOT on the home page/login
            if (window.location.pathname.includes('/dashboard')) {
                logout();
            }
        };
        authEvents.addEventListener('unauthorized', handleUnauthorized);
        return () => authEvents.removeEventListener('unauthorized', handleUnauthorized);
    }, [logout]);

    const contextValue = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    }), [user, isLoading, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};