import React, { useEffect, useState } from "react";
import { FaUserCircle, FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";
import customAxios from "../../../lib/customAxios.tsx";
import { parseDateArray, timeAgo } from "../PostTime.tsx";
import { getCategoryColor } from "../categoryUtils.tsx";
import { showToast } from "../../../lib/ToastContainer.tsx";
import type { Post, User } from "../types/communityTypes.ts";

interface PostListItemProps {
    post: Post;
    onClick: () => void;
    currentUser: User | null;
}

const PostListItem: React.FC<PostListItemProps> = ({ post, onClick, currentUser }) => {
    const [netScore, setNetScore] = useState<number>(0);
    const [userVoteStatus, setUserVoteStatus] = useState<"upvote" | "downvote" | null>(null);
    const date = parseDateArray(post.createdAt);
    const categoryName = post.categoryName || post.category?.name || "Brak kategorii";

    const thumbnailUrl = post.thumbnailImageId
        ? `http://localhost:8080/community/image/${post.thumbnailImageId}`
        : null;

    useEffect(() => {
        const fetchVoteStatus = async () => {
            try {
                const scoreResponse = await customAxios.get<number>(`community/posts/${post.id}/vote`);
                setNetScore(scoreResponse.data);

                if (currentUser) {
                    const statusResponse = await customAxios.get<string | null>(`community/posts/${post.id}/vote/status`);
                    setUserVoteStatus(statusResponse.data ? (statusResponse.data as "upvote" | "downvote") : null);
                }
            } catch (err) {
                console.error(`Błąd głosowania dla posta ${post.id}`, err);
            }
        };
        fetchVoteStatus();
    }, [post.id, currentUser]);

    const handleVote = async (e: React.MouseEvent, voteType: "upvote" | "downvote") => {
        e.stopPropagation();

        if (!currentUser) {
            showToast.info("Zaloguj się, aby móc głosować na posty.");
            return;
        }

        try {
            const response = await customAxios.post<number>(`community/posts/${post.id}/vote?type=${voteType}`);
            setNetScore(response.data);
            setUserVoteStatus(prev => (prev === voteType ? null : voteType));
        } catch (err: any) {
            console.error("Błąd głosowania:", err);
            if (err.response?.status === 401) {
                alert("Sesja wygasła.");
            }
        }
    };

    return (
        <li
            onClick={onClick}
            className="cursor-pointer bg-dark-surface rounded-xl border border-dark-border hover:border-dark-accent/40 hover:shadow-md transition-all duration-200 mb-3 overflow-hidden group"
        >
            <div className="flex items-stretch">
                {/* Vote sidebar */}
                <div
                    className="flex flex-col items-center justify-center gap-1 px-3 py-4 bg-dark-surface2 border-r border-dark-border shrink-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={(e) => handleVote(e, "upvote")}
                        className={`p-1 rounded transition-colors ${userVoteStatus === "upvote" ? "text-ocean-blue" : "text-dark-muted hover:text-ocean-blue"}`}
                    >
                        <FaThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <span className={`font-bold text-sm min-w-[1.5rem] text-center leading-none ${netScore > 0 ? "text-ocean-blue" : netScore < 0 ? "text-ocean-red" : "text-dark-muted"}`}>
                        {netScore}
                    </span>
                    <button
                        onClick={(e) => handleVote(e, "downvote")}
                        className={`p-1 rounded transition-colors ${userVoteStatus === "downvote" ? "text-ocean-red" : "text-dark-muted hover:text-ocean-red"}`}
                    >
                        <FaThumbsDown className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Thumbnail */}
                {thumbnailUrl ? (
                    <div className="shrink-0 w-20 self-stretch">
                        <img
                            src={thumbnailUrl}
                            alt="Miniatura"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                    </div>
                ) : null}

                {/* Content */}
                <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm shrink-0 ${getCategoryColor(categoryName)}`}>
                                {categoryName}
                            </span>
                            <h3 className="text-base font-bold text-dark-text group-hover:text-dark-accent transition-colors line-clamp-1">
                                {post.title}
                            </h3>
                        </div>
                        <p className="text-dark-muted text-sm line-clamp-2">{post.content}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-dark-border">
                        <div className="flex items-center gap-3 text-xs text-dark-muted">
                            <div className="flex items-center gap-1.5">
                                <FaUserCircle className="w-3 h-3" />
                                <span className="font-medium text-dark-text">{post.authorName || post.user?.username || "Nieznany"}</span>
                            </div>
                            {post.commentCount !== undefined && (
                                <div className="flex items-center gap-1">
                                    <FaComment className="w-3 h-3" />
                                    <span>{post.commentCount}</span>
                                </div>
                            )}
                        </div>
                        <div className="text-xs text-dark-muted">
                            <span>{timeAgo(date)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default PostListItem;
