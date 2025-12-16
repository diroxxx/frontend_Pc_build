import {useAtom} from "jotai";
import {offerLeftPanelFiltersAtom} from "../atoms/OfferLeftPanelFiltersAtom.ts";
import React, {useState} from "react";
import {SortByOffersEnum} from "../../types/SortByOffersEnum.ts";
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
        <div className=" bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="w-full md:flex-1">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Wyszukaj ofertę (np. Nvidia, RTX 4080)..."
                                value={tempSearchFilter}
                                onChange={(e) => setTempSearchFilter(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full px-5 py-3.5 pl-12 pr-12 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue transition-all"
                            />

                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <SearchIcon className="h-5 w-5" />
                            </div>

                            {tempSearchFilter && (
                                <button
                                    onClick={handleSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ocean-blue hover:text-ocean-blue/80 transition"
                                >
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-60">
                        <select
                            value={offerLeftPanelFilters.sortBy}
                            onChange={handleSortChange}
                            className="w-full px-5 py-3.5 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue transition-all cursor-pointer bg-white"
                        >
                            <option value={SortByOffersEnum.CHEAPEST}>Najtańsze</option>
                            <option value={SortByOffersEnum.EXPENSIVE}>Najdroższe</option>
                            <option value={SortByOffersEnum.NEWEST}>Najnowsze</option>
                        </select>
                    </div>

                </div>
            </div>
        </div>
    );


}