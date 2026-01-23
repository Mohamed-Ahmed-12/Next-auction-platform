export interface Permission {
    id: string;
    name: string;
    codename: string;
}

export interface Role {
    id: string;
    name: string;
    permissions: Permissions[];
}