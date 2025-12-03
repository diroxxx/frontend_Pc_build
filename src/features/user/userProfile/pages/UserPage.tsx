// import { useState, useEffect } from "react";
// import { useAtom } from "jotai";
// import { userAtom } from "../../../../atomContext/userAtom.tsx";
// import UserProfile from "../components/UserProfile.tsx";
// import UserComputers from "../components/UserComputers.tsx";
// import customAxios from "../../../../lib/customAxios.tsx";
//
// function UserPage() {
//     const [activeTab, setActiveTab] = useState("profile");
//
//     // --- STATE DLA POSTÓW ---
//     const [posts, setPosts] = useState<any[]>([]);
//     const [loadingPosts, setLoadingPosts] = useState(false);
//     const [errorPosts, setErrorPosts] = useState<string | null>(null);
//
//     // --- Pobranie aktualnego usera z atomu ---
//     const [user] = useAtom(userAtom);
//
//     // --- POBRANIE POSTÓW UŻYTKOWNIKA ---
//     useEffect(() => {
//         if (activeTab === "posts" && user?.nickname) {
//             const fetchPosts = async () => {
//                 try {
//                     setLoadingPosts(true);
//                     setErrorPosts(null);
//
//                     const response = await customAxios.get(`community/posts/user/${user.nickname}`);
//                     const data = response.data;
//
//                     // Upewnienie się, że posts jest tablicą
//                     setPosts(Array.isArray(data) ? data : []);
//                 } catch (err: any) {
//                     setErrorPosts(err.message || "Failed to load posts");
//                 } finally {
//                     setLoadingPosts(false);
//                 }
//             };
//
//             fetchPosts();
//         }
//     }, [activeTab, user?.nickname]);
//
//     return (
//         <div className="min-h-screen bg-gray-100">
//             <div className="max-w-4xl mx-auto py-8 px-4">
//                 {/* Navigation Tabs */}
//                 <div className="flex justify-center mb-8">
//                     <div className="bg-gray-200 rounded-full p-1 flex">
//                         <button
//                             onClick={() => setActiveTab("profile")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "profile" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             My Profile
//                         </button>
//                         <button
//                             onClick={() => setActiveTab("posts")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "posts" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             My Posts
//                         </button>
//                         <button
//                             onClick={() => setActiveTab("builds")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "builds" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             My Builds
//                         </button>
//                         <button
//                             onClick={() => setActiveTab("saved")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "saved" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             Saved
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* Profile */}
//                 {activeTab === "profile" && <UserProfile />}
//
//                 {/* --- MY POSTS CONTENT --- */}
//                 {activeTab === "posts" && (
//                     <div className="py-8">
//                         <h3 className="text-xl font-semibold mb-4">My Posts</h3>
//
//                         {loadingPosts && <p className="text-gray-600 text-center">Loading...</p>}
//                         {errorPosts && <p className="text-red-500 text-center">{errorPosts}</p>}
//                         {!loadingPosts && !errorPosts && posts.length === 0 && (
//                             <p className="text-gray-600 text-center">You haven't created any posts yet.</p>
//                         )}
//
//                         {/* LISTA POSTÓW */}
//                         <div className="space-y-4">
//                             {Array.isArray(posts) &&
//                                 posts.map((post) => (
//                                     <div
//                                         key={post.id}
//                                         className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
//                                     >
//                                         <h4 className="text-lg font-bold">{post.title}</h4>
//                                         <p className="text-gray-700 mt-1">{post.content}</p>
//                                         {post.category?.name && (
//                                             <p className="text-gray-400 text-sm mt-2">
//                                                 Kategoria: {post.category.name}
//                                             </p>
//                                         )}
//                                     </div>
//                                 ))}
//                         </div>
//                     </div>
//                 )}
//
//                 {activeTab === "builds" && <UserComputers />}
//
//                 {activeTab === "saved" && (
//                     <div className="text-center text-gray-600 py-8">
//                         <h3 className="text-xl font-medium">Saved</h3>
//                         <p className="mt-2">Your saved items will be displayed here</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
//
// export default UserPage;

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../../../atomContext/userAtom.tsx"; // Upewnij się, że ścieżka jest poprawna
import UserProfile from "../components/UserProfile.tsx";
import UserComputers from "../components/UserComputers.tsx";
import customAxios from "../../../../lib/customAxios.tsx";

// Opcjonalnie: Interfejsy dla lepszego podpowiadania kodu (TypeScript)
interface Category {
    id: number;
    name: string;
}

interface PostData {
    id: number;
    title: string;
    content: string;
    category: Category;
    // savedDate?: string; // Jeśli backend zwraca datę zapisania
}

function UserPage() {
    const [activeTab, setActiveTab] = useState("profile");

    // --- STATE DLA POSTÓW (MY POSTS) ---
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [errorPosts, setErrorPosts] = useState<string | null>(null);

    // --- STATE DLA ZAPISANYCH (SAVED) ---
    const [savedPosts, setSavedPosts] = useState<PostData[]>([]);
    const [loadingSaved, setLoadingSaved] = useState(false);
    const [errorSaved, setErrorSaved] = useState<string | null>(null);

    // --- Pobranie aktualnego usera z atomu ---
    const [user] = useAtom(userAtom);

    // --- 1. POBRANIE POSTÓW UŻYTKOWNIKA ---
    useEffect(() => {
        if (activeTab === "posts" && user?.nickname) {
            const fetchPosts = async () => {
                try {
                    setLoadingPosts(true);
                    setErrorPosts(null);

                    const response = await customAxios.get(`community/posts/user/${user.nickname}`);
                    const data = response.data;

                    setPosts(Array.isArray(data) ? data : []);
                } catch (err: any) {
                    console.error(err);
                    setErrorPosts(err.message || "Failed to load posts");
                } finally {
                    setLoadingPosts(false);
                }
            };

            fetchPosts();
        }
    }, [activeTab, user?.nickname]);

    // --- 2. POBRANIE ZAPISANYCH ELEMENTÓW ---
    useEffect(() => {
        if (activeTab === "saved" && user?.nickname) {
            const fetchSaved = async () => {
                try {
                    setLoadingSaved(true);
                    setErrorSaved(null);

                    // Wywołanie endpointu, który stworzyliśmy w backendzie
                    const response = await customAxios.get(`community/posts/saved/${user.nickname}`);
                    const data = response.data;

                    setSavedPosts(Array.isArray(data) ? data : []);
                } catch (err: any) {
                    console.error(err);
                    setErrorSaved(err.message || "Failed to load saved items");
                } finally {
                    setLoadingSaved(false);
                }
            };

            fetchSaved();
        }
    }, [activeTab, user?.nickname]);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-200 rounded-full p-1 flex">
                        {["profile", "posts", "builds", "saved"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full transition-all duration-200 capitalize ${
                                    activeTab === tab
                                        ? "bg-white text-gray-800 shadow-sm font-medium"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                            >
                                {tab === "profile" ? "My Profile" :
                                    tab === "posts" ? "My Posts" :
                                        tab === "builds" ? "My Builds" : "Saved"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- PROFILE CONTENT --- */}
                {activeTab === "profile" && <UserProfile />}

                {/* --- MY POSTS CONTENT --- */}
                {activeTab === "posts" && (
                    <div className="py-8">
                        <h3 className="text-xl font-semibold mb-4">My Posts</h3>

                        {loadingPosts && <p className="text-gray-600 text-center animate-pulse">Loading posts...</p>}
                        {errorPosts && <p className="text-red-500 text-center">{errorPosts}</p>}

                        {!loadingPosts && !errorPosts && posts.length === 0 && (
                            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-500">You haven't created any posts yet.</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div key={post.id} className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-lg font-bold text-gray-800">{post.title}</h4>
                                        {post.category?.name && (
                                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                {post.category.name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 mt-2 line-clamp-3">{post.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- MY BUILDS CONTENT --- */}
                {activeTab === "builds" && <UserComputers />}

                {/* --- SAVED CONTENT (NOWA SEKCJA) --- */}
                {activeTab === "saved" && (
                    <div className="py-8">
                        <h3 className="text-xl font-semibold mb-4">Saved Posts</h3>

                        {loadingSaved && <p className="text-gray-600 text-center animate-pulse">Loading saved items...</p>}
                        {errorSaved && <p className="text-red-500 text-center">{errorSaved}</p>}

                        {!loadingSaved && !errorSaved && savedPosts.length === 0 && (
                            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-500">You haven't saved any posts yet.</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {savedPosts.map((savedItem) => (
                                <div key={savedItem.id} className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-lg font-bold text-gray-800">{savedItem.title}</h4>
                                        {savedItem.category?.name && (
                                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                {savedItem.category.name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 mt-2 line-clamp-3">{savedItem.content}</p>

                                    {/* Opcjonalny przycisk np. do przejścia do posta */}
                                    <div className="mt-4 flex justify-end">
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserPage;