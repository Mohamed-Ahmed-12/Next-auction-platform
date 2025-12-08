import axios, { AxiosHeaders } from "axios";
export const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json"
    }
})

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

axiosInstance.interceptors.response.use(
    // Success Handler
    (response) => {
        return response;
    },
    // Error Handler
    (error) => {
        const status = error.response ? error.response.status : null;

        if (status === 401) {
            // **ACTION FOR AUTHENTICATION FAILURE (Expired/Invalid Token)**
            console.log('401 Unauthorized received. Initiating logout...');
            
            // 1. Clear invalid tokens
            localStorage.removeItem('user');
            
        } else if (status === 403) {
            // **ACTION FOR AUTHORIZATION FAILURE (Permission Denied)**
            console.log('403 Forbidden received. User is denied access to this resource.');

        }

        // Return a rejected Promise for all errors (401, 403, 500, etc.)
        // so the calling function/component can still handle the failure.
        return Promise.reject(error);
    }
);