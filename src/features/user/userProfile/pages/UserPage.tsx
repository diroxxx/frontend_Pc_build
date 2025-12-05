import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../../../atomContext/userAtom.tsx";
import UserProfile from "../components/UserProfile.tsx";
import UserComputers from "../components/UserComputers.tsx";
import customAxios from "../../../../lib/customAxios.tsx";
import PostDetails from "../../../../pages/UserPage/Community/PostDetails.tsx";
import PaginatedList from "../../../../pages/UserPage/Community/PaginatedPosts.tsx";
import { FaUserCircle } from "react-icons/fa";

// --- INTERFEJSY ---

interface User {
    id: number;
    username: string;
}

interface Category {
    id: number;
    name: string;
}

interface Post {
    id: number;
    postId: number;
    title: string;
    content: string;
    user: User;
    createdAt: number[];
    category?: Category;
}

function UserPage() {
    const [activeTab, setActiveTab] = useState("profile");

    // --- STATE DLA POSTÓW ---
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [errorPosts, setErrorPosts] = useState<string | null>(null);

    // --- STATE DLA ZAPISANYCH ---
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [loadingSaved, setLoadingSaved] = useState(false);
    const [errorSaved, setErrorSaved] = useState<string | null>(null);

    // --- STATE DLA SZCZEGÓŁÓW POSTA ---
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const [user] = useAtom(userAtom);

    // --- POBIERANIE POSTÓW USERA ---
    useEffect(() => {
        if (activeTab === "posts" && user?.nickname) {
            const fetchPosts = async () => {
                try {
                    setLoadingPosts(true);
                    setErrorPosts(null);
                    const response = await customAxios.get(`community/posts/user/${user.nickname}`);
                    const data = response.data;

                    if (Array.isArray(data)) {
                        const postsWithUser = data.map((post: any) => ({
                            ...post,
                            user: post.user || { username: user.nickname }
                        }));
                        setPosts(postsWithUser);
                    } else {
                        setPosts([]);
                    }
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

    useEffect(() => {
        if (activeTab === "saved" && user?.nickname) {
            const fetchSaved = async () => {
                try {
                    setLoadingSaved(true);
                    setErrorSaved(null);
                    const response = await customAxios.get(`community/posts/saved/${user.nickname}`);

                    const data = response.data;

                    if (Array.isArray(data)) {
                        // MAPOWANIE: Tworzymy strukturę pasującą do interfejsu Post
                        const formattedSavedPosts = data.map((item: any) => ({
                            ...item,
                            // Tworzymy sztuczny obiekt user dla autora posta na podstawie nowego pola z backendu
                            user: {
                                id: 0, // ID autora ngit ie jest konieczne do wyświetlenia nazwy, ale TS może go wymagać
                                username: item.authorName || "Nieznany autor"
                            }
                        }));
                        setSavedPosts(formattedSavedPosts);
                    } else {
                        setSavedPosts([]);
                    }

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

    const handlePostClick = (post: Post) => {
        setSelectedPost(post);
    };

    const handleBackToList = () => {
        setSelectedPost(null);
    };

    if (selectedPost) {
        return (
            <div className="min-h-screen bg-gray-100 py-4">
                <PostDetails
                    post={selectedPost}
                    onBack={handleBackToList}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-200 rounded-full p-1 flex flex-wrap justify-center">
                        {["profile", "posts", "builds", "saved"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full transition-all duration-200 capitalize m-1 ${
                                    activeTab === tab
                                        ? "bg-white text-gray-800 shadow-sm font-medium"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                            >
                                {tab === "profile" ? "Mój Profil" :
                                    tab === "posts" ? "Moje Posty" :
                                        tab === "builds" ? "Moje Zestawy" : "Zapisane Posty"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- PROFILE CONTENT --- */}
                {activeTab === "profile" && <UserProfile />}

                {/* --- MY POSTS CONTENT --- */}
                {activeTab === "posts" && (
                    <div className="py-8">
                        <h3 className="text-xl font-semibold text-center mb-4">Moje Posty</h3>

                        {loadingPosts && <p className="text-gray-600 text-center animate-pulse">Loading posts...</p>}
                        {errorPosts && <p className="text-red-500 text-center">{errorPosts}</p>}

                        {!loadingPosts && !errorPosts && posts.length === 0 && (
                            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-500">You haven't created any posts yet.</p>
                            </div>
                        )}

                        {/* UŻYCIE PAGINATED LIST DLA MY POSTS */}
                        {!loadingPosts && !errorPosts && (
                            <PaginatedList
                                items={posts}
                                itemsPerPage={5}
                                renderItem={(post) => (
                                    <div
                                        key={post.id}
                                        onClick={() => handlePostClick(post)}
                                        className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                {post.title}
                                            </h4>
                                            {post.category?.name && (
                                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                    {post.category.name}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 mt-2 line-clamp-3">{post.content}</p>
                                        <div className="mt-2 text-xs text-gray-400">
                                            Kliknij, aby zobaczyć szczegóły
                                        </div>
                                    </div>
                                )}
                            />
                        )}
                    </div>
                )}

                {/* --- MY BUILDS CONTENT --- */}
                {activeTab === "builds" && <UserComputers />}

                {/*/!* --- SAVED CONTENT --- *!/*/}
                {/*{activeTab === "saved" && (*/}
                {/*    <div className="py-8">*/}
                {/*        <h3 className="text-xl font-semibold text-center mb-4">Zapisane Posty</h3>*/}

                {/*        {loadingSaved && <p className="text-gray-600 text-center animate-pulse">Loading saved items...</p>}*/}
                {/*        {errorSaved && <p className="text-red-500 text-center">{errorSaved}</p>}*/}

                {/*        {!loadingSaved && !errorSaved && savedPosts.length === 0 && (*/}
                {/*            <div className="text-center py-10 bg-white rounded-lg shadow-sm">*/}
                {/*                <p className="text-gray-500">Nie zapisałeś jeszcze żadnego posta.</p>*/}
                {/*            </div>*/}
                {/*        )}*/}

                {/*        /!* UŻYCIE PAGINATED LIST DLA SAVED POSTS *!/*/}
                {/*        {!loadingSaved && !errorSaved && (*/}
                {/*            <PaginatedList*/}
                {/*                items={savedPosts}*/}
                {/*                itemsPerPage={5}*/}
                {/*                renderItem={(savedItem) => (*/}
                {/*                    <div*/}
                {/*                        key={savedItem.id}*/}
                {/*                        onClick={() => {*/}
                {/*                            // Poprawka ID dla zapisanych postów*/}
                {/*                            const correctPostObject = {*/}
                {/*                                ...savedItem,*/}
                {/*                                id: savedItem.postId*/}
                {/*                            };*/}
                {/*                            handlePostClick(correctPostObject);*/}
                {/*                        }}*/}
                {/*                        className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 cursor-pointer group"*/}
                {/*                    >*/}
                {/*                        <div className="flex justify-between items-start">*/}
                {/*                            <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">*/}
                {/*                                {savedItem.title}*/}
                {/*                            </h4>*/}
                {/*                            {savedItem.category?.name && (*/}
                {/*                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">*/}
                {/*                                    {savedItem.category.name}*/}
                {/*                                </span>*/}
                {/*                            )}*/}
                {/*                        </div>*/}
                {/*                        <p className="text-gray-600 mt-2 line-clamp-3">{savedItem.content}</p>*/}
                {/*                        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                )}*/}
                {/*            />*/}
                {/*        )}*/}
                {/*    </div>*/}
                {/*)}*/}
                {/* --- SAVED CONTENT --- */}
                {activeTab === "saved" && (
                    <div className="py-8">
                        <h3 className="text-xl font-semibold text-center mb-4">Zapisane Posty</h3>

                        {/* ... loading i error bez zmian ... */}

                        {!loadingSaved && !errorSaved && (
                            <PaginatedList
                                items={savedPosts}
                                itemsPerPage={5}
                                renderItem={(savedItem) => (
                                    <div
                                        key={savedItem.id}
                                        onClick={() => {
                                            // Zabezpieczenie na wypadek gdyby postId było nullem
                                            const correctPostObject = {
                                                ...savedItem,
                                                id: savedItem.postId ?? 0
                                            };

                                            // Klikamy tylko jeśli ID jest poprawne
                                            if (correctPostObject.id !== 0) {
                                                handlePostClick(correctPostObject);
                                            }
                                        }}
                                        className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                {savedItem.title}
                                            </h4>
                                            {savedItem.category?.name && (
                                                <span
                                                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    {savedItem.category.name}
                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 mt-2 line-clamp-3">{savedItem.content}</p>

                                        {/* --- TU BYŁO PUSTO, TERAZ JEST AUTOR --- */}
                                        {/*<div className="mt-3 flex justify-between items-center text-xs text-gray-500">*/}
                                        {/*    <div className="flex items-center">*/}
                                        {/*        <span className="mr-1">Autor:</span>*/}
                                        {/*        <div className="flex items-center font-bold text-gray-700">*/}
                                        {/*            <FaUserCircle className="w-4 h-4 mr-1 text-gray-400" />*/}
                                        {/*            /!* Używamy optional chaining (?.) dla bezpieczeństwa *!/*/}
                                        {/*            {savedItem.user?.username || "Nieznany"}*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}

                                        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                                            <div className="flex items-center">
                                                <span className="mr-1">Autor:</span>
                                                <div className="flex items-center font-bold text-gray-700">
                                                    <FaUserCircle className="w-4 h-4 mr-1 text-gray-400"/>
                                                    {savedItem.user?.username || "Nieznany"}
                                                </div>
                                            </div>
                                        </div>
                                        {/* --------------------------------------- */}
                                    </div>
                                )}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserPage;