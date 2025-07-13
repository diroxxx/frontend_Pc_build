import {createContext, useContext, useEffect, useState} from "react";
import {getAuthToken} from "./Auth.tsx";
import {jwtDecode} from "jwt-decode";

interface User {
    email: string;
    role: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
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
                });
            } catch (e) {
                setUser(null);
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);