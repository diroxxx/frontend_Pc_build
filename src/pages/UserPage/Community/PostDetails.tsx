import React, { useEffect, useState } from 'react';
import customAxios from "../../../lib/customAxios.tsx";
import AddCommentForm from "./AddComment.tsx";
import {FaThumbsUp, FaThumbsDown, FaChevronLeft, FaChevronRight, FaUserCircle, FaTimes, FaEdit} from 'react-icons/fa';
import {timeAgo} from "./PostTime.tsx";
import {useAtom} from "jotai";
import {userAtom} from "../../../atomContext/userAtom.tsx";


interface User {
    id: number;
    username: string;
}

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
// KONIEC: Przeniesione funkcje czasowe


interface PostGalleryProps {
    postId: number;
}

const PostGallery: React.FC<PostGalleryProps> = ({ postId }) => {
    const [images, setImages] = useState<PostImageDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!postId) {
            setLoading(false);
            return;
        }

        const fetchImages = async () => {
            setLoading(true);
            try {
                const response = await customAxios.get<PostImageDTO[]>(
                    `/community/posts/${postId}/images`
                );
                setImages(response.data);
            } catch (err) {
                console.error("Błąd pobierania zdjęć:", err);
                setError("Nie udało się załadować listy zdjęć.");
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [postId]);

    const prevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (loading) return <p className="text-blue-500 mt-4">Ładowanie zdjęć...</p>;
    if (error) return <p className="text-red-500 mt-4">{error}</p>;
    if (images.length === 0) return <p className="text-gray-500 mt-4 italic">Brak zdjęć do wyświetlenia.</p>;

    return (
        <div className="mt-6">
            {/*<h3 className="text-xl font-bold text-gray-800 mb-4">Galeria zdjęć:</h3>*/}

            <div className="relative w-full max-w-3xl mx-auto">
                {/* Duże zdjęcie */}
                <img
                    src={images[currentIndex].imageUrl}
                    alt={images[currentIndex].filename}
                    className="w-full aspect-square object-cover rounded-lg shadow-md"
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/600x338?text=Błąd+ładowania";
                    }}
                />

                {/* Strzałki do przewijania */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition"
                        >
                            <FaChevronRight />
                        </button>
                    </>
                )}

                {images.length > 1 && (
                    <div className="flex justify-center mt-4 space-x-2 overflow-x-auto">
                        {images.map((img, index) => (
                            <img
                                key={img.id}
                                src={img.imageUrl}
                                alt={img.filename}
                                className={`w-20 aspect-square object-cover rounded cursor-pointer border-2 ${
                                    index === currentIndex ? "border-blue-500" : "border-transparent"
                                }`}
                                onClick={() => setCurrentIndex(index)}
                                onError={(e) => {
                                    e.currentTarget.src = "https://placehold.co/100x100?text=Błąd+ładowania";
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


const PostDetails: React.FC<PostDetailProps> = ({ post, onBack }) => {
    const [comments, setComments] = useState<PostCommentDTO[]>([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [commentsError, setCommentsError] = useState<string | null>(null);
    const creationDate = parseDateArray(post.createdAt);
    const categoryName = post.category?.name || 'Ogólne';
    const [netScore, setNetScore] = useState<number>(0);
    const [userVoteStatus, setUserVoteStatus] = useState<'upvote' | 'downvote' | null>(null);
    const [voteError, setVoteError] = useState<string | null>(null);
    const [commentSort, setCommentSort] = useState<'newest' | 'oldest'>('newest')
    const [isEditing, setIsEditing] = useState(false);
    // Stan do przechowywania aktualnej treści posta (aby odświeżyć widok po edycji)
    const [currentContent, setCurrentContent] = useState(post.content);


    const [user] = useAtom(userAtom);
    const isAuthor = user && user.nickname === post.user.username;

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


    const VoteSection = () => (
        <div className="inline-flex items-center space-x-4 border p-3 rounded-lg bg-gray-50 mb-6">
            <button
                className={`flex items-center p-2 rounded-full transition ${
                    userVoteStatus === 'upvote' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleVote('upvote')}
                title="Upvote (Like)"
            >
                <FaThumbsUp className="w-5 h-5"/>
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
                <FaThumbsDown className="w-5 h-5"/>
            </button>

            {voteError && (
                <span className="text-sm text-red-500 ml-4 font-medium">{voteError}</span>
            )}
        </div>
    );

    const getSortedComments = () => {
        // Tworzymy kopię, aby sortowanie nie modyfikowało stanu
        const sortedComments = [...comments];

        sortedComments.sort((a, b) => {
            // Używamy zdefiniowanej wcześniej funkcji parseDateArray
            const dateA = parseDateArray(a.createdAt).getTime();
            const dateB = parseDateArray(b.createdAt).getTime();

            // 'newest' (najnowsze) = dateB - dateA (malejąco)
            // 'oldest' (najstarsze) = dateA - dateB (rosnąco)
            return commentSort === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return sortedComments;
    };

    const handleUpdateContent = async (updatedContent: string) => {
        const updatedData = {content: updatedContent};

        try {
            await customAxios.put(`community/posts/${post.id}`, updatedData);

            // 1. Zaktualizuj lokalny stan treści, aby widok od razu się zmienił
            setCurrentContent(updatedContent);
            // 2. Wyłącz tryb edycji
            setIsEditing(false);

            alert("Treść posta została zaktualizowana!");

        } catch (err: any) {
            console.error("Błąd aktualizacji posta:", err);
            alert("Nie udało się zaktualizować treści posta. Sprawdź konsolę.");
        }
    };

    const EditForm: React.FC = () => {
        const [content, setContent] = useState(currentContent);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!content.trim()) {
                setError('Treść nie może być pusta!');
                return;
            }
            if (content === currentContent) {
                setIsEditing(false); // Nic się nie zmieniło
                return;
            }

            setLoading(true);
            setError(null);
            await handleUpdateContent(content); // Wywołaj funkcję aktualizującą
            setLoading(false);
        };

        return (
            <div className="bg-gray-50 p-6 rounded-lg my-6 border border-blue-200">
                <h3 className="text-xl font-bold mb-4 text-blue-700">Edytujesz treść posta:</h3>

                <form onSubmit={handleSubmit}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                    />

                    {error && <p className="text-red-600 font-medium mt-2">{error}</p>}

                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-gray-400"
                            disabled={loading || !content.trim()}
                        >
                            {loading ? 'Zapisywanie...' : 'Zapisz Zmiany'}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    const handleDeletePost = async () => {
        if (!isAuthor) {
            alert("Nie masz uprawnień do usunięcia tego posta.");
            return;
        }

        if (window.confirm("Czy na pewno chcesz usunąć ten post? Tej operacji nie można cofnąć!")) {
            try {
                await customAxios.delete(`/community/posts/${post.id}`);

                alert(`Post "${post.title}" został pomyślnie usunięty.`);

                onBack();

            } catch (error: any) {
                console.error("Błąd usuwania posta:", error);
                const errorMessage = error.response?.data?.message || 'Wystąpił nieznany błąd podczas usuwania posta.';
                alert(`Błąd: ${errorMessage}`);
            }
        }
    };

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

    const sortedComments = getSortedComments();
//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             <button
//                 className="mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-medium transition"
//                 onClick={onBack}
//             >
//                 ← Powrót do Forum
//             </button>
//
//             {/*<div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-2xl border-t-4 border-blue-600">*/}
//             {/* ⭐ ZMODYFIKOWANY KONTENER GŁÓWNY POSTA ⭐ */}
//             <div className="relative max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-2xl border-t-4 border-blue-600">
//                 {isAuthor && (
//                     <div className="absolute top-4 right-4 flex space-x-2">
//                         <button
//                             onClick={handleEditPost}
//                             className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-150"
//                             title="Edytuj post"
//                         >
//                             <FaEdit className="w-4 h-4" />
//                         </button>
//                         <button
//                             onClick={handleDeletePost}
//                             className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-150"
//                             title="Usuń post"
//                         >
//                             <FaTimes className="w-4 h-4" />
//                         </button>
//                     </div>
//                 )}
//                 {/* Reszta zawartości posta jest tutaj */}
//                 {/* ... (pozostały kod PostDetails - nagłówek, galeria, treść itd.) ... */}
//
//                 {/* ⭐ ZMODYFIKOWANA SEKCJA NAGŁÓWKA ⭐ */}
//                 <div className="flex items-center mb-4">
//                     {/* Ramka Kategori (styl 'pigułki' z turkusowym tłem) */}
//                     <span className="inline-block bg-teal-500 text-white text-base font-bold px-3 py-1  mr-4 shadow-md">
//                         {categoryName}
//                     </span>
//
//                     {/* Tytuł Posta */}
//                     <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{post.title}</h1>
//                 </div>
//
//                 <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
//
//
//                     <span>Autor: <strong className="text-gray-700">{post.user.username}</strong></span>
//                     <span>|</span>
//                     <span>Opublikowano: {formatDate(creationDate)}</span>
//                 </div>
//
//                 <hr className="my-8 border-gray-300"/>
//
//
//                 <PostGallery postId={post.id}/>
//
//                 <hr className="my-4 border-gray-300"/>
//
//                 <VoteSection/>
//
//                 <hr className="my-4 border-black"/>
//
//
//                 <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap my-8">
//                     <p>{post.content}</p>
//                 </div>
//
//                 <hr className="my-8 border-black"/>
//
//                 {/* ⭐ ZMODYFIKOWANA SEKCJA KOMENTARZY - NAGŁÓWEK I SORTOWANIE ⭐ */}
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-2xl font-bold text-gray-800">Komentarze ({comments.length})</h2>
//
//                     {comments.length > 1 && (
//                         <select
//                             value={commentSort}
//                             onChange={(e) => setCommentSort(e.target.value as 'newest' | 'oldest')}
//                             className="p-2 border border-gray-300 rounded text-sm bg-white"
//                         >
//                             <option value="newest">Najnowsze</option>
//                             <option value="oldest">Najstarsze</option>
//                         </select>
//                     )}
//                 </div>
//                 {/* KONIEC NAGŁÓWKA SORTOWANIA */}
//
//                 {loadingComments && (<p className="text-gray-500">Ładowanie komentarzy...</p>)}
//                 {commentsError && (<p className="text-red-600 font-semibold">{commentsError}</p>)}
//
//
//
//                 {!loadingComments && !commentsError && (
//                     <div className="space-y-4">
//                         {comments.length === 0 ? (
//                             <p className="text-gray-500 italic">Brak komentarzy. Bądź pierwszy!</p>
//                         ) : (
//                             sortedComments.map(comment => {
//                                 const commentDate = parseDateArray(comment.createdAt);
//                                 return (
//                                     <div key={comment.id} className="bg-gray-50 p-4 rounded border border-gray-200">
//                                         <div className="flex justify-between items-start text-sm mb-1">
//                                             {/* ⭐ ZAKTUALIZOWANA SEKCJA NAZWY UŻYTKOWNIKA KOMENTARZA ⭐ */}
//                                             <div className="flex items-center space-x-2"> {/* Kontener dla ikony i nazwy */}
//                                                 <FaUserCircle className="w-4 h-4 text-gray-500" /> {/* Ikona */}
//                                                 <span className="font-bold text-gray-800">{comment.username}</span> {/* Nazwa użytkownika */}
//                                             </div>
//                                             {/* KONIEC ZAKTUALIZOWANEJ SEKCJI */}
//
//                                             <div className="text-right text-gray-500 text-xs">
//                                                 <span className="block">{formatDate(commentDate)}</span>
//                                                 <span className="block font-medium text-gray-600">
//                                     ({timeAgo(commentDate)})
//                                 </span>
//                                             </div>
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
//             </div>
//         </div>
//     );
// };
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <button
                className="mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-medium transition"
                onClick={onBack}
            >
                ← Powrót do Forum
            </button>

            {/* ⭐ GŁÓWNY KONTENER POSTA - POZYCJONOWANIE IKON ⭐ */}
            <div className="relative max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-2xl border-t-4 border-blue-600">

                {/* IKONY EDYCJI/USUWANIA (WARUNKOWE) */}
                {isAuthor && !isEditing && (
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                            onClick={() => setIsEditing(true)} // ⭐ PRZEŁĄCZANIE W TRYB EDYCJI ⭐
                            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-150"
                            title="Edytuj post"
                        >
                            <FaEdit className="w-4 h-4"/>
                        </button>
                        <button
                            onClick={handleDeletePost}
                            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-150"
                            title="Usuń post"
                        >
                            <FaTimes className="w-4 h-4"/>
                        </button>
                    </div>
                )}

                {/* ⭐ ZMODYFIKOWANA SEKCJA NAGŁÓWKA ⭐ */}
                <div className="flex items-center mb-4">
                    <span
                        className="inline-block bg-teal-500 text-white text-base font-bold px-3 py-1 rounded-full mr-4 shadow-md">
                        {categoryName}
                    </span>
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{post.title}</h1>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
                    <span className="flex items-center space-x-1">
                        <span>Autor:</span>
                        <span className="flex items-center space-x-1 text-gray-700 font-bold">
                            <FaUserCircle className="w-4 h-4 text-gray-500"/>
                            <span>{post.user.username}</span>
                        </span>
                    </span>
                    <span>|</span>
                    <span>Opublikowano: {formatDate(creationDate)}</span>
                </div>

                <hr className="my-8 border-gray-300"/>

                <PostGallery postId={post.id}/>

                <hr className="my-4 border-gray-300"/>

                <VoteSection/>

                <hr className="my-4 border-black"/>

                {/* ⭐ WARUNKOWE RENDEROWANIE TREŚCI LUB FORMULARZA EDYCJI ⭐ */}
                {isEditing ? (
                    <EditForm/>
                ) : (
                    <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap my-8">
                        <p>{currentContent}</p> {/* Wyświetla zaktualizowaną treść */}
                    </div>
                )}

                <hr className="my-8 border-black"/>

                {/* ⭐ SEKCJA KOMENTARZY I SORTOWANIA ⭐ */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Komentarze ({comments.length})</h2>

                    {comments.length > 1 && (
                        <select
                            value={commentSort}
                            onChange={(e) => setCommentSort(e.target.value as 'newest' | 'oldest')}
                            className="p-2 border border-gray-300 rounded text-sm bg-white"
                        >
                            <option value="newest">Najnowsze</option>
                            <option value="oldest">Najstarsze</option>
                        </select>
                    )}
                </div>

                {loadingComments && (<p className="text-gray-500">Ładowanie komentarzy...</p>)}
                {commentsError && (<p className="text-red-600 font-semibold">{commentsError}</p>)}

                {!loadingComments && !commentsError && (
                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 italic">Brak komentarzy. Bądź pierwszy!</p>
                        ) : (
                            sortedComments.map(comment => {
                                const commentDate = parseDateArray(comment.createdAt);
                                // const isCommentAuthor = user && user.nickname === comment.userId; // Sprawdzenie autora komentarza

                                return (
                                    <div key={comment.id}
                                         className="bg-gray-50 p-4 rounded border border-gray-200 relative">

                                        {/* Ikony edycji/usuwania komentarzy (jeśli są zaimplementowane) */}

                                        <div className="flex justify-between items-start text-sm mb-1">
                                            <div className="flex items-center space-x-2">
                                                <FaUserCircle className="w-4 h-4 text-gray-500"/>
                                                <span className="font-bold text-gray-800">{comment.username}</span>
                                            </div>

                                            <div className="text-right text-gray-500 text-xs">
                                                <span className="block">{formatDate(commentDate)}</span>
                                                <span className="block font-medium text-gray-600">
                                                    ({timeAgo(commentDate)})
                                                </span>
                                            </div>
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
}

export default PostDetails;