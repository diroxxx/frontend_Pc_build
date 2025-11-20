import { useState } from "react";
import UserProfile from "../components/userPages/UserProfile.tsx";
import UserComputers from "../components/userPages/UserComputers.tsx";

function UserPage() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-200 rounded-full p-1 flex">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`px-6 py-2 rounded-full transition-all duration-200 ${
                                activeTab === "profile"
                                    ? "bg-white text-gray-800 shadow-sm"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            My Profile
                        </button>
                        <button
                            onClick={() => setActiveTab("posts")}
                            className={`px-6 py-2 rounded-full transition-all duration-200 ${
                                activeTab === "posts"
                                    ? "bg-white text-gray-800 shadow-sm"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            My Posts
                        </button>
                        <button
                            onClick={() => setActiveTab("builds")}
                            className={`px-6 py-2 rounded-full transition-all duration-200 ${
                                activeTab === "builds"
                                    ? "bg-white text-gray-800 shadow-sm"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            My Builds
                        </button>
                        <button
                            onClick={() => setActiveTab("saved")}
                            className={`px-6 py-2 rounded-full transition-all duration-200 ${
                                activeTab === "saved"
                                    ? "bg-white text-gray-800 shadow-sm"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Saved
                        </button>
                    </div>
                </div>

                {/* Profile Content */}
                {activeTab === "profile" && 
                    <UserProfile />
                }

                {/* Other tabs content */}
                {activeTab === "posts" && (
                    <div className="text-center text-gray-600 py-8">
                        <h3 className="text-xl font-medium">My Posts</h3>
                        <p className="mt-2">Your posts will be displayed here</p>
                    </div>
                )}

                {activeTab === "builds" && (
                    <UserComputers />
                )}

                {activeTab === "saved" && (
                    <div className="text-center text-gray-600 py-8">
                        <h3 className="text-xl font-medium">Saved</h3>
                        <p className="mt-2">Your saved items will be displayed here</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserPage;