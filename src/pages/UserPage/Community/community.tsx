// import React, { useEffect, useState } from "react";
//
//
// interface User {
//     id: number;
//     username: string;
// }
//
// interface Post {
//     id: number;
//     title: string;
//     content: string;
//     user: User;
//     createdAt: number[];
// }
//
//
// interface Category {
//     id: number;
//     name: string;
// }
//
// const API_BASE_URL = 'http://localhost:8080/community';
// const TEST_USER_ID = 1; // Id użytkownika na potrzeby testów
//
// // Funkcje pomocnicze do obsługi dat
// const parseDateArray = (dateArray: number[] | undefined) => {
//     if (!dateArray || dateArray.length < 6) return new Date();
//     const [year, month, day, hour, minute, second] = dateArray;
//     return new Date(year, month - 1, day, hour, minute, second);
// };
//
// const formatDate = (date: Date) => {
//     return date.toLocaleString("pl-PL", {
//         day: "2-digit",
//         month: "long",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//     });
// };
//
// const timeAgo = (date: Date) => {
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMinutes = Math.floor(diffMs / 60000);
//
//     if (diffMinutes < 1) return "przed chwilą";
//     if (diffMinutes < 60) return `${diffMinutes} min. temu`;
//     const diffHours = Math.floor(diffMinutes / 60);
//     if (diffHours < 24) return `${diffHours} godz. temu`;
//     const diffDays = Math.floor(diffHours / 24);
//     if (diffDays < 30) return `${diffDays} dni temu`;
//
//     return date.toLocaleDateString("pl-PL");
// };
//
// // --- GŁÓWNY KOMPONENT COMMUNITY ---
//
// const Community: React.FC = () => {
//     const [posts, setPosts] = useState<Post[]>([]);
//     const [selectedPost, setSelectedPost] = useState<Post | null>(null);
//     const [filter, setFilter] = useState<"oldest" | "newest">("newest");
//     const [isCreatingPost, setIsCreatingPost] = useState(false);
//
//     // Stan do formularza tworzenia postu
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//     const [categoryId, setCategoryId] = useState('');
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [formLoading, setFormLoading] = useState(true);
//     const [formError, setFormError] = useState<string | null>(null);
//     const [postStatus, setPostStatus] = useState<string | null>(null);
//
//
//     // 1. Funkcja do pobierania postów
//     const fetchPosts = async () => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/posts`);
//             if (!response.ok) {
//                 throw new Error("Błąd podczas pobierania postów");
//             }
//             const data = await response.json();
//             setPosts(data);
//         } catch (error) {
//             console.error("Fetch posts error:", error);
//         }
//     };
//
//     // 2. Funkcja do pobierania kategorii (dla formularza)
//     const fetchCategories = async () => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/categories`);
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const data: Category[] = await response.json();
//             setCategories(data);
//             if (data.length > 0) {
//                 setCategoryId(data[0].id.toString());
//             }
//         } catch (err) {
//             setFormError('Nie udało się załadować kategorii. Sprawdź połączenie z backendem.');
//             console.error("Błąd pobierania kategorii:", err);
//         } finally {
//             setFormLoading(false);
//         }
//     };
//
//     // 3. Ładowanie danych przy pierwszym renderowaniu
//     useEffect(() => {
//         fetchPosts();
//         fetchCategories(); // Pobieramy kategorie, aby były gotowe
//     }, []);
//
//     // 4. Funkcja do sortowania postów
//     const getSortedPosts = () => {
//         return [...posts].sort((a, b) => {
//             const dateA = parseDateArray(a.createdAt).getTime();
//             const dateB = parseDateArray(b.createdAt).getTime();
//             return filter === "oldest" ? dateA - dateB : dateB - dateA;
//         });
//     };
//
//     // 5. Funkcja obsługująca wysłanie formularza (LOGIKA FORMULARZA)
//     const handleCreatePostSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setPostStatus('Wysyłanie...');
//
//         if (!title.trim() || !content.trim() || !categoryId) {
//             setPostStatus('Wypełnij wszystkie wymagane pola!');
//             return;
//         }
//
//         const newPostData = {
//             title,
//             content,
//             userId: TEST_USER_ID,
//             categoryId: parseInt(categoryId, 10),
//         };
//
//         try {
//             const response = await fetch(`${API_BASE_URL}/posts`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(newPostData),
//             });
//
//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({ message: 'Błąd po stronie serwera' }));
//                 throw new Error(errorData.message || `Wystąpił błąd: ${response.status}`);
//             }
//
//             setPostStatus(`Sukces! Post został utworzony.`);
//
//             // Resetowanie formularza
//             setTitle('');
//             setContent('');
//
//             // Wróć do widoku listy i odśwież ją
//             setTimeout(() => {
//                 setIsCreatingPost(false);
//                 setPostStatus(null);
//                 fetchPosts();
//             }, 1000);
//
//         } catch (err) {
//             setPostStatus(`Błąd: ${(err as Error).message || 'Nie udało się połączyć z API.'}`);
//             console.error("Błąd tworzenia posta:", err);
//         }
//     };
//
//     // --- WIDOK TWORZENIA NOWEGO POSTA ---
//     if (isCreatingPost) {
//         if (formLoading) return <div className="p-6 text-center">Ładowanie formularza...</div>;
//         if (formError) return <div className="p-6 text-center text-red-600">Błąd: {formError}</div>;
//
//         return (
//             <div className="p-6 bg-gray-100 min-h-screen">
//                 <button
//                     className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                     onClick={() => {
//                         setIsCreatingPost(false); // Wróć do listy
//                         setPostStatus(null); // Reset statusu
//                     }}
//                 >
//                     ← Wróć do listy postów
//                 </button>
//
//                 <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: 'white' }}>
//                     <h2>Utwórz Nowy Post 📝</h2>
//                     <form onSubmit={handleCreatePostSubmit}>
//
//                         {/* Pole Tytułu */}
//                         <div>
//                             <label htmlFor="title" className="block mt-4 mb-1 font-medium">Tytuł:</label>
//                             <input
//                                 type="text"
//                                 id="title"
//                                 value={title}
//                                 onChange={(e) => setTitle(e.target.value)}
//                                 required
//                                 className="w-full p-2 border border-gray-300 rounded"
//                             />
//                         </div>
//
//                         {/* Pole Kategori */}
//                         <div>
//                             <label htmlFor="category" className="block mt-4 mb-1 font-medium">Kategoria:</label>
//                             <select
//                                 id="category"
//                                 value={categoryId}
//                                 onChange={(e) => setCategoryId(e.target.value)}
//                                 required
//                                 className="w-full p-2 border border-gray-300 rounded"
//                             >
//                                 {categories.map((cat) => (
//                                     <option key={cat.id} value={cat.id}>
//                                         {cat.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//
//                         {/* Pole Treści */}
//                         <div>
//                             <label htmlFor="content" className="block mt-4 mb-1 font-medium">Treść:</label>
//                             <textarea
//                                 id="content"
//                                 value={content}
//                                 onChange={(e) => setContent(e.target.value)}
//                                 required
//                                 rows={6}
//                                 className="w-full p-2 border border-gray-300 rounded"
//                             />
//                         </div>
//
//                         <input type="hidden" value={TEST_USER_ID} />
//
//                         {/* Przycisk Submit */}
//                         <button
//                             type="submit"
//                             className="w-full mt-4 p-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
//                             disabled={!title.trim() || !content.trim() || !categoryId}
//                         >
//                             Opublikuj Post
//                         </button>
//                     </form>
//
//                     {/* Status Wysyłki */}
//                     {postStatus && (
//                         <p className={`mt-4 p-3 rounded text-center font-semibold ${postStatus.includes('Sukces') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                             {postStatus}
//                         </p>
//                     )}
//                 </div>
//             </div>
//         );
//     }
//
//     // --- WIDOK POJEDYNCZEGO POSTA ---
//     if (selectedPost) {
//         const date = parseDateArray(selectedPost.createdAt);
//         return (
//             <div className="p-6 bg-gray-100 min-h-screen">
//                 <button
//                     className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                     onClick={() => setSelectedPost(null)}
//                 >
//                     ← Wróć do listy
//                 </button>
//                 <div className="bg-white p-6 rounded shadow">
//                     <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
//                     <p className="text-gray-500 text-sm mb-4">
//                         Autor: **{selectedPost.user.username}** |{" "}
//                         {formatDate(date)} ({timeAgo(date)})
//                     </p>
//                     <p className="text-gray-700 whitespace-pre-line">{selectedPost.content}</p>
//                 </div>
//             </div>
//         );
//     }
//
//     // --- WIDOK LISTY POSTÓW ---
//     const sortedPosts = getSortedPosts();
//
//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Forum Społeczności 💻</h1>
//
//             <div className="flex justify-center items-center mb-6 space-x-4">
//                 <input
//                     type="text"
//                     placeholder="Szukaj..."
//                     className="border border-gray-300 rounded px-4 py-2 w-1/3 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 />
//
//                 <button
//                     className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition duration-150"
//                     onClick={() => setIsCreatingPost(true)}
//                 >
//                     + Utwórz Post
//                 </button>
//
//                 <select
//                     className="border border-gray-300 rounded px-4 py-2 shadow-sm"
//                     value={filter}
//                     onChange={(e) => setFilter(e.target.value as "oldest" | "newest")}
//                 >
//                     <option value="newest">Najnowsze</option>
//                     <option value="oldest">Najstarsze</option>
//                 </select>
//             </div>
//
//             {/* Lista postów */}
//             <ul className="space-y-4">
//                 {posts.length === 0 ? (
//                     <p className="text-center text-gray-500">Brak postów do wyświetlenia.</p>
//                 ) : (
//                     sortedPosts.map((post) => {
//                         const date = parseDateArray(post.createdAt);
//                         return (
//                             <li
//                                 key={post.id}
//                                 onClick={() => setSelectedPost(post)}
//                                 className="cursor-pointer bg-white p-4 rounded shadow-lg hover:shadow-xl transition duration-200 flex justify-between items-start border-l-4 border-blue-500"
//                             >
//                                 <div className="flex-1 min-w-0 pr-4">
//                                     <h3 className="text-xl font-bold text-gray-800 truncate">{post.title}</h3>
//                                     <p className="text-gray-600 mt-1">
//                                         {post.content.substring(0, 100)}
//                                         {post.content.length > 100 ? '...' : ''}
//                                     </p>
//                                     <p className="text-gray-500 text-sm mt-2">
//                                         Autor: **{post.user.username}**
//                                     </p>
//                                 </div>
//                                 <div className="text-gray-400 text-sm text-right flex-shrink-0 pt-1">
//                                     <span className="block">{formatDate(date)}</span>
//                                     <span className="block text-xs">({timeAgo(date)})</span>
//                                 </div>
//                             </li>
//                         );
//                     })
//                 )}
//             </ul>
//         </div>
//     );
// };
//
// export default Community;

import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode'; // Pamiętaj o instalacji: npm install jwt-decode

// --- INTERFEJSY I FUNKCJE POMOCNICZE ---

interface User {
    id: number;
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

const API_BASE_URL = 'http://localhost:8080/community';

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

// --- HOOK UWIERZYTELNIANIA (Zastępuje TEST_USER_ID) ---

const useAuth = () => {
    const token = localStorage.getItem('auth_token');
    let userId = null;

    if (token) {
        try {
            const decodedToken: any = jwtDecode(token);
            const rawId = decodedToken.id || decodedToken.sub;

            if (rawId) {
                userId = parseInt(rawId);
            }

        } catch (error) {
            console.error("Token jest nieprawidłowy lub wygasł.");
        }
    }
    return { token, userId };
};

// --- GŁÓWNY KOMPONENT COMMUNITY ---

const Community: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [filter, setFilter] = useState<"oldest" | "newest">("newest");
    const [isCreatingPost, setIsCreatingPost] = useState(false);

    // ⬅️ UŻYCIE HOOKA AUTH
    const { token, userId } = useAuth();

    // Stan do formularza tworzenia postu
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [formLoading, setFormLoading] = useState(true);
    const [formError, setFormError] = useState<string | null>(null);
    const [postStatus, setPostStatus] = useState<string | null>(null);


    // --- FUNKCJE POBIERANIA DANYCH ---

    const fetchPosts = async () => {
        // ... (Logika pobierania postów) ...
        try {
            const response = await fetch(`${API_BASE_URL}/posts`);
            if (!response.ok) throw new Error("Błąd podczas pobierania postów");
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Fetch posts error:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data: Category[] = await response.json();
            setCategories(data);
            if (data.length > 0) setCategoryId(data[0].id.toString());
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
    }, []);

    const getSortedPosts = () => {
        return [...posts].sort((a, b) => {
            const dateA = parseDateArray(a.createdAt).getTime();
            const dateB = parseDateArray(b.createdAt).getTime();
            return filter === "oldest" ? dateA - dateB : dateB - dateA;
        });
    };

    // --- ZMODYFIKOWANA FUNKCJA WYSYŁANIA POSTA Z AUTORYZACJĄ JWT ---
    const handleCreatePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ⬅️ WERYFIKACJA: Czy jest token?
        if (!token || !userId) {
            setPostStatus('Błąd: Musisz być zalogowany, aby dodać post.');
            return;
        }

        setPostStatus('Wysyłanie...');

        if (!title.trim() || !content.trim() || !categoryId) {
            setPostStatus('Wypełnij wszystkie wymagane pola!');
            return;
        }

        // ⬅️ DTO BEZ userId: Backend pobierze ID z tokena
        const newPostData = {
            title,
            content,
            categoryId: parseInt(categoryId, 10),
        };

        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // ⬅️ DODANIE TOKENA JWT
                },
                body: JSON.stringify(newPostData),
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error("Brak autoryzacji. Twoja sesja mogła wygasnąć.");
                }
                const errorData = await response.json().catch(() => ({ message: 'Błąd po stronie serwera' }));
                throw new Error(errorData.message || `Wystąpił błąd: ${response.status}`);
            }

            setPostStatus(`Sukces! Post został utworzony.`);

            setTitle('');
            setContent('');
            setTimeout(() => {
                setIsCreatingPost(false);
                setPostStatus(null);
                fetchPosts();
            }, 1000);

        } catch (err) {
            setPostStatus(`Błąd: ${(err as Error).message || 'Nie udało się połączyć z API.'}`);
            console.error("Błąd tworzenia posta:", err);
        }
    };

    // --- WIDOK TWORZENIA NOWEGO POSTA ---
    if (isCreatingPost) {
        if (!token) return <div className="p-6 text-center text-red-600">Musisz być zalogowany, aby tworzyć posty!</div>;
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
                    <p className="text-sm text-gray-500 mb-4">Tworzysz jako User ID: **{userId || 'Niezalogowany'}**</p>
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
                            <label htmlFor="content" className="block mt-4 mb-1 font-medium">Treść:</label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={6}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        {/* Pole User ID (ukryte) - usunięto stałą TEST_USER_ID, zostaje dynamiczny userId dla informacji */}
                        <input type="hidden" value={userId || ''} />

                        {/* Przycisk Submit */}
                        <button
                            type="submit"
                            className="w-full mt-4 p-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
                            disabled={!title.trim() || !content.trim() || !categoryId}
                        >
                            Opublikuj Post
                        </button>
                    </form>

                    {/* Status Wysyłki */}
                    {postStatus && (
                        <p className={`mt-4 p-3 rounded text-center font-semibold ${postStatus.includes('Sukces') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {postStatus}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // --- WIDOK POJEDYNCZEGO POSTA I LISTY (BEZ ZMIAN) ---
    if (selectedPost) {
        const date = parseDateArray(selectedPost.createdAt);
        return (
            <div className="p-6 bg-gray-100 min-h-screen">
                {/* ... (logika wyświetlania pojedynczego posta) ... */}
                <button
                    className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setSelectedPost(null)}
                >
                    ← Wróć do listy
                </button>
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
                    <p className="text-gray-500 text-sm mb-4">
                        Autor: **{selectedPost.user.username}** |{" "}
                        {formatDate(date)} ({timeAgo(date)})
                    </p>
                    <p className="text-gray-700 whitespace-pre-line">{selectedPost.content}</p>
                </div>
            </div>
        );
    }

    const sortedPosts = getSortedPosts();

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Forum Społeczności 💻</h1>

            <div className="flex justify-center items-center mb-6 space-x-4">
                {/*<input*/}
                {/*    type="text"*/}
                {/*    placeholder="Szukaj..."*/}
                {/*    className="border border-gray-300 rounded px-4 py-2 w-1/3 shadow-sm focus:ring-blue-500 focus:border-blue-500"*/}
                {/*/>*/}

                {/* ⬅️ Przycisk tworzenia: warunkowo włączony */}
                {/*<button*/}
                {/*    className={`px-4 py-2 rounded shadow-md transition duration-150 ${userId ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}*/}
                {/*    // onClick={() => userId && setIsCreatingPost(true)}*/}
                {/*    // disabled={!userId}*/}
                {/*    // title={userId ? "Utwórz nowy post" : "Zaloguj się, aby tworzyć posty"}*/}
                {/*>*/}
                {/*    + Utwórz Post*/}
                {/*</button>*/}
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition duration-150"
                    onClick={() => setIsCreatingPost(true)} // Zmieniamy, żeby był klikalny bez warunku
                    style={{zIndex: 1000, position: 'relative'}} // ⬅️ DODAJ TO TYMCZASOWO
                    // disabled={!userId} // ⬅️ MUSI BYĆ USUNIĘTE LUB ZAKOMENTOWANE
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

            {/* Lista postów */}
            <ul className="space-y-4">
                {posts.length === 0 ? (
                    <p className="text-center text-gray-500">Brak postów do wyświetlenia.</p>
                ) : (
                    sortedPosts.map((post) => {
                        const date = parseDateArray(post.createdAt);
                        return (
                            <li
                                key={post.id}
                                onClick={() => setSelectedPost(post)}
                                className="cursor-pointer bg-white p-4 rounded shadow-lg hover:shadow-xl transition duration-200 flex justify-between items-start border-l-4 border-blue-500"
                            >
                                <div className="flex-1 min-w-0 pr-4">
                                    <h3 className="text-xl font-bold text-gray-800 truncate">{post.title}</h3>
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
// import React, { useEffect, useState } from "react";
// import { useAtom } from 'jotai'; // ⬅️ IMPORT JOTAI
// import { userAtom } from '../../../atomContext/userAtom.tsx'; // ⬅️ IMPORT STANU UŻYTKOWNIKA
//
// // --- INTERFEJSY I STAŁE ---
//
// interface User {
//     id: number;
//     username: string;
//     // ... inne pola potrzebne
// }
//
// interface Post {
//     id: number;
//     title: string;
//     content: string;
//     user: User;
//     createdAt: number[];
// }
//
// interface Category {
//     id: number;
//     name: string;
// }
//
// const API_BASE_URL = 'http://localhost:8080/community';
//
// // --- FUNKCJE POMOCNICZE (BEZ ZMIAN) ---
//
// const parseDateArray = (dateArray: number[] | undefined) => {
//     if (!dateArray || dateArray.length < 6) return new Date();
//     const [year, month, day, hour, minute, second] = dateArray;
//     return new Date(year, month - 1, day, hour, minute, second);
// };
//
// const formatDate = (date: Date) => {
//     return date.toLocaleString("pl-PL", {
//         day: "2-digit",
//         month: "long",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//     });
// };
//
// const timeAgo = (date: Date) => {
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMinutes = Math.floor(diffMs / 60000);
//
//     if (diffMinutes < 1) return "przed chwilą";
//     if (diffMinutes < 60) return `${diffMinutes} min. temu`;
//     const diffHours = Math.floor(diffMinutes / 60);
//     if (diffHours < 24) return `${diffHours} godz. temu`;
//     const diffDays = Math.floor(diffHours / 24);
//     if (diffDays < 30) return `${diffDays} dni temu`;
//
//     return date.toLocaleDateString("pl-PL");
// };
//
// // --- HOOK UWIERZYTELNIANIA Z UŻYCIEM JOTAI ---
//
// const useCommunityAuth = () => {
//     // ⬅️ UŻYWAMY USEATOM, ŻEBY POBRAĆ AKTUALNY OBIEKT UŻYTKOWNIKA
//     const [user] = useAtom(userAtom);
//
//     // ... reszta logiki tokena ...
//     const token = localStorage.getItem('auth_token');
//
//     // ⬅️ POBIERAMY ID BEZPOŚREDNIO Z OBIEKTU USER
//     const userId = user?.id || null;
//
//     // ... reszta logiki ...
//
//     return {
//         token,
//         userId,
//         isAuthenticated: !!token && !!userId
//     };
// }
//
//
// // --- GŁÓWNY KOMPONENT COMMUNITY ---
//
// const Community: React.FC = () => {
//     const [posts, setPosts] = useState<Post[]>([]);
//     const [selectedPost, setSelectedPost] = useState<Post | null>(null);
//     const [filter, setFilter] = useState<"oldest" | "newest">("newest");
//     const [isCreatingPost, setIsCreatingPost] = useState(false);
//
//     // ⬅️ UŻYCIE NOWEGO HOOKA AUTH
//     const { token, userId, isAuthenticated } = useCommunityAuth();
//
//     // Stan do formularza tworzenia postu
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//     const [categoryId, setCategoryId] = useState('');
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [formLoading, setFormLoading] = useState(true);
//     const [formError, setFormError] = useState<string | null>(null);
//     const [postStatus, setPostStatus] = useState<string | null>(null);
//
//
//     // --- FUNKCJE POBIERANIA DANYCH ---
//
//     const fetchPosts = async () => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/posts`);
//             if (!response.ok) throw new Error("Błąd podczas pobierania postów");
//             const data = await response.json();
//             setPosts(data);
//         } catch (error) {
//             console.error("Fetch posts error:", error);
//         }
//     };
//
//     const fetchCategories = async () => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/categories`);
//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//             const data: Category[] = await response.json();
//             setCategories(data);
//             if (data.length > 0) setCategoryId(data[0].id.toString());
//         } catch (err) {
//             setFormError('Nie udało się załadować kategorii. Sprawdź połączenie z backendem.');
//             console.error("Błąd pobierania kategorii:", err);
//         } finally {
//             setFormLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         fetchPosts();
//         fetchCategories();
//     }, []);
//
//     const getSortedPosts = () => {
//         return [...posts].sort((a, b) => {
//             const dateA = parseDateArray(a.createdAt).getTime();
//             const dateB = parseDateArray(b.createdAt).getTime();
//             return filter === "oldest" ? dateA - dateB : dateB - a;
//         });
//     };
//
//     // --- FUNKCJA WYSYŁANIA POSTA Z AUTORYZACJĄ JWT ---
//     const handleCreatePostSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//
//         // Weryfikacja zalogowania (używamy stanu Jotai)
//         if (!isAuthenticated) {
//             setPostStatus('Błąd: Musisz być zalogowany, aby dodać post.');
//             return;
//         }
//
//         setPostStatus('Wysyłanie...');
//
//         if (!title.trim() || !content.trim() || !categoryId) {
//             setPostStatus('Wypełnij wszystkie wymagane pola!');
//             return;
//         }
//
//         // DTO BEZ userId
//         const newPostData = {
//             title,
//             content,
//             categoryId: parseInt(categoryId, 10),
//         };
//
//         try {
//             const response = await fetch(`${API_BASE_URL}/posts`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`, // Używamy tokena z Local Storage
//                 },
//                 body: JSON.stringify(newPostData),
//             });
//
//             if (!response.ok) {
//                 if (response.status === 401 || response.status === 403) {
//                     throw new Error("Brak autoryzacji. Twoja sesja mogła wygasnąć.");
//                 }
//                 const errorData = await response.json().catch(() => ({ message: 'Błąd po stronie serwera' }));
//                 throw new Error(errorData.message || `Wystąpił błąd: ${response.status}`);
//             }
//
//             setPostStatus(`Sukces! Post został utworzony.`);
//
//             setTitle('');
//             setContent('');
//             setTimeout(() => {
//                 setIsCreatingPost(false);
//                 setPostStatus(null);
//                 fetchPosts();
//             }, 1000);
//
//         } catch (err) {
//             setPostStatus(`Błąd: ${(err as Error).message || 'Nie udało się połączyć z API.'}`);
//             console.error("Błąd tworzenia posta:", err);
//         }
//     };
//
//     // --- WIDOKI ---
//     if (isCreatingPost) {
//         if (!isAuthenticated) return <div className="p-6 text-center text-red-600">Musisz być zalogowany, aby tworzyć posty!</div>;
//         if (formLoading) return <div className="p-6 text-center">Ładowanie formularza...</div>;
//         if (formError) return <div className="p-6 text-center text-red-600">Błąd: {formError}</div>;
//
//         return (
//             <div className="p-6 bg-gray-100 min-h-screen">
//                 <button
//                     className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                     onClick={() => {
//                         setIsCreatingPost(false);
//                         setPostStatus(null);
//                     }}
//                 >
//                     ← Wróć do listy postów
//                 </button>
//
//                 <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: 'white' }}>
//                     <h2>Utwórz Nowy Post 📝</h2>
//
//                     {/* ⬅️ Wyświetlanie User ID */}
//                     <p className="text-sm text-gray-500 mb-4">
//                         Tworzysz jako User ID: **{userId || 'Niezalogowany'}**
//                     </p>
//
//                     <form onSubmit={handleCreatePostSubmit}>
//
//                         {/* Pole Tytułu */}
//                         <div>
//                             <label htmlFor="title" className="block mt-4 mb-1 font-medium">Tytuł:</label>
//                             <input
//                                 type="text"
//                                 id="title"
//                                 value={title}
//                                 onChange={(e) => setTitle(e.target.value)}
//                                 required
//                                 className="w-full p-2 border border-gray-300 rounded"
//                             />
//                         </div>
//
//                         {/* Pole Kategori */}
//                         <div>
//                             <label htmlFor="category" className="block mt-4 mb-1 font-medium">Kategoria:</label>
//                             <select
//                                 id="category"
//                                 value={categoryId}
//                                 onChange={(e) => setCategoryId(e.target.value)}
//                                 required
//                                 className="w-full p-2 border border-gray-300 rounded"
//                             >
//                                 {categories.map((cat) => (
//                                     <option key={cat.id} value={cat.id}>
//                                         {cat.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//
//                         {/* Pole Treści */}
//                         <div>
//                             <label htmlFor="content" className="block mt-4 mb-1 font-medium">Treść:</label>
//                             <textarea
//                                 id="content"
//                                 value={content}
//                                 onChange={(e) => setContent(e.target.value)}
//                                 required
//                                 rows={6}
//                                 className="w-full p-2 border border-gray-300 rounded"
//                             />
//                         </div>
//
//                         <input type="hidden" value={userId || ''} />
//
//                         <button
//                             type="submit"
//                             className="w-full mt-4 p-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
//                             disabled={!title.trim() || !content.trim() || !categoryId}
//                         >
//                             Opublikuj Post
//                         </button>
//                     </form>
//
//                     {postStatus && (
//                         <p className={`mt-4 p-3 rounded text-center font-semibold ${postStatus.includes('Sukces') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                             {postStatus}
//                         </p>
//                     )}
//                 </div>
//             </div>
//         );
//     }
//
//     // --- WIDOK LISTY POSTÓW I KONTROLKI ---
//
//     const sortedPosts = getSortedPosts();
//
//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Forum Społeczności 💻</h1>
//
//             <div className="flex justify-center items-center mb-6 space-x-4">
//                 <input
//                     type="text"
//                     placeholder="Szukaj..."
//                     className="border border-gray-300 rounded px-4 py-2 w-1/3 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 />
//
//                 {/* ⬅️ Przycisk aktywowany stanem Jotai */}
//                 <button
//                     className={`px-4 py-2 rounded shadow-md transition duration-150 ${isAuthenticated ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
//                     onClick={() => isAuthenticated && setIsCreatingPost(true)}
//                     // disabled={!isAuthenticated}
//                     title={isAuthenticated ? "Utwórz nowy post" : "Zaloguj się, aby tworzyć posty"}
//                 >
//                     + Utwórz Post
//                 </button>
//
//                 <select
//                     className="border border-gray-300 rounded px-4 py-2 shadow-sm"
//                     value={filter}
//                     onChange={(e) => setFilter(e.target.value as "oldest" | "newest")}
//                 >
//                     <option value="newest">Najnowsze</option>
//                     <option value="oldest">Najstarsze</option>
//                 </select>
//             </div>
//
//             <ul className="space-y-4">
//                 {posts.length === 0 ? (
//                     <p className="text-center text-gray-500">Brak postów do wyświetlenia.</p>
//                 ) : (
//                     sortedPosts.map((post) => {
//                         const date = parseDateArray(post.createdAt);
//                         return (
//                             <li
//                                 key={post.id}
//                                 onClick={() => setSelectedPost(post)}
//                                 className="cursor-pointer bg-white p-4 rounded shadow-lg hover:shadow-xl transition duration-200 flex justify-between items-start border-l-4 border-blue-500"
//                             >
//                                 <div className="flex-1 min-w-0 pr-4">
//                                     <h3 className="text-xl font-bold text-gray-800 truncate">{post.title}</h3>
//                                     <p className="text-gray-600 mt-1">
//                                         {post.content.substring(0, 100)}
//                                         {post.content.length > 100 ? '...' : ''}
//                                     </p>
//                                     <p className="text-gray-500 text-sm mt-2">
//                                         Autor: **{post.user.username}**
//                                     </p>
//                                 </div>
//                                 <div className="text-gray-400 text-sm text-right flex-shrink-0 pt-1">
//                                     <span className="block">{formatDate(date)}</span>
//                                     <span className="block text-xs">({timeAgo(date)})</span>
//                                 </div>
//                             </li>
//                         );
//                     })
//                 )}
//             </ul>
//         </div>
//     );
// };
//
// export default Community;