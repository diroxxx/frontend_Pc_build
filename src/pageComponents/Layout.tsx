import {Outlet} from "react-router-dom";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}