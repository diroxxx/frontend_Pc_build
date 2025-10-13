import { use, useState } from "react";
import UsersComponent from "./adminComponentsPage/usersComponent";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../components/Auth";
import { userAtom } from "../../atomContext/userAtom";
import { useAtom } from "jotai";
import { showToast } from "../../components/ui/ToastProvider/ToastContainer";
import OffersComponent from "./adminComponentsPage/offersComponent/offersComponent";
import PcPartsComponent from "./adminComponentsPage/pcPartsComponent";
import GeneralInfo from "./adminComponentsPage/generalInfo";
const AdminControlPanel = () => {
        const [activeTab, setActiveTab] = useState("components");
        const navigate = useNavigate();
        const [getUser,setUser] = useAtom(userAtom);

         const handleLogout = () => {
        try {
            // Wyczyść tokeny
            setAuthToken(null);            
            setUser(null);
            navigate("/admin/login");
        } catch (error) {
            console.error("Błąd podczas wylogowania:", error);
                    showToast.error("Błąd podczas wylogowania");
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Header w stylu głównej strony */}
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

            {/* Layout: nawigacja po lewej, content po prawej, pełna wysokość */}
            <div className="flex min-h-[600px]">
                {/* Navigation tabs po lewej stronie, pełna wysokość */}
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
                        Zarządzaj użytkownikami
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

                {/* Content area */}
                <div className="flex-1 p-6">
                    {activeTab === "general" && <GeneralInfo />}
                    {activeTab === "users" && <UsersComponent />}
                    {activeTab === "components" && <PcPartsComponent />}
                    {activeTab === "offers" && <OffersComponent />}
                </div>
            </div>
        </div>
    );
}

export default AdminControlPanel;