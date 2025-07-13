export const getAuthToken = () => {
    return localStorage.getItem("auth_token");
};

export const setAuthToken = (token: string | null) => {
    if (token) {
        localStorage.setItem("auth_token", token);
    } else {
        localStorage.removeItem("auth_token");
    }
}
    export const getRefreshToken = () => {
        return localStorage.getItem("refresh_token");
    };

    export const setRefreshToken = (token: string | null) => {
        if (token) {
            localStorage.setItem("refresh_token", token);
        } else {
            localStorage.removeItem("refresh_token");
        }
    }
