import {Navigate} from "react-router-dom";
import type {JSX} from "react";
import {getAuthToken} from "./Auth.tsx";
import {jwtDecode} from "jwt-decode";
import type {CustomJwtPayload} from "./CustomJwtPayload.tsx";

export const RoleProtectedRoute = ({
                                       children,
                                       role,
                                   }: {
    children: JSX.Element;
    role: string;
}) => {
    const token = getAuthToken();
    if (!token) return <Navigate to="/login" replace />;

    const decoded = jwtDecode<CustomJwtPayload>(token);
    if (decoded.role !== role) return <Navigate to="/unauthorized" replace />;

    try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        if (decoded.role !== role) {
            return <Navigate to="/unauthorized" replace />;
        }
        return children;
    } catch {
        return <Navigate to="/login" replace />;
    }};