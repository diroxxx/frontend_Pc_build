import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../features/auth/atoms/userAtom.tsx";
import { useLogout } from "../../features/auth/user/hooks/useLogout.ts";
import { useQueryClient } from "@tanstack/react-query";
import { themeAtom } from "../../shared/atoms/themeAtom.ts";
import { Sun, Moon, User, LogOut, UserCircle, Cpu } from "lucide-react";

const NAV_LINKS = [
    { label: "Strona główna", path: "/" },
    { label: "Konfigurator", path: "/builds" },
    { label: "Komponenty", path: "/offers" },
    { label: "Forum", path: "/community" },
    { label: "Sprawdź gry", path: "/check-games" },
];

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user] = useAtom(userAtom);
    const [theme, setTheme] = useAtom(themeAtom);
    const [showDropdown, setShowDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const logout = useLogout();
    const queryClient = useQueryClient();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showDropdown]);

    return (
        <header className={`sticky top-0 z-50 bg-dark-surface border-b border-dark-border transition-shadow duration-200 ${scrolled ? "shadow-lg shadow-black/20" : ""}`}>
            <div className="px-6 py-3 flex justify-between items-center">
                {/* Logo */}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 group"
                >
                    <div className="w-8 h-8 rounded-lg bg-dark-accent flex items-center justify-center flex-shrink-0 group-hover:bg-dark-accent-hover transition-colors">
                        <Cpu size={16} className="text-white" />
                    </div>
                    <span className="text-xl font-black text-dark-text group-hover:text-dark-accent transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Pc-Build
                    </span>
                </button>

                {/* Nav links — center */}
                <nav className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(({ label, path }) => {
                        const active = location.pathname === path;
                        return (
                            <button
                                key={path}
                                onClick={() => navigate(path)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    active
                                        ? "bg-dark-surface2 text-dark-accent"
                                        : "text-dark-muted hover:text-dark-text hover:bg-dark-surface2"
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-surface2 transition-all"
                        title={theme === "dark" ? "Przełącz na jasny motyw" : "Przełącz na ciemny motyw"}
                    >
                        {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                    </button>

                    {user ? (
                        <div ref={dropdownRef} className="relative flex items-center gap-2">
                            <span className="hidden sm:block text-sm font-medium text-dark-muted">
                                {user.nickname}
                            </span>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${
                                    showDropdown
                                        ? "border-dark-accent bg-dark-surface2 text-dark-accent"
                                        : "border-dark-border bg-dark-surface2 text-dark-muted hover:border-dark-accent hover:text-dark-accent"
                                }`}
                            >
                                <UserCircle size={18} />
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 top-11 w-44 bg-dark-surface border border-dark-border rounded-xl shadow-2xl shadow-black/30 z-50 overflow-hidden">
                                    <button
                                        onClick={() => { navigate("/userInfo"); setShowDropdown(false); }}
                                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-dark-text hover:bg-dark-surface2 transition-colors"
                                    >
                                        <User size={14} className="text-dark-muted" />
                                        Profil
                                    </button>
                                    <div className="border-t border-dark-border" />
                                    <button
                                        onClick={() => { logout(); queryClient.clear(); setShowDropdown(false); navigate("/"); }}
                                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-ocean-red hover:bg-ocean-red/10 transition-colors"
                                    >
                                        <LogOut size={14} />
                                        Wyloguj się
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate("/login")}
                                className="px-4 py-2 text-sm font-semibold text-dark-text border border-dark-border rounded-lg hover:border-dark-accent hover:text-dark-accent bg-dark-surface2 transition-all"
                            >
                                Zaloguj się
                            </button>
                            <button
                                onClick={() => navigate("/register")}
                                className="px-4 py-2 text-sm font-semibold text-white bg-dark-accent rounded-lg hover:bg-dark-accent-hover transition-all"
                            >
                                Rejestracja
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile nav */}
            <nav className="md:hidden border-t border-dark-border px-4 py-2 flex gap-1 overflow-x-auto">
                {NAV_LINKS.map(({ label, path }) => {
                    const active = location.pathname === path;
                    return (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                                active
                                    ? "bg-dark-surface2 text-dark-accent"
                                    : "text-dark-muted hover:text-dark-text"
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </nav>
        </header>
    );
}
