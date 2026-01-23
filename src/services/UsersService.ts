import { axiosInstance } from "@/lib/network";
import { UserManagement } from "@/types/users";

export const createUser = async (data: UserManagement): Promise<UserManagement> => {
    const res = await axiosInstance.post<UserManagement>('auth/users/', data);
    return res.data;
}

export const updateUser = async (data: UserManagement): Promise<UserManagement> => {
    const res = await axiosInstance.put<UserManagement>(`auth/users/${data.id}/`, data);
    return res.data;
}