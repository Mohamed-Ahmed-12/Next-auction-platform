import { axiosInstance } from "@/lib/network";
import { Notification } from "@/types/notification";

export async function fetchUserNotifications():Promise<Notification> {
       try {
           const response = await axiosInstance.get<Notification>(`notifications/`);
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