import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../auth/atoms/userAtom.tsx";
import UserProfile from "./components/UserProfile.tsx";
import UserComputers from "./components/UserComputers.tsx";
import customAxios from "../../lib/customAxios.tsx";
import PostDetails from "../Community/PostDetails.tsx";
import PaginatedList from "../Community/PaginatedPosts.tsx";
import {
    FaDesktop,
    FaMicrochip,
    FaMoneyBillWave,
    FaUserCircle,
    FaThumbsUp,
    FaThumbsDown
} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import { getCategoryColor } from "../Community/categoryUtils.tsx";
import { parseDateArray, formatDate } from "../Community/PostTime.tsx";


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
    postId?: number;
    title: string;
    content: string;
    user: User;
    authorName?: string;
    createdAt: number[];
    category?: Category;
    categoryName?: string;
    thumbnailImageId?: number;
    imageId?: number;
}

interface Computer {
    id: number;
    name: string;
    totalPrice: number;
    offers: any[];
}

interface PostListItemProps {
    post: Post;
    onClick: () => void;
    currentUser: User | null;
}

const PostListItem: React.FC<PostListItemProps> = ({ post, onClick, currentUser }) => {
    const realPostId = post.postId && post.postId !== 0 ? post.postId : post.id;

    const [netScore, setNetScore] = useState<number>(0);
    const [userVoteStatus, setUserVoteStatus] = useState<'upvote' | 'downvote' | null>(null);
    const date = parseDateArray(post.createdAt);

    const categoryName = post.categoryName || post.category?.name || 'Brak kategorii';
    const imageIdToUse = post.thumbnailImageId || post.imageId;
    const thumbnailUrl = imageIdToUse
        ? `http://localhost:8080/community/image/${imageIdToUse}`
        : null;

    useEffect(() => {
        const fetchVoteStatus = async () => {
            try {
                const scoreResponse = await customAxios.get<number>(`community/posts/${realPostId}/vote`);
                setNetScore(scoreResponse.data);

                if (currentUser) {
                    const statusResponse = await customAxios.get<string | null>(`community/posts/${realPostId}/vote/status`);
                    if (statusResponse.data) {
                        setUserVoteStatus(statusResponse.data as 'upvote' | 'downvote');
                    } else {
                        setUserVoteStatus(null);
                    }
                }
            } catch (err) {
                console.error(`Błąd głosowania dla posta ${realPostId}`, err);
            }
        };
        fetchVoteStatus();
    }, [realPostId, currentUser]);

    const handleVote = async (e: React.MouseEvent, voteType: 'upvote' | 'downvote') => {
        e.stopPropagation();

        if (!currentUser) {
            alert("Musisz być zalogowany, aby głosować!");
            return;
        }

        try {
            const response = await customAxios.post<number>(`community/posts/${realPostId}/vote?type=${voteType}`);
            setNetScore(response.data);
            setUserVoteStatus(prev => prev === voteType ? null : voteType);
        } catch (err: any) {
            console.error("Błąd głosowania:", err);
            if (err.response?.status === 401) {
                alert("Sesja wygasła.");
            }
        }
    };

    return (
        <div
            onClick={onClick}
            className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 mb-4 border border-gray-200 overflow-hidden"
        >
            <div className="p-4">
                <div className="flex items-start">
                    {thumbnailUrl ? (
                        <div className="mr-4 flex-shrink-0">
                            <img
                                src={thumbnailUrl}
                                alt="Miniatura"
                                className="w-24 h-24 object-cover rounded-md border border-gray-200"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        </div>
                    ) : (
                        <div className="mr-4 flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200 text-gray-400 text-xs text-center p-1">
                            Brak zdjęcia
                        </div>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col justify-between">

                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center overflow-hidden mr-2">
                                <span className={`flex-shrink-0 text-white text-xs font-semibold px-2 py-0.5 rounded-full mr-2 shadow-sm ${getCategoryColor(categoryName)}`}>
                                    {categoryName}
                                </span>
                                <h3 className="text-lg font-bold text-gray-800 truncate">{post.title}</h3>
                            </div>

                            <div className="text-right text-gray-400 text-xs flex-shrink-0">
                                <span className="block">{formatDate(date)}</span>
                                {/*<span className="block text-[10px] mt-0.5">({timeAgo(date)})</span>*/}
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.content}</p>

                        <div className="flex justify-between items-end mt-auto">

                            <div className="flex items-center text-gray-500 text-xs pb-1">
                                <span className="mr-1">Autor:</span>
                                <div className="flex items-center text-gray-700 font-semibold">
                                    <FaUserCircle className="w-3 h-3 mr-1 text-gray-400"/>
                                    {post.authorName || post.user?.username || 'Nieznany'}
                                </div>
                            </div>

                            <div
                                className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 shadow-sm"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={(e) => handleVote(e, 'upvote')}
                                    className={`p-1 hover:scale-110 transition ${userVoteStatus === 'upvote' ? 'text-blue-600' : 'text-gray-400 hover:text-blue-500'}`}
                                >
                                    <FaThumbsUp className="w-4 h-4" />
                                </button>

                                <span className={`font-bold text-sm min-w-[1.5rem] text-center ${netScore > 0 ? 'text-blue-600' : netScore < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                    {netScore}
                                </span>

                                <button
                                    onClick={(e) => handleVote(e, 'downvote')}
                                    className={`p-1 hover:scale-110 transition ${userVoteStatus === 'downvote' ? 'text-red-600' : 'text-gray-400 hover:text-red-500'}`}
                                >
                                    <FaThumbsDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};


function UserPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const navigate = useNavigate();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [errorPosts, setErrorPosts] = useState<string | null>(null);

    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [loadingSaved, setLoadingSaved] = useState(false);
    const [errorSaved, setErrorSaved] = useState<string | null>(null);

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

    // POBIERANIE ZESTAWÓW KOMPUTEROWYCH
    useEffect(() => {
        if (activeTab === "builds" && user?.email) {
            const fetchComputers = async () => {
                try {
                    setLoadingComputers(true);
                    setErrorComputers(null);
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
                                <p className="text-gray-500">Nie stworzyłeś jeszcze żadnych postów.</p>
                            </div>
                        )}

                        {!loadingPosts && !errorPosts && (
                            <PaginatedList
                                items={posts}
                                itemsPerPage={5}
                                renderItem={(post) => (
                                    <PostListItem
                                        key={post.id}
                                        post={post}
                                        onClick={() => handlePostClick(post)}
                                        currentUser={user as unknown as User}
                                    />
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
                                            onClick={() => navigate('/builds')}
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
                                renderItem={(savedItem) => {
                                    const postForList = {
                                        ...savedItem,
                                        id: savedItem.postId || savedItem.id
                                    };

                                    return (
                                        <PostListItem
                                            key={savedItem.id}
                                            post={postForList}
                                            onClick={() => {
                                                const correctPostObject = {
                                                    ...savedItem,
                                                    id: savedItem.postId ?? 0
                                                };
                                                if (correctPostObject.id !== 0) {
                                                    handlePostClick(correctPostObject);
                                                }
                                            }}
                                            currentUser={user as unknown as User}
                                        />
                                    );
                                }}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserPage;