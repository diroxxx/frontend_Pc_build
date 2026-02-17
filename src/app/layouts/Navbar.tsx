import {useNavigate, useLocation} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import { useAtom } from 'jotai';
import { userAtom } from '../../features/auth/atoms/userAtom.tsx';
import {useLogout} from "../../features/auth/user/hooks/useLogout.ts";
import {useQueryClient} from "@tanstack/react-query";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user] = useAtom(userAtom);
    // const [, logout] = useAtom(logoutUserAtom);
    const [showDropdown, setShowDropdown] = useState(false);
    const [, setIsScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const logout = useLogout();
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);


return (
    <>
        <header className="bg-gradient-blue-horizontal text-white">
            <div className="px-6 py-4 flex justify-between items-center">
                <h1 className="text-ocean-white text-3xl font-bold" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
                    Pc-Build
                </h1>
                
                <div className="flex gap-3 relative">
                    {user ? (
                        <div ref={dropdownRef} className="relative flex items-center gap-3">
                            <span className="text-sm font-medium px-3 py-1 rounded-full">
                                {user.nickname}
                            </span>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="focus:outline-none hover:bg-ocean-light-blue hover:bg-opacity-30 p-2 rounded-full transition-all duration-300 hover:shadow-lg"
                            >
                                <img src="user.png" alt="Logo_user" className="h-8 w-8 rounded-full" />
                            </button>
                            {showDropdown && (
                                <div className="absolute right-0 top-12 w-40 bg-white rounded-lg shadow-xl z-50 border border-gray-100">
                                    <button
                                        onClick={() => {
                                            navigate("/userInfo");
                                            setShowDropdown(false);
                                        }}
                                        className="block w-full text-left px-4 py-3 text-midnight-dark hover:bg-ocean-light-blue hover:bg-opacity-20 transition-colors duration-200 rounded-t-lg"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            logout();
                                            queryClient.clear();
                                            setShowDropdown(false);
                                            navigate("/")
                                        }}
                                        className="block w-full text-left px-4 py-3 text-midnight-dark hover:bg-ocean-red hover:bg-opacity-20 rounded-b-lg transition-colors duration-200"
                                    >
                                        Wyloguj się
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-white bg-opacity-90 text-midnight-dark px-5 py-2 rounded-lg font-medium hover:bg-ocean-light-blue hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ocean-light-blue transition-all duration-300 shadow-sm"
                            >
                                Zaloguj się
                            </button>
                            <button
                                onClick={() => navigate("/register")}
                                className="border-2 border-white text-white px-5 py-2 rounded-lg font-medium hover:bg-ocean-light-blue hover:border-ocean-light-blue hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ocean-light-blue transition-all duration-300"
                            >
                                Rejestracja
                            </button>
                        </div>
                    )}
                </div>
            </div>

            { (
                <div className="border-t border-white border-opacity-20">
                    <nav className="px-6 py-3">
                        <div className="flex gap-1 justify-center flex-wrap">
                            <button 
                                onClick={() => navigate("/")} 
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    location.pathname === "/" 
                                        ? "bg-white text-ocean-blue shadow-sm" 
                                        : "text-white hover:bg-ocean-light-blue hover:bg-opacity-25 hover:shadow-md hover:backdrop-blur-sm"
                                }`}
                            >
                                Strona główna
                            </button>
                            <button 
                                onClick={() => navigate("/builds")} 
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    location.pathname === "/builds" 
                                        ? "bg-white text-ocean-blue shadow-sm" 
                                        : "text-white hover:bg-ocean-light-blue hover:bg-opacity-25 hover:shadow-md hover:backdrop-blur-sm"
                                }`}
                            >
                                Konfigurator
                            </button>
                            <button 
                                onClick={() => navigate("/offers")} 
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    location.pathname === "/offers" 
                                        ? "bg-white text-ocean-blue shadow-sm" 
                                        : "text-white hover:bg-ocean-light-blue hover:bg-opacity-25 hover:shadow-md hover:backdrop-blur-sm"
                                }`}
                            >
                                Komponenty
                            </button>
                            <button 
                                onClick={() => navigate("/community")} 
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    location.pathname === "/community" 
                                        ? "bg-white text-ocean-blue shadow-sm" 
                                        : "text-white hover:bg-ocean-light-blue hover:bg-opacity-25 hover:shadow-md hover:backdrop-blur-sm"
                                }`}
                            >
                                Forum
                            </button>
                            <button 
                                onClick={() => navigate("/check-games")} 
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    location.pathname === "/check-games" 
                                        ? "bg-white text-ocean-blue shadow-sm" 
                                        : "text-white hover:bg-ocean-light-blue hover:bg-opacity-25 hover:shadow-md hover:backdrop-blur-sm"
                                }`}
                            >
                                Sprawdź gry
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    </>
);
}