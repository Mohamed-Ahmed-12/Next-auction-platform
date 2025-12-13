import { format, parseISO, isValid } from "date-fns";


export function formatTimestamp(timestamp: string | null | undefined): string {
    // 1. Guard against null, undefined, or empty string input
    if (!timestamp || typeof timestamp !== 'string' || timestamp.trim() === '') {
        return ""; // <--- RETURN EMPTY STRING INSTEAD OF NULL
    }

    const date = parseISO(timestamp);

    // 2. Check if the date-fns successfully parsed a valid date
    if (!isValid(date)) {
        console.warn(`formatTimestamp: Unparseable timestamp received: "${timestamp}"`);
        return ""; // <--- RETURN EMPTY STRING INSTEAD OF NULL
    }
    
    // 3. Format and return the valid date
    return format(date, "MMM dd, yyyy • hh:mm a");
}