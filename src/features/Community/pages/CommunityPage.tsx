import React, { useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../auth/atoms/userAtom.tsx";
import PostDetails from "../PostDetails.tsx";
import PaginatedList from "../PaginatedPosts.tsx";
import { parseDateArray } from "../PostTime.tsx";
import { useCommunityPosts } from "../hooks/useCommunityPosts.ts";
import PostListItem from "../components/PostListItem.tsx";
import CreatePostForm from "../components/CreatePostForm.tsx";
import CommunityFilters from "../components/CommunityFilters.tsx";
import type { Post, User } from "../types/communityTypes.ts";

const CommunityPage: React.FC = () => {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [filter, setFilter] = useState<"newest" | "oldest">("newest");
    const [selectedFilterCategoryId, setSelectedFilterCategoryId] = useState<string | null>(null);

    const [user] = useAtom(userAtom);
    const isAuthenticated = !!user;

    const { posts, categories, isLoading, fetchPosts } = useCommunityPosts(selectedFilterCategoryId);

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

    if (isCreatingPost) {
        if (!isAuthenticated) return <div className="p-6 text-center text-ocean-red bg-dark-bg min-h-screen">Zaloguj się!</div>;
        if (isLoading) return <div className="p-6 text-center text-dark-text bg-dark-bg min-h-screen">Ładowanie formularza...</div>;

        return (
            <CreatePostForm
                categories={categories}
                currentUser={user as unknown as User}
                onCancel={() => setIsCreatingPost(false)}
                onSuccess={() => {
                    setIsCreatingPost(false);
                    fetchPosts();
                }}
            />
        );
    }

    const sortedPosts = getSortedPosts();

    return (
        <div className="bg-dark-bg min-h-screen">
            {/* Header */}
            <div className="bg-dark-surface border-b border-dark-border">
                <div className="max-w-4xl mx-auto px-4 py-5 flex items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-dark-text">Forum Społeczności</h1>
                        <p className="text-dark-muted text-sm mt-0.5">Dyskutuj, pytaj i dziel się wiedzą o sprzęcie PC</p>
                    </div>
                    {!isLoading && (
                        <span className="text-xs text-dark-muted bg-dark-surface2 border border-dark-border px-2.5 py-1 rounded-full font-medium">
                            {posts.length} {posts.length === 1 ? "post" : "postów"}
                        </span>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-5">
                <CommunityFilters
                    categories={categories}
                    selectedCategoryId={selectedFilterCategoryId}
                    onCategoryChange={setSelectedFilterCategoryId}
                    filter={filter}
                    onFilterChange={setFilter}
                    isAuthenticated={isAuthenticated}
                    onCreatePost={() => setIsCreatingPost(true)}
                />

                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-20 bg-dark-surface border border-dark-border rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-dark-muted">
                        <p className="text-4xl mb-3">💬</p>
                        <p className="text-base font-semibold text-dark-text">Brak postów w tej kategorii</p>
                        <p className="text-sm mt-1">Bądź pierwszy i utwórz nowy post!</p>
                    </div>
                ) : (
                    <PaginatedList
                        items={sortedPosts}
                        itemsPerPage={12}
                        renderItem={(post) => (
                            <PostListItem
                                key={post.id}
                                post={post}
                                onClick={() => setSelectedPost(post)}
                                currentUser={user as unknown as User}
                            />
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default CommunityPage;
