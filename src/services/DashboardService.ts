import { axiosInstance } from "@/lib/network";

export const getDashboardData = async () => {
    try {
        const response = await axiosInstance.get("dashboard/");
        return response.data;
    } catch (error: any) {
        console.error("Failed to fetch dashboard data:", error);

        if (error.response) {
            console.error("Server Error:", error.response.data || error.response.statusText);
            throw new Error(
                error.response.data?.detail ||
                error.response.data ||
                `Server error: ${error.response.status}`
            );

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