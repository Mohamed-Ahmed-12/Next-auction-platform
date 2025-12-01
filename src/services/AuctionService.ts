import { arrayToCommaString } from "@/lib/helpers";
import { axiosInstance } from "../lib/network"
import { Auction} from "@/types/main"
import { AuctionFilterFields } from "@/types/filters";


export const fetchAuctionByStatus = async (status: string): Promise<Auction[]> => {
    try {
        const response = await axiosInstance.get<Auction[]>(`auction/?status=${status}`)
        return response.data
    } catch (error: any) {
        console.error("Failed to fetch auction:", error)
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error("Server Error:", error.response.data);
            throw new Error(error.response.data?.error || "Server error occurred");
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
            throw new Error(error.response.data?.error || "Server error occurred");
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
            throw new Error(error.response.data?.error || "Server error occurred");
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