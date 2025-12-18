import axios, {type AxiosError, type InternalAxiosRequestConfig} from "axios";
import { getAuthToken, setAuthToken } from "../features/auth/hooks/Auth.tsx";

import { showToast } from './ToastContainer.tsx';
import {userAtom} from "../features/auth/atoms/userAtom.tsx";
import {store} from "./store.ts";

const customAxios = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
});
type AxiosRequestWithRetry = InternalAxiosRequestConfig & { _retry?: boolean };

interface ApiErrorResponse {
    message?: string;
    error?: string;
    status?: number;
}

customAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.data instanceof FormData) {
        if (config.headers) {
            delete (config.headers as Record<string, any>)["Content-Type"];
            if ((config.headers as any).common) delete (config.headers as any).common["Content-Type"];
            if ((config.headers as any).post) delete (config.headers as any).post["Content-Type"];
        }
    }
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



customAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];


const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
};

customAxios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestWithRetry;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(resolve => {
                    subscribeTokenRefresh((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(customAxios(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post(
                    "http://localhost:8080/auth/refresh",
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = (response.data as any).accessToken;
                setAuthToken(newAccessToken);
                onRefreshed(newAccessToken);
                isRefreshing = false;

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return customAxios(originalRequest);

            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                isRefreshing = false;
                setAuthToken(null);
                store.set(userAtom, null);
                showToast.error("Sesja wygasła. Zaloguj się ponownie.");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        if (error.response?.status === 403) {
            console.warn("Brak uprawnień do wykonania operacji (403)");
            showToast.error("Brak uprawnień do wykonania tej operacji.");
            return Promise.reject(error);
        }

        if (error.response?.status === 400) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const msg = axiosError.response?.data?.message || "Nieprawidłowe dane";
            showToast.error(msg);
            console.error("400 Bad Request:", msg);
            return Promise.reject(error);
        }

        // === 500 SERVER ERROR ===
        if (error.response?.status === 500) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const msg = axiosError.response?.data?.message || "Wystąpił błąd po stronie serwera.";
            showToast.error(msg);
            console.error("500 Server Error:", msg);
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default customAxios;
