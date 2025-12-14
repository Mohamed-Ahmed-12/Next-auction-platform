import { axiosInstance } from "@/lib/network";
import { useCallback, useEffect, useState } from "react";

/**
 * useFetch Hook
 * -----------------
 * A reusable React hook for performing data retrieval (`GET`) requests using Axios.
 * It automatically fetches data when the component mounts or the URL changes, 
 * manages the loading and error states, and provides a manual trigger for re-fetching.
 *
 * @template T The expected type of the response data.
 * @param {string} url - The API endpoint to fetch data from (relative to axiosInstance).
 * @returns {{
 * data: T | null,
 * loading: boolean,
 * error: string | null,
 * refetch: () => Promise<void>
 * }} 
 * - data: The fetched response data (of type T).
 * - loading: True while the request is ongoing.
 * - error: Error message string if the request fails, otherwise null.
 * - refetch: A function to manually trigger the data fetch again.
 */
export function useFetch<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Core function to execute the API call. Wrapped in useCallback to ensure 
   * function stability, only changing when the 'url' dependency changes.
   */
  const fetchData = useCallback(async () => {
    // Prevent fetching if URL is empty (e.g., initial state)
    if (!url) return; 

    setLoading(true);
    setError(null); // Clear previous errors
    
    try {
      // Execute the GET request using the pre-configured axios instance
      const response = await axiosInstance.get<T>(url);
      setData(response.data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      // Determine the error message
      setError(err.message || "An error occurred while fetching data."); 
    } finally {
      setLoading(false);
    }
  }, [url]); // Recreates function only when the URL changes

  /**
   * useEffect hook to trigger the initial data fetch 
   * when the component mounts or when 'fetchData' (due to URL change) updates.
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependency on fetchData (stable function)

  /**
   * Returns the current state variables and the stable fetchData function exposed as 'refetch'.
   */
  return { data, loading, error, refetch: fetchData };
}