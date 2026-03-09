import React, { useState } from "react";

interface PaginatedListProps<T> {
    items: T[];
    itemsPerPage?: number;
    renderItem: (item: T, index: number) => React.ReactNode;
}

const PaginatedList = <T,>({ items, itemsPerPage = 5, renderItem }: PaginatedListProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div>
            <ul className="space-y-4">
                {currentItems.map(renderItem)}
            </ul>

            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 gap-1.5">
                    <button
                        className="px-3 py-1.5 text-sm rounded-lg bg-dark-surface border border-dark-border text-dark-text hover:bg-dark-surface2 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Poprzednia
                    </button>

                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-8 h-8 text-sm rounded-lg font-medium transition ${currentPage === idx + 1 ? 'bg-ocean-blue text-white border border-ocean-blue' : 'bg-dark-surface border border-dark-border text-dark-muted hover:bg-dark-surface2 hover:text-dark-text'}`}
                            onClick={() => goToPage(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}

                    <button
                        className="px-3 py-1.5 text-sm rounded-lg bg-dark-surface border border-dark-border text-dark-text hover:bg-dark-surface2 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Następna
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaginatedList;
