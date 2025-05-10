/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Creates an authenticated API client for making requests to protected endpoints
 */
export const createApiClient = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  };

  /**
   * Makes an authenticated request to the API
   */
  const fetchApi = async <T>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<T> => {
    const token = getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle 401 unauthorized errors
        if (response.status === 401) {
          if (typeof window !== "undefined") {
            if (token) {
              localStorage.removeItem("auth_token");
              throw new Error("Session expired. Please login again.");
            } else {
              throw new Error("Unauthorized. Please login.");
            }
            // Optionally redirect to login
            // window.location.href = '/login';
          } else {
            throw new Error("Unauthorized. Please login.");
          }
        }

        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      if (response.status === 204) return {} as T; // No Content

      const text = await response.text();
      try {
        return text ? JSON.parse(text) : ({} as T);
      } catch (e) {
        throw new Error("Invalid JSON response");
      }
    } catch (error) {
      // console.error("API request failed:", error);
      // toast({
      //   title: "Request Failed",
      //   description:
      //     error instanceof Error ? error.message : "Something went wrong",
      //   variant: "destructive",
      // });
      throw error;
    }
  };

  return {
    get: <T>(
      endpoint: string,
      options: Omit<ApiOptions, "body" | "method"> = {}
    ) => fetchApi<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(
      endpoint: string,
      data: any,
      options: Omit<ApiOptions, "body" | "method"> = {}
    ) => fetchApi<T>(endpoint, { ...options, body: data, method: "POST" }),

    put: <T>(
      endpoint: string,
      data: any,
      options: Omit<ApiOptions, "body" | "method"> = {}
    ) => fetchApi<T>(endpoint, { ...options, body: data, method: "PUT" }),

    patch: <T>(
      endpoint: string,
      data: any,
      options: Omit<ApiOptions, "body" | "method"> = {}
    ) => fetchApi<T>(endpoint, { ...options, body: data, method: "PATCH" }),

    delete: <T>(
      endpoint: string,
      options: Omit<ApiOptions, "body" | "method"> = {}
    ) => fetchApi<T>(endpoint, { ...options, method: "DELETE" }),

    isAuthenticated: () => !!getAuthToken(),
  };
};

// Create default instance
export const apiClient = createApiClient();
