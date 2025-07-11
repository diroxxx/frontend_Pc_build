import Login from "./pages/auth/login.tsx";
import {useEffect, useState} from "react";
import {getAuthToken} from "./components/Auth.tsx";
import {jwtDecode} from "jwt-decode";
import type {CustomJwtPayload} from "./components/CustomJwtPayload.tsx";
import MainPage from "./pages/mainPage/MainPage.tsx";
import {RoleProtectedRoute} from "./components/RoleProtectedRoute.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Unauthorized from "./components/Unauthorized.tsx";
import Register from "./pages/auth/Register.tsx";
function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState("user");
    useEffect(() => {
        let token = getAuthToken();
        if (token !== null) {
            setIsAuthenticated(true);
            const decode = jwtDecode<CustomJwtPayload>(token);
            setRole(decode.role as string);
        } else {
            setIsAuthenticated(false);
        }
    }, []);
    return(
    <div>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/mainPage"
                    element={
                        <RoleProtectedRoute role="USER">
                            <MainPage />
                        </RoleProtectedRoute>
                    }
                />
                <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
        </Router>
    </div>
    )
}

export default App;