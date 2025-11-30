// // import React, { useEffect, useState } from 'react';
// // import customAxios from "../../../lib/customAxios.tsx";
// // import AddCommentForm from "./AddComment.tsx";
// // import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'; // Import ikon
// //
// //
// // interface User {
// //     id: number;
// //     username: string;
// // }
// //
// // interface Post {
// //     id: number;
// //     title: string;
// //     content: string;
// //     user: User;
// //     createdAt: number[];
// //     category?: { id: number, name: string };
// // }
// //
// // interface PostCommentDTO {
// //     id: number;
// //     content: string;
// //     userId: number;
// //     username: string;
// //     createdAt: number[];
// // }
// //
// // interface PostDetailProps {
// //     post: Post;
// //     onBack: () => void;
// // }
// //
// // // --- FUNKCJE POMOCNICZE ---
// //
// // const parseDateArray = (dateArray: number[] | undefined) => {
// //     if (!dateArray || dateArray.length < 6) return new Date();
// //     const [year, month, day, hour, minute, second] = dateArray;
// //     return new Date(year, month - 1, day, hour, minute, second);
// // };
// //
// // const formatDate = (date: Date) => {
// //     return date.toLocaleString("pl-PL", {
// //         day: "2-digit",
// //         month: "long",
// //         year: "numeric",
// //         hour: "2-digit",
// //         minute: "2-digit",
// //     });
// // };
// //
// // // --- KOMPONENT ---
// //
// // const PostDetails: React.FC<PostDetailProps> = ({ post, onBack }) => {
// //     const [comments, setComments] = useState<PostCommentDTO[]>([]);
// //     const [loadingComments, setLoadingComments] = useState(true);
// //     const [commentsError, setCommentsError] = useState<string | null>(null);
// //     const creationDate = parseDateArray(post.createdAt);
// //     const categoryName = post.category?.name || 'Ogólne';
// //     const [netScore, setNetScore] = useState<number>(0);
// //     const [userVoteStatus, setUserVoteStatus] = useState<'upvote' | 'downvote' | null>(null);
// //     const [voteError, setVoteError] = useState<string | null>(null);
// //
// //
// //     // ⬅️ FUNKCJA POBIERAJĄCA KOMENTARZE
// //     const fetchComments = async () => {
// //         setLoadingComments(true);
// //         setCommentsError(null);
// //         try {
// //             const response = await customAxios.get<PostCommentDTO[]>(`community/posts/${post.id}/comments`);
// //             setComments(response.data);
// //         } catch (err) {
// //             console.error("Błąd pobierania komentarzy:", err);
// //             setCommentsError("Nie udało się załadować komentarzy.");
// //         } finally {
// //             setLoadingComments(false);
// //         }
// //     };
// //
// //     const fetchVoteStatus = async () => {
// //         try {
// //             const scoreResponse = await customAxios.get<number>(`community/posts/${post.id}/vote`);
// //             setNetScore(scoreResponse.data);
// //
// //             const statusResponse = await customAxios.get<string | null>(`community/posts/${post.id}/vote/status`);
// //
// //             if (statusResponse.data) {
// //                 setUserVoteStatus(statusResponse.data as 'upvote' | 'downvote');
// //             } else {
// //                 setUserVoteStatus(null);
// //             }
// //
// //         } catch (err) {
// //             console.error("Błąd pobierania statusu głosowania:", err);
// //         }
// //     };
// //     // --- KOMPONENT SEKCJI GŁOSOWANIA ---
// //     const VoteSection = () => (
// //         <div className="flex items-center space-x-4 border p-3 rounded-lg bg-gray-50 mb-6">
// //             <button
// //                 className={`flex items-center p-2 rounded-full transition ${
// //                     userVoteStatus === 'upvote' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
// //                 }`}
// //                 onClick={() => handleVote('upvote')}
// //                 title="Upvote (Like)"
// //             >
// //                 <FaThumbsUp className="w-5 h-5" />
// //             </button>
// //
// //             <span
// //                 className={`text-xl font-bold ${
// //                     netScore > 0 ? 'text-green-700' : netScore < 0 ? 'text-red-700' : 'text-gray-700'
// //                 }`}
// //             >
// //                 {netScore}
// //             </span>
// //
// //             <button
// //                 className={`flex items-center p-2 rounded-full transition ${
// //                     userVoteStatus === 'downvote' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
// //                 }`}
// //                 onClick={() => handleVote('downvote')}
// //                 title="Downvote (Dislike)"
// //             >
// //                 <FaThumbsDown className="w-5 h-5" />
// //             </button>
// //
// //             {voteError && (
// //                 <span className="text-sm text-red-500 ml-4 font-medium">{voteError}</span>
// //             )}
// //         </div>
// //     );
// //
// //     const handleVote = async (voteType: 'upvote' | 'downvote') => {
// //         setVoteError(null);
// //         try {
// //             const response = await customAxios.post<number>(`community/posts/${post.id}/vote?type=${voteType}`);
// //
// //             setNetScore(response.data);
// //
// //
// //             if (userVoteStatus === voteType) {
// //                 // Kliknięto ten sam typ głosu: wycofanie (Un-vote)
// //                 setUserVoteStatus(null);
// //             } else {
// //                 // Nowy głos lub zmiana głosu
// //                 setUserVoteStatus(voteType);
// //             }
// //
// //         } catch (err: any) {
// //             console.error("Błąd głosowania:", err);
// //             if (err.response?.status === 401) {
// //                 setVoteError("Musisz być zalogowany, aby głosować!");
// //             } else {
// //                 setVoteError("Wystąpił błąd podczas oddawania głosu.");
// //             }
// //         }
// //     };
// //
// //     useEffect(() => {
// //         fetchComments();
// //         fetchVoteStatus();
// //     }, [post.id]);
// //
// //
// //     return (
// //         <div className="p-6 bg-gray-100 min-h-screen">
// //             <button
// //                 className="mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-medium transition"
// //                 onClick={onBack}
// //             >
// //                 ← Powrót do Forum
// //             </button>
// //
// //             <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-2xl border-t-4 border-blue-600">
// //
// //                 <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{post.title}</h1>
// //
// //                 <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
// //                     <span className="font-semibold text-blue-700">Kategoria: {categoryName}</span>
// //                     <span>|</span>
// //                     <span>Autor: <strong className="text-gray-700">{post.user.username}</strong></span>
// //                     <span>|</span>
// //                     <span>Opublikowano: {formatDate(creationDate)}</span>
// //                 </div>
// //
// //                 {/* ⬅️ WSTAWIENIE SEKCJI GŁOSOWANIA */}
// //                 <VoteSection />
// //                 {/* ---------------------------------- */}
// //
// //                 <hr className="mb-6" />
// //
// //                 <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
// //                     <p>{post.content}</p>
// //                 </div>
// //
// //                 <hr className="mt-8 mb-8" />
// //
// //                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Komentarze ({comments.length})</h2>
// //
// //                 {loadingComments && (<p className="text-gray-500">Ładowanie komentarzy...</p>)}
// //                 {commentsError && (<p className="text-red-600 font-semibold">{commentsError}</p>)}
// //
// //                 {!loadingComments && !commentsError && (
// //                     <div className="space-y-4">
// //                         {comments.length === 0 ? (
// //                             <p className="text-gray-500 italic">Brak komentarzy. Bądź pierwszy!</p>
// //                         ) : (
// //                             comments.map(comment => {
// //                                 const commentDate = parseDateArray(comment.createdAt);
// //                                 return (
// //                                     <div key={comment.id} className="bg-gray-50 p-4 rounded border border-gray-200">
// //                                         <div className="flex justify-between items-start text-sm mb-1">
// //                                             {/* Zmieniono na użycie `username` bezpośrednio z DTO */}
// //                                             <span className="font-bold text-gray-800">{comment.username}</span>
// //                                             <span className="text-gray-500 text-xs">
// //                                                 {formatDate(commentDate)}
// //                                             </span>
// //                                         </div>
// //                                         <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
// //                                     </div>
// //                                 );
// //                             })
// //                         )}
// //                     </div>
// //                 )}
// //                 <div className="mt-6 p-4 border-t border-gray-300 pt-6">
// //                     <AddCommentForm
// //                         postId={post.id}
// //                         onCommentAdded={fetchComments}
// //                     />
// //                 </div>
// //
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default PostDetails;
//
//




//dzialajace
// import React, { useEffect, useState } from 'react';
// import customAxios from "../../../lib/customAxios.tsx";
// import AddCommentForm from "./AddComment.tsx";
// import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
//
//
// interface User {
//     id: number;
//     username: string;
// }
//
// // ⭐ NOWY INTERFEJS DLA ZDJĘĆ
// interface PostImageDTO {
//     id: number;
//     imageUrl: string; // URL do pobrania obrazu z backendu
//     filename: string;
//     mimeType: string;
// }
//
// interface Post {
//     id: number;
//     title: string;
//     content: string;
//     user: User;
//     createdAt: number[];
//     category?: { id: number, name: string };
//     images?: PostImageDTO[]; // ⭐ DODANA LISTA ZDJĘĆ
// }
//
// interface PostCommentDTO {
//     id: number;
//     content: string;
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
//     const [comments, setComments] = useState<PostCommentDTO[]>([]);
//     const [loadingComments, setLoadingComments] = useState(true);
//     const [commentsError, setCommentsError] = useState<string | null>(null);
//     const creationDate = parseDateArray(post.createdAt);
//     const categoryName = post.category?.name || 'Ogólne';
//     const [netScore, setNetScore] = useState<number>(0);
//     const [userVoteStatus, setUserVoteStatus] = useState<'upvote' | 'downvote' | null>(null);
//     const [voteError, setVoteError] = useState<string | null>(null);
//
//
//     // ⬅️ FUNKCJA POBIERAJĄCA KOMENTARZE
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
//     const fetchVoteStatus = async () => {
//         try {
//             const scoreResponse = await customAxios.get<number>(`community/posts/${post.id}/vote`);
//             setNetScore(scoreResponse.data);
//
//             const statusResponse = await customAxios.get<string | null>(`community/posts/${post.id}/vote/status`);
//
//             if (statusResponse.data) {
//                 setUserVoteStatus(statusResponse.data as 'upvote' | 'downvote');
//             } else {
//                 setUserVoteStatus(null);
//             }
//
//         } catch (err) {
//             console.error("Błąd pobierania statusu głosowania:", err);
//         }
//     };
//     // --- KOMPONENT SEKCJI GŁOSOWANIA ---
//     const VoteSection = () => (
//         <div className="flex items-center space-x-4 border p-3 rounded-lg bg-gray-50 mb-6">
//             <button
//                 className={`flex items-center p-2 rounded-full transition ${
//                     userVoteStatus === 'upvote' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//                 onClick={() => handleVote('upvote')}
//                 title="Upvote (Like)"
//             >
//                 <FaThumbsUp className="w-5 h-5" />
//             </button>
//
//             <span
//                 className={`text-xl font-bold ${
//                     netScore > 0 ? 'text-green-700' : netScore < 0 ? 'text-red-700' : 'text-gray-700'
//                 }`}
//             >
//                 {netScore}
//             </span>
//
//             <button
//                 className={`flex items-center p-2 rounded-full transition ${
//                     userVoteStatus === 'downvote' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//                 onClick={() => handleVote('downvote')}
//                 title="Downvote (Dislike)"
//             >
//                 <FaThumbsDown className="w-5 h-5" />
//             </button>
//
//             {voteError && (
//                 <span className="text-sm text-red-500 ml-4 font-medium">{voteError}</span>
//             )}
//         </div>
//     );
//
//     const handleVote = async (voteType: 'upvote' | 'downvote') => {
//         setVoteError(null);
//         try {
//             const response = await customAxios.post<number>(`community/posts/${post.id}/vote?type=${voteType}`);
//
//
//             setNetScore(response.data);
//
//
//             if (userVoteStatus === voteType) {
//                 // Kliknięto ten sam typ głosu: wycofanie (Un-vote)
//                 setUserVoteStatus(null);
//             } else {
//                 // Nowy głos lub zmiana głosu
//                 setUserVoteStatus(voteType);
//             }
//
//         } catch (err: any) {
//             console.error("Błąd głosowania:", err);
//             if (err.response?.status === 401) {
//                 setVoteError("Musisz być zalogowany, aby głosować!");
//             } else {
//                 setVoteError("Wystąpił błąd podczas oddawania głosu.");
//             }
//         }
//     };
//
//     useEffect(() => {
//         fetchComments();
//         fetchVoteStatus();
//     }, [post.id]);
//
//
//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
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
//                 {/* Sekcja Głosowania */}
//                 <VoteSection />
//                 <hr className="mb-6" />
//
//                 {/* Treść Posta */}
//                 <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
//                     <p>{post.content}</p>
//                 </div>
//
//                 {/*/!* ⭐ NOWA SEKCJA: WYŚWIETLANIE ZDJĘĆ ⭐ *!/*/}
//                 {/*{(post.images && post.images.length > 0) && (*/}
//                 {/*    <div className="mt-6 border-t pt-6">*/}
//                 {/*        <h3 className="text-xl font-bold text-gray-800 mb-4">Zdjęcia:</h3>*/}
//                 {/*        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">*/}
//                 {/*            {post.images.map((img) => (*/}
//                 {/*                <div*/}
//                 {/*                    key={img.id}*/}
//                 {/*                    className="relative overflow-hidden rounded-lg shadow-md border border-gray-200 cursor-pointer group"*/}
//                 {/*                    // Dodaj obsługę kliknięcia, aby powiększyć zdjęcie, jeśli potrzebujesz*/}
//                 {/*                >*/}
//                 {/*                    <img*/}
//                 {/*                        // Używamy imageUrl, który wskazuje na endpoint Spring Boot pobierający dane binarne*/}
//                 {/*                        src={img.imageUrl}*/}
//                 {/*                        alt={img.filename}*/}
//                 {/*                        className="w-full h-40 object-cover transition duration-300 group-hover:opacity-90"*/}
//                 {/*                    />*/}
//                 {/*                    /!* Opcjonalny overlay z nazwą pliku *!/*/}
//                 {/*                    <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">*/}
//                 {/*                        {img.filename}*/}
//                 {/*                    </div>*/}
//                 {/*                </div>*/}
//                 {/*            ))}*/}
//                 {/*        </div>*/}
//                 {/*    </div>*/}
//                 {/*)}*/
//                 }
//                 {/* ⬅️ TUTAJ WSTAWIAMY KOD GALERII ZDJĘĆ */}
//                 {/* ⭐ NOWA SEKCJA: WYŚWIETLANIE ZDJĘĆ ⭐ */}
//                 {(post.images && post.images.length > 0) && (
//                     <div className="mt-6 border-t pt-6">
//                         <h3 className="text-xl font-bold text-gray-800 mb-4">Zdjęcia:</h3>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                             {post.images.map((img) => (
//                                 <div
//                                     key={img.id}
//                                     className="relative overflow-hidden rounded-lg shadow-md border border-gray-200 cursor-pointer group"
//                                 >
//                                     <img
//                                         src={img.imageUrl}
//                                         alt={img.filename}
//                                         className="w-full h-40 object-cover transition duration-300 group-hover:opacity-90"
//                                     />
//                                     <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
//                                         {img.filename}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//                 {/* ⭐ KONIEC SEKCJI ZDJĘĆ ⭐ */}
//
//                 {/* ⭐ KONIEC SEKCJI ZDJĘĆ ⭐ */}
//
//                 <hr className="mt-8 mb-8" />
//
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Komentarze ({comments.length})</h2>
//
//                 {loadingComments && (<p className="text-gray-500">Ładowanie komentarzy...</p>)}
//                 {commentsError && (<p className="text-red-600 font-semibold">{commentsError}</p>)}
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
//                                             <span className="font-bold text-gray-800">{comment.username}</span>
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


//image
// import React, { useState, useEffect } from 'react';
// import customAxios from '../../../lib/customAxios.tsx';
//
// interface PostImageDTO {
//     id: number;
//     imageUrl: string;
//     filename: string;
//     mimeType: string;
// }
//
// interface PostGalleryProps {
//     postId: number;
// }
//
// const PostGallery: React.FC<PostGalleryProps> = ({ postId }) => {
//
//     const [images, setImages] = useState<PostImageDTO[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//
//     console.log(`[RENDER] PostGallery — postId = ${postId}`);  // ⭐ teraz pokaże ID zamiast undefined
//
//     useEffect(() => {
//
//         if (!postId) {
//             console.warn("PostGallery: postId jest pusty — przerwano fetch.");
//             return;
//         }
//
//         const fetchImages = async () => {
//             setLoading(true);
//             try {
//                 // ⭐ DYNAMICZNY ENDPOINT Z postId
//                 const response = await customAxios.get<PostImageDTO[]>(`/community/posts/${postId}/images`);
//                 setImages(response.data);
//             } catch (err) {
//                 console.error("Błąd pobierania listy zdjęć:", err);
//                 setError("Nie udało się załadować listy zdjęć.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchImages();
//
//     }, [postId]);
//
//
//     if (loading) return <p>Ładowanie zdjęć...</p>;
//     if (error) return <p style={{ color: 'red' }}>Błąd: {error}</p>;
//     if (images.length === 0) return <p>Brak zdjęć do wyświetlenia.</p>;
//
//     return (
//         <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
//             {images.map((img) => (
//                 <div key={img.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
//                     <img
//                         src={img.imageUrl}
//                         alt={img.filename}
//                         style={{ maxWidth: '300px', height: 'auto', display: 'block' }}
//                         onError={(e) => {
//                             e.currentTarget.src = 'https://via.placeholder.com/300?text=Błąd+Ładowania';
//                         }}
//                     />
//                     <p style={{ marginTop: '5px', fontSize: '12px' }}>{img.filename}</p>
//                 </div>
//             ))}
//         </div>
//     );
// };
//
// export default PostGallery;


// Plik: PostDetails.tsx
// import React, { useEffect, useState } from 'react';
// import customAxios from "../../../lib/customAxios.tsx";
// import AddCommentForm from "./AddComment.tsx";
// import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
//
// // --- INTERFEJSY ---
//
// interface User {
//     id: number;
//     username: string;
// }
//
// // Interfejs DTO dla zdjęć
// interface PostImageDTO {
//     id: number;
//     imageUrl: string; // URL do pobrania obrazu
//     filename: string;
//     mimeType: string;
// }
//
// interface Post {
//     id: number;
//     title: string;
//     content: string;
//     user: User;
//     createdAt: number[];
//     category?: { id: number, name: string };
//     images?: PostImageDTO[]; // ⭐ WAŻNE: Lista zdjęć jest tutaj!
// }
//
// interface PostCommentDTO {
//     id: number;
//     content: string;
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
// // --- KOMPONENT WYŚWIETLAJĄCY GALERIĘ ZDJĘĆ (Uproszczony) ---
//
// interface ImageGalleryProps {
//     images: PostImageDTO[];
// }
//
// // Używamy tego komponentu zamiast pierwotnego PostGallery,
// // ponieważ on tylko WYŚWIETLA, a nie POBIERA dane.
// const PostGalleryDisplay: React.FC<ImageGalleryProps> = ({ images }) => {
//     if (images.length === 0) return null; // Nie pokazujemy sekcji, jeśli brak zdjęć
//
//     return (
//         <div className="mt-6 border-t pt-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Zdjęcia:</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                 {images.map((img) => (
//                     <div
//                         key={img.id}
//                         className="relative overflow-hidden rounded-lg shadow-md border border-gray-200 cursor-pointer group"
//                     >
//                         <img
//                             src={img.imageUrl}
//                             alt={img.filename}
//                             className="w-full h-40 object-cover transition duration-300 group-hover:opacity-90"
//                             onError={(e) => {
//                                 // Dodajemy fallback obrazek na wypadek błędu ładowania
//                                 e.currentTarget.src = 'https://via.placeholder.com/300?text=Błąd+Ładowania';
//                             }}
//                         />
//                         <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
//                             {img.filename}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };
//
//
// // --- GŁÓWNY KOMPONENT PostDetails ---
//
// const PostDetails: React.FC<PostDetailProps> = ({ post, onBack }) => {
//     const [comments, setComments] = useState<PostCommentDTO[]>([]);
//     const [loadingComments, setLoadingComments] = useState(true);
//     const [commentsError, setCommentsError] = useState<string | null>(null);
//     const creationDate = parseDateArray(post.createdAt);
//     const categoryName = post.category?.name || 'Ogólne';
//     const [netScore, setNetScore] = useState<number>(0);
//     const [userVoteStatus, setUserVoteStatus] = useState<'upvote' | 'downvote' | null>(null);
//     const [voteError, setVoteError] = useState<string | null>(null);
//
//
//     // ⬅️ FUNKCJA POBIERAJĄCA KOMENTARZE
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
//     const fetchVoteStatus = async () => {
//         try {
//             const scoreResponse = await customAxios.get<number>(`community/posts/${post.id}/vote`);
//             setNetScore(scoreResponse.data);
//
//             const statusResponse = await customAxios.get<string | null>(`community/posts/${post.id}/vote/status`);
//
//             if (statusResponse.data) {
//                 setUserVoteStatus(statusResponse.data as 'upvote' | 'downvote');
//             } else {
//                 setUserVoteStatus(null);
//             }
//
//         } catch (err) {
//             console.error("Błąd pobierania statusu głosowania:", err);
//         }
//     };
//
//     // --- KOMPONENT SEKCJI GŁOSOWANIA ---
//     const VoteSection = () => (
//         <div className="flex items-center space-x-4 border p-3 rounded-lg bg-gray-50 mb-6">
//             <button
//                 className={`flex items-center p-2 rounded-full transition ${
//                     userVoteStatus === 'upvote' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//                 onClick={() => handleVote('upvote')}
//                 title="Upvote (Like)"
//             >
//                 <FaThumbsUp className="w-5 h-5" />
//             </button>
//
//             <span
//                 className={`text-xl font-bold ${
//                     netScore > 0 ? 'text-green-700' : netScore < 0 ? 'text-red-700' : 'text-gray-700'
//                 }`}
//             >
//                 {netScore}
//             </span>
//
//             <button
//                 className={`flex items-center p-2 rounded-full transition ${
//                     userVoteStatus === 'downvote' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//                 onClick={() => handleVote('downvote')}
//                 title="Downvote (Dislike)"
//             >
//                 <FaThumbsDown className="w-5 h-5" />
//             </button>
//
//             {voteError && (
//                 <span className="text-sm text-red-500 ml-4 font-medium">{voteError}</span>
//             )}
//         </div>
//     );
//
//     const handleVote = async (voteType: 'upvote' | 'downvote') => {
//         setVoteError(null);
//         try {
//             const response = await customAxios.post<number>(`community/posts/${post.id}/vote?type=${voteType}`);
//
//
//             setNetScore(response.data);
//
//
//             if (userVoteStatus === voteType) {
//                 // Kliknięto ten sam typ głosu: wycofanie (Un-vote)
//                 setUserVoteStatus(null);
//             } else {
//                 // Nowy głos lub zmiana głosu
//                 setUserVoteStatus(voteType);
//             }
//
//         } catch (err: any) {
//             console.error("Błąd głosowania:", err);
//             if (err.response?.status === 401) {
//                 setVoteError("Musisz być zalogowany, aby głosować!");
//             } else {
//                 setVoteError("Wystąpił błąd podczas oddawania głosu.");
//             }
//         }
//     };
//
//     useEffect(() => {
//         fetchComments();
//         fetchVoteStatus();
//     }, [post.id]);
//
//
//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
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
//                 {/* Sekcja Głosowania */}
//                 <VoteSection />
//                 <hr className="mb-6" />
//
//                 {/* Treść Posta */}
//                 <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
//                     <p>{post.content}</p>
//                 </div>
//
//                 {/* ⭐ ZINTEGROWANA SEKCJA: WYŚWIETLANIE ZDJĘĆ ⭐ */}
//                 {(post.images && post.images.length > 0) && (
//                     <PostGalleryDisplay images={post.images} />
//                 )}
//                 {/* ⭐ KONIEC ZINTEGROWANEJ SEKCJI ZDJĘĆ ⭐ */}
//
//                 <hr className="mt-8 mb-8" />
//
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Komentarze ({comments.length})</h2>
//
//                 {loadingComments && (<p className="text-gray-500">Ładowanie komentarzy...</p>)}
//                 {commentsError && (<p className="text-red-600 font-semibold">{commentsError}</p>)}
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
//                                             <span className="font-bold text-gray-800">{comment.username}</span>
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


// Plik: PostDetails.tsx
import React, { useEffect, useState } from 'react';
import customAxios from "../../../lib/customAxios.tsx";
import AddCommentForm from "./AddComment.tsx";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';


// --- INTERFEJSY ---

interface User {
    id: number;
    username: string;
}

// ⭐ INTERFEJS DTO DLA ZDJĘĆ
interface PostImageDTO {
    id: number;
    imageUrl: string; // URL do pobrania obrazu
    filename: string;
    mimeType: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    user: User;
    createdAt: number[];
    category?: { id: number, name: string };
    // UWAGA: Usunięto 'images?: PostImageDTO[]' z tego interfejsu,
    // ponieważ będą one ładowane oddzielnie przez PostGallery!
}

interface PostCommentDTO {
    id: number;
    content: string;
    userId: number;
    username: string;
    createdAt: number[];
}

interface PostDetailProps {
    post: Post;
    onBack: () => void;
}


// --- FUNKCJE POMOCNICZE (bez zmian) ---

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


// 🖼️ KOMPONENT POSTGALLERY Z WŁASNĄ LOGIKĄ POBIERANIA ZDJĘĆ
interface PostGalleryProps {
    postId: number;
}

const PostGallery: React.FC<PostGalleryProps> = ({ postId }) => {

    const [images, setImages] = useState<PostImageDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!postId) {
            console.warn("PostGallery: postId jest pusty — przerwano fetch.");
            setLoading(false);
            return;
        }

        const fetchImages = async () => {
            setLoading(true);
            try {
                // ⭐ PRZYWRÓCONA LOGIKA POBIERANIA ZDJĘĆ Z BACKENDU
                const response = await customAxios.get<PostImageDTO[]>(`/community/posts/${postId}/images`);
                setImages(response.data);
                console.log(response.data);
            } catch (err) {
                console.error("Błąd pobierania listy zdjęć:", err);
                setError("Nie udało się załadować listy zdjęć.");
            } finally {
                setLoading(false);
            }
        };

        fetchImages();

    }, [postId]);


    if (loading) return <p className="text-blue-500 mt-4">Ładowanie zdjęć...</p>;
    if (error) return <p style={{ color: 'red' }} className="mt-4">Błąd: {error}</p>;
    if (images.length === 0) return <p className="text-gray-500 mt-4 italic">Brak zdjęć do wyświetlenia.</p>;


    return (
        <div className="mt-6 border-t pt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Zdjęcia:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img) => (
                    <div
                        key={img.id}
                        className="relative overflow-hidden rounded-lg shadow-md border border-gray-200 cursor-pointer group"
                    >
                        <img
                            src={img.imageUrl}
                            alt={img.filename}
                            className="w-full h-40 object-cover transition duration-300 group-hover:opacity-90"
                            onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/300x300?text=Błąd+Ładowania';
                            }}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                            {img.filename}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- GŁÓWNY KOMPONENT PostDetails ---

const PostDetails: React.FC<PostDetailProps> = ({ post, onBack }) => {
    // ... Logika stanów i funkcji pomocniczych (fetchComments, fetchVoteStatus, handleVote) bez zmian ...
    const [comments, setComments] = useState<PostCommentDTO[]>([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [commentsError, setCommentsError] = useState<string | null>(null);
    const creationDate = parseDateArray(post.createdAt);
    const categoryName = post.category?.name || 'Ogólne';
    const [netScore, setNetScore] = useState<number>(0);
    const [userVoteStatus, setUserVoteStatus] = useState<'upvote' | 'downvote' | null>(null);
    const [voteError, setVoteError] = useState<string | null>(null);

    // FUNKCJA POBIERAJĄCA KOMENTARZE
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

    const fetchVoteStatus = async () => {
        try {
            const scoreResponse = await customAxios.get<number>(`community/posts/${post.id}/vote`);
            setNetScore(scoreResponse.data);

            const statusResponse = await customAxios.get<string | null>(`community/posts/${post.id}/vote/status`);

            if (statusResponse.data) {
                setUserVoteStatus(statusResponse.data as 'upvote' | 'downvote');
            } else {
                setUserVoteStatus(null);
            }

        } catch (err) {
            console.error("Błąd pobierania statusu głosowania:", err);
        }
    };

    // KOMPONENT SEKCJI GŁOSOWANIA
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

    const handleVote = async (voteType: 'upvote' | 'downvote') => {
        setVoteError(null);
        try {
            const response = await customAxios.post<number>(`community/posts/${post.id}/vote?type=${voteType}`);

            setNetScore(response.data);

            if (userVoteStatus === voteType) {
                setUserVoteStatus(null);
            } else {
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

                {/* Sekcja Głosowania */}
                <VoteSection />
                <hr className="mb-6" />

                {/* Treść Posta */}
                <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
                    <p>{post.content}</p>
                </div>

                {/* 🖼️ ZINTEGROWANA GALERIA POBIERAJĄCA ZDJĘCIA */}
                <PostGallery postId={post.id} />
                {/* PostGallery teraz samodzielnie wykona:
                   GET /community/posts/{post.id}/images
                */}

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