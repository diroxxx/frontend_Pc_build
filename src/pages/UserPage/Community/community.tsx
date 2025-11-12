import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../../atomContext/userAtom.tsx";
import customAxios from "../../../lib/customAxios.tsx";


interface User {
    id: number; // ⬅
    username: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    user: User;
    createdAt: number[];
}

interface Category {
    id: number;
    name: string;
}

const AUTH_TOKEN_KEY = 'auth_token';

const parseDateArray = (dateArray: number[] | undefined) => {
    if (!dateArray || dateArray.length < 6) return new Date();
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second);
};

const formatDate = (date: Date) => {
    return date.toLocaleString("pl-PL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const timeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "przed chwilą";
    if (diffMinutes < 60) return `${diffMinutes} min. temu`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} godz. temu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} dni temu`;

    return date.toLocaleDateString("pl-PL");
};



const Community: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [filter, setFilter] = useState<"oldest" | "newest">("newest");
    const [isCreatingPost, setIsCreatingPost] = useState(false);


    const [user] = useAtom(userAtom);
    const isAuthenticated = !!user;
    const [selectedFilterCategoryId, setSelectedFilterCategoryId] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [formLoading, setFormLoading] = useState(true);
    const [formError, setFormError] = useState<string | null>(null);
    const [postStatus, setPostStatus] = useState<string | null>(null);

    // const fetchPosts = async () => {
    //     try {
    //         let url = `community/posts`;
    //
    //         // ⬅️ KRYTYCZNA ZMIANA: Dodanie parametru zapytania (query parameter)
    //         // Jeśli wybrana jest kategoria (i nie jest to 'wszystkie'), dodaj parametr
    //         if (selectedFilterCategoryId && selectedFilterCategoryId !== 'all') {
    //             url = `community/posts?categoryId=${selectedFilterCategoryId}`;
    //         }
    //
    //         const response = await customAxios.get(url);
    //         setPosts(response.data);
    //     } catch (error) {
    //         console.error("Fetch posts error:", error);
    //     }
    // };
    const fetchPosts = async () => {
        try {
            const response = await customAxios.get(`community/`);
            setPosts(response.data);
        } catch (error) {
            console.error("Fetch posts error:", error);
        }
    };


    // const fetchCategories = async () => {
    //     try {
    //         // ⬅️ Użycie customAxios.get
    //         const response = await customAxios.get(`community/categories`);
    //         setCategories(response.data as Category[]); // Axios zwraca dane w response.data
    //     } catch (err) {
    //         setFormError('Nie udało się załadować kategorii. Sprawdź połączenie z backendem.');
    //         console.error("Błąd pobierania kategorii:", err);
    //     } finally {
    //         setFormLoading(false);
    //     }
    // };
    const fetchCategories = async () => {
        try {
            const response = await customAxios.get(`community/categories`);
            const data: Category[] = response.data;

            setCategories(data);

            // ⬅️ KRYTYCZNA NAPRAWA: Ustawienie pierwszej kategorii jako domyślnej
            if (data.length > 0) {
                // Zakładamy, że kategoria "Buildy użytkowników" jest pierwszą,
                // lub że chcemy użyć pierwszej znalezionej

                // Jeśli chcesz konkretną kategorię po nazwie (MUSISZ UŻYĆ ID):
                const defaultCategory = data.find(cat => cat.name === 'Buildy użytkowników');

                if (defaultCategory) {
                    setCategoryId(defaultCategory.id.toString()); // Ustaw ID znalezionej
                } else {
                    setCategoryId(data[0].id.toString()); // Ustaw ID pierwszej kategorii, jeśli Buildów nie znaleziono
                }
            }

        } catch (err) {
            setFormError('Nie udało się załadować kategorii. Sprawdź połączenie z backendem.');
            console.error("Błąd pobierania kategorii:", err);
        } finally {
            setFormLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, [selectedFilterCategoryId]);

    const getSortedPosts = () => {
        return [...posts].sort((a, b) => {
            const dateA = parseDateArray(a.createdAt).getTime();
            const dateB = parseDateArray(b.createdAt).getTime();
            return filter === "oldest" ? dateA - dateB : dateB - dateA;
        });
    };

    const handleCreatePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ⬅️ Nie potrzebujemy ręcznie pobierać tokena, bo customAxios to robi.
        // Wystarczy weryfikacja logiki frontendu.
        if (!isAuthenticated) {
            setPostStatus('Błąd: Musisz być zalogowany.');
            return;
        }

        setPostStatus('Wysyłanie...');

        if (!title.trim() || !content.trim() || !categoryId) {
            setPostStatus('Wypełnij wszystkie wymagane pola!');
            return;
        }

        const newPostData = {
            title,
            content,
            categoryId: parseInt(categoryId, 10),
        };

        try {
            // ⬅️ KLUCZOWA ZMIANA: PRAWIDŁOWE UŻYCIE customAxios.post(URL, DANE)
            const response = await customAxios.post(`community/posts`, newPostData);

            // Axios rzuca wyjątek dla statusów 4xx/5xx, więc jeśli tu dotarliśmy, to sukces.
            setPostStatus(`Sukces! Post został utworzony.`);

            setTitle('');
            setContent('');
            setTimeout(() => {
                setIsCreatingPost(false);
                setPostStatus(null);
                fetchPosts();
            }, 1000);

        } catch (err: any) {
            // ⬅️ OBSŁUGA BŁĘDU AXIOS
            // Błędy są łapane tutaj, w tym błędy 401/403 (przetworzone przez interceptor)
            const errorMessage = err.response?.data?.message
                || err.response?.data?.error
                || err.message
                || 'Wystąpił nieznany błąd podczas tworzenia posta.';

            setPostStatus(`Błąd: ${errorMessage}`);
            console.error("Błąd tworzenia posta:", err);
        }
    };

    if (isCreatingPost) {
        if (!isAuthenticated) return <div className="p-6 text-center text-red-600">Musisz być zalogowany, aby tworzyć posty!</div>;
        if (formLoading) return <div className="p-6 text-center">Ładowanie formularza...</div>;
        if (formError) return <div className="p-6 text-center text-red-600">Błąd: {formError}</div>;

        return (
            <div className="p-6 bg-gray-100 min-h-screen">
                <button
                    className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => {
                        setIsCreatingPost(false);
                        setPostStatus(null);
                    }}
                >
                    ← Wróć do listy postów
                </button>

                <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: 'white' }}>
                    <h2>Utwórz Nowy Post 📝</h2>

                    {/* ⬅️ Wyświetlanie nazwy użytkownika */}
                    <p className="text-sm text-gray-500 mb-4">
                        Tworzysz jako: **{user?.nickname || 'Niezalogowany'}**
                    </p>

                    <form onSubmit={handleCreatePostSubmit}>

                        {/* Pole Tytułu */}
                        <div>
                            <label htmlFor="title" className="block mt-4 mb-1 font-medium">Tytuł:</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        {/* Pole Kategori */}
                        <div>
                            <label htmlFor="category" className="block mt-4 mb-1 font-medium">Kategoria:</label>
                            <select
                                id="category"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Pole Treści */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Treść:</label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={6}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 p-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
                            disabled={!title.trim() || !content.trim() || !categoryId}
                        >
                            Opublikuj Post
                        </button>
                    </form>

                    {postStatus && (
                        <p className={`mt-4 p-3 rounded text-center font-semibold ${postStatus.includes('Sukces') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {postStatus}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // --- WIDOK LISTY POSTÓW I KONTROLKI ---

    const sortedPosts = getSortedPosts();


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Forum Społeczności 💻</h1>

            <div className="flex justify-center items-center mb-6 space-x-4">
                <select
                    className="border border-gray-300 rounded px-4 py-2 shadow-sm"
                    value={selectedFilterCategoryId || 'all'}
                    onChange={(e) => setSelectedFilterCategoryId(e.target.value)}
                >
                    <option value="all">Wszystkie kategorie</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <button
                    className={`px-4 py-2 rounded shadow-md transition duration-150 ${isAuthenticated ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                    onClick={() => isAuthenticated && setIsCreatingPost(true)}
                    disabled={!isAuthenticated}
                    title={isAuthenticated ? "Utwórz nowy post" : "Zaloguj się, aby tworzyć posty"}
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

            {/*/!* Lista postów *!/*/}
            {/*<ul className="space-y-4">*/}
            {/*    {posts.length === 0 ? (*/}
            {/*        <p className="text-center text-gray-500">Brak postów do wyświetlenia.</p>*/}
            {/*    ) : (*/}
            {/*        sortedPosts.map((post) => {*/}
            {/*            const date = parseDateArray(post.createdAt);*/}
            {/*            return (*/}
            {/*                <li*/}
            {/*                    key={post.id}*/}
            {/*                    onClick={() => setSelectedPost(post)}*/}
            {/*                    className="cursor-pointer bg-white p-4 rounded shadow-lg hover:shadow-xl transition duration-200 flex justify-between items-start border-l-4 border-blue-500"*/}
            {/*                >*/}
            {/*                    <div className="flex-1 min-w-0 pr-4">*/}
            {/*                        <h3 className="text-xl font-bold text-gray-800 truncate">{post.title}</h3>*/}
            {/*                        <p className="text-gray-600 mt-1">*/}
            {/*                            {post.content.substring(0, 100)}*/}
            {/*                            {post.content.length > 100 ? '...' : ''}*/}
            {/*                        </p>*/}
            {/*                        <p className="text-gray-500 text-sm mt-2">*/}
            {/*                            Autor: **{post.user.username}***/}
            {/*                        </p>*/}
            {/*                    </div>*/}
            {/*                    <div className="text-gray-400 text-sm text-right flex-shrink-0 pt-1">*/}
            {/*                        <span className="block">{formatDate(date)}</span>*/}
            {/*                        <span className="block text-xs">({timeAgo(date)})</span>*/}
            {/*                    </div>*/}
            {/*                </li>*/}
            {/*            );*/}
            {/*        })*/}
            {/*    )}*/}
            {/*</ul>*/}
            <ul className="space-y-4">
                {posts.length === 0 ? (
                    <p className="text-center text-gray-500">Brak postów do wyświetlenia.</p>
                ) : (
                    sortedPosts.map((post) => {
                        const date = parseDateArray(post.createdAt);

                        // 💡 WERYFIKACJA: Sprawdzamy, czy kategoria istnieje i pobieramy jej nazwę
                        const categoryName = post.category?.name || 'Brak kategorii';

                        return (
                            <li
                                key={post.id}
                                onClick={() => setSelectedPost(post)}
                                className="cursor-pointer bg-white p-4 rounded shadow-lg hover:shadow-xl transition duration-200 flex justify-between items-start border-l-4 border-blue-500"
                            >
                                <div className="flex-1 min-w-0 pr-4">

                                    {/* ⬅️ ZMIANA: Dodanie kategorii obok tytułu */}
                                    <h3 className="text-xl font-bold text-gray-800 truncate">
                                        [{categoryName}] {post.title}
                                    </h3>

                                    <p className="text-gray-600 mt-1">
                                        {post.content.substring(0, 100)}
                                        {post.content.length > 100 ? '...' : ''}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Autor: **{post.user.username}**
                                    </p>
                                </div>
                                <div className="text-gray-400 text-sm text-right flex-shrink-0 pt-1">
                                    <span className="block">{formatDate(date)}</span>
                                    <span className="block text-xs">({timeAgo(date)})</span>
                                </div>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
};

export default Community;