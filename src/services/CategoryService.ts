import { objectToFormData } from "@/helpers/forms";
import { axiosInstance } from "@/lib/network";
import { SelectOption } from "@/types/formfield";
import { Category } from "@/types/main"
export const fetchCategories = async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>("category/");
    return response.data;
};

export const updateCategory = async (data: Category): Promise<Category> => {
    const formData = objectToFormData(data, false);
    const response = await axiosInstance.put<Category>(`category/${data.id}/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

export const createCategory = async (data: Category): Promise<Category> => {
    const formData = objectToFormData(data, false);
    const response = await axiosInstance.post<Category>(`category/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

export const fetchCategoriesForSelect = async (): Promise<SelectOption[]> => {
    const response = await axiosInstance.get<SelectOption[]>("dashboard/category/select-option");
    return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await axiosInstance.delete(`category/${id}/`);
}