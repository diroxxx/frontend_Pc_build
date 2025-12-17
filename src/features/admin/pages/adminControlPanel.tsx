import {useState } from "react";
import UsersPage from "../UsersManage/usersPage.tsx";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../../lib/Auth.tsx";
import { userAtom } from "../../../atomContext/userAtom.tsx";
import { useAtom } from "jotai";
import { showToast } from "../../../lib/ToastContainer.tsx";
import OffersComponent from "../offersUpdates/offersUpdatePage.tsx";
import GeneralPage from "../AdminGeneralPage/generalPage.tsx";
import ComponentsPage from "./componentsPage.tsx";
import OffersAdminPage from "./OffersAdminPage.tsx";
import {useQueryClient} from "@tanstack/react-query";
import AdminGamesPage from "../AdminGames/pages/AdminGamesPage.tsx";
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
            <div className="bg-gradient-blue-horizontal text-white py-6 mb-6 relative">
                <button
                    onClick={handleLogout}
                    className="absolute top-3 right-4 bg-ocean-red hover:bg-oceane-red text-white px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    Wyloguj
                </button>
                <div className="container mx-auto px-4">
                    <h1 className="text-text-ocean-white text-2xl md:text-3xl font-bold text-center">
                        PANEL ADMINISTRATORA
                    </h1>
                    <p className="text-center text-text-ocean-white mt-1 text-base">
                        Zarządzanie portalem PC-Build
                    </p>
                </div>
            </div>

            <div className="flex min-h-[600px] gap-4 px-2">
                <div className="flex flex-col w-52 bg-ocean-white rounded-lg shadow-md border border-gray-200 h-full py-3">
                    {[
                        { key: 'general', label: 'Ogólne' },
                        { key: 'offersUpdate', label: 'Aktualizacje ofert' },
                        { key: 'offers', label: 'Oferty' },
                        { key: 'components', label: 'Komponenty' },
                        { key: 'users', label: 'Użytkownicy' },
                        { key: 'games', label: 'Gry' },
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveTab(item.key as typeof activeTab)}
                            className={`mb-1.5 mx-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 text-left font-medium ${
                                activeTab === item.key
                                    ? 'bg-ocean-dark-blue text-ocean-white shadow-sm'
                                    : 'text-gray-600 hover:text-ocean-dark-blue'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 p-1">
                    {activeTab === 'general' && <GeneralPage onNavigate={setActiveTab} />}
                    {activeTab === 'users' && <UsersPage />}
                    {activeTab === 'components' && <ComponentsPage />}
                    {activeTab === 'offersUpdate' && <OffersComponent />}
                    {activeTab === 'offers' && <OffersAdminPage />}
                    {activeTab === 'games' && <AdminGamesPage />}
                </div>
            </div>
        </div>
    );

}

export default AdminControlPanel;