import { axiosInstance } from "@/lib/network";
import { Item } from "@/types/main";

export const createItem = async (data: Item): Promise<Item> => {
    try {
        const response = await axiosInstance.post<Item>(`items/`, data)
        return response.data
    } catch (error: any) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error("Server Error:", error.response.data);
            throw new Error(error.response.data?.detail || "Server error occurred");
        } else if (error.request) {
            // Request was made but no response
            console.error("Network Error:", error.request);
            throw new Error("Network error. Please check your connection.");
        } else {
            // Something else happened
            console.error("Unexpected Error:", error.message);
            throw new Error("Unexpected error occurred.");
        }
    }
}

export const updateItem = async (data: Item): Promise<Item> => {
    try {
        const response = await axiosInstance.put<Item>(`item/${data.slug}/get-update/`, data, );
        return response.data;
    } catch (error: any) {
        console.error("Failed to update item:", error);

        if (error.response) {
            // Server responded with a status other than 2xx
            console.error("Server Error:", error.response.data);
            throw new Error(error.response.data?.detail || "Server error occurred");
        } else if (error.request) {
            // Request was made but no response
            console.error("Network Error:", error.request);
            throw new Error("Network error. Please check your connection.");
        } else {
            // Something else happened
            console.error("Unexpected Error:", error.message);
            throw new Error("Unexpected error occurred.");
        }
    }
}