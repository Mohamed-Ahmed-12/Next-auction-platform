import { axiosInstance } from "@/lib/network";
import { Notification } from "@/types/notification";

export async function fetchUserNotifications(): Promise<Notification> {
    const response = await axiosInstance.get<Notification>(`notifications/`);
    return response.data
}