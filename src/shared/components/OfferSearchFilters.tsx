import {useAtom} from "jotai";
import {offerLeftPanelFiltersAtom} from "../atoms/OfferLeftPanelFiltersAtom.ts";
import React, {useState} from "react";
import {SortByOffersEnum} from "../dtos/SortByOffersEnum.ts";
import {offerPageAtom} from "../atoms/OfferPageAtom.ts";
import {ArrowRight, SearchIcon} from "lucide-react";

export const OfferSearchFilters = () => {

    const [offerLeftPanelFilters, setOfferLeftPanelFilters] = useAtom(offerLeftPanelFiltersAtom);
    const [tempSearchFilter, setTempSearchFilter] = useState<string | undefined>(offerLeftPanelFilters.query);
    const [, setPage] = useAtom(offerPageAtom);

    const handleSearch = () => {
        setOfferLeftPanelFilters(prev => ({ ...prev, query: tempSearchFilter}));
        setPage(0);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOfferLeftPanelFilters(prev => ({ ...prev, sortBy: e.target.value as SortByOffersEnum }));
        setPage(0);
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            <div className="w-full sm:flex-1">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Wyszukaj komponent (np. Nvidia, RTX 4080, AM5...)..."
                        value={tempSearchFilter}
                        onChange={(e) => setTempSearchFilter(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full px-4 py-2.5 pl-11 pr-10 text-sm bg-dark-surface border border-dark-border rounded-xl text-dark-text placeholder-dark-muted focus:border-dark-accent transition-colors"
                    />

                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted">
                        <SearchIcon className="h-4 w-4" />
                    </div>

                    {tempSearchFilter && (
                        <button
                            onClick={handleSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-accent hover:text-white transition"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="w-full sm:w-48">
                <select
                    value={offerLeftPanelFilters.sortBy}
                    onChange={handleSortChange}
                    className="w-full px-4 py-2.5 text-sm bg-dark-surface border border-dark-border rounded-xl text-dark-text focus:border-dark-accent transition-colors cursor-pointer"
                >
                    <option value={SortByOffersEnum.CHEAPEST}>Najtańsze</option>
                    <option value={SortByOffersEnum.EXPENSIVE}>Najdroższe</option>
                    <option value={SortByOffersEnum.NEWEST}>Najnowsze</option>
                </select>
            </div>

        </div>
    );


}