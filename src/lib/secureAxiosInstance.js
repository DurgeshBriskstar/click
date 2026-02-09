import axios from "axios";

const secureAxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3007/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
secureAxiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle expired tokens
secureAxiosInstance.interceptors.response.use(
    (response) => {
        // Check if we were redirected to login page
        // This happens when axios follows a 307 redirect from middleware
        const requestUrl = response.config?.url || "";
        const responseUrl = response.request?.responseURL || response.config?.url || "";
        const responseData = response.data;

        // Check if response URL indicates redirect to login
        const isRedirectedToLogin = requestUrl &&
            !requestUrl.includes("/login") &&
            responseUrl.includes("/login");

        // Also check if we got HTML instead of JSON (login page HTML)
        const isHtmlResponse = typeof responseData === 'string' &&
            (responseData.trim().startsWith('<!DOCTYPE') ||
                responseData.trim().startsWith('<html'));

        if ((isRedirectedToLogin || isHtmlResponse) && typeof window !== "undefined") {
            window.location.href = "/login";
            return Promise.reject(new Error("Session expired. Redirecting to login..."));
        }

        return response;
    },
    (error) => {
        // Check if error is due to expired/invalid token (401 or 403)
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            // Check if it's an inactive account error
            const errorMessage = error?.response?.data?.message || "";
            const isInactiveAccount = error?.response?.status === 403 && 
                (errorMessage.includes("deactivated") || errorMessage.includes("inactive"));

            if (typeof window !== "undefined") {
                // Store message in sessionStorage if it's an inactive account
                if (isInactiveAccount && errorMessage) {
                    sessionStorage.setItem("logoutMessage", errorMessage);
                }
                window.location.href = "/login";
            }
        }

        // Check if error response indicates redirect to login
        const requestUrl = error?.config?.url || "";
        const responseUrl = error?.request?.responseURL || error?.response?.request?.responseURL || "";

        if (requestUrl && !requestUrl.includes("/login") && responseUrl.includes("/login")) {
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default secureAxiosInstance;
