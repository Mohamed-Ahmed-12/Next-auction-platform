"use client"
import { useAuth } from "@/context/authContext";
import { Badge, Button, Dropdown, DropdownItem } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { BiAlarm, BiBell } from "react-icons/bi";
import { toast } from "react-toastify";
type Notification = {
    title:string;
    timestamp:string;
}
const Notifications = () => {
    const [notifications , setNotifications] = useState<Notification[]>([])
    const socketRef = useRef<WebSocket | null>(null);
    const { user } = useAuth();
    const token = user?.access || null;

    // Setup WebSocket
    useEffect(() => {
        if (!token) return;

        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/?token=${token}`)

        socketRef.current = socket;

        socket.onopen = () => console.log("WebSocket Connected");

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                toast.info(data?.message)
            } catch (err) {
                console.error("Invalid WebSocket message:", event.data);
            }
        };

        socket.onerror = () => console.log("WebSocket error occurred");

        return () => socket.close();
    }, [token]);
    return (

        <Dropdown label="" dismissOnClick={false} renderTrigger={() =>
            <div className="relative cursor-pointer">
                <BiBell className="text-2xl bg-indigo-50 rounded-xl" />
                <Badge className="rounded-full absolute -top-1.5 -right-1 px-1 py-0" color="failure">2</Badge>
            </div>}>
            <DropdownItem>Notifications</DropdownItem>
        </Dropdown>
    )
}
export default Notifications;