import { axiosInstance } from "@/lib/network";
import { Item } from "@/types/main";

export const createItem = async (data: Item): Promise<Item> => {
    const response = await axiosInstance.post<Item>(`items/`, data)
    return response.data
}

export const updateItem = async (data: Item): Promise<Item> => {
    const response = await axiosInstance.put<Item>(`item/${data.slug}/get-update/`, data,);
    return response.data;
}