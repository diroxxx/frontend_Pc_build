import {useAtom} from "jotai";
import {offerLeftPanelFiltersAtom} from "../atoms/OfferLeftPanelFiltersAtom.ts";
import React, {useState} from "react";
import {SortByOffersEnum} from "../../types/SortByOffersEnum.ts";
import {SearchIcon} from "../../assets/icons/searchIcon.tsx";
import {offerPageAtom} from "../atoms/OfferPageAtom.ts";

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
        <div className="flex flex-wrap gap-4 items-center bg-white rounded-lg p-4 shadow-sm">
            <div className="relative w-full max-w-2xl min-w-[100px]">
                <input
                    type="text"
                    placeholder="Wyszukaj ofertę (np. Nvidia, RTX 4080)..."
                    value={tempSearchFilter}
                    onChange={(e) => setTempSearchFilter( e.target.value )}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <button
                    onClick={handleSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600"
                >
                    <SearchIcon/>
                </button>

            </div>

            <select
                value={offerLeftPanelFilters.sortBy}
                onChange={handleSortChange}
                className="px-4 py-3 border border-gray-300 rounded-lg"
            >
                <option value="">Domyślne sortowanie</option>
                <option value={SortByOffersEnum.CHEAPEST}>Najtańsze</option>
                <option value={SortByOffersEnum.EXPENSIVE}>Najdroższe</option>
                <option value={SortByOffersEnum.NEWEST}>Najnowsze</option>
            </select>

        </div>

    )
}