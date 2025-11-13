import Login from "../features/user/pages/UserAuth/login.tsx";
import MainPage from "../pages/MainPage.tsx";
import {RoleProtectedRoute} from "./router/RoleProtectedRoute.tsx";
import {Routes, Route } from "react-router-dom";
import Unauthorized from "../pages/Unauthorized.tsx";
import Register from "../features/user/pages/UserAuth/Register.tsx";
import Layout from "../pageComponents/Layout.tsx";
import OffersUserPage from "../features/user/pages/OffersUserPage.tsx";
import UserPage from "../features/user/pages/UserPage.tsx";
import Community from "../pages/UserPage/Community/community.tsx";
import Builds from "../features/user/components/builds/Builds.tsx";

import AdminLoginPage from "../features/admin/pages/adminLoginPage.tsx";
import AdminControlPanel from "../features/admin/pages/adminControlPanel.tsx";
import {ToastProvider} from "../lib/ToastContainer.tsx";
import {queryClient} from "./store/queryClient.ts";
import {QueryClientProvider} from "@tanstack/react-query";

function App() {
    return(
    <div>
        <QueryClientProvider client={queryClient}>
        <ToastProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route element={<Layout/>}>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/offers" element={<OffersUserPage />} />
                    <Route path="/builds" element={<Builds />} />
                    <Route path="/community" element={<Community/>} />

                    <Route
                        path="/userInfo"
                        element={
                            <RoleProtectedRoute role="USER">
                                <UserPage />
                            </RoleProtectedRoute>
                        }
                    />
                </Route>

                <Route path="/admin/login" element={<AdminLoginPage />} />

                <Route
                    path="/admin/controlPanel"
                    element={
                        <RoleProtectedRoute role="ADMIN">
                            <AdminControlPanel />
                        </RoleProtectedRoute>
                    }
                />

            </Routes>
        </ToastProvider>
            </QueryClientProvider>
    </div>
    )
}
export default App;