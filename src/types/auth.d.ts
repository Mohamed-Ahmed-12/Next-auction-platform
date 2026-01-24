export type LoginCredentials = {
    username: string;
    password: string;
    rememberMe:boolean;
}

export interface AuthProviderProps {
    children: ReactNode;
}

export interface User {
    refresh: string;
    username:string;
    email?:string;
    roles:any[];
    permissions?:any[];
}
