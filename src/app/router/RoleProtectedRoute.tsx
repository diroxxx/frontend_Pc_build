import {Navigate} from "react-router-dom";
import type {JSX} from "react";
import {getAuthToken} from "../../features/auth/hooks/Auth.tsx";
import {jwtDecode} from "jwt-decode";
import type {CustomJwtPayload} from "../../features/auth/atoms/userAtom.tsx";

export const RoleProtectedRoute = ({
                                       children,
                                       role,
                                   }: {
    children: JSX.Element;
    role: string;
}) => {
    const token = getAuthToken();
    if (!token) {
        if(location.pathname.startsWith("/admin")){
            return <Navigate to="/admin/login" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        if (decoded.role !== role) {
            return <Navigate to="/unauthorized" replace />;
        }
        return children;
    } catch {
        return <Navigate to="/login" replace />;
    }
};