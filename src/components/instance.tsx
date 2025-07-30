import axios from "axios";
import { getAuthToken, getRefreshToken, setRefreshToken, setAuthToken } from "./Auth";

const instance = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // if ((error.response?.status === 401 || error.response?.status === 500) && !originalRequest._retry) {
        if ((error.response?.status === 401 ) && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = getRefreshToken();
                const response = await axios.post("http://localhost:8080/auth/refresh", {
                    refreshToken: refreshToken,
                });
                const newAccessToken = response.data.accessToken;
                setAuthToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return instance(originalRequest); // Ponów oryginalne żądanie z nowym tokenem
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                setAuthToken(null);
                setRefreshToken(null);
                window.location.href = "/login"; // Przekieruj do logowania
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
export default instance;