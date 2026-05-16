import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../auth/atoms/userAtom.tsx";
import UserProfile from "./components/UserProfile.tsx";
import customAxios from "../../lib/customAxios.tsx";
import PostDetails from "../Community/PostDetails.tsx";
import PaginatedList from "../Community/PaginatedPosts.tsx";
import { Monitor, Cpu, Banknote, User, ThumbsUp, ThumbsDown, FileText, Bookmark, ExternalLink, ImageOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCategoryColor } from "../Community/categoryUtils.tsx";
import { parseDateArray, formatDate } from "../Community/PostTime.tsx";

interface UserDto {
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
    user: UserDto;
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
    currentUser: UserDto | null;
}

const PostListItem: React.FC<PostListItemProps> = ({ post, onClick, currentUser }) => {
    const realPostId = post.postId && post.postId !== 0 ? post.postId : post.id;
    const [netScore, setNetScore] = useState<number>(0);
    const [userVoteStatus, setUserVoteStatus] = useState<'upvote' | 'downvote' | null>(null);
    const date = parseDateArray(post.createdAt);
    const categoryName = post.categoryName || post.category?.name || 'Brak kategorii';
    const imageIdToUse = post.thumbnailImageId || post.imageId;
    const thumbnailUrl = imageIdToUse ? `http://localhost:8080/community/image/${imageIdToUse}` : null;

    useEffect(() => {
        const fetchVoteStatus = async () => {
            try {
                const scoreResponse = await customAxios.get<number>(`community/posts/${realPostId}/vote`);
                setNetScore(scoreResponse.data);
                if (currentUser) {
                    const statusResponse = await customAxios.get<string | null>(`community/posts/${realPostId}/vote/status`);
                    setUserVoteStatus(statusResponse.data ? (statusResponse.data as 'upvote' | 'downvote') : null);
                }
            } catch (err) {
                console.error(`Błąd głosowania dla posta ${realPostId}`, err);
            }
        };
        fetchVoteStatus();
    }, [realPostId, currentUser]);

    const handleVote = async (e: React.MouseEvent, voteType: 'upvote' | 'downvote') => {
        e.stopPropagation();
        if (!currentUser) { alert("Musisz być zalogowany, aby głosować!"); return; }
        try {
            const response = await customAxios.post<number>(`community/posts/${realPostId}/vote?type=${voteType}`);
            setNetScore(response.data);
            setUserVoteStatus(prev => prev === voteType ? null : voteType);
        } catch (err: any) {
            console.error("Błąd głosowania:", err);
            if (err.response?.status === 401) alert("Sesja wygasła.");
        }
    };

    return (
        <div
            onClick={onClick}
            className="cursor-pointer bg-dark-surface border border-dark-border rounded-xl hover:border-dark-accent/50 hover:bg-dark-surface2 transition-all duration-200 mb-3 overflow-hidden"
        >
            <div className="p-4">
                <div className="flex items-start gap-4">
                    {thumbnailUrl ? (
                        <img
                            src={thumbnailUrl}
                            alt="Miniatura"
                            className="w-20 h-20 object-cover rounded-lg border border-dark-border flex-shrink-0"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-20 h-20 bg-dark-surface2 rounded-lg border border-dark-border flex items-center justify-center flex-shrink-0">
                            <ImageOff size={20} className="text-dark-muted" />
                        </div>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        <div className="flex justify-between items-start gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className={`flex-shrink-0 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full ${getCategoryColor(categoryName)}`}>
                                    {categoryName}
                                </span>
                                <h3 className="text-sm font-bold text-dark-text truncate">{post.title}</h3>
                            </div>
                            <span className="text-[11px] text-dark-muted flex-shrink-0">{formatDate(date)}</span>
                        </div>

                        <p className="text-xs text-dark-muted line-clamp-2">{post.content}</p>

                        <div className="flex justify-between items-center mt-1">
                            <div className="flex items-center gap-1 text-xs text-dark-muted">
                                <User size={11} />
                                <span className="font-medium text-dark-text">{post.authorName || post.user?.username || 'Nieznany'}</span>
                            </div>

                            <div
                                className="flex items-center gap-2 bg-dark-surface2 border border-dark-border px-2.5 py-1 rounded-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={(e) => handleVote(e, 'upvote')}
                                    className={`transition-colors ${userVoteStatus === 'upvote' ? 'text-blue-400' : 'text-dark-muted hover:text-blue-400'}`}
                                >
                                    <ThumbsUp size={13} />
                                </button>
                                <span className={`text-xs font-bold min-w-[1rem] text-center ${netScore > 0 ? 'text-blue-400' : netScore < 0 ? 'text-red-400' : 'text-dark-muted'}`}>
                                    {netScore}
                                </span>
                                <button
                                    onClick={(e) => handleVote(e, 'downvote')}
                                    className={`transition-colors ${userVoteStatus === 'downvote' ? 'text-red-400' : 'text-dark-muted hover:text-red-400'}`}
                                >
                                    <ThumbsDown size={13} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TABS = [
    { key: "profile", label: "Mój Profil",      icon: User },
    { key: "posts",   label: "Moje Posty",       icon: FileText },
    { key: "builds",  label: "Moje Zestawy",     icon: Monitor },
    { key: "saved",   label: "Zapisane Posty",   icon: Bookmark },
] as const;

function UserPage() {
    const [activeTab, setActiveTab] = useState<string>("profile");
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

    useEffect(() => {
        if (activeTab === "posts" && user?.nickname) {
            setLoadingPosts(true);
            setErrorPosts(null);
            customAxios.get(`community/posts/user/${user.nickname}`)
                .then((res) => {
                    const data = Array.isArray(res.data) ? res.data : [];
                    setPosts(data.map((p: any) => ({ ...p, user: p.user || { username: user.nickname } })));
                })
                .catch((err) => setErrorPosts(err.message || "Błąd ładowania postów"))
                .finally(() => setLoadingPosts(false));
        }
    }, [activeTab, user?.nickname]);

    useEffect(() => {
        if (activeTab === "builds" && user?.email) {
            setLoadingComputers(true);
            setErrorComputers(null);
            customAxios.get(`api/users/${user.email}/computers`)
                .then((res) => setComputers(res.data))
                .catch(() => setErrorComputers("Nie udało się pobrać konfiguracji PC."))
                .finally(() => setLoadingComputers(false));
        }
    }, [activeTab, user?.email]);

    useEffect(() => {
        if (activeTab === "saved" && user?.nickname) {
            setLoadingSaved(true);
            setErrorSaved(null);
            customAxios.get(`community/posts/saved/${user.nickname}`)
                .then((res) => {
                    const data = Array.isArray(res.data) ? res.data : [];
                    setSavedPosts(data.map((item: any) => ({ ...item, user: { id: 0, username: item.authorName || "Nieznany autor" } })));
                })
                .catch((err) => setErrorSaved(err.message || "Błąd ładowania zapisanych postów"))
                .finally(() => setLoadingSaved(false));
        }
    }, [activeTab, user?.nickname]);

    if (selectedPost) {
        return (
            <div className="bg-dark-bg py-4">
                <PostDetails post={selectedPost} onBack={() => setSelectedPost(null)} />
            </div>
        );
    }

    return (
        <div className="bg-dark-bg">
            <div className="max-w-3xl mx-auto py-8 px-4">

                {/* Tab bar */}
                <div className="flex justify-center mb-8">
                    <div className="bg-dark-surface border border-dark-border rounded-xl p-1 flex gap-1">
                        {TABS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    activeTab === key
                                        ? "bg-dark-surface2 text-dark-text shadow-sm"
                                        : "text-dark-muted hover:text-dark-text"
                                }`}
                            >
                                <Icon size={14} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Profile tab */}
                {activeTab === "profile" && <UserProfile />}

                {/* Posts tab */}
                {activeTab === "posts" && (
                    <div>
                        <h3 className="text-base font-bold text-dark-text mb-4">Moje Posty</h3>

                        {loadingPosts && (
                            <div className="space-y-3">
                                {[1,2,3].map(i => <div key={i} className="h-24 bg-dark-surface rounded-xl animate-pulse border border-dark-border" />)}
                            </div>
                        )}
                        {errorPosts && <p className="text-red-400 text-sm text-center py-6">{errorPosts}</p>}

                        {!loadingPosts && !errorPosts && posts.length === 0 && (
                            <div className="text-center py-12 bg-dark-surface border border-dark-border rounded-xl">
                                <FileText size={36} className="mx-auto text-dark-muted mb-3" />
                                <p className="text-dark-muted text-sm">Nie stworzyłeś jeszcze żadnych postów.</p>
                            </div>
                        )}

                        {!loadingPosts && !errorPosts && posts.length > 0 && (
                            <PaginatedList
                                items={posts}
                                itemsPerPage={5}
                                renderItem={(post) => (
                                    <PostListItem
                                        key={post.id}
                                        post={post}
                                        onClick={() => setSelectedPost(post)}
                                        currentUser={user as unknown as UserDto}
                                    />
                                )}
                            />
                        )}
                    </div>
                )}

                {/* Builds tab */}
                {activeTab === "builds" && (
                    <div>
                        <h3 className="text-base font-bold text-dark-text mb-4">Moje Konfiguracje PC</h3>

                        {loadingComputers && (
                            <div className="space-y-3">
                                {[1,2].map(i => <div key={i} className="h-20 bg-dark-surface rounded-xl animate-pulse border border-dark-border" />)}
                            </div>
                        )}
                        {errorComputers && <p className="text-red-400 text-sm text-center py-6">{errorComputers}</p>}

                        {!loadingComputers && !errorComputers && computers.length === 0 && (
                            <div className="text-center py-12 bg-dark-surface border border-dark-border rounded-xl">
                                <Monitor size={36} className="mx-auto text-dark-muted mb-3" />
                                <p className="text-dark-muted text-sm">Nie stworzyłeś jeszcze żadnych zestawów.</p>
                            </div>
                        )}

                        {!loadingComputers && !errorComputers && computers.length > 0 && (
                            <div className="space-y-3">
                                {computers.map((comp) => (
                                    <div
                                        key={comp.id}
                                        className="bg-dark-surface border border-dark-border rounded-xl px-5 py-4 hover:border-dark-accent/50 hover:bg-dark-surface2 transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Monitor size={16} className="text-dark-muted" />
                                                <h4 className="text-sm font-bold text-dark-text">{comp.name}</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-xs text-dark-muted">
                                                <span className="flex items-center gap-1.5">
                                                    <Cpu size={12} />
                                                    {comp.offers ? comp.offers.length : 0} komponentów
                                                </span>
                                                <span className="flex items-center gap-1.5 text-dark-accent font-semibold">
                                                    <Banknote size={12} />
                                                    {comp.offers
                                                        ? comp.offers.reduce((sum: number, p: any) => sum + (p.price || 0), 0).toLocaleString("pl-PL")
                                                        : "0"} zł
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            className="flex items-center gap-1.5 px-4 py-2 bg-dark-accent/15 text-dark-accent hover:bg-dark-accent hover:text-white border border-dark-accent/20 hover:border-dark-accent rounded-lg transition-all text-xs font-semibold flex-shrink-0"
                                            onClick={() => navigate('/builds')}
                                        >
                                            <ExternalLink size={13} />
                                            Zobacz szczegóły
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Saved posts tab */}
                {activeTab === "saved" && (
                    <div>
                        <h3 className="text-base font-bold text-dark-text mb-4">Zapisane Posty</h3>

                        {loadingSaved && (
                            <div className="space-y-3">
                                {[1,2,3].map(i => <div key={i} className="h-24 bg-dark-surface rounded-xl animate-pulse border border-dark-border" />)}
                            </div>
                        )}
                        {errorSaved && <p className="text-red-400 text-sm text-center py-6">{errorSaved}</p>}

                        {!loadingSaved && !errorSaved && savedPosts.length === 0 && (
                            <div className="text-center py-12 bg-dark-surface border border-dark-border rounded-xl">
                                <Bookmark size={36} className="mx-auto text-dark-muted mb-3" />
                                <p className="text-dark-muted text-sm">Nie masz jeszcze żadnych zapisanych postów.</p>
                            </div>
                        )}

                        {!loadingSaved && !errorSaved && savedPosts.length > 0 && (
                            <PaginatedList
                                items={savedPosts}
                                itemsPerPage={5}
                                renderItem={(savedItem) => {
                                    const postForList = { ...savedItem, id: savedItem.postId || savedItem.id };
                                    return (
                                        <PostListItem
                                            key={savedItem.id}
                                            post={postForList}
                                            onClick={() => {
                                                const correctPost = { ...savedItem, id: savedItem.postId ?? 0 };
                                                if (correctPost.id !== 0) setSelectedPost(correctPost);
                                            }}
                                            currentUser={user as unknown as UserDto}
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
