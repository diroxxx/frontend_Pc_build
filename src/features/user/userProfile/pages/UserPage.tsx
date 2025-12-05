import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../../../atomContext/userAtom.tsx";
import UserProfile from "../components/UserProfile.tsx";
import UserComputers from "../components/UserComputers.tsx";
import customAxios from "../../../../lib/customAxios.tsx";
import PostDetails from "../../../../pages/UserPage/Community/PostDetails.tsx";
import PaginatedList from "../../../../pages/UserPage/Community/PaginatedPosts.tsx";
import {FaDesktop, FaMicrochip, FaMoneyBillWave, FaUserCircle} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
// 👇 DODAJ TEN IMPORT (dopasuj ścieżkę do swojego pliku categoryUtils)
import { getCategoryColor } from "../../../../pages/UserPage/Community/categoryUtils";

// --- INTERFEJSY ---

interface User {
    id: number;
    username: string;
    nickname: string;
    email: string;
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
interface Computer {
    id: number;
    name: string;
    totalPrice: number;
    offers: any[];
}

function UserPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const navigate = useNavigate(); // <--- DODAJ TO
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
    const [computers, setComputers] = useState<Computer[]>([]);
    const [loadingComputers, setLoadingComputers] = useState(false);
    const [errorComputers, setErrorComputers] = useState<string | null>(null);

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

    // NOWE: POBIERANIE ZESTAWÓW KOMPUTEROWYCH
    useEffect(() => {
        // Sprawdzamy czy zakładka to "builds" i czy mamy email usera
        if (activeTab === "builds" && user?.email) {
            const fetchComputers = async () => {
                try {
                    setLoadingComputers(true);
                    setErrorComputers(null);

                    // Endpoint z Javy: /users/{email}/computers
                    const response = await customAxios.get(`api/users/${user.email}/computers`);

                    setComputers(response.data);
                } catch (err: any) {
                    console.error("Błąd pobierania zestawów:", err);
                    setErrorComputers("Nie udało się pobrać konfiguracji PC.");
                } finally {
                    setLoadingComputers(false);
                }
            };
            fetchComputers();
        }
    }, [activeTab, user?.email]);

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
                            user: {
                                id: 0,
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
                                        {/* 👇 ZMIANA: Kategoria przed tytułem, dynamiczny kolor 👇 */}
                                        <div className="flex items-center mb-2">
                                            <span className={`inline-block text-white text-xs font-semibold px-2 py-0.5 rounded-full mr-3 shadow-md ${getCategoryColor(post.category?.name)}`}>
                                                {post.category?.name || 'Inne'}
                                            </span>
                                            <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                {post.title}
                                            </h4>
                                        </div>
                                        {/* 👆 KONIEC ZMIANY 👆 */}

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
                {activeTab === "builds" && (
                    <div className="py-8">
                        <h3 className="text-xl font-semibold text-center mb-4">Moje Konfiguracje PC</h3>

                        {loadingComputers && <p className="text-gray-600 text-center animate-pulse">Ładowanie zestawów...</p>}
                        {errorComputers && <p className="text-red-500 text-center">{errorComputers}</p>}

                        {!loadingComputers && !errorComputers && computers.length === 0 && (
                            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                                <FaDesktop className="mx-auto text-gray-300 w-12 h-12 mb-3" />
                                <p className="text-gray-500">Nie stworzyłeś jeszcze żadnych zestawów.</p>
                            </div>
                        )}

                        {/* LISTA ZESTAWÓW */}
                        {!loadingComputers && !errorComputers && computers.length > 0 && (
                            <div className="grid gap-4">
                                {computers.map((comp) => (
                                    <div
                                        key={comp.id}
                                        className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border-l-4 border-green-500 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                                    >
                                        <div className="mb-4 sm:mb-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaDesktop className="text-gray-600 text-xl" />
                                                <h4 className="text-xl font-bold text-gray-800">{comp.name}</h4>
                                            </div>

                                            <div
                                                className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <FaMicrochip/> Części: {comp.offers ? comp.offers.length : 0}
                                                </span>
                                                <span
                                                    className="flex items-center gap-1 text-green-700 font-bold text-base">
                                                         <FaMoneyBillWave/>
                                                        Cena: {comp.offers
                                                    ? comp.offers.reduce((sum: number, part: any) => sum + (part.price || 0), 0).toFixed(2)
                                                    : "0.00"} PLN
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium shadow"
                                            // onClick={() => console.log("Otwórz szczegóły zestawu ID:", comp.id)}
                                            onClick={() => navigate('/builds')} // <--- ZMIANA TUTAJ
                                        >
                                            Zobacz szczegóły
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- SAVED CONTENT --- */}
                {activeTab === "saved" && (
                    <div className="py-8">
                        <h3 className="text-xl font-semibold text-center mb-4">Zapisane Posty</h3>

                        {!loadingSaved && !errorSaved && (
                            <PaginatedList
                                items={savedPosts}
                                itemsPerPage={5}
                                renderItem={(savedItem) => (
                                    <div
                                        key={savedItem.id}
                                        onClick={() => {
                                            const correctPostObject = {
                                                ...savedItem,
                                                id: savedItem.postId ?? 0
                                            };
                                            if (correctPostObject.id !== 0) {
                                                handlePostClick(correctPostObject);
                                            }
                                        }}
                                        className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 cursor-pointer group"
                                    >
                                        {/* 👇 ZMIANA: Kategoria przed tytułem, dynamiczny kolor 👇 */}
                                        <div className="flex items-center mb-2">
                                            <span className={`inline-block text-white text-xs font-semibold px-2 py-0.5 rounded-full mr-3 shadow-md ${getCategoryColor(savedItem.category?.name)}`}>
                                                {savedItem.category?.name || 'Inne'}
                                            </span>
                                            <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                {savedItem.title}
                                            </h4>
                                        </div>
                                        {/* 👆 KONIEC ZMIANY 👆 */}

                                        <p className="text-gray-600 mt-2 line-clamp-3">{savedItem.content}</p>

                                        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                                            <div className="flex items-center">
                                                <span className="mr-1">Autor:</span>
                                                <div className="flex items-center font-bold text-gray-700">
                                                    <FaUserCircle className="w-4 h-4 mr-1 text-gray-400"/>
                                                    {savedItem.user?.username || "Nieznany"}
                                                </div>
                                            </div>
                                        </div>
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