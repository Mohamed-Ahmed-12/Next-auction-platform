import { parseISO, isValid, intervalToDuration } from "date-fns";


/**
 * Formats a timestamp based on the provided locale.
 * @param timestamp - The ISO string to format
 * @param locale - The current active locale (e.g., 'en', 'ar')
 */
export function formatTimestamp(
    timestamp: string | null | undefined, 
    locale: string = 'en'
): string {
    // 1. Guard against null, undefined, or empty string input
    if (!timestamp || typeof timestamp !== 'string' || timestamp.trim() === '') {
        return "";
    }

    const date = parseISO(timestamp);

    // 2. Check if the date-fns successfully parsed a valid date
    if (!isValid(date)) {
        console.warn(`formatTimestamp: Unparseable timestamp received: "${timestamp}"`);
        return "";
    }

    // 3. Use Native Intl API for locale-based formatting
    // This will automatically handle "AM/PM" vs "ص/م" and month names in Arabic/English
    try {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    } catch (e) {
        // Fallback if Intl fails
        console.error(`formatTimestamp: Intl formatting failed for locale "${locale}" with error:`, e);
        return timestamp; 
    }
}

export const durationFromStrings = (djangoStartDateString: string, djangoEndDateString: string) => {
    return intervalToDuration({
        start: parseISO(djangoStartDateString),
        end: parseISO(djangoEndDateString)
    });
}