/**
 * Interface for the expected JSON error payload from the Django backend.
 */
export interface ErrorData {
    detail?: string;
    message?: string;
    error?: string;
    errors?: any; // For validation errors (e.g., status 400)
    // [key: string]: any;
}

/**
 * Interface for the custom object we reject the promise with.
 * This bundles all useful context (status, response data) for the caller.
 * Note: We extend the built-in Error for better compatibility.
 */
export interface AxiosErrorWithData extends Error {
    status?: number;
    responseData?: ErrorData | any;
    isNetworkError?: boolean;
}
