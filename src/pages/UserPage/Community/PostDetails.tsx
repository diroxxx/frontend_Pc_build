import React, { useEffect, useState } from 'react';
import customAxios from "../../../lib/customAxios.tsx";
import AddCommentForm from "./AddComment.tsx";
import {
    FaThumbsUp,
    FaThumbsDown,
    FaChevronLeft,
    FaChevronRight,
    FaUserCircle,
    FaTimes,
    FaEdit,
    FaBookmark, FaRegBookmark
} from 'react-icons/fa';
import {timeAgo} from "./PostTime.tsx";
import {useAtom} from "jotai";
import {userAtom} from "../../../atomContext/userAtom.tsx";
import { Dialog } from "@mui/material";
import {getCategoryColor} from "./categoryUtils.tsx";


interface User {
    id: number;
    username: string;
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

interface PostGalleryProps {
    postId: number;
}

const PostGallery: React.FC<PostGalleryProps> = ({ postId }) => {
    const [images, setImages] = useState<PostImageDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


//     useEffect(() => {
//         if (!postId) {
//             setLoading(false);
//             return;
//         }
//
//         const fetchImages = async () => {
//             setLoading(true);
//             try {
//                 const response = await customAxios.get<PostImageDTO[]>(
//                     `/community/posts/${postId}/images`
//                 );
//                 setImages(response.data);
//             } catch (err) {
//                 console.error("Błąd pobierania zdjęć:", err);
//                 setError("Nie udało się załadować listy zdjęć.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchImages();
//     }, [postId]);
//
//     const prevImage = () => {
//         setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//     };
//
//     const nextImage = () => {
//         setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
//     };
//
//     if (loading) return <p className="text-blue-500 mt-4">Ładowanie zdjęć...</p>;
//     if (error) return <p className="text-red-500 mt-4">{error}</p>;
//     if (images.length === 0) return <p className="text-gray-500 mt-4 italic">Brak zdjęć do wyświetlenia.</p>;
//
//     return (
//         <div className="mt-6">
//             {/*<h3 className="text-xl font-bold text-gray-800 mb-4">Galeria zdjęć:</h3>*/}
//
//             <div className="relative w-full max-w-3xl mx-auto">
//                 {/* Duże zdjęcie */}
//                 <img
//                     src={images[currentIndex].imageUrl}
//                     alt={images[currentIndex].filename}
//                     className="w-full aspect-square object-cover rounded-lg shadow-md"
//                     onError={(e) => {
//                         e.currentTarget.src = "https://placehold.co/600x338?text=Błąd+ładowania";
//                     }}
//                 />
//
//                 {/* Strzałki do przewijania */}
//                 {images.length > 1 && (
//                     <>
//                         <button
//                             onClick={prevImage}
//                             className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition"
//                         >
//                             <FaChevronLeft />
//                         </button>
//                         <button
//                             onClick={nextImage}
//                             className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition"
//                         >
//                             <FaChevronRight />
//                         </button>
//                     </>
//                 )}
//
//                 {images.length > 1 && (
//                     <div className="flex justify-center mt-4 space-x-2 overflow-x-auto">
//                         {images.map((img, index) => (
//                             <img
//                                 key={img.id}
//                                 src={img.imageUrl}
//                                 alt={img.filename}
//                                 className={`w-20 aspect-square object-cover rounded cursor-pointer border-2 ${
//                                     index === currentIndex ? "border-blue-500" : "border-transparent"
//                                 }`}
//                                 onClick={() => setCurrentIndex(index)}
//                                 onError={(e) => {
//                                     e.currentTarget.src = "https://placehold.co/100x100?text=Błąd+ładowania";
//                                 }}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
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

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation(); // Zapobiega zamykaniu modala przy kliknięciu strzałki
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation(); // Zapobiega zamykaniu modala przy kliknięciu strzałki
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (loading) return <p className="text-blue-500 mt-4">Ładowanie zdjęć...</p>;
    if (error) return <p className="text-red-500 mt-4">{error}</p>;
    if (images.length === 0) return <p className="text-gray-500 mt-4 italic">Brak zdjęć do wyświetlenia.</p>;

    return (
        <div className="mt-6">
            <div className="relative w-full max-w-3xl mx-auto">
                {/* Duże zdjęcie - dodano onClick i cursor-pointer */}
                <img
                    src={images[currentIndex].imageUrl}
                    alt={images[currentIndex].filename}
                    onClick={handleOpen} // <-- KLIKNIĘCIE OTWIERA MODAL
                    className="w-full aspect-square object-cover rounded-lg shadow-md cursor-pointer hover:opacity-95 transition" // <-- DODANO cursor-pointer
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/600x338?text=Błąd+ładowania";
                    }}
                />

                {/* Strzałki do przewijania (widok standardowy) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => prevImage(e)}
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={(e) => nextImage(e)}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition"
                        >
                            <FaChevronRight />
                        </button>
                    </>
                )}

                {/* Miniatury */}
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

            {/* --- MODAL MUI (LIGHTBOX) --- */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="xl" // Pozwala na bardzo szeroki modal
                PaperProps={{
                    style: {
                        backgroundColor: 'transparent', // Przezroczyste tło "kartki" dialogu
                        boxShadow: 'none', // Usunięcie cienia
                        overflow: 'hidden'
                    }
                }}
                slotProps={{
                    backdrop: {
                        style: { backgroundColor: 'rgba(0, 0, 0, 0.9)' } // Ciemniejsze tło za zdjęciem
                    }
                }}
            >
                <div className="relative flex items-center justify-center outline-none">
                    {/* Przycisk zamknięcia */}
                    <button
                        onClick={handleClose}
                        className="absolute -top-10 right-0 text-white hover:text-gray-300 z-50 text-3xl"
                    >
                        <FaTimes />
                    </button>

                    {/* Strzałka Lewa w Modalu */}
                    {images.length > 1 && (
                        <button
                            onClick={prevImage}
                            className="absolute left-0 md:-left-12 text-white p-2 hover:bg-white/10 rounded-full transition z-50"
                        >
                            <FaChevronLeft size={40} />
                        </button>
                    )}

                    {/* Zdjęcie w pełnym rozmiarze */}
                    <img
                        src={images[currentIndex].imageUrl}
                        alt={images[currentIndex].filename}
                        className="max-h-[90vh] max-w-[90vw] object-contain rounded"
                    />

                    {/* Strzałka Prawa w Modalu */}
                    {images.length > 1 && (
                        <button
                            onClick={nextImage}
                            className="absolute right-0 md:-right-12 text-white p-2 hover:bg-white/10 rounded-full transition z-50"
                        >
                            <FaChevronRight size={40} />
                        </button>
                    )}
                </div>
            </Dialog>
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
    const [currentContent, setCurrentContent] = useState(post.content);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const closeToast = () => setToastMessage(null);
    const [commentVotes, setCommentVotes] = useState<Record<number, number>>({});
    const [commentUserVote, setCommentUserVote] = useState<Record<number, 'upvote' | 'downvote' | null>>({});

    const [user] = useAtom(userAtom);
    // const isAuthor = user && user.nickname === post.user.username;
    const isAuthor = user && post.user && user.nickname === post.user.username;
    const [isSaved, setIsSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

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
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [post.id]);

    useEffect(() => {
        if (showDeleteModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showDeleteModal]);

    // 1. Sprawdź przy załadowaniu, czy post jest już zapisany
    useEffect(() => {
        const checkSavedStatus = async () => {
            // Sprawdzamy tylko jeśli użytkownik jest zalogowany
            if (user) {
                try {
                    const response = await customAxios.get<boolean>(`/community/posts/${post.id}/isSaved`);
                    setIsSaved(response.data);
                } catch (error) {
                    console.error("Błąd sprawdzania statusu zapisu:", error);
                }
            }
        };
        checkSavedStatus();
    }, [post.id, user]);

// 2. Funkcja obsługująca kliknięcie w zakładkę
    const handleToggleSave = async () => {
        if (!user) {
            setToastMessage({ message: "Musisz być zalogowany, aby zapisać post.", type: 'error' });
            return;
        }

        if (saveLoading) return;
        setSaveLoading(true);

        const previousState = isSaved;
        setIsSaved(!isSaved);

        try {
            if (!previousState) {
                // Jeśli nie był zapisany -> ZAPISZ
                await customAxios.post(`/community/posts/${post.id}/save`);
                setToastMessage({ message: "Post został zapisany!", type: 'success' });
            } else {
                // Jeśli był zapisany -> USUŃ Z ZAPISANYCH
                await customAxios.delete(`/community/posts/${post.id}/unsave`);
                setToastMessage({ message: "Post usunięty z zapisanych.", type: 'success' });
            }
        } catch (error: any) {
            console.error("Błąd zapisu:", error);
            setIsSaved(previousState); // Cofnij zmianę ikonki w razie błędu

            // --- NAPRAWA: Bezpieczne wyciąganie treści błędu ---
            let errMsg = "Wystąpił błąd podczas zapisywania.";

            // Sprawdzamy co dokładnie przyszło z backendu
            if (error.response && error.response.data) {
                const data = error.response.data;

                // Jeśli backend zwrócił obiekt { message: "...", status: ... }
                if (typeof data === 'object' && data.message) {
                    errMsg = data.message;
                }
                // Jeśli backend zwrócił czysty tekst
                else if (typeof data === 'string') {
                    errMsg = data;
                }
            }

            setToastMessage({ message: errMsg, type: 'error' });
        } finally {
            setSaveLoading(false);
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

    const fetchCommentVotes = async () => {
        try {
            const newNetScores: Record<number, number> = {};
            const newUserVotes: Record<number, 'upvote' | 'downvote' | null> = {};

            for (const comment of comments) {
                // NET SCORE komentarza
                const scoreRes = await customAxios.get<number>(
                    `/community/comments/${comment.id}/vote`
                );
                newNetScores[comment.id] = scoreRes.data;

                // STATUS użytkownika
                const statusRes = await customAxios.get<string | null>(
                    `/community/comments/${comment.id}/vote/status`
                );

                const status = statusRes.data;
                newUserVotes[comment.id] =
                    status === 'upvote' || status === 'downvote' ? status : null;
            }

            setCommentVotes(newNetScores);
            setCommentUserVote(newUserVotes);

        } catch (err) {
            console.error("Błąd pobierania głosów komentarzy:", err);
        }
    };


    const VoteSection = () => (
        <div className="inline-flex items-center space-x-4 border p-3 rounded-lg bg-gray-50 mb-6">
            {/* PRZYCISK LIKE */}
            <button
                className={`flex items-center p-2 rounded-full transition ${
                    !user ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                    userVoteStatus === 'upvote'
                        ? 'bg-blue-600 text-white'
                        : `bg-gray-200 text-gray-700 ${user ? 'hover:bg-gray-300' : ''}`
                }`}
                onClick={() => handleVote('upvote')}
                title="Upvote (Like)"
            >
                <FaThumbsUp className="w-5 h-5"/>
            </button>

            {/* WYNIK PUNKTOWY */}
            <span
                className={`text-xl font-bold ${
                    netScore > 0 ? 'text-gray-700' : netScore < 0 ? 'text-red-700' : 'text-gray-700'
                }`}
            >
                {netScore}
            </span>

            {/* PRZYCISK DISLIKE */}
            <button
                className={`flex items-center p-2 rounded-full transition ${
                    !user ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                    userVoteStatus === 'downvote'
                        ? 'bg-red-600 text-white'
                        : `bg-gray-200 text-gray-700 ${user ? 'hover:bg-gray-300' : ''}`
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
        const sortedComments = [...comments];

        sortedComments.sort((a, b) => {
            const dateA = parseDateArray(a.createdAt).getTime();
            const dateB = parseDateArray(b.createdAt).getTime();

            return commentSort === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return sortedComments;
    };

    const handleUpdateContent = async (updatedContent: string) => {
        const updatedData = {content: updatedContent};

        try {
            await customAxios.put(`community/posts/${post.id}`, updatedData);

            setCurrentContent(updatedContent);
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
                            className="px-4 py-2 bg-blue-700-600 text-white rounded hover:bg-green-700 transition disabled:bg-gray-400"
                            disabled={loading || !content.trim()}
                        >
                            {loading ? 'Zapisywanie...' : 'Zapisz Zmiany'}
                        </button>
                    </div>
                </form>
            </div>
        );
    };
    const handleInitiateDelete = () => {
        if (!isAuthor) {
            alert("Brak uprawnień do usunięcia tego posta.");
            return;
        }
        setShowDeleteModal(true);
    };


    const handleDeletePost = async () => {
        setDeleteLoading(true);

        try {
            await customAxios.delete(`/community/posts/delete/${post.id}`);

            setToastMessage({ message: `Pomyślnie usunięto post`, type: 'success' });

            setShowDeleteModal(false);
            setTimeout(onBack, 1000);

        } catch (error: any) {
            console.error("Błąd usuwania posta:", error);
            const errorMessage = error.response?.data?.message || 'Wystąpił nieznany błąd podczas usuwania posta.';


            setToastMessage({ message: `Nie udało się: ${errorMessage}`, type: 'error' });

            setShowDeleteModal(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    const DeleteConfirmationModal: React.FC = () => {
        if (!showDeleteModal) return null;

        return (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                {/* ⭐ OKNO MODALA ⭐ */}
                <div className="bg-gray-800 text-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">

                    {/* Ikona X do zamknięcia */}
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                        aria-label="Zamknij"
                    >
                        <FaTimes className="w-5 h-5"/>
                    </button>

                    {/* Nagłówek modala */}
                    <h3 className="text-2xl font-bold mb-2">Usunąć post?</h3>

                    {/* Treść / Wiadomość */}
                    <p className="text-gray-400 mb-8">
                        Czy na pewno chcesz usunąć post?
                    </p>

                    {/* Kontener przycisków */}
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition font-semibold"
                            disabled={deleteLoading}
                        >
                            Wróć
                        </button>
                        <button
                            onClick={handleDeletePost}
                            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold disabled:bg-red-400"
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? 'Usuwam...' : 'Tak, usuń'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    const ToastNotification: React.FC = () => {
        if (!toastMessage) return null;

        // Używamy setTimeout do automatycznego ukrycia po 4 sekundach
        useEffect(() => {
            const timer = setTimeout(closeToast, 4000);
            return () => clearTimeout(timer);
        }, [toastMessage]);

        // const bgColor = toastMessage.type === 'success' ? 'bg-green-600' : 'bg-red-600';
        const Icon = toastMessage.type === 'success' ? FaThumbsUp : FaTimes;


        return (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 p-4 rounded-xl shadow-2xl transition-opacity duration-300 z-50 flex items-center space-x-3 text-white" style={{ backgroundColor: '#2d2d2d' }}>
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{toastMessage.message}</span>
                <button onClick={closeToast} className="ml-4 text-gray-400 hover:text-white">
                    <FaTimes className="w-4 h-4" />
                </button>
            </div>
        );
    };

    const handleVote = async (voteType: 'upvote' | 'downvote') => {
        if (!user) {
            setToastMessage({
                message: "Musisz być zalogowany, aby oceniać posty.",
                type: 'error'
            });
            return;
        }
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
            // Tutaj też możemy użyć Toast zamiast małego tekstu erroru, jeśli wolisz
            if (err.response?.status === 401) {
                setToastMessage({ message: "Sesja wygasła. Zaloguj się ponownie.", type: 'error' });
            } else {
                setToastMessage({ message: "Wystąpił błąd podczas oddawania głosu.", type: 'error' });
            }
        }
    };

    const handleCommentVote = async (commentId: number, vote: 'upvote' | 'downvote') => {
        // --- ZMIANA: Blokada dla niezalogowanych ---
        if (!user) {
            setToastMessage({
                message: "Musisz być zalogowany, aby oceniać komentarze.",
                type: 'error'
            });
            return;
        }
        // -------------------------------------------

        try {
            const response = await customAxios.post(
                `/community/comments/${commentId}/vote?type=${vote}`
            );

            setCommentVotes(prev => ({
                ...prev,
                [commentId]: response.data
            }));

            setCommentUserVote(prev => ({
                ...prev,
                [commentId]: prev[commentId] === vote ? null : vote
            }));

        } catch (err) {
            console.error("Błąd głosowania na komentarz:", err);
            // Opcjonalnie: obsługa błędu z backendu
            setToastMessage({ message: "Wystąpił błąd podczas głosowania.", type: 'error' });
        }
    };

    useEffect(() => {
        fetchComments();
        fetchVoteStatus();
        fetchCommentVotes()
    }, [post.id]);


    const sortedComments = getSortedComments();


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <button
                className="mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-medium transition"
                onClick={onBack}
            >
                ← Powrót
            </button>

            {/* ⭐ GŁÓWNY KONTENER POSTA - POZYCJONOWANIE IKON ⭐ */}
            <div className="relative max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-2xl border-t-4 border-blue-600">
                {/* ⭐ IKONY W PRAWYM GÓRNYM ROGU (ZAPIS + EDYCJA/USUWANIE) ⭐ */}
                {!isEditing && (
                    <div className="absolute top-4 right-4 flex items-center space-x-2">

                        {/* Przycisk ZAPISZ (Widoczny dla zalogowanych) */}
                        {user && !isAuthor && (
                            <button
                                onClick={handleToggleSave}
                                disabled={saveLoading}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-150 group"
                                title={isSaved ? "Usuń z zapisanych" : "Zapisz post"}
                            >
                                {isSaved ? (
                                    <FaBookmark className="w-5 h-5 text-yellow-500 scale-110"/>
                                ) : (
                                    <FaRegBookmark className="w-5 h-5 text-gray-500 group-hover:text-yellow-600"/>
                                )}
                            </button>
                        )}

                        {/* Przyciski AUTORA (Edycja i Usuwanie) */}
                        {isAuthor && (
                            <>
                                <div className="h-6 w-px bg-gray-300 mx-2"></div>
                                {/* Separator */}

                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition duration-150"
                                    title="Edytuj post"
                                >
                                    <FaEdit className="w-4 h-4"/>
                                </button>

                                <button
                                    onClick={handleInitiateDelete}
                                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition duration-150"
                                    title="Usuń post"
                                >
                                    <FaTimes className="w-4 h-4"/>
                                </button>
                            </>
                        )}
                    </div>
                )}

                <div className="flex items-center mb-2">
                    <span className={`inline-block text-white text-xs font-semibold px-2 py-0.5 rounded-full mr-3 shadow-md ${getCategoryColor(post.category?.name)}`}>
                                        {categoryName}
                                    </span>
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                        {post.title}
                    </h1>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
                    <span className="flex items-center space-x-1">
                        <span>Autor:</span>
                        <span className="flex items-center space-x-1 text-gray-700 font-bold">
                            <FaUserCircle className="w-4 h-4 text-gray-500"/>
                            {/*<span>{post.user.username}</span>*/}
                            <span>{post.user?.username || "Nieznany"}</span>
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
                        <p>{currentContent}</p>
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
                                        {/*<div className="flex items-center space-x-4 mt-3">*/}

                                        {/*    <button*/}
                                        {/*        className={`p-1 rounded ${*/}
                                        {/*            commentUserVote[comment.id] === 'upvote'*/}
                                        {/*                ? 'text-white bg-blue-600'*/}
                                        {/*                : 'text-gray-600 bg-gray-200'*/}
                                        {/*        }`}*/}
                                        {/*        onClick={() => handleCommentVote(comment.id, 'upvote')}*/}
                                        {/*    >*/}
                                        {/*        <FaThumbsUp/>*/}
                                        {/*    </button>*/}

                                        {/*    <span className="font-bold text-gray-800">*/}
                                        {/*            {commentVotes[comment.id] ?? 0}*/}
                                        {/*     </span>*/}

                                        {/*    <button*/}
                                        {/*        className={`p-1 rounded ${*/}
                                        {/*            commentUserVote[comment.id] === 'downvote'*/}
                                        {/*                ? 'text-white bg-red-600'*/}
                                        {/*                : 'text-gray-600 bg-gray-200'*/}
                                        {/*        }`}*/}
                                        {/*        onClick={() => handleCommentVote(comment.id, 'downvote')}*/}
                                        {/*    >*/}
                                        {/*        <FaThumbsDown/>*/}
                                        {/*    </button>*/}

                                        {/*</div>*/}
                                        <div className="flex items-center space-x-4 mt-3">

                                            <button
                                                // Dodano warunek !user do stylów (opacity-50 i cursor-not-allowed)
                                                className={`p-1 rounded transition-colors ${
                                                    !user ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
                                                } ${
                                                    commentUserVote[comment.id] === 'upvote'
                                                        ? 'text-white bg-blue-600 hover:bg-blue-700'
                                                        : 'text-gray-600 bg-gray-200'
                                                }`}
                                                onClick={() => handleCommentVote(comment.id, 'upvote')}
                                                // Opcjonalnie: możesz dodać disabled={!user} jeśli wolisz,
                                                // ale wtedy Toast z komunikatem się nie pokaże.
                                                // Zostawiam bez disabled, aby funkcja handleCommentVote wyświetliła błąd.
                                            >
                                                <FaThumbsUp/>
                                            </button>

                                            <span className="font-bold text-gray-800">
        {commentVotes[comment.id] ?? 0}
    </span>

                                            <button
                                                className={`p-1 rounded transition-colors ${
                                                    !user ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
                                                } ${
                                                    commentUserVote[comment.id] === 'downvote'
                                                        ? 'text-white bg-red-600 hover:bg-red-700'
                                                        : 'text-gray-600 bg-gray-200'
                                                }`}
                                                onClick={() => handleCommentVote(comment.id, 'downvote')}
                                            >
                                                <FaThumbsDown/>
                                            </button>

                                        </div>
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

            <DeleteConfirmationModal/>
            <ToastNotification/>
        </div>
    );
};

export default PostDetails;