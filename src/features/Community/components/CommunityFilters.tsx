import React from "react";
import type { Category } from "../types/communityTypes.ts";

interface CommunityFiltersProps {
    categories: Category[];
    selectedCategoryId: string | null;
    onCategoryChange: (categoryId: string) => void;
    filter: "newest" | "oldest";
    onFilterChange: (filter: "newest" | "oldest") => void;
    isAuthenticated: boolean;
    onCreatePost: () => void;
}

const CommunityFilters: React.FC<CommunityFiltersProps> = ({
    categories,
    selectedCategoryId,
    onCategoryChange,
    filter,
    onFilterChange,
    isAuthenticated,
    onCreatePost,
}) => {
    return (
        <div className="flex flex-wrap items-center gap-2.5 mb-5 p-3 bg-dark-surface border border-dark-border rounded-xl shadow-sm">
            <select
                className="border border-dark-border rounded-lg px-3 py-1.5 text-sm bg-dark-surface2 text-dark-text focus:outline-none focus:ring-2 focus:ring-dark-accent/30 transition"
                value={selectedCategoryId || "all"}
                onChange={(e) => onCategoryChange(e.target.value)}
            >
                <option value="all">Wszystkie kategorie</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                ))}
            </select>

            <select
                className="border border-dark-border rounded-lg px-3 py-1.5 text-sm bg-dark-surface2 text-dark-text focus:outline-none focus:ring-2 focus:ring-dark-accent/30 transition"
                value={filter}
                onChange={(e) => onFilterChange(e.target.value as "newest" | "oldest")}
            >
                <option value="newest">Najnowsze</option>
                <option value="oldest">Najstarsze</option>
            </select>

            <div className="ml-auto">
                <button
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition duration-150 ${
                        isAuthenticated
                            ? "bg-ocean-teal text-white hover:bg-ocean-teal-hover"
                            : "bg-dark-surface2 text-dark-muted border border-dark-border cursor-not-allowed opacity-60"
                    }`}
                    onClick={() => isAuthenticated && onCreatePost()}
                    disabled={!isAuthenticated}
                    title={!isAuthenticated ? "Zaloguj się, aby dodać post" : undefined}
                >
                    + Nowy Post
                </button>
            </div>
        </div>
    );
};

export default CommunityFilters;
