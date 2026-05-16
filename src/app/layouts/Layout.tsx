import {Outlet} from "react-router-dom";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import {useAtomValue} from "jotai";
import {themeAtom} from "../../shared/atoms/themeAtom.ts";
import {useEffect} from "react";

export default function Layout() {
    const theme = useAtomValue(themeAtom);

    useEffect(() => {
        if (theme === 'light') {
            document.documentElement.classList.add('theme-light');
        } else {
            document.documentElement.classList.remove('theme-light');
        }
    }, [theme]);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-dark-bg">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}