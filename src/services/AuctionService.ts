import { arrayToCommaString } from "@/helpers/filters";
import { axiosInstance } from "../lib/network"
import { Auction } from "@/types/main"
import { AuctionFilterFields } from "@/types/filters";
import { objectToFormData } from "@/helpers/forms";
import { SelectOption } from "@/types/formfield";


export const fetchAuctionByStatus = async (status: string): Promise<Auction[]> => {
    try {
        const response = await axiosInstance.get<Auction[]>(`auction/?status=${status}`)
        return response.data
    } catch (error: any) {
        console.error("Failed to fetch auction:", error)
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

export const fetchAuctions = async (): Promise<Auction[]> => {
    try {
        const response = await axiosInstance.get<Auction[]>(`auction/`)
        return response.data
    } catch (error: any) {
        console.error("Failed to fetch auction:", error)
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

export const filterAuction = async (fields: AuctionFilterFields): Promise<Auction[]> => {
    try {
        const cate = arrayToCommaString(fields.category);
        const status = arrayToCommaString(fields.status);
        const response = await axiosInstance.get<Auction[]>('auction/', {
            params: {
                category: cate,
                status: status,
            }
        })
        return response.data
    } catch (error: any) {
        console.error("Failed to fetch auction:", error)
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

export const createAuction = async (data: Auction): Promise<Auction> => {
    console.log(data)
    try {
        const response = await axiosInstance.post<Auction>(`auction/`, data)
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

export const updateAuction = async (data: Auction): Promise<Auction> => {
    const formData = objectToFormData(data, false)
    console.log(data, formData)

    try {
        const response = await axiosInstance.put<Auction>(`auction/${data.slug}/get-update/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error: any) {
        console.error("Failed to update auction:", error);

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

export const fetchAuctionsForSelect = async (): Promise<SelectOption[]> => {
    try {
        const response = await axiosInstance.get<SelectOption[]>("dashboard/auction/select-option");
        return response.data;
    } catch (error: any) {
        console.error("Failed to fetch auctions:", error);

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