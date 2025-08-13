import Login from "./pages/auth/login.tsx";
import {useEffect, useState} from "react";
import {getAuthToken} from "./components/Auth.tsx";
import {jwtDecode} from "jwt-decode";
import type {CustomJwtPayload} from "./components/CustomJwtPayload.tsx";
import MainPage from "./pages/mainPage/MainPage.tsx";
import {RoleProtectedRoute} from "./components/RoleProtectedRoute.tsx";
import {Routes, Route } from "react-router-dom";
import Unauthorized from "./pages/Unauthorized.tsx";
import Register from "./pages/auth/Register.tsx";
import Layout from "./pageComponents/Layout.tsx";
import Components from "./pages/componentsPage/Components.tsx";
import UserPage from "./UserInfoPage/UserPage";
import Builds from "./pages/builds/builds.tsx";
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState("user");
    useEffect(() => {
        const token = getAuthToken();
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
        {/*<Router>*/}
            <Routes>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route element={<Layout/>}>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/components" element={<Components />} />
                    <Route path="/builds" element={<Builds />} />
                    
                    <Route
                        path="/userInfo"
                        element={
                            <RoleProtectedRoute role="USER">
                                <UserPage />
                            </RoleProtectedRoute>
                        }
                    />
                </Route>

            </Routes>
        {/*</Router>*/}
    </div>
    )
}
export default App;