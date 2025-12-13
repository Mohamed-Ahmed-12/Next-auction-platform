import { axiosInstance } from "@/lib/network";
import { User } from "@/types/auth";

export const createUser = async (data: User): Promise<User> => {
    const res = await axiosInstance.post<User>('auth/users/', data);
    return res.data;
}

export const updateUser = async (data: User): Promise<User> => {
    const res = await axiosInstance.put<User>(`auth/users/${data.id}/`, data);
    return res.data;
}