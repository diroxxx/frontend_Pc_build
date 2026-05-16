import { useState } from "react";
import UsersPage from "../usersManagment/admin/usersPage.tsx";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../auth/hooks/Auth.tsx";
import { userAtom } from "../auth/atoms/userAtom.tsx";
import { useAtom } from "jotai";
import { showToast } from "../../lib/ToastContainer.tsx";
import OffersComponent from "../offersUpdates/admin/offersUpdatePage.tsx";
import GeneralPage from "./generalPage.tsx";
import ComponentsPage from "../pcParts/admin/componentsPage.tsx";
import OffersAdminPage from "../offers/Admin/OffersAdminPage.tsx";
import { useQueryClient } from "@tanstack/react-query";
import AdminGamesPage from "../games/admin/pages/AdminGamesPage.tsx";
import { LayoutDashboard, RefreshCw, Tag, Cpu, Users, Gamepad2, LogOut, ShieldCheck, AlertCircle } from "lucide-react";
import UnknownOffersPage from "../unknownOffers/UnknownOffersPage.tsx";

const TABS = [
    { key: "general",      label: "Ogólne",             icon: LayoutDashboard },
    { key: "offersUpdate", label: "Aktualizacje ofert",  icon: RefreshCw },
    { key: "offers",       label: "Oferty",              icon: Tag },
    { key: "components",   label: "Komponenty",          icon: Cpu },
    { key: "users",        label: "Użytkownicy",         icon: Users },
    { key: "games",        label: "Gry",                 icon: Gamepad2 },
    { key: "unknown",      label: "Nieprzypisane",       icon: AlertCircle },
];

const AdminControlPanel = () => {
    const [activeTab, setActiveTab] = useState("general");
    const navigate = useNavigate();
    const [, setUser] = useAtom(userAtom);
    const queryClient = useQueryClient();

    const handleLogout = () => {
        try {
            setAuthToken(null);
            setUser(null);
            navigate("/admin/login");
            setTimeout(() => queryClient.clear(), 100);
        } catch (error) {
            console.error("Błąd podczas wylogowania:", error);
            showToast.error("Błąd podczas wylogowania");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
            {/* Header */}
            <header className="bg-gradient-blue-horizontal text-white shadow-lg flex-shrink-0">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                            <ShieldCheck size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold leading-none">Panel Administratora</h1>
                            <p className="text-white/70 text-xs mt-0.5">Zarządzanie portalem PC-Build</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-all"
                    >
                        <LogOut size={15} />
                        Wyloguj
                    </button>
                </div>

                {/* Tab bar w headerze */}
                <nav className="px-6 pb-0 flex gap-1 overflow-x-auto">
                    {TABS.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap transition-all border-b-2 ${
                                activeTab === key
                                    ? "bg-white text-ocean-blue border-white"
                                    : "text-white/80 hover:text-white border-transparent hover:bg-white/10"
                            }`}
                        >
                            <Icon size={14} />
                            {label}
                        </button>
                    ))}
                </nav>
            </header>

            {/* Content */}
            <main className="flex-1 p-6 overflow-auto">
                {activeTab === "general"      && <GeneralPage onNavigate={setActiveTab} />}
                {activeTab === "users"        && <UsersPage />}
                {activeTab === "components"   && <ComponentsPage />}
                {activeTab === "offersUpdate" && <OffersComponent />}
                {activeTab === "offers"       && <OffersAdminPage />}
                {activeTab === "games"        && <AdminGamesPage />}
                {activeTab === "unknown"      && <UnknownOffersPage />}
            </main>
        </div>
    );
};

export default AdminControlPanel;
