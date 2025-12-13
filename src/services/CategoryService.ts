import { objectToFormData } from "@/helpers/forms";
import { axiosInstance } from "@/lib/network";
import { SelectOption } from "@/types/formfield";
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
    const formData = objectToFormData(data, false);

    try {
        const response = await axiosInstance.put<Category>(`category/${data.id}/`, formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });
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

export const createCategory = async (data: Category): Promise<Category> => {
    const formData = objectToFormData(data, false);
    console.log(formData);
    try {
        const response = await axiosInstance.post<Category>(`category/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error: any) {
        console.error("Failed to create category:", error);

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

export const fetchCategoriesForSelect = async (): Promise<SelectOption[]> => {
    try {
        const response = await axiosInstance.get<SelectOption[]>("dashboard/category/select-option");
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

export const deleteCategory = async (id: number): Promise<void> => {
    try {
        const response = await axiosInstance.delete(`category/${id}/`);
        return response.data;
    } catch (error: any) {
        console.error("Failed to delete category:", error);

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