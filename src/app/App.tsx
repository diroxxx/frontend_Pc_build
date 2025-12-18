import Login from "../features/auth/guest/login.tsx";
import MainPage from "../pageComponents/MainPage.tsx";
import {RoleProtectedRoute} from "./router/RoleProtectedRoute.tsx";
import {Routes, Route, Navigate} from "react-router-dom";
import Register from "../features/auth/guest/Register.tsx";
import Layout from "../pageComponents/Layout.tsx";
import OffersUserPage from "../features/offers/guest/pages/OffersUserPage.tsx";
import UserPage from "../features/userProfile/pages/UserPage.tsx";
import Community from "../pages/UserPage/Community/community.tsx";
import ConfiguratorPcPage from "../features/computers/user/pages/ConfiguratorPcPage.tsx";

import AdminLoginPage from "../features/auth/admin/adminLoginPage.tsx";
import AdminControlPanel from "../features/admin/pages/adminControlPanel.tsx";
import {ToastProvider} from "../lib/ToastContainer.tsx";
import {queryClient} from "./store/queryClient.ts";
import {QueryClientProvider} from "@tanstack/react-query";
import GamesPage from "../features/games/pages/GamesPage.tsx";
import {AuthRedirect} from "../components/auth/AuthRedirect.tsx";

function App() {
    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <AuthRedirect redirectTo="/">
                                    <Login />
                                </AuthRedirect>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <AuthRedirect redirectTo="/">
                                    <Register />
                                </AuthRedirect>
                            }
                        />
                        <Route
                            path="/admin/login"
                            element={
                                <AuthRedirect redirectTo="/admin/controlPanel">
                                    <AdminLoginPage />
                                </AuthRedirect>
                            }
                        />

                        <Route element={<Layout />}>
                            <Route path="/" element={<MainPage />} />
                            <Route path="/offers" element={<OffersUserPage />} />
                            <Route path="/builds" element={<ConfiguratorPcPage />} />
                            <Route path="/community" element={<Community />} />
                            <Route path="/check-games" element={<GamesPage />} />

                            <Route
                                path="/userInfo"
                                element={
                                    <RoleProtectedRoute role="USER">
                                        <UserPage />
                                    </RoleProtectedRoute>
                                }
                            />
                        </Route>

                        <Route
                            path="/admin/controlPanel"
                            element={
                                <RoleProtectedRoute role="ADMIN">
                                    <AdminControlPanel />
                                </RoleProtectedRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </ToastProvider>
            </QueryClientProvider>
        </div>
    );
}

export default App;