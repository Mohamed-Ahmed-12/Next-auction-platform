export type LoginCredentials = {
    username: string;
    password: string;
}


export interface AuthProviderProps {
    children: ReactNode;
}

export interface Tokens {
    access: string;
    refresh: string;
}


