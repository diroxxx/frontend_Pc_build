import {createContext, useContext, useEffect} from "react";
import { useAtom } from 'jotai';
import { userAtom, logoutUserAtom, initializeUserAtom } from '../atomContext/userAtom';

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
    const [user, setUser] = useAtom(userAtom);
    const [, logout] = useAtom(logoutUserAtom);
    const [, initializeUser] = useAtom(initializeUserAtom);

    useEffect(() => {
        initializeUser();
    }, [initializeUser]);

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);