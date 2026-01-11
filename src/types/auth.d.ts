export type LoginCredentials = {
    username: string;
    password: string;
}

export interface AuthProviderProps {
    children: ReactNode;
}

export interface User {
    access: string;
    refresh: string;
    username:string;
    email?:string;
}
export interface User {
    id:number
    username: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    is_active: string;
    is_staff: string;
    is_superuser: string;
    last_login?: string;
    date_joined?: string;
}
