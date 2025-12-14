import { axiosInstance } from "@/lib/network";
import { DashboardData } from "@/types/dashboard";

export const getDashboardData = async (): Promise<DashboardData> => {
    const response = await axiosInstance.get("dashboard/");
    return response.data;
}

export const getAuctionsByDate = async (date:string): Promise<any> => {
    const response = await axiosInstance.get(`dashboard/auctions-bydate/?date=${date}`);
    return response.data;
}