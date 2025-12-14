import axios, { AxiosHeaders } from "axios";
export const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json"
    }
})

let logoutFn: () => void;

export const setLogoutFunction = (fn: () => void) => {
    logoutFn = fn;
};

axiosInstance.interceptors.request.use((config) => {
    const userString = localStorage.getItem("user");

    if (userString) {
        const { access: token } = JSON.parse(userString);

        if (token) {
            // Ensure headers exist in a TS-safe way
            if (!config.headers) {
                config.headers = new AxiosHeaders();
            }

            // If headers is AxiosHeaders → use set()
            if (config.headers instanceof AxiosHeaders) {
                config.headers.set("Authorization", `Bearer ${token}`);
            } else {
                // If headers is a plain object (rare in Axios 1.x)
                (config.headers as any)["Authorization"] = `Bearer ${token}`;
            }
        }
    }

    return config;
});

interface ErrorData {
    detail: string;
    [key: string]: any; // Allow other properties like 'errors', 'code', etc.
}
/**
 * Asynchronously reads the content of an error Blob (which is expected to contain a JSON string), 
 * parses it, and returns the resulting object, or a default error object on failure.
 * * @param errorBlob The Blob object containing the error response body.
 * @returns A Promise that resolves to an ErrorData object.
 */
async function readBlobError(errorBlob: Blob): Promise<ErrorData> {
    return new Promise((resolve) => {
        const reader = new FileReader();

        // 1. Error Handler: Called if the file reading itself fails
        reader.onerror = () => {
            // Resolve with a guaranteed ErrorData shape
            resolve({ detail: "Failed to read error details from blob." });
        };

        // 2. Load Handler: Called when the Blob content is successfully read
        reader.onload = () => {
            try {
                // FileReader.result can be string or ArrayBuffer depending on read method.
                // Since we use readAsText, we expect a string.
                const resultText = reader.result as string;

                if (resultText) {
                    // Attempt to parse the text content
                    const errorData: ErrorData = JSON.parse(resultText);
                    resolve(errorData);
                } else {
                    // Handle case where result is empty string but reading was successful
                    resolve({ detail: "Server returned an empty error response." });
                }
            } catch (e) {
                // If JSON parsing fails, return a generic error message
                resolve({ detail: "Server returned a non-JSON or invalid error response." });
            }
        };

        // Start reading the blob content as text
        reader.readAsText(errorBlob);
    });
}

axiosInstance.interceptors.response.use(
    // Success Handler (Status 2xx)
    (response) => response,

    // Error Handler (Status 4xx/5xx or network issues)
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            const status = error.response.status;

            let responseData = error.response.data;
            let detail = "Server error occurred";

            // --- 1. HANDLE BLOB ERROR RESPONSE (e.g., Failed File Download) ---
            if (responseData instanceof Blob) {
                // If the response is a Blob, we must await reading its JSON content
                responseData = await readBlobError(responseData);
            }

            // Now that responseData is a parsed object (or an error object from readBlobError)
            detail = responseData?.detail || responseData?.message || responseData?.error || detail;

            console.log("Response Status:", status);
            console.log("Response Detail:", detail);

            // --- 2. HANDLE SPECIFIC STATUS CODES (401/403) ---
            if (status === 401) {
                // **ACTION FOR AUTHENTICATION FAILURE**
                console.log('401 Unauthorized: Initiating logout...');
                logoutFn();
                return Promise.reject(new Error(detail || "Session expired. Please log in again."));

            } else if (status === 403) {
                // **ACTION FOR AUTHORIZATION FAILURE**
                console.log('403 Forbidden: Access denied.');
                return Promise.reject(new Error("You do not have permission to perform this action."));

            }

            // --- 3. HANDLE OTHER SERVER ERRORS (4xx, 5xx) ---
            else {
                // This covers 400 Bad Request, 500 Internal Server Error, etc.
                console.error(`General Server Error (${status}):`, responseData);
                return Promise.reject(new Error(detail));
            }

        } else if (error.request) {
            // --- 4. HANDLE NETWORK ERRORS (Request made but no response received) ---
            console.error("Network Error: No response received.", error.request);
            return Promise.reject(new Error("Network error. Please check your connection or server status."));

        } else {
            // --- 5. HANDLE UNEXPECTED ERRORS (Request setup failed) ---
            console.error("Unexpected Request Error:", error.message);
            return Promise.reject(new Error("An unexpected error occurred during request setup."));
        }
    }
);