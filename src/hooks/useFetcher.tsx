import { axiosInstance } from "@/lib/network";
import { useEffect, useState } from "react";

/**
 * useFetch Hook
 * -------------
 * A reusable React hook for performing GET requests using Axios.
 *
 * Purpose:
 * - Fetch data from a given API endpoint.
 * - Manage loading, success, and error states.
 *
 * Parameters:
 * @param {string} url - The API endpoint to fetch data from.
 *
 * Returns:
 * @returns {{
 *   data: T | null,
 *   loading: boolean,
 *   error: string | null
 * }} 
 * - data: The fetched response data (generic type T)
 * - loading: True while the request is ongoing
 * - error: Error message if the request fails
 *
 * Behavior:
 * - Automatically fires when the component mounts or when `url` changes.
 * - Uses axiosInstance for unified base URL, headers, auth, etc.
 * - Catches and logs errors.
 *
 * Usage Example:
 * const { data, loading, error } = useFetch<User[]>("/users");
 */
export function useFetch<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<T>(url);
        setData(response.data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
