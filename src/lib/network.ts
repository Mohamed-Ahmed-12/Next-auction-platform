import { readBlobError } from "@/helpers/apis";
import { AxiosErrorWithData, ErrorData } from "@/types/error";
import axios, { AxiosHeaders, AxiosError } from "axios";
/**
 * The core Axios instance configured for the Django API.
 */
export const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json"
    }
});

let logoutFn: () => void = () => { };

export const setLogoutFunction = (fn: () => void) => {
    logoutFn = fn;
};

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use((config) => {
    const userString = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const userLang = localStorage.getItem("currentLang")
        ?? document.documentElement.lang
        ?? "en";

    // Ensure headers exist
    if (!config.headers) {
        config.headers = new AxiosHeaders();
    }

    // Set Accept-Language (Matches Django's LocaleMiddleware)
    config.headers.set("Accept-Language", userLang);

    // Set Authorization if user exists
    if (userString) {
        try {
            const { access: token } = JSON.parse(userString);
            if (token) {
                config.headers.set("Authorization", `Bearer ${token}`);
            }
        } catch (e) {
            console.error("Error parsing user data:", e);
        }
    }

    return config;
});

// RESPONSE INTERCEPTOR: Handle Errors and Rejections
axiosInstance.interceptors.response.use(
    // Success Handler (Status 2xx)
    (response) => response,

    // Error Handler (Status 4xx/5xx or network issues)
    async (error: AxiosError) => {

        if (error.response) {
            const status = error.response.status;

            // 🎯 FIX: Explicitly type responseData as 'any' or 'unknown' combined with 'ErrorData'
            // We use `unknown` for safer initial typing, then assert it later.
            let responseData: unknown = error.response.data;
            let detail = "Server error occurred";

            // --- 1. HANDLE BLOB ERROR RESPONSE (e.g., Failed File Download) ---
            if (responseData instanceof Blob) {
                // After reading the blob, responseData is guaranteed to be ErrorData
                responseData = await readBlobError(responseData);
            }

            // 🎯 FIX: Assert or cast responseData to the type that contains 'detail' (ErrorData)
            const errorBody = responseData as ErrorData;

            // The error is fixed here, as 'errorBody' is now guaranteed to have the properties
            detail = errorBody.detail || errorBody.message || errorBody.error || detail;
            console.log("Response Status:", status);
            console.log("Response Detail:", detail);

            // 2. HANDLE SPECIFIC STATUS CODES (401/403)
            if (status === 401) {
                console.log('401 Unauthorized: Initiating logout...');
                logoutFn();
                // Reject with a standard Error object for session expiration
                return Promise.reject(new Error(detail || "Session expired. Please log in again."));

            } else if (status === 403) {
                console.log('403 Forbidden: Access denied.');
                // Reject with a standard Error object for permission issues
                return Promise.reject(new Error("You do not have permission to perform this action."));

            }

            // 3. HANDLE OTHER SERVER ERRORS (400, 500, etc.)
            else {
                console.error(`General Server Error (${status}):`, responseData);

                // Create the custom, detailed error object
                const customError: AxiosErrorWithData = {
                    // To maintain compatibility with Error
                    ...new Error(detail),
                    name: 'API_SERVER_ERROR',
                    message: detail,
                    status: status,
                    responseData: responseData,

                };

                // Reject the promise with the new, detailed object
                return Promise.reject(customError);
            }

        } else if (error.request) {
            // --- NETWORK ERRORS (Request made but no response received) ---
            console.error("Network Error: No response received.", error.request);

            // Create a detailed network error
            const networkError: AxiosErrorWithData = {
                ...new Error("Network error. Please check your connection or server status."),
                name: 'API_NETWORK_ERROR',
                message: "Network error. Please check your connection or server status.",
                isNetworkError: true,
            };

            return Promise.reject(networkError);

        } else {
            // --- UNEXPECTED ERRORS (Request setup failed) ---
            console.error("Unexpected Request Error:", error.message);
            return Promise.reject(new Error("An unexpected error occurred during request setup."));
        }
    }
);