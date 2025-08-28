import { useState } from "react";
import UsersComponent from "../adminPage/usersComponent";

const AdminControlPanel = () => {
        const [activeTab, setActiveTab] = useState("profile");
    
    return (
        <div>
            <div className="bg-red-600 text-white py-8 mb-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-center">
                        PANEL ADMINISTRATORA
                    </h1>
                    <p className="text-center text-red-100 mt-2 text-lg">
                        Zarządzanie portalem PC-Build
                    </p>
                
                </div>
            </div>                
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-200 rounded-full p-1 flex">
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`px-6 py-2 rounded-full transition-all duration-200 ${
                                activeTab === "users"
                                    ? "bg-white text-gray-800 shadow-sm"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                                Manage Users
                        </button>
                        <button
                            onClick={() => setActiveTab("components")}
                            className={`px-6 py-2 rounded-full transition-all duration-200 ${
                                activeTab === "components"
                                    ? "bg-white text-gray-800 shadow-sm"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Components
                        </button>
                        <button
                            onClick={() => setActiveTab("games")}
                            className={`px-6 py-2 rounded-full transition-all duration-200 ${
                                activeTab === "games"
                                    ? "bg-white text-gray-800 shadow-sm"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Games
                        </button>
                    </div>
                </div>        
                
                
                {activeTab === "users" && 
                    <UsersComponent />
                }
                {/* {activeTab === "components" && 
                    <ComponentsList />
                }
                {activeTab === "games" && 
                    <GamesList />
                } */}
                </div>
    );
}

export default AdminControlPanel;

