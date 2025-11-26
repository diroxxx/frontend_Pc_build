// import React from 'react';
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
//     category?: { id: number, name: string };
// }
//
// // 2. Propsy dla komponentu PostDetail
// interface PostDetailProps {
//     post: Post;
//     onBack: () => void; // Funkcja do powrotu do widoku listy
// }
//
// // 3. Funkcje pomocnicze do formatowania daty (skopiowane z Community.tsx)
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
//
// const PostDetails: React.FC<PostDetailProps> = ({ post, onBack }) => {
//     const creationDate = parseDateArray(post.createdAt);
//     const categoryName = post.category?.name || 'Ogólne';
//
//     return (
//         <div className="p-6 bg-white min-h-screen shadow-inner">
//             <button
//                 className="mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-medium transition"
//                 onClick={onBack}
//             >
//                 ← Powrót do Forum
//             </button>
//
//             <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-2xl border-t-4 border-blue-600">
//
//                 {/* Nagłówek i Metadane */}
//                 <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{post.title}</h1>
//
//                 <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
//                     <span className="font-semibold text-blue-700">Kategoria: {categoryName}</span>
//                     <span>|</span>
//                     <span>Autor: <strong className="text-gray-700">{post.user.username}</strong></span>
//                     <span>|</span>
//                     <span>Opublikowano: {formatDate(creationDate)}</span>
//                 </div>
//
//                 <hr className="mb-6" />
//
//                 {/* Treść Posta */}
//                 <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
//                     {/* Użycie `whitespace-pre-wrap` jest opcjonalne, ale pomaga zachować formatowanie wpisane przez użytkownika */}
//                     <p>{post.content}</p>
//                 </div>
//
//                 <hr className="mt-8 mb-8" />
//
//                 {/* Sekcja Komentarzy (DO ROZBUDOWY) */}
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Komentarze (0)</h2>
//
//                 <div className="bg-gray-50 p-4 rounded border">
//                     <p className="text-gray-500">
//                         Tutaj znajdzie się komponent do wyświetlania i dodawania komentarzy.
//                     </p>
//                 </div>
//
//             </div>
//         </div>
//     );
// };
//
// export default PostDetails;

//dziala
// import React, { useEffect, useState } from 'react';
// import customAxios from "../../../lib/customAxios.tsx";
// import AddCommentForm from "./AddComment.tsx";
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
//     category?: { id: number, name: string };
// }
//
// // ⬅️ NOWY INTERFEJS DLA KOMENTARZY
// interface PostCommentDTO {
//     id: number;
//     content: string;
//     // Przyjmujemy, że DTO ma zagnieżdżonego UserDto lub proste pola autora
//     userId: number;
//     username: string;
//     createdAt: number[];
// }
//
// interface PostDetailProps {
//     post: Post;
//     onBack: () => void;
// }
//
// // --- FUNKCJE POMOCNICZE ---
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
// // --- KOMPONENT ---
//
// const PostDetails: React.FC<PostDetailProps> = ({ post, onBack }) => {
//     const [comments, setComments] = useState<PostCommentDTO[]>([]); // ⬅️ Stan na komentarze
//     const [loadingComments, setLoadingComments] = useState(true);
//     const [commentsError, setCommentsError] = useState<string | null>(null);
//
//     const creationDate = parseDateArray(post.createdAt);
//     const categoryName = post.category?.name || 'Ogólne';
//
//     // ⬅️ FUNKCJA POBIERAJĄCA KOMENTARZE
//     // const fetchComments = async () => {
//     //     setLoadingComments(true);
//     //     setCommentsError(null);
//     //     try {
//     //         // Użycie ID posta z propsów
//     //         const response = await customAxios.get<PostCommentDTO[]>(`community/posts/${post.id}/comments`);
//     //         setComments(response.data);
//     //     } catch (err) {
//     //         console.error("Błąd pobierania komentarzy:", err);
//     //         setCommentsError("Nie udało się załadować komentarzy.");
//     //     } finally {
//     //         setLoadingComments(false);
//     //     }
//     // };
//     const fetchComments = async () => {
//         setLoadingComments(true);
//         setCommentsError(null);
//         try {
//             const response = await customAxios.get<PostCommentDTO[]>(`community/posts/${post.id}/comments`);
//             setComments(response.data);
//         } catch (err) {
//             console.error("Błąd pobierania komentarzy:", err);
//             setCommentsError("Nie udało się załadować komentarzy.");
//         } finally {
//             setLoadingComments(false);
//         }
//     };
//
//
//     useEffect(() => {
//         fetchComments();
//     }, [post.id]);
//
//
//     return (
//         <div className="p-6 bg-white min-h-screen shadow-inner">
//             <button
//                 className="mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-medium transition"
//                 onClick={onBack}
//             >
//                 ← Powrót do Forum
//             </button>
//
//             <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-2xl border-t-4 border-blue-600">
//
//                 <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{post.title}</h1>
//
//                 <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
//                     <span className="font-semibold text-blue-700">Kategoria: {categoryName}</span>
//                     <span>|</span>
//                     <span>Autor: <strong className="text-gray-700">{post.user.username}</strong></span>
//                     <span>|</span>
//                     <span>Opublikowano: {formatDate(creationDate)}</span>
//                 </div>
//
//                 <hr className="mb-6" />
//
//                 <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
//                     <p>{post.content}</p>
//                 </div>
//
//                 <hr className="mt-8 mb-8" />
//
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Komentarze ({comments.length})</h2>
//
//                 {loadingComments && (
//                     <p className="text-gray-500">Ładowanie komentarzy...</p>
//                 )}
//
//                 {commentsError && (
//                     <p className="text-red-600 font-semibold">{commentsError}</p>
//                 )}
//
//                 {!loadingComments && !commentsError && (
//                     <div className="space-y-4">
//                         {comments.length === 0 ? (
//                             <p className="text-gray-500 italic">Brak komentarzy. Bądź pierwszy!</p>
//                         ) : (
//                             comments.map(comment => {
//                                 const commentDate = parseDateArray(comment.createdAt);
//                                 return (
//                                     <div key={comment.id} className="bg-gray-50 p-4 rounded border border-gray-200">
//                                         <div className="flex justify-between items-start text-sm mb-1">
//                                             <span className="font-bold text-gray-800">{comment.user.username}</span>
//                                             <span className="text-gray-500 text-xs">
//                                                 {formatDate(commentDate)}
//                                             </span>
//                                         </div>
//                                         <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
//                                     </div>
//                                 );
//                             })
//                         )}
//                     </div>
//                 )}
//                 <div className="mt-6 p-4 border-t border-gray-300 pt-6">
//                     <AddCommentForm
//                         postId={post.id}
//                         onCommentAdded={fetchComments}
//                     />
//                 </div>
//
//             </div>
//         </div>
//     );
// };
//
// export default PostDetails;
import React, { useEffect, useState } from 'react';
import customAxios from "../../../lib/customAxios.tsx";
import AddCommentForm from "./AddComment.tsx";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'; // Import ikon


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
    category?: { id: number, name: string };
}

// ⬅️ NOWY INTERFEJS DLA KOMENTARZY
interface PostCommentDTO {
    id: number;
    content: string;
    // Przyjmujemy, że DTO ma zagnieżdżonego UserDto lub proste pola autora
    userId: number;
    username: string;
    createdAt: number[];
}

interface PostDetailProps {
    post: Post;
    onBack: () => void;
}

// --- FUNKCJE POMOCNICZE ---

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

// --- KOMPONENT ---

const PostDetails: React.FC<PostDetailProps> = ({ post, onBack }) => {
    const [comments, setComments] = useState<PostCommentDTO[]>([]); // ⬅️ Stan na komentarze
    const [loadingComments, setLoadingComments] = useState(true);
    const [commentsError, setCommentsError] = useState<string | null>(null);

    const creationDate = parseDateArray(post.createdAt);
    const categoryName = post.category?.name || 'Ogólne';
    // ⬅️ NOWY STAN DLA GŁOSOWANIA
    const [netScore, setNetScore] = useState<number>(0);
    // 'upvote', 'downvote' lub null (brak głosu)
    const [userVoteStatus, setUserVoteStatus] = useState<'upvote' | 'downvote' | null>(null);
    const [voteError, setVoteError] = useState<string | null>(null);

    // ⬅️ FUNKCJA POBIERAJĄCA KOMENTARZE
    // const fetchComments = async () => {
    //     setLoadingComments(true);
    //     setCommentsError(null);
    //     try {
    //         // Użycie ID posta z propsów
    //         const response = await customAxios.get<PostCommentDTO[]>(`community/posts/${post.id}/comments`);
    //         setComments(response.data);
    //     } catch (err) {
    //         console.error("Błąd pobierania komentarzy:", err);
    //         setCommentsError("Nie udało się załadować komentarzy.");
    //     } finally {
    //         setLoadingComments(false);
    //     }
    // };
    const fetchComments = async () => {
        setLoadingComments(true);
        setCommentsError(null);
        try {
            const response = await customAxios.get<PostCommentDTO[]>(`community/posts/${post.id}/comments`);
            setComments(response.data);
        } catch (err) {
            console.error("Błąd pobierania komentarzy:", err);
            setCommentsError("Nie udało się załadować komentarzy.");
        } finally {
            setLoadingComments(false);
        }
    };
    // const fetchVoteStatus = async () => {
    //     try {
    //         // GET /community/posts/{postId}/vote
    //         const response = await customAxios.get<number>(`community/posts/${post.id}/vote`);
    //         setNetScore(response.data);
    //         setVoteError(null);
    //     } catch (err) {
    //         console.error("Błąd pobierania statusu głosowania:", err);
    //         // setVoteError("Nie udało się załadować wyniku głosowania."); // Zostawiamy błąd cichy, jeśli to GET
    //     }
    // };
    const fetchVoteStatus = async () => {
        try {
            // 1. Pobierz wynik netto
            const scoreResponse = await customAxios.get<number>(`community/posts/${post.id}/vote`);
            setNetScore(scoreResponse.data);

            // 2. Pobierz status głosu użytkownika
            const statusResponse = await customAxios.get<string | null>(`community/posts/${post.id}/vote/status`);

            // Ustaw userVoteStatus na 'upvote', 'downvote' lub null
            if (statusResponse.data) {
                setUserVoteStatus(statusResponse.data as 'upvote' | 'downvote');
            } else {
                setUserVoteStatus(null);
            }

        } catch (err) {
            console.error("Błąd pobierania statusu głosowania:", err);
        }
    };
    // --- KOMPONENT SEKCJI GŁOSOWANIA ---
    const VoteSection = () => (
        <div className="flex items-center space-x-4 border p-3 rounded-lg bg-gray-50 mb-6">
            <button
                className={`flex items-center p-2 rounded-full transition ${
                    userVoteStatus === 'upvote' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleVote('upvote')}
                title="Upvote (Like)"
            >
                <FaThumbsUp className="w-5 h-5" />
            </button>

            <span
                className={`text-xl font-bold ${
                    netScore > 0 ? 'text-green-700' : netScore < 0 ? 'text-red-700' : 'text-gray-700'
                }`}
            >
                {netScore}
            </span>

            <button
                className={`flex items-center p-2 rounded-full transition ${
                    userVoteStatus === 'downvote' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleVote('downvote')}
                title="Downvote (Dislike)"
            >
                <FaThumbsDown className="w-5 h-5" />
            </button>

            {voteError && (
                <span className="text-sm text-red-500 ml-4 font-medium">{voteError}</span>
            )}
        </div>
    );
    // --- KONIEC KOMPONENTU SEKCJI GŁOSOWANIA ---

    // ⬅️ FUNKCJA OBSŁUGUJĄCA GŁOSOWANIE
    const handleVote = async (voteType: 'upvote' | 'downvote') => {
        setVoteError(null);
        try {
            // POST /community/posts/{postId}/vote?type=upvote
            const response = await customAxios.post<number>(`community/posts/${post.id}/vote?type=${voteType}`);

            setNetScore(response.data); // Aktualizacja wyniku zwróconego przez backend

            // Aktualizacja lokalnego statusu głosu
            if (userVoteStatus === voteType) {
                // Kliknięto ten sam typ głosu: wycofanie (Un-vote)
                setUserVoteStatus(null);
            } else {
                // Nowy głos lub zmiana głosu
                setUserVoteStatus(voteType);
            }

        } catch (err: any) {
            console.error("Błąd głosowania:", err);
            if (err.response?.status === 401) {
                setVoteError("Musisz być zalogowany, aby głosować!");
            } else {
                setVoteError("Wystąpił błąd podczas oddawania głosu.");
            }
        }
    };

    useEffect(() => {
        fetchComments();
        fetchVoteStatus();
    }, [post.id]);


//     return (
//         <div className="p-6 bg-white min-h-screen shadow-inner">
//             <button
//                 className="mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-medium transition"
//                 onClick={onBack}
//             >
//                 ← Powrót do Forum
//             </button>
//
//             <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-2xl border-t-4 border-blue-600">
//
//                 <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{post.title}</h1>
//
//                 <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
//                     <span className="font-semibold text-blue-700">Kategoria: {categoryName}</span>
//                     <span>|</span>
//                     <span>Autor: <strong className="text-gray-700">{post.user.username}</strong></span>
//                     <span>|</span>
//                     <span>Opublikowano: {formatDate(creationDate)}</span>
//                 </div>
//
//                 <hr className="mb-6" />
//
//                 <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
//                     <p>{post.content}</p>
//                 </div>
//
//                 <hr className="mt-8 mb-8" />
//
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Komentarze ({comments.length})</h2>
//
//                 {loadingComments && (
//                     <p className="text-gray-500">Ładowanie komentarzy...</p>
//                 )}
//
//                 {commentsError && (
//                     <p className="text-red-600 font-semibold">{commentsError}</p>
//                 )}
//
//                 {!loadingComments && !commentsError && (
//                     <div className="space-y-4">
//                         {comments.length === 0 ? (
//                             <p className="text-gray-500 italic">Brak komentarzy. Bądź pierwszy!</p>
//                         ) : (
//                             comments.map(comment => {
//                                 const commentDate = parseDateArray(comment.createdAt);
//                                 return (
//                                     <div key={comment.id} className="bg-gray-50 p-4 rounded border border-gray-200">
//                                         <div className="flex justify-between items-start text-sm mb-1">
//                                             <span className="font-bold text-gray-800">{comment.user.username}</span>
//                                             <span className="text-gray-500 text-xs">
//                                                 {formatDate(commentDate)}
//                                             </span>
//                                         </div>
//                                         <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
//                                     </div>
//                                 );
//                             })
//                         )}
//                     </div>
//                 )}
//                 <div className="mt-6 p-4 border-t border-gray-300 pt-6">
//                     <AddCommentForm
//                         postId={post.id}
//                         onCommentAdded={fetchComments}
//                     />
//                 </div>
//
//             </div>
//         </div>
//     );
// };
//
// export default PostDetails;
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <button
                className="mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-medium transition"
                onClick={onBack}
            >
                ← Powrót do Forum
            </button>

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-2xl border-t-4 border-blue-600">

                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{post.title}</h1>

                <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
                    <span className="font-semibold text-blue-700">Kategoria: {categoryName}</span>
                    <span>|</span>
                    <span>Autor: <strong className="text-gray-700">{post.user.username}</strong></span>
                    <span>|</span>
                    <span>Opublikowano: {formatDate(creationDate)}</span>
                </div>

                {/* ⬅️ WSTAWIENIE SEKCJI GŁOSOWANIA */}
                <VoteSection />
                {/* ---------------------------------- */}

                <hr className="mb-6" />

                <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
                    <p>{post.content}</p>
                </div>

                <hr className="mt-8 mb-8" />

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Komentarze ({comments.length})</h2>

                {loadingComments && (<p className="text-gray-500">Ładowanie komentarzy...</p>)}
                {commentsError && (<p className="text-red-600 font-semibold">{commentsError}</p>)}

                {!loadingComments && !commentsError && (
                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 italic">Brak komentarzy. Bądź pierwszy!</p>
                        ) : (
                            comments.map(comment => {
                                const commentDate = parseDateArray(comment.createdAt);
                                return (
                                    <div key={comment.id} className="bg-gray-50 p-4 rounded border border-gray-200">
                                        <div className="flex justify-between items-start text-sm mb-1">
                                            {/* Zmieniono na użycie `username` bezpośrednio z DTO */}
                                            <span className="font-bold text-gray-800">{comment.username}</span>
                                            <span className="text-gray-500 text-xs">
                                                {formatDate(commentDate)}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
                <div className="mt-6 p-4 border-t border-gray-300 pt-6">
                    <AddCommentForm
                        postId={post.id}
                        onCommentAdded={fetchComments}
                    />
                </div>

            </div>
        </div>
    );
};

export default PostDetails;