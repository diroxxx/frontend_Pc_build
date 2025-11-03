import {useState } from "react";
import UsersPage from "./usersPage.tsx";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../../lib/Auth.tsx";
import { userAtom } from "../../../atomContext/userAtom.tsx";
import { useAtom } from "jotai";
import { showToast } from "../../../lib/ToastContainer.tsx";
import OffersComponent from "./offersUpdatePage.tsx";
import GeneralPage from "./generalPage.tsx";
import ComponentsPage from "./componentsPage.tsx";
import OffersPage from "./OffersPage.tsx";
import {useQueryClient} from "@tanstack/react-query";
const AdminControlPanel = () => {
        const [activeTab, setActiveTab] = useState("general");
        const navigate = useNavigate();
        const [getUser,setUser] = useAtom(userAtom);
        const queryClient = useQueryClient();

        const handleLogout = () => {
            try {
                setAuthToken(null);
                queryClient.clear();
                setUser(null);
                navigate("/admin/login");
        } catch (error) {
            console.error("Błąd podczas wylogowania:", error);
                    showToast.error("Błąd podczas wylogowania");
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/*<ToastContainer />*/}
            <div className="bg-gradient-blue-horizontal text-white py-6 mb-6 relative">
                <button
                    onClick={handleLogout}
                    className="absolute top-3 right-4 bg-ocean-red hover:bg-oceane-red text-white px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Wyloguj
                </button>
                <div className="container mx-auto px-4">
                    <h1 className="text-text-ocean-white  text-2xl md:text-3xl font-bold text-center">
                        PANEL ADMINISTRATORA
                    </h1>
                    <p className="text-center text-text-ocean-white mt-1 text-base">
                        Zarządzanie portalem PC-Build
                    </p>
                </div>
            </div>

            <div className="flex min-h-[600px]">
                <div className="flex flex-col w-64 bg-ocean-white rounded-lg shadow-md border border-gray-200 h-full">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`mb-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                            activeTab === "general"
                                ? "bg-ocean-dark-blue text-ocean-white shadow-sm"
                                : "text-gray-600 hover:text-ocean-dark-blue "
                        }`}
                    >
                        Ogólne
                    </button>
                    <button
                        onClick={() => setActiveTab("offersUpdate")}
                        className={`mb-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                            activeTab === "offersUpdate"
                                ? "bg-ocean-dark-blue text-ocean-white shadow-sm"
                                : "text-gray-600 hover:text-ocean-dark-blue "
                        }`}
                    >
                        Aktualizacje ofert
                    </button>
                    <button
                        onClick={() => setActiveTab("offers")}
                        className={`mb-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                            activeTab === "offers"
                                ? "bg-ocean-dark-blue text-ocean-white shadow-sm"
                                : "text-gray-600 hover:text-ocean-dark-blue "
                        }`}
                    >
                        Oferty
                    </button>
                    <button
                        onClick={() => setActiveTab("components")}
                        className={`mb-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                            activeTab === "components"
                                ? "bg-ocean-dark-blue text-ocean-white shadow-sm"
                                : "text-gray-600 hover:text-ocean-dark-blue "
                        }`}
                    >
                        Komponenty
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`mb-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                            activeTab === "users"
                                ? "bg-ocean-dark-blue text-ocean-white shadow-sm"
                                : "text-gray-600 hover:text-ocean-dark-blue"
                        }`}
                    >
                        Uzytkownicy
                    </button>
                    <button
                        onClick={() => setActiveTab("games")}
                        className={`mb-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                            activeTab === "games"
                                ? "bg-ocean-dark-blue text-ocean-white shadow-sm"
                                : "text-gray-600 hover:text-ocean-dark-blue"
                        }`}
                    >
                        Gry
                    </button>
                </div>

                <div className="flex-1 p-6">
                    {activeTab === "general" && <GeneralPage onNavigate={setActiveTab} />}
                    {activeTab === "users" && <UsersPage />}
                    {activeTab === "components" && <ComponentsPage />}
                    {activeTab === "offersUpdate" && <OffersComponent />}
                    {activeTab === "offers" && <OffersPage />}
                </div>
            </div>
        </div>
    );
}

export default AdminControlPanel;