import React, { useEffect, useState } from 'react';
import customAxios from "../../lib/customAxios.tsx";
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
import {userAtom} from "../auth/atoms/userAtom.tsx";
import { Dialog } from "@mui/material";
import {getCategoryColor} from "./categoryUtils.tsx";
import { showToast } from '../../lib/ToastContainer.tsx';


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
    user?: User;
    authorName?:string;
    createdAt: number[];
    category?: { id: number, name: string };
    categoryName?: string;
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
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (loading) return <p className="text-ocean-teal mt-4">Ładowanie zdjęć...</p>;
    if (error) return <p className="text-red-500 mt-4">{error}</p>;
    if (images.length === 0) return <p className="text-gray-500 mt-4 italic">Brak zdjęć do wyświetlenia.</p>;

    return (
        <div className="mt-3">
            <div className="relative w-full max-w-lg mx-auto">
                <img
                    src={images[currentIndex].imageUrl}
                    alt={images[currentIndex].filename}
                    onClick={handleOpen}
                    className="w-full max-h-56 object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-95 transition"
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/600x338?text=Błąd+ładowania";
                    }}
                />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => prevImage(e)}
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-ocean-dark-blue bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={(e) => nextImage(e)}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-ocean-dark-blue bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition"
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
                                    index === currentIndex ? "border-ocean-blue" : "border-transparent"
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

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="xl"
                PaperProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        overflow: 'hidden'
                    }
                }}
                slotProps={{
                    backdrop: {
                        style: { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
                    }
                }}
            >
                <div className="relative flex items-center justify-center outline-none">
                    <button
                        onClick={handleClose}
                        className="absolute -top-10 right-0 text-white hover:text-gray-300 z-50 text-3xl"
                    >
                        <FaTimes />
                    </button>

                    {images.length > 1 && (
                        <button
                            onClick={prevImage}
                            className="absolute left-0 md:-left-12 text-white p-2 hover:bg-white/10 rounded-full transition z-50"
                        >
                            <FaChevronLeft size={40} />
                        </button>
                    )}

                    <img
                        src={images[currentIndex].imageUrl}
                        alt={images[currentIndex].filename}
                        className="max-h-[90vh] max-w-[90vw] object-contain rounded"
                    />

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
    // const categoryName = post.category?.name || 'Ogólne';
    const categoryName = post.categoryName || post.category?.name || 'Ogólne';    
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
    const [commentVotes, setCommentVotes] = useState<{ [key: number]: number }>({});
    const [commentUserVote, setCommentUserVote] = useState<{ [key: number]: "upvote" | "downvote" | null }>({});

    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editCommentText, setEditCommentText] = useState("");
    const [commentToDeleteId, setCommentToDeleteId] = useState<number | null>(null);
    const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);

    const [user] = useAtom(userAtom);
    // const isAuthor = user && post.user && user.nickname === post.user.username;
    const isAuthor = user && (
        (post.user && user.nickname === post.user.username) ||
        (post.authorName && user.nickname === post.authorName)
    );
    const [isSaved, setIsSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

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

    useEffect(() => {
        const checkSavedStatus = async () => {
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
                await customAxios.post(`/community/posts/${post.id}/save`);
                setToastMessage({ message: "Post został zapisany!", type: 'success' });
            } else {
                await customAxios.delete(`/community/posts/${post.id}/unsave`);
                setToastMessage({ message: "Post usunięty z zapisanych.", type: 'success' });
            }
        } catch (error: any) {
            console.error("Błąd zapisu:", error);
            setIsSaved(previousState);

            let errMsg = "Wystąpił błąd podczas zapisywania.";

            if (error.response && error.response.data) {
                const data = error.response.data;

                if (typeof data === 'object' && data.message) {
                    errMsg = data.message;
                }
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
                const scoreRes = await customAxios.get<number>(
                    `/community/comments/${comment.id}/vote`
                );
                newNetScores[comment.id] = scoreRes.data;

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


    const getSortedComments = () => {
        const sortedComments = [...comments];

        sortedComments.sort((a, b) => {
            const dateA = parseDateArray(a.createdAt).getTime();
            const dateB = parseDateArray(b.createdAt).getTime();

            return commentSort === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return sortedComments;
    };


    const startEditingComment = (commentId: number, currentContent: string) => {
        setEditingCommentId(commentId);
        setEditCommentText(currentContent);
    };

    const cancelEditingComment = () => {
        setEditingCommentId(null);
        setEditCommentText("");
    };

    const saveEditedComment = async (commentId: number) => {
        if (!editCommentText.trim()) {
            setToastMessage({ message: "Komentarz nie może być pusty.", type: 'error' });
            return;
        }

        try {
            await customAxios.put(`/community/comments/${commentId}`, {
                content: editCommentText
            });

            setComments(prev => prev.map(c =>
                c.id === commentId ? { ...c, content: editCommentText } : c
            ));

            setEditingCommentId(null);
            setToastMessage({ message: "Komentarz zaktualizowany!", type: 'success' });
        } catch (error) {
            console.error("Błąd edycji komentarza:", error);
            setToastMessage({ message: "Nie udało się edytować komentarza.", type: 'error' });
        }
    };

    const confirmDeleteComment = async () => {
        if (!commentToDeleteId) return;
        setDeleteCommentLoading(true);

        try {
            await customAxios.delete(`/community/comments/${commentToDeleteId}`);

            setComments(prev => prev.filter(c => c.id !== commentToDeleteId));

            setToastMessage({ message: "Komentarz usunięty.", type: 'success' });
            setCommentToDeleteId(null);
        } catch (error) {
            console.error("Błąd usuwania komentarza:", error);
            setToastMessage({ message: "Nie udało się usunąć komentarza.", type: 'error' });
        } finally {
            setDeleteCommentLoading(false);
        }
    };

    const DeleteCommentModal = () => {
        if (!commentToDeleteId) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-dark-surface rounded-xl shadow-2xl max-w-sm w-full p-6 border border-dark-border">
                    <h3 className="text-lg font-bold mb-2 text-dark-text">Usunąć komentarz?</h3>
                    <p className="text-dark-muted mb-6 text-sm">Tej operacji nie można cofnąć.</p>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setCommentToDeleteId(null)}
                            className="px-4 py-2 bg-dark-surface2 border border-dark-border text-dark-text rounded-lg hover:bg-dark-border transition"
                            disabled={deleteCommentLoading}
                        >
                            Anuluj
                        </button>
                        <button
                            onClick={confirmDeleteComment}
                            className="px-4 py-2 bg-ocean-red text-white rounded-lg hover:bg-ocean-red-hover transition"
                            disabled={deleteCommentLoading}
                        >
                            {deleteCommentLoading ? "Usuwanie..." : "Usuń"}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const handleUpdateContent = async (updatedContent: string) => {
        const updatedData = {content: updatedContent};

        try {
            await customAxios.put(`community/posts/${post.id}`, updatedData);

            setCurrentContent(updatedContent);
            setIsEditing(false);

            showToast.success("Treść posta została zaktualizowana!");

        } catch (err: any) {
            console.error("Błąd aktualizacji posta:", err);
            showToast.error("Nie udało się zaktualizować treści posta.");
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
                setIsEditing(false);
                return;
            }

            setLoading(true);
            setError(null);
            await handleUpdateContent(content);
            setLoading(false);
        };

        return (
            <div className="bg-dark-surface2 p-4 rounded-lg my-4 border border-blue-500/30">
                <h3 className="text-sm font-bold mb-3 text-ocean-blue">Edytujesz treść posta:</h3>

                <form onSubmit={handleSubmit}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        required
                        className="w-full p-2 border border-dark-border rounded-lg bg-dark-surface text-dark-text focus:outline-none focus:ring-2 focus:ring-dark-accent/40 text-sm"
                        disabled={loading}
                    />

                    {error && <p className="text-ocean-red font-medium mt-2 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-3 mt-3">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1.5 bg-dark-surface2 border border-dark-border text-dark-text rounded-lg hover:bg-dark-border transition text-sm"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1.5 bg-ocean-teal text-white rounded-lg hover:bg-ocean-teal-hover transition disabled:opacity-50 text-sm"
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
            showToast.error("Brak uprawnień do usunięcia tego posta.");
            return;
        }
        setShowDeleteModal(true);
    };


    const handleDeletePost = async () => {
        setDeleteLoading(true);

        try {
            await customAxios.delete(`/community/posts/delete/${post.id}`);

            showToast.success("Post został usunięty.");

            setShowDeleteModal(false);
            setTimeout(onBack, 1000);

        } catch (error: any) {
            console.error("Błąd usuwania posta:", error);
            const errorMessage = error.response?.data?.message || 'Wystąpił nieznany błąd podczas usuwania posta.';

            showToast.error(`Nie udało się usunąć posta: ${errorMessage}`);

            setShowDeleteModal(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    const DeleteConfirmationModal: React.FC = () => {
        if (!showDeleteModal) return null;

        return (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 text-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">

                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                        aria-label="Zamknij"
                    >
                        <FaTimes className="w-5 h-5"/>
                    </button>

                    <h3 className="text-2xl font-bold mb-2">Usunąć post?</h3>

                    <p className="text-gray-400 mb-8">
                        Czy na pewno chcesz usunąć post?
                    </p>

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

        useEffect(() => {
            const timer = setTimeout(closeToast, 4000);
            return () => clearTimeout(timer);
        }, [toastMessage]);

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
            showToast.info("Musisz być zalogowany, aby oceniać posty.");
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
            if (err.response?.status === 401) {
                showToast.error("Sesja wygasła. Zaloguj się ponownie.");
            } else {
                showToast.error("Wystąpił błąd podczas oddawania głosu.");
            }
        }
    };


    const handleCommentVote = async (commentId: number, vote: "upvote" | "downvote") => {
        if (!user) {
            showToast.info("Musisz być zalogowany, aby oceniać komentarze.");
            return;
        }

        try {
            const response = await customAxios.post(
                `/community/comments/${commentId}/vote?type=${vote}`
            );

            const newScore = response.data;

            setCommentVotes(prev => ({
                ...prev,
                [commentId]: newScore,
            }));

            setCommentUserVote(prev => ({
                ...prev,
                [commentId]: prev[commentId] === vote ? null : vote,
            }));

        } catch (err: any) {

            if (err.response?.status === 403) {
                showToast.error("Nie możesz głosować na własny komentarz.");
                return;
            }

            showToast.error("Wystąpił błąd podczas głosowania.");
        }
    };

    useEffect(() => {
        if (comments.length === 0) return;

        const loadVotes = async () => {
            const scoreMap: { [key: number]: number } = {};
            const statusMap: { [key: number]: any } = {};

            for (const c of comments) {

                try {
                    const scoreRes = await customAxios.get(`/community/comments/${c.id}/vote`);
                    scoreMap[c.id] = scoreRes.data;
                } catch {
                    scoreMap[c.id] = 0;
                }

                try {
                    const statusRes = await customAxios.get(`/community/comments/${c.id}/vote/status`);
                    statusMap[c.id] = statusRes.data;
                } catch {
                    statusMap[c.id] = null;
                }
            }

            setCommentVotes(scoreMap);
            setCommentUserVote(statusMap);
        };

        loadVotes();
    }, [comments]);

    useEffect(() => {
        const loadData = async () => {
            await fetchComments();
            await fetchVoteStatus();
            await fetchCommentVotes();
        };

        loadData();
    }, [post.id]);


    const sortedComments = getSortedComments();


    return (
        <div className="bg-dark-bg">
            {/* Top bar */}
            <div className="max-w-7xl mx-auto px-4 pt-3 pb-2">
                <button
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark-surface border border-dark-border rounded-lg hover:bg-dark-surface2 text-sm font-medium text-dark-text shadow-sm transition"
                    onClick={onBack}
                >
                    ← Powrót do forum
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-8">
                <div className="flex flex-col lg:flex-row gap-5 items-start">

                    {/* LEFT COLUMN — post content */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-dark-surface rounded-xl shadow-sm border border-dark-border overflow-hidden">
                            {/* Post header */}
                            <div className="px-4 py-3 border-b border-dark-border">
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                                        <span className={`text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm shrink-0 ${getCategoryColor(post.categoryName)}`}>
                                            {categoryName}
                                        </span>
                                        <h1 className="text-lg font-bold text-dark-text leading-snug">
                                            {post.title}
                                        </h1>
                                    </div>

                                    {!isEditing && (
                                        <div className="flex items-center gap-1 shrink-0">
                                            {user && !isAuthor && (
                                                <button
                                                    onClick={handleToggleSave}
                                                    disabled={saveLoading}
                                                    className="p-1.5 rounded-full bg-dark-surface2 hover:bg-yellow-500/10 border border-dark-border transition group"
                                                    title={isSaved ? "Usuń z zapisanych" : "Zapisz post"}
                                                >
                                                    {isSaved ? (
                                                        <FaBookmark className="w-3.5 h-3.5 text-yellow-500"/>
                                                    ) : (
                                                        <FaRegBookmark className="w-3.5 h-3.5 text-dark-muted group-hover:text-yellow-500"/>
                                                    )}
                                                </button>
                                            )}
                                            {isAuthor && (
                                                <>
                                                    <button
                                                        onClick={() => setIsEditing(true)}
                                                        className="p-1.5 rounded-full bg-blue-500/10 text-ocean-blue hover:bg-blue-500/20 border border-blue-500/30 transition"
                                                        title="Edytuj post"
                                                    >
                                                        <FaEdit className="w-3.5 h-3.5"/>
                                                    </button>
                                                    <button
                                                        onClick={handleInitiateDelete}
                                                        className="p-1.5 rounded-full bg-red-500/10 text-ocean-red hover:bg-red-500/20 border border-red-500/30 transition"
                                                        title="Usuń post"
                                                    >
                                                        <FaTimes className="w-3.5 h-3.5"/>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs text-dark-muted">
                                    <span className="flex items-center gap-1">
                                        <FaUserCircle className="w-3 h-3"/>
                                        <span className="font-semibold text-dark-text">{post.authorName || post.user?.username || "Nieznany"}</span>
                                    </span>
                                    <span>·</span>
                                    <span>{formatDate(creationDate)}</span>
                                </div>
                            </div>

                            {/* Vote bar */}
                            <div className="px-4 py-2 bg-dark-surface2 border-b border-dark-border flex items-center gap-2">
                                <button
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                                        !user ? 'opacity-50 cursor-not-allowed' : ''
                                    } ${
                                        userVoteStatus === 'upvote'
                                            ? 'bg-ocean-blue text-white'
                                            : 'bg-dark-surface border border-dark-border text-dark-text hover:border-ocean-blue hover:text-ocean-blue'
                                    }`}
                                    onClick={() => handleVote('upvote')}
                                >
                                    <FaThumbsUp className="w-3 h-3"/> Za
                                </button>

                                <span className={`text-sm font-bold min-w-[1.5rem] text-center ${
                                    netScore > 0 ? 'text-ocean-blue' : netScore < 0 ? 'text-ocean-red' : 'text-dark-muted'
                                }`}>
                                    {netScore}
                                </span>

                                <button
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                                        !user ? 'opacity-50 cursor-not-allowed' : ''
                                    } ${
                                        userVoteStatus === 'downvote'
                                            ? 'bg-ocean-red text-white'
                                            : 'bg-dark-surface border border-dark-border text-dark-text hover:border-ocean-red hover:text-ocean-red'
                                    }`}
                                    onClick={() => handleVote('downvote')}
                                >
                                    <FaThumbsDown className="w-3 h-3"/> Przeciw
                                </button>

                                {voteError && (
                                    <span className="text-xs text-ocean-red ml-1">{voteError}</span>
                                )}
                            </div>

                            {/* Post body */}
                            <div className="px-4 py-3">
                                <PostGallery postId={post.id}/>

                                {isEditing ? (
                                    <EditForm/>
                                ) : (
                                    <div className="mt-3 text-dark-text leading-relaxed whitespace-pre-wrap text-sm">
                                        {currentContent}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN — comments */}
                    <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-4">
                        <div className="bg-dark-surface rounded-xl shadow-md border border-dark-border overflow-hidden">
                            {/* Comments header */}
                            <div className="px-5 py-4 border-b border-dark-border flex items-center justify-between">
                                <h2 className="text-lg font-bold text-dark-text">
                                    Komentarze <span className="text-dark-muted font-normal text-sm">({comments.length})</span>
                                </h2>
                                {comments.length > 1 && (
                                    <select
                                        value={commentSort}
                                        onChange={(e) => setCommentSort(e.target.value as 'newest' | 'oldest')}
                                        className="text-sm border border-dark-border rounded-lg px-2 py-1.5 bg-dark-surface2 text-dark-text focus:outline-none"
                                    >
                                        <option value="newest">Najnowsze</option>
                                        <option value="oldest">Najstarsze</option>
                                    </select>
                                )}
                            </div>

                            {/* Add comment form */}
                            <div className="px-5 py-4 border-b border-dark-border bg-dark-surface2">
                                <AddCommentForm postId={post.id} onCommentAdded={fetchComments}/>
                            </div>

                            {/* Comments list */}
                            <div className="divide-y divide-dark-border max-h-[60vh] overflow-y-auto">
                                {loadingComments && (
                                    <p className="px-5 py-6 text-center text-dark-muted text-sm">Ładowanie komentarzy...</p>
                                )}
                                {commentsError && (
                                    <p className="px-5 py-4 text-ocean-red text-sm font-medium">{commentsError}</p>
                                )}

                                {!loadingComments && !commentsError && comments.length === 0 && (
                                    <p className="px-5 py-8 text-center text-dark-muted italic text-sm">Brak komentarzy. Bądź pierwszy!</p>
                                )}

                                {!loadingComments && !commentsError && sortedComments.map(comment => {
                                    const commentDate = parseDateArray(comment.createdAt);
                                    const isNameMatch = user?.nickname && comment.username && user.nickname === comment.username;
                                    const isCommentAuthor = user && isNameMatch;
                                    const canEdit = isCommentAuthor;
                                    const canDelete = isCommentAuthor;

                                    return (
                                        <div key={comment.id} className="px-5 py-4 relative group hover:bg-dark-surface2 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-1.5">
                                                    <FaUserCircle className="w-3.5 h-3.5 text-dark-muted"/>
                                                    <span className="text-sm font-semibold text-dark-text">{comment.username}</span>
                                                </div>

                                                {!editingCommentId && (canEdit || canDelete) && (
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {canEdit && (
                                                            <button
                                                                onClick={() => startEditingComment(comment.id, comment.content)}
                                                                className="p-1 rounded bg-blue-500/10 text-ocean-blue hover:bg-blue-500/20 transition"
                                                                title="Edytuj"
                                                            >
                                                                <FaEdit className="w-3 h-3"/>
                                                            </button>
                                                        )}
                                                        {canDelete && (
                                                            <button
                                                                onClick={() => setCommentToDeleteId(comment.id)}
                                                                className="p-1 rounded bg-red-500/10 text-ocean-red hover:bg-red-500/20 transition"
                                                                title="Usuń"
                                                            >
                                                                <FaTimes className="w-3 h-3"/>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {editingCommentId === comment.id ? (
                                                <div>
                                                    <textarea
                                                        value={editCommentText}
                                                        onChange={(e) => setEditCommentText(e.target.value)}
                                                        className="w-full p-2 border border-dark-border rounded-lg bg-dark-surface2 text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-dark-accent/40"
                                                        rows={3}
                                                    />
                                                    <div className="flex justify-end gap-2 mt-2">
                                                        <button
                                                            onClick={cancelEditingComment}
                                                            className="text-xs px-3 py-1.5 bg-dark-surface2 border border-dark-border rounded-lg hover:bg-dark-border text-dark-text"
                                                        >
                                                            Anuluj
                                                        </button>
                                                        <button
                                                            onClick={() => saveEditedComment(comment.id)}
                                                            className="text-xs px-3 py-1.5 bg-ocean-blue rounded-lg hover:bg-ocean-blue-hover text-white"
                                                        >
                                                            Zapisz
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-dark-text text-sm whitespace-pre-wrap">{comment.content}</p>
                                            )}

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className={`p-1 rounded transition-colors ${
                                                            !user ? "opacity-50 cursor-not-allowed" : "hover:bg-dark-border"
                                                        } ${commentUserVote[comment.id] === "upvote" ? "bg-ocean-blue text-white" : "text-dark-muted bg-dark-surface2"}`}
                                                        onClick={() => handleCommentVote(comment.id, "upvote")}
                                                    >
                                                        <FaThumbsUp className="w-3 h-3"/>
                                                    </button>
                                                    <span className="text-xs font-bold text-dark-text">
                                                        {commentVotes[comment.id] ?? 0}
                                                    </span>
                                                    <button
                                                        className={`p-1 rounded transition-colors ${
                                                            !user ? "opacity-50 cursor-not-allowed" : "hover:bg-dark-border"
                                                        } ${commentUserVote[comment.id] === "downvote" ? "bg-ocean-red text-white" : "text-dark-muted bg-dark-surface2"}`}
                                                        onClick={() => handleCommentVote(comment.id, "downvote")}
                                                    >
                                                        <FaThumbsDown className="w-3 h-3"/>
                                                    </button>
                                                </div>

                                                <span className="text-xs text-dark-muted">{timeAgo(commentDate)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteCommentModal />
            <DeleteConfirmationModal/>
            <ToastNotification/>
        </div>
    );
};

export default PostDetails;