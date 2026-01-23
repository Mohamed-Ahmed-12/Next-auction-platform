import { readBlobError } from "@/helpers/apis";
import { AxiosErrorWithData, ErrorData } from "@/types/error";
import axios, { AxiosHeaders, AxiosError } from "axios";
/**
 * The core Axios instance configured for the Django API.
 */
export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/",
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    headers: {
        "Content-Type": "application/json"
    }
});
export const authEvents = new EventTarget();

// let logoutFn: () => void = () => { };

// export const setLogoutFunction = (fn: () => void) => {
//     logoutFn = fn;
// };

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use((config) => {
    // 1. Language logic is fine to keep in localStorage
    const userLang = typeof window !== "undefined"
        ? (localStorage.getItem("currentLang") ?? document.documentElement.lang ?? "en")
        : "en";

    if (!config.headers) {
        config.headers = new AxiosHeaders();
    }

    config.headers.set("Accept-Language", userLang);

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
            const originalRequest = error.config as any;

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
            // 1. Skip if the request explicitly asks to skip interceptors
            if (originalRequest?._skipInterceptor) return Promise.reject(error);

            // 2. Define routes to ignore (preventing infinite loops)
            const authUrls = ['auth/logout/', 'auth/login/', 'auth/verify/'];
            const isAuthRequest = authUrls.some(url => originalRequest?.url?.includes(url));

            if (status === 401 && !isAuthRequest) {
                // Instead of calling a function directly, we dispatch a global event
                authEvents.dispatchEvent(new Event('unauthorized'));
                // 2. HANDLE SPECIFIC STATUS CODES (401/403)
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