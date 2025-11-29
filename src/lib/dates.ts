import { format, parseISO } from "date-fns";


export function formatTimestamp(timestamp: string) {
    const date = parseISO(timestamp);
    const formatted = format(date, "MMM dd, yyyy • hh:mm a");
    return formatted
}
