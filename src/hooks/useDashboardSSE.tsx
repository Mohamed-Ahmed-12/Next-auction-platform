import { DashboardData } from "@/types/dashboard";
import { useEffect, useState } from "react";

export function useDashboardSSE(initialData: any) {
    const [data, setData] = useState(initialData);
    useEffect(() => {
        const evtSource = new EventSource("http://127.0.0.1:8000/api/dashboard/events/");
        evtSource.onopen = () => console.log("SSE connected");
        evtSource.onerror = (err) => {
            console.error("SSE error: ", err);
            // evtSource.close();
        };
        evtSource.onmessage = (event) => {
            console.log("SSE message", event.data)
        };
        evtSource.addEventListener("update", (e) => {
            const parsed = JSON.parse(e.data);
            setData((prev: any) => ({
                ...prev,
                ...parsed
            }));
        });


        return () => {
            console.log("SSE connection closed");
            evtSource.close();
        };
    }, []);
    return data;
}
