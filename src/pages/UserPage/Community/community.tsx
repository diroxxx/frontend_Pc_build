import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../../atomContext/userAtom.tsx";
import customAxios from "../../../lib/customAxios.tsx";
import PostDetails from "./PostDetails.tsx";
import { FaArrowLeft, FaUserCircle, FaPaperclip, FaTimes } from 'react-icons/fa';
import PaginatedList from "./PaginatedPosts.tsx";
import { parseDateArray, formatDate, timeAgo } from "./PostTime.tsx";
import { getCategoryColor } from "./categoryUtils.tsx";

// --- INTERFEJSY ---

interface User {
    id: number;
    username: string;
    nickname: string;
}

interface PostImageDTO {
    id: number;
    imageUrl: string;
    filename: string;
    mimeType: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    user: User;
    authorName?: string;
    createdAt: number[];
    category?: Category;
    images: PostImageDTO[];
    thumbnailImageId?: number
}

interface Category {
    id: number;
    name: string;
}

const Community: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [filter, setFilter] = useState<"oldest" | "newest">("newest");
    const [isCreatingPost, setIsCreatingPost] = useState(false);

    const [user] = useAtom(userAtom);
    const isAuthenticated = !!user;

    const [selectedFilterCategoryId, setSelectedFilterCategoryId] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const [formLoading, setFormLoading] = useState(true);
    const [postStatus, setPostStatus] = useState<string | null>(null);

    // --- POBIERANIE DANYCH ---
    const fetchPosts = async () => {
        try {
            let endpoint = 'community/';
            if (selectedFilterCategoryId && selectedFilterCategoryId !== 'all') {
                endpoint = `community/categories/id/${selectedFilterCategoryId}`;
            }
            const response = await customAxios.get(endpoint);
            setPosts(response.data);
        } catch (error) {
            console.error("Fetch posts error:", error);
            setPosts([]);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await customAxios.get(`community/categories`);
            setCategories(response.data);
        } catch (err) {
            console.error("Błąd kategorii", err);
        } finally {
            setFormLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, [selectedFilterCategoryId]);

    // --- OBSŁUGA PLIKÓW ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]);
        }
    };

    const removeFile = (indexToRemove: number) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // --- GŁÓWNA FUNKCJA WYSYŁANIA
    const handleCreatePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) return;
        if (!title.trim() || !content.trim() || !categoryId) {
            setPostStatus('Wypełnij wszystkie wymagane pola!');
            return;
        }

        setPostStatus('Tworzenie posta...');

        try {
            const newPostData = {
                title,
                content,
                categoryId: parseInt(categoryId, 10),
            };


            const response = await customAxios.post<Post>(`community/posts`, newPostData);
            const createdPost = response.data;
            const newPostId = createdPost.id;

            // 2. WYSYŁANIE ZDJĘĆ
            if (selectedFiles.length > 0) {
                setPostStatus(`Wysyłanie ${selectedFiles.length} zdjęć...`);


                const uploadPromises = selectedFiles.map(file => {
                    const formData = new FormData();

                    formData.append('file', file);

                    formData.append('postId', newPostId.toString());

                    return customAxios.post('community/posts/upload-image-to-db', formData);
                });

                await Promise.all(uploadPromises);
            }

            setPostStatus('Post opublikowany pomyślnie! 🎉');

            setTimeout(() => {
                setIsCreatingPost(false);
                setPostStatus(null);
                setTitle('');
                setContent('');
                setCategoryId('');
                setSelectedFiles([]);
                fetchPosts();
            }, 1000);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.response?.data || 'Wystąpił błąd.';
            setPostStatus(`Błąd: ${errorMessage}`);
            console.error("Błąd procesu tworzenia:", err);
        }
    };

    const getSortedPosts = () => {
        return [...posts].sort((a, b) => {
            const dateA = parseDateArray(a.createdAt).getTime();
            const dateB = parseDateArray(b.createdAt).getTime();
            return filter === "oldest" ? dateA - dateB : dateB - dateA;
        });
    };

    const handleBackToList = () => {
        setSelectedPost(null);
        fetchPosts();
    };

    if (selectedPost) {
        return <PostDetails post={selectedPost} onBack={handleBackToList} />;
    }

    // --- WIDOK FORMULARZA ---
    if (isCreatingPost) {
        if (!isAuthenticated) return <div className="p-6 text-center text-red-600">Zaloguj się!</div>;
        if (formLoading) return <div className="p-6 text-center">Ładowanie formularza...</div>;

        return (
            <div className="p-6 bg-gray-100 min-h-screen">
                <button
                    className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 flex items-center"
                    onClick={() => {
                        setIsCreatingPost(false);
                        setPostStatus(null);
                        setTitle('');
                        setContent('');
                        setCategoryId('');
                        setSelectedFiles([]);
                    }}
                >
                    <FaArrowLeft className="mr-2"/> Anuluj
                </button>

                <div style={{
                    maxWidth: '600px',
                    margin: '20px auto',
                    padding: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    background: 'white'
                }}>
                    <h2 className="text-2xl font-bold mb-4">Nowy Post</h2>
                    <p className="text-sm text-gray-500 mb-4">Autor: {user?.nickname}</p>

                    <form onSubmit={handleCreatePostSubmit}>
                        <div>
                            <label className="block mt-4 mb-1 font-medium">Tytuł:</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Wpisz tytuł..."
                            />
                        </div>

                        <div>
                            <label className="block mt-4 mb-1 font-medium">Kategoria:</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded bg-white"
                            >
                                <option value="" disabled>Wybierz kategorię</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mt-4 mb-1 font-medium">Treść:</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={6}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="O czym chcesz napisać?"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block mb-2 font-medium">Zdjęcia (max 10):</label>
                            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
                                <FaPaperclip className="mr-2" /> Wybierz pliki
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>

                            {selectedFiles.length > 0 && (
                                <ul className="mt-3 space-y-2">
                                    {selectedFiles.map((file, index) => (
                                        <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded border text-sm">
                                            <span className="truncate max-w-xs">{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <FaTimes />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-6 p-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
                            disabled={!title.trim() || !content.trim() || !categoryId || (postStatus !== null && postStatus.includes('...'))}
                        >
                            {postStatus && postStatus.includes('...') ? (
                                <span>{postStatus}</span>
                            ) : (
                                "Opublikuj Post"
                            )}
                        </button>
                    </form>

                    {postStatus && !postStatus.includes('...') && (
                        <p className={`mt-4 p-3 rounded text-center font-semibold ${postStatus.includes('pomyślnie') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {postStatus}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    const sortedPosts = getSortedPosts();

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Forum Społeczności</h1>

            <div className="flex justify-center items-center mb-6 space-x-4">
                <select
                    className="border border-gray-300 rounded px-4 py-2 shadow-sm"
                    value={selectedFilterCategoryId || 'all'}
                    onChange={(e) => setSelectedFilterCategoryId(e.target.value)}
                >
                    <option value="all">Wszystkie kategorie</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                    ))}
                </select>

                <button
                    className={`px-4 py-2 rounded shadow-md transition duration-150 ${isAuthenticated ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                    onClick={() => isAuthenticated && setIsCreatingPost(true)}
                    disabled={!isAuthenticated}
                >
                    + Utwórz Post
                </button>

                <select
                    className="border border-gray-300 rounded px-4 py-2 shadow-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as "oldest" | "newest")}
                >
                    <option value="newest">Najnowsze</option>
                    <option value="oldest">Najstarsze</option>
                </select>
            </div>

            {posts.length === 0 ? (
                <p className="text-center text-gray-500">Brak postów do wyświetlenia w tej kategorii.</p>
            ) : (
                <PaginatedList
                    items={sortedPosts}
                    itemsPerPage={12}
                    renderItem={(post) => {
                        const date = parseDateArray(post.createdAt);
                        const categoryName = post.category?.name || 'Brak kategorii';


                        const thumbnailUrl = post.thumbnailImageId
                            ? `http://localhost:8080/community/image/${post.thumbnailImageId}`
                            : null;

                        return (
                            <li
                                key={post.id}
                                onClick={() => setSelectedPost(post)}
                                className="cursor-pointer bg-white p-4 rounded shadow-lg hover:shadow-xl transition duration-200 flex justify-between items-start border-l-4 border-blue-500"
                            >
                                <div className="flex flex-1 min-w-0 pr-4">

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

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center mb-2">
                            <span className={`inline-block text-white text-xs font-semibold px-2 py-0.5 rounded-full mr-3 shadow-md ${getCategoryColor(post.category?.name)}`}>
                                {categoryName}
                            </span>
                                            <h3 className="text-xl font-bold text-gray-800 truncate">{post.title}</h3>
                                        </div>
                                        <p className="text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                                        <div className="text-gray-500 text-sm mt-2 flex items-center">
                                            <span className="mr-1">Autor:</span>
                                            <div className="flex items-center text-gray-900 font-bold">
                                                <FaUserCircle className="w-4 h-4 mr-1 text-gray-400"/>
                                                {post.authorName || post.user?.username || 'Nieznany'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-gray-400 text-sm text-right flex-shrink-0 pt-1 pl-2">
                                    <span className="block">{formatDate(date)}</span>
                                    <span className="block text-xs">({timeAgo(date)})</span>
                                </div>
                            </li>
                        );
                    }}
                />
            )}
        </div>
    );
}

export default Community;

