import axios from "axios";

// Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3007/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to handle expired tokens
axiosInstance.interceptors.response.use(
    (response) => {
        // Check if we were redirected to login page
        // This happens when axios follows a 307 redirect from middleware
        const requestUrl = response.config?.url || "";
        const responseUrl = response.request?.responseURL || response.config?.url || "";
        const responseData = response.data;

        // Only redirect for authenticated endpoints, not for login/logout
        const isAuthEndpoint = requestUrl.includes("/auth/login") ||
            requestUrl.includes("/auth/logout");

        // Check if response URL indicates redirect to login
        const isRedirectedToLogin = requestUrl &&
            !requestUrl.includes("/login") &&
            responseUrl.includes("/login");

        // Also check if we got HTML instead of JSON (login page HTML)
        const isHtmlResponse = typeof responseData === 'string' &&
            (responseData.trim().startsWith('<!DOCTYPE') ||
                responseData.trim().startsWith('<html'));

        if ((isRedirectedToLogin || isHtmlResponse) && !isAuthEndpoint && typeof window !== "undefined") {
            window.location.href = "/login";
            return Promise.reject(new Error("Session expired. Redirecting to login..."));
        }

        return response;
    },
    (error) => {
        // Check if error is due to expired/invalid token (401 or 403)
        // Only redirect for authenticated endpoints, not for login/logout
        const isAuthEndpoint = error?.config?.url?.includes("/auth/login") ||
            error?.config?.url?.includes("/auth/logout");

        if ((error?.response?.status === 401 || error?.response?.status === 403) && !isAuthEndpoint) {
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        // Check if error response indicates redirect to login
        const requestUrl = error?.config?.url || "";
        const responseUrl = error?.request?.responseURL || error?.response?.request?.responseURL || "";

        if (requestUrl && !requestUrl.includes("/login") && responseUrl.includes("/login") && !isAuthEndpoint) {
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;