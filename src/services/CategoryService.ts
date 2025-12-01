import { axiosInstance } from "@/lib/network";
import { Category } from "@/types/main"
export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await axiosInstance.get<Category[]>("category/");
        return response.data;
    } catch (error: any) {
        console.error("Failed to fetch categories:", error);

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
};

export const updateCategory = async (data: Category): Promise<Category> => {
    try {
        const response = await axiosInstance.put<Category>(`category/${data.id}/`, data);
        return response.data;
    } catch (error: any) {
        console.error("Failed to update category:", error);

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