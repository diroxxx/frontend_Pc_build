import {createContext, useContext, useEffect, useState} from "react";
import {getAuthToken, setAuthToken} from "./Auth.tsx";
import {jwtDecode} from "jwt-decode";

interface User {
    email: string;
    role: string;
    nickname: string
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    logout: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setUser({
                    email: decoded.sub,
                    role: decoded.role,
                    nickname: decoded.username
                });
            } catch (e) {
                setUser(null);
            }
        }
    }, []);

    const logout = () => {
        setAuthToken(null);
        setUser(null);
        // Remove from localStorage if you're storing it there
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);