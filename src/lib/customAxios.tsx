import axios from "axios";
import { getAuthToken, setAuthToken } from "./Auth.tsx";

import { showToast } from './ToastContainer.tsx';

const customAxios = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

customAxios.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

customAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // 401 - Token wygasł, spróbuj odświeżyć
        if (error.response?.status === 401 && !originalRequest._retry) {
                // if ((error.response?.status === 401 || error.response?.status === 500) && !originalRequest._retry) {

            originalRequest._retry = true;
            try {
                // const refreshToken = getRefreshToken();
                const response = await axios.post("http://localhost:8080/auth/refresh", {
                    // refreshToken: refreshToken,
                }
            , {withCredentials: true}
        );
                const newAccessToken = response.data.accessToken;
                setAuthToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return customAxios(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                setAuthToken(null);
                // showToast.error("Sesja wygasła. Zaloguj się ponownie.");
                // window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        
        // 403 - Brak uprawnień (nie próbuj odświeżać tokenu)
        if (error.response?.status === 403) {
            console.error("Access forbidden - insufficient permissions");
            showToast.error("Brak uprawnień do wykonania tej operacji.");
            
            const token = getAuthToken();
            if (!token) {
                setAuthToken(null);
                window.location.href = "/login";
            }
            
            return Promise.reject(error);
        }
        
        if (error.response?.status === 500) {
            showToast.error(error.response.data.message || "Error occurred on the server. Please try again later.");
            return Promise.reject(error);
        }

        if (error.response?.status === 400) {
            const message = error.response.data.message || "Nieprawidłowe dane";
            showToast.error(message);
            console.error("Bad Request:", message);
            return Promise.reject(error);
        }
        
        // Inne błędy
        return Promise.reject(error);
    }
);
export default customAxios;