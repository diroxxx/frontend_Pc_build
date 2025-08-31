import Login from "./pages/UserAuth/login.tsx";
import MainPage from "./pages/mainPage/MainPage.tsx";
import {RoleProtectedRoute} from "./components/RoleProtectedRoute.tsx";
import {Routes, Route } from "react-router-dom";
import Unauthorized from "./pages/Unauthorized.tsx";
import Register from "./pages/UserAuth/Register.tsx";
import Layout from "./pageComponents/Layout.tsx";
import Components from "./pages/componentsPage/Components.tsx";
import UserPage from "./UserInfoPage/UserPage";
import Community from "./pages/Community/community.tsx";
import Builds from "./pages/builds/builds.tsx";

import AdminLogin from "./pages/adminPage/Adminlogin.tsx";
import AdminControlPanel from "./pages/adminPage/adminControlPanel.tsx";
import { useAtom } from 'jotai';
import { useEffect } from 'react';


function App() {

    return(
    <div>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route element={<Layout/>}>
                <Route path="/" element={<MainPage />} />
                <Route path="/components" element={<Components />} />
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

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
                    path="/admin/controlPanel"
                    element={
                        <RoleProtectedRoute role="ADMIN">
                            <AdminControlPanel />
                        </RoleProtectedRoute>
                    }
                />

        </Routes>
    </div>
    )
}
export default App;