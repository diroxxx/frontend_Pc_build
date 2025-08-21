import Login from "./pages/auth/login.tsx";
import MainPage from "./pages/mainPage/MainPage.tsx";
import {RoleProtectedRoute} from "./components/RoleProtectedRoute.tsx";
import {Routes, Route } from "react-router-dom";
import Unauthorized from "./pages/Unauthorized.tsx";
import Register from "./pages/auth/Register.tsx";
import Layout from "./pageComponents/Layout.tsx";
import Components from "./pages/componentsPage/Components.tsx";
import UserPage from "./UserInfoPage/UserPage";
import Builds from "./pages/Builds/builds.tsx";
import Community from "./pages/Community/community.tsx";

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
        </Routes>
    </div>
    )
}
export default App;