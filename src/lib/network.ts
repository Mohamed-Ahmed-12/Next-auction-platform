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