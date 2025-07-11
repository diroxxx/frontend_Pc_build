import Login from "./pages/auth/login.tsx";
import {useEffect, useState} from "react";
import {getAuthToken} from "./pages/auth/AuthService.tsx";
import {jwtDecode} from "jwt-decode";
import type {CustomJwtPayload} from "./pages/auth/CustomJwtPayload.tsx";

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
    return <div>
        <Login />;


    </div>

}

export default App;