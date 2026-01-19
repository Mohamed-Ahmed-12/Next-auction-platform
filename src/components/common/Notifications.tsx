"use client"
import { useAuth } from "@/context/authContext";
import { useFetch } from "@/hooks/useFetcher";
import { NotificationPagination } from "@/types/notification";
import { Badge, Dropdown, DropdownHeader, DropdownItem } from "flowbite-react";
import { useEffect, useRef } from "react";
import { BiBell } from "react-icons/bi";
import { HiViewGrid } from "react-icons/hi";
import { toast } from "react-toastify";

const NotificationsComponent = () => {
    const { data: notificationsData, error, loading } = useFetch<NotificationPagination>('notifications/');

    // Use state to track if the dropdown is open/closed
    // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const socketRef = useRef<WebSocket | null>(null);
    const { user } = useAuth();
    const token = user?.access || null;

    // Determine unread count from the fetched data
    const unreadCount = notificationsData?.results.filter(n => !n.is_read).length || 0;

    // --- 1. WebSocket Setup ---
    useEffect(() => {
        if (!token) return;

        const socket = new WebSocket(`ws://192.168.1.8:8000/ws/notifications/?token=${token}`);
        socketRef.current = socket;

        socket.onopen = () => console.log("WebSocket Connected");

        socket.onmessage = (event) => {
            try {
                console.log(event)
                const data = JSON.parse(event.data);
                // Handle real-time updates (e.g., adding new notification, toast)
                if (data?.message) {
                    toast.info(data.message);
                }
                // You would typically need logic here to update the notificationsData state
            } catch (err) {
                console.error("Invalid WebSocket message:", event.data || err);
            }
        };

        socket.onerror = (e) => console.log("WebSocket error occurred:", e);

        // Cleanup function
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [token]);

    // --- 3. Render Component ---
    return (
        <Dropdown
            size="md"
            className="w-100"
            label=""
            dismissOnClick={false}

            renderTrigger={() => (
                <div className="relative cursor-pointer">
                    <BiBell size={25} className="p-1 bg-indigo-50 rounded-xl" />
                    {/* Display actual unread count */}
                    {unreadCount > 0 && (
                        <Badge
                            className="rounded-full absolute -top-1.5 -right-1 px-1 py-0"
                            color="failure"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </div>
            )}
        >
            <DropdownHeader>
                <span className="block text-sm font-semibold font-sans">
                    Recent Notifications
                </span>
            </DropdownHeader>
            {
                loading ? <DropdownItem>Loading ...</DropdownItem> : (
                    error ? <DropdownItem>Error occurred while fetching notifications</DropdownItem>
                        : (
                            notificationsData && notificationsData.results.length > 0 ? (
                                notificationsData.results.map((noti) => (
                                    <DropdownItem
                                        key={noti.id}
                                        icon={HiViewGrid}
                                        className={!noti.is_read ? 'font-bold text-black' : 'text-gray-500'}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: noti.content || 'System Notification' }} />
                                    </DropdownItem>
                                ))
                            ) : (
                                <DropdownItem disabled>
                                    No notifications to display.
                                </DropdownItem>
                            )
                        )
                )
            }
        </Dropdown>
    );
}

export default NotificationsComponent;