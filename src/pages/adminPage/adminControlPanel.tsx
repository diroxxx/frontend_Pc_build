import { use, useState } from "react";
import UsersComponent from "./adminPageComponents/UsersComponent";
import { useNavigate } from "react-router-dom";
import { setAuthToken, setRefreshToken } from "../../components/Auth";
import { userAtom } from "../../atomContext/userAtom";
import { useAtom } from "jotai";
import { showToast } from "../../components/ui/ToastProvider/ToastContainer";
import OffersComponent from "./adminPageComponents/offersComponent";
import PcPartsComponent from "./adminPageComponents/pcPartsComponent";
const AdminControlPanel = () => {
        const [activeTab, setActiveTab] = useState("components");
        const navigate = useNavigate();
        const [getUser,setUser] = useAtom(userAtom);

         const handleLogout = () => {
        try {
            // Wyczyść tokeny
            setAuthToken(null);
            setRefreshToken(null);
            
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
           <div className="bg-slate-800 text-white py-6 mb-6 relative">
                <button
                    onClick={handleLogout}
                    className="absolute top-3 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Wyloguj
                </button>
                
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-center">
                        PANEL ADMINISTRATORA
                    </h1>
                    <p className="text-center text-gray-300 mt-1 text-base">
                        Zarządzanie portalem PC-Build
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6">
                {/* Navigation tabs w stylu podobnym do głównej strony */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg p-2 flex shadow-md border border-gray-200">
                        <button
                            onClick={() => setActiveTab("offers")}
                            className={`px-8 py-3 rounded-lg transition-all duration-200 font-medium ${
                                activeTab === "games"
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                            }`}
                        >
                            Oferty
                        </button>
                        <button
                            onClick={() => setActiveTab("components")}
                            className={`px-8 py-3 rounded-lg transition-all duration-200 font-medium ${
                                activeTab === "components"
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                            }`}
                        >
                            Komponenty
                        </button>
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`px-8 py-3 rounded-lg transition-all duration-200 font-medium ${
                                activeTab === "users"
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                            }`}
                        >
                            Zarządzaj użytkownikami
                        </button>
                        <button
                            onClick={() => setActiveTab("games")}
                            className={`px-8 py-3 rounded-lg transition-all duration-200 font-medium ${
                                activeTab === "games"
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                            }`}
                        >
                            Gry
                        </button>
                    </div>
                </div>

                {/* Content area */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    {activeTab === "users" && <UsersComponent />}
                    {activeTab === "components" && <PcPartsComponent />}
                    {activeTab === "offers" && <OffersComponent />}
                </div>
            </div>
        </div>
    );
}

export default AdminControlPanel;