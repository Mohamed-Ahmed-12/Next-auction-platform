import { axiosInstance } from "./axiosInstance"
import { Auction, Category } from "@/types/main"

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await axiosInstance.get<Category[]>("category/")
        return response.data
    } catch (err) {
        console.error("Failed to fetch categories:", err)
        return []
    }
}
export const fetchAuctionByStatus = async (status: string): Promise<Auction[]> => {
    try {
        const response = await axiosInstance.get<Auction[]>(`auction/?status=${status}`)
        return response.data
    } catch (err) {
        console.error("Failed to fetch categories:", err)
        return []
    }
}