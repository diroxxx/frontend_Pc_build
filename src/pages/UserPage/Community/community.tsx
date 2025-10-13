// import React, { useEffect, useState } from "react";
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
//     createdAt?: string;
// }
//
//
//
// const Community: React.FC = () => {
//     const [posts, setPosts] = useState<Post[]>([]);
//     const [selectedPost, setSelectedPost] = useState<Post | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string>("");
//
//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const response = await fetch("http://localhost:8080/community/posts");
//                 if (!response.ok) throw new Error("Błąd podczas pobierania postów");
//                 const data: Post[] = await response.json();
//                 setPosts(data);
//             } catch (err: any) {
//                 setError(err.message || "Coś poszło nie tak");
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchPosts();
//     }, []);
//
//     const formatDateArray = (dateArray: number[] | undefined) => {
//         if (!dateArray || dateArray.length < 6) return "";
//
//         // [rok, miesiąc, dzień, godzina, minuta, sekunda, nanosekunda]
//         const [year, month, day, hour, minute, second] = dateArray;
//
//         // Miesiąc w JS jest 0-indexowany, więc odejmujemy 1
//         const date = new Date(year, month - 1, day, hour, minute, second);
//
//         return date.toLocaleString("pl-PL", {
//             day: "2-digit",
//             month: "long",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit",
//         });
//     };
//
//
//
//     if (loading) return <div className="p-6">Ładowanie...</div>;
//     if (error) return <div className="p-6 text-red-500">{error}</div>;
//
//     // Jeśli wybrano post, pokaż jego szczegóły
//     if (selectedPost) {
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
//                         Autor: {selectedPost.user.username} | Data: {formatDateArray(selectedPost.createdAt)}
//                     </p>
//                     <p className="text-gray-700">{selectedPost.content}</p>
//                 </div>
//             </div>
//         );
//     }
//
//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             {/* Pasek wyszukiwania, przycisk i filtr */}
//             <div className="flex justify-center items-center mb-6 space-x-4">
//                 <input
//                     type="text"
//                     placeholder="Szukaj..."
//                     className="border border-gray-300 rounded px-4 py-2 w-1/3"
//                 />
//                 <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
//                     +
//                 </button>
//                 <select className="border border-gray-300 rounded px-4 py-2">
//                     <option>Filtruj po dacie (najstarsze)</option>
//                     <option>Filtruj po dacie (najnowsze)</option>
//                 </select>
//             </div>
//
//             {/* Lista postów */}
//             <div>
//                 <h2 className="text-2xl font-bold mb-4">Lista postów</h2>
//                 <ul className="space-y-4">
//                     {posts.map((post) => (
//                         <li
//                             key={post.id}
//                             onClick={() => setSelectedPost(post)}
//                             className="cursor-pointer bg-white p-4 rounded shadow hover:shadow-md transition"
//                         >
//                             <h3 className="text-xl font-semibold">{post.title}</h3>
//                             <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
//                             <p className="text-gray-500 text-sm">Autor: {post.user.username}</p>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };
//
// export default Community;


import React, { useEffect, useState } from "react";

interface User {
    id: number;
    username: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    user: User;
    createdAt: number[]; // [rok, miesiąc, dzień, godzina, minuta, sekunda, nanosekunda]
}

// Funkcja do konwersji tablicy daty na obiekt Date
const parseDateArray = (dateArray: number[] | undefined) => {
    if (!dateArray || dateArray.length < 6) return new Date();
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second);
};

// Funkcja do formatowania daty w polskim stylu
const formatDate = (date: Date) => {
    return date.toLocaleString("pl-PL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Funkcja do obliczenia ile czasu temu był post
const timeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 60) return `${diffMinutes} min. temu`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} godz. temu`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} dni temu`;
};

const Community: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch("http://localhost:8080/community/posts");
            const data = await response.json();
            setPosts(data);
        };
        fetchPosts();
    }, []);

    if (selectedPost) {
        const date = parseDateArray(selectedPost.createdAt);
        return (
            <div className="p-6 bg-gray-100 min-h-screen">
                <button
                    className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setSelectedPost(null)}
                >
                    ← Wróć do listy
                </button>
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
                    <p className="text-gray-500 text-sm mb-4">
                        Autor: {selectedPost.user.username} |{" "}
                        {formatDate(date)} ({timeAgo(date)})
                    </p>
                    <p className="text-gray-700">{selectedPost.content}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Pasek wyszukiwania, przycisk i filtr */}
            <div className="flex justify-center items-center mb-6 space-x-4">
                <input
                    type="text"
                    placeholder="Szukaj..."
                    className="border border-gray-300 rounded px-4 py-2 w-1/3"
                />
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    +
                </button>
                <select className="border border-gray-300 rounded px-4 py-2">
                    <option>Filtruj po dacie (najstarsze)</option>
                    <option>Filtruj po dacie (najnowsze)</option>
                </select>
            </div>

            {/* Lista postów */}
            <ul className="space-y-4">
                {posts.map((post) => {
                    const date = parseDateArray(post.createdAt);
                    return (
                        <li
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className="cursor-pointer bg-white p-4 rounded shadow hover:shadow-md transition flex justify-between items-start"
                        >
                            <div>
                                <h3 className="text-xl font-semibold">{post.title}</h3>
                                <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
                                <p className="text-gray-500 text-sm">Autor: {post.user.username}</p>
                            </div>
                            <div className="text-gray-400 text-sm text-right">
                                {formatDate(date)} <br />
                                ({timeAgo(date)})
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Community;
