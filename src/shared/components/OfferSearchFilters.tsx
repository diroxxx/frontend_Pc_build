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
        <div className=" border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

                    <div className="w-full sm:flex-1 sm:max-w-2xl sm:mx-auto lg:max-w-3xl">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Wyszukaj ofertę (np. Nvidia, RTX 4080)..."
                                value={tempSearchFilter}
                                onChange={(e) => setTempSearchFilter(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="w-full px-5 py-3.5 pl-12 pr-12 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue transition-all"
                            />

                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <SearchIcon className="w-5 h-5" />
                            </div>

                            {tempSearchFilter && (
                                <button
                                    onClick={handleSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ocean-blue hover:text-ocean-blue/80 transition"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="w-full sm:w-auto">
                        <select
                            value={offerLeftPanelFilters.sortBy}
                            onChange={handleSortChange}
                            className="w-full sm:w-auto px-5 py-3.5 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue transition-all cursor-pointer bg-white"
                        >
                            <option value="">Domyślne sortowanie</option>
                            <option value={SortByOffersEnum.CHEAPEST}>Najtańsze najpierw</option>
                            <option value={SortByOffersEnum.EXPENSIVE}>Najdroższe najpierw</option>
                            <option value={SortByOffersEnum.NEWEST}>Najnowsze najpierw</option>
                        </select>
                    </div>

                </div>
            </div>
        </div>
    );
}