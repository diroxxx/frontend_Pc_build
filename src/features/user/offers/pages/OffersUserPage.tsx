import {useEffect, useState} from "react";
import SidePanelBuilds from '../../components/builds/SidePanelBuilds.tsx';
import {useFetchOffers} from "../../../../shared/useFetchOffers.ts";
import {ComponentTypeEnum} from "../../../../types/BaseItemDto.ts";
import OfferUserList from "../components/OfferUserList.tsx";
import ReactPaginate from "react-paginate";
import {RightArrow} from "../../../../assets/icons/rightArrow.tsx";
import {LeftArrow} from "../../../../assets/icons/leftArrow.tsx";
import { useSearchParams } from "react-router-dom";
import {LayoutGrid, List} from "lucide-react";
import {useAtom} from "jotai";
import {viewModeAtom} from "../atoms/OfferListViewMode.ts";
import { OffersFilters} from "../../../../shared/components/OffersFilters.tsx";
import {offerLeftPanelFiltersAtom} from "../../../../shared/atoms/OfferLeftPanelFiltersAtom.ts";
import {OfferSearchFilters} from "../../../../shared/components/OfferSearchFilters.tsx";
import {offerPageAtom} from "../../../../shared/atoms/OfferPageAtom.ts";



function OffersUserPage() {

    const [showScrollTop, setShowScrollTop] = useState(false);
    const [searchParams] = useSearchParams();
    const componentCategoryParam = searchParams.get("category");
    const [page, setPage] = useAtom(offerPageAtom);
    const [selectedComponentByComputer, setSelectedComponentByComputer] = useState<ComponentTypeEnum | undefined>(undefined);
    const [offerLeftPanelFilters,] = useAtom(offerLeftPanelFiltersAtom);

    useEffect(() => {
        if (componentCategoryParam) {
            setSelectedComponentByComputer(componentCategoryParam as ComponentTypeEnum);
        } 
    }, []);

    const {data: offersData, isLoading: isLoadingOffers, error, isFetching} = useFetchOffers(page, offerLeftPanelFilters);
    const offers = offersData?.offers ?? [];

    const [viewMode, setViewMode] = useAtom(viewModeAtom);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setShowScrollTop(scrollTop > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (error) return <p className="p-4 text-ocean-red">Błąd podczas pobierania danych.</p>;
    return (
        <div className="min-h-screen bg-gray-50">
            <SidePanelBuilds />
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-6">
                <div className="max-w-7xl mx-auto">

                    <OfferSearchFilters/>
                    <div className="flex justify-end mb-4 gap-2">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-md border transition ${
                                viewMode === "list"
                                    ? "bg-ocean-blue text-white border-ocean-blue"
                                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                            }`}
                            title="Widok listy"
                        >
                            <List size={18} />
                        </button>

                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-md border transition ${
                                viewMode === "grid"
                                    ? "bg-ocean-blue text-white border-ocean-blue"
                                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                            }`}
                            title="Widok siatki"
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content with sidebar */}
            <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
                {/* Sidebar with filters */}
                {/*<div className="w-64 flex-shrink-0">*/}
                {/*    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 sticky top-6">*/}
                {/*        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtry</h3>*/}
                {/*        */}
                {/*        /!* Category filter *!/*/}
                {/*        <div className="mb-6">*/}
                {/*            <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                {/*                Kategoria*/}
                {/*            </label>*/}
                {/*            <select*/}
                {/*                value={tempFilters.componentType}*/}
                {/*                onChange={(e) => setTempFilters((prev) => ({...prev, componentType: e.target.value as ComponentTypeEnum}))}*/}
                {/*                className="w-full px-3 py-2 border border-gray-300 rounded-lg"*/}
                {/*            >*/}
                {/*                <option value="">Wszystkie kategorie</option>*/}
                {/*                {componentTypes.map(type => (*/}
                {/*                    <option key={type} value={type}>*/}
                {/*                        {type}*/}
                {/*                    </option>*/}
                {/*                ))}*/}
                {/*            </select>*/}
                {/*        </div>*/}

                {/*         /!*Price filter *!/*/}
                {/*        <div className="mb-6">*/}
                {/*            <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                {/*                Cena: {tempFilters.minPrize} zł – {tempFilters.maxPrize} zł*/}
                {/*            </label>*/}
                {/*            <div className="space-y-2">*/}
                {/*                <input*/}
                {/*                    type="range"*/}
                {/*                    min="0"*/}
                {/*                    max="10000"*/}
                {/*                    value={tempFilters.minPrize}*/}
                {/*                    onChange={(e) => setTempFilters(prev => ({ ...prev, minPrize: parseInt(e.target.value) }))}*/}
                {/*                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"*/}
                {/*                />*/}
                {/*                <input*/}
                {/*                    type="range"*/}
                {/*                    min="0"*/}
                {/*                    max="10000"*/}
                {/*                    value={tempFilters.maxPrize}*/}
                {/*                    onChange={(e) => setTempFilters(prev => ({ ...prev, maxPrize: parseInt(e.target.value) }))}*/}
                {/*                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*        </div>*/}

                {/*         /!*Manufacturer filter*!/*/}
                {/*        <div className="mb-6">*/}
                {/*            <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                {/*                Producent*/}
                {/*            </label>*/}
                {/*            <select*/}
                {/*                value={tempFilters.brand}*/}
                {/*                onChange={(e) => setTempFilters((prev) => ({...prev, brand: e.target.value}) )}*/}
                {/*                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"*/}
                {/*            >*/}
                {/*                <option value="">Wszyscy producenci</option>*/}
                {/*                {Array.isArray(brands) && brands.map(brand => (*/}
                {/*                    <option key={brand} value={brand}>{brand}</option>*/}
                {/*                ))}*/}

                {/*            </select>*/}
                {/*        </div>*/}

                {/*         /!*Condition filter *!/*/}
                {/*        <div className="mb-6">*/}
                {/*            <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                {/*                Stan*/}
                {/*            </label>*/}
                {/*            <select*/}
                {/*                value={tempFilters.itemCondition}*/}
                {/*                onChange={(e) => setTempFilters((prev) =>({...prev, itemCondition: e.target.value as ItemConditionEnum}))}*/}
                {/*                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"*/}
                {/*            >*/}
                {/*                <option value="">Wszystkie stany</option>*/}
                {/*                {componentConditions.map(condition => (*/}
                {/*                    <option key={condition} value={condition}>*/}
                {/*                        {condition}*/}
                {/*                    </option>*/}
                {/*                ))}*/}
                {/*            </select>*/}
                {/*        </div>*/}

                {/*         /!*Shop filter*!/*/}
                {/*        <div className="mb-6">*/}
                {/*            <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                {/*                Sklep*/}
                {/*            </label>*/}
                {/*            <select*/}
                {/*                value={tempFilters.shopName}*/}
                {/*                onChange={(e) => setTempFilters((prev) => ({...prev, shopName: e.target.value}))}*/}
                {/*                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"*/}
                {/*            >*/}
                {/*                <option value="">Wszystkie sklepy</option>*/}
                {/*                {shopsNames.map(shop => (*/}
                {/*                    <option key={shop} value={shop}>*/}
                {/*                        {shop}*/}
                {/*                    </option>*/}
                {/*                ))}*/}
                {/*            </select>*/}
                {/*        </div>*/}

                {/*        /!* Clear filters button *!/*/}
                {/*        <div className="mb-6">*/}
                {/*            <button*/}
                {/*                onClick={applyFilters}*/}
                {/*                className="w-full bg-ocean-dark-blue text-white py-2 rounded-lg hover:bg-ocean-blue transition mb-2"*/}
                {/*            >*/}
                {/*                Zastosuj filtry*/}
                {/*            </button>*/}
                {/*            <button*/}
                {/*                onClick={clearFilters}*/}
                {/*                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"*/}
                {/*            >*/}
                {/*                Wyczyść filtry*/}
                {/*            </button>*/}
                {/*        </div>*/}

                {/*    </div>*/}
                {/*</div>*/}

                <OffersFilters chooseComponentTypeParam = {selectedComponentByComputer}/>
                {/* Main content */}
                <div className="flex-1" >

                    {/* Scroll to Top Button */}
                    {showScrollTop && (
                        <button
                            onClick={scrollToTop}
                            className="fixed bottom-6 right-6 z-40 bg-gradient-ocean hover:bg-gradient-ocean-hover text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
                            title="Powrót na górę"
                        >
                            <svg 
                                width="24" 
                                height="24" 
                                fill="none" 
                                viewBox="0 0 24 24"
                                className="transform transition-transform duration-200"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19V5m-7 7l7-7 7 7"
                                />
                            </svg>
                        </button>
                    )}
                    <OfferUserList offers={offers} isFetching={isFetching} isLoading={isLoadingOffers}/>
                    {/* Pagination */}
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel={<RightArrow />}
                        previousLabel={<LeftArrow />}
                        onPageChange={(e) => setPage(e.selected)}
                        forcePage={page}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={1}
                        pageCount={offersData?.totalPages ?? 1}
                        containerClassName="flex justify-center gap-1 py-4"
                        pageLinkClassName="px-3 py-1 block rounded bg-gray-100 cursor-pointer"
                        activeLinkClassName="bg-ocean-dark-blue text-white font-semibold"
                        previousLinkClassName="px-3 py-1 block rounded hover:bg-gray-200 cursor-pointer"
                        nextLinkClassName="px-3 py-1 block rounded hover:bg-gray-200 cursor-pointer"
                        onClick={scrollToTop}
                    />

                </div>
            </div>
        </div>
    );
}

export default OffersUserPage;