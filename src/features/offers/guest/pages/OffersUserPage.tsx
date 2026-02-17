import {useEffect, useState} from "react";
import SidePanelBuilds from '../../../computers/components/SidePanelBuilds.tsx';
import {useFetchOffers} from "../../../../shared/hooks/useFetchOffers.ts";
import {ComponentTypeEnum} from "../../../../shared/dtos/BaseItemDto.ts";
import OfferUserList from "../components/OfferUserList.tsx";
import ReactPaginate from "react-paginate";
import {RightArrow} from "../../../../assets/icons/rightArrow.tsx";
import {LeftArrow} from "../../../../assets/icons/leftArrow.tsx";
import { useSearchParams } from "react-router-dom";
import {LayoutGrid, List, SlidersHorizontal, X} from "lucide-react";
import {useAtom} from "jotai";
import {viewModeAtom} from "../atoms/OfferListViewMode.ts";
import { OffersSideFilters} from "../../../../shared/components/OffersSideFilters.tsx";
import {offerLeftPanelFiltersAtom} from "../../../../shared/atoms/OfferLeftPanelFiltersAtom.ts";
import {OfferSearchFilters} from "../../../../shared/components/OfferSearchFilters.tsx";
import {offerPageAtom} from "../../../../shared/atoms/OfferPageAtom.ts";
import { useCompatibleOffers } from "../../../../shared/hooks/useComatibleOffers.ts";

function OffersUserPage() {

    const [showScrollTop, setShowScrollTop] = useState(false);
    const [searchParams] = useSearchParams();
    const componentCategoryParam = searchParams.get("category");
    const [page, setPage] = useAtom(offerPageAtom);
    const [selectedComponentByComputer, setSelectedComponentByComputer] = useState<ComponentTypeEnum | undefined>(undefined);
    const [offerLeftPanelFilters,] = useAtom(offerLeftPanelFiltersAtom);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        if (componentCategoryParam) {
            setSelectedComponentByComputer(componentCategoryParam as ComponentTypeEnum);
        } 
    }, []);

    const {data: offersData, isLoading: isLoadingOffers, error,isError, isFetching, isRefetching} = useFetchOffers(page, offerLeftPanelFilters);
    const compatibleOffers = useCompatibleOffers(offersData?.offers);
    
    const offers = compatibleOffers ?? [];
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

            <div className="border-b border-gray-200 sticky top-0 z-20 bg-white/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5">
                    <div className="flex items-center justify-between gap-4 flex-wrap ">
                        <div className="flex-1 min-w-0">
                            <OfferSearchFilters/>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2.5 rounded-lg border transition-all duration-200 ${
                                    viewMode === "list"
                                        ? "bg-ocean-blue text-white border-ocean-blue shadow-sm"
                                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                                }`}
                                title="Widok listy"
                            >
                                <List size={20}/>
                            </button>

                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2.5 rounded-lg border transition-all duration-200 ${
                                    viewMode === "grid"
                                        ? "bg-ocean-blue text-white border-ocean-blue shadow-sm"
                                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                                }`}
                                title="Widok siatki"
                            >
                                <LayoutGrid size={20}/>
                            </button>
                        </div>
                    </div>
                    <div className="mt-3 lg:hidden">
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                                showMobileFilters
                                    ? "bg-ocean-blue text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                            }`}
                        >
                            <SlidersHorizontal size={18}/>
                            {showMobileFilters ? "Ukryj filtry" : "Filtry i sortowanie"}
                        </button>
                    </div>

                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="hidden lg:block lg:w-80 lg:shrink-0">
                        <div className="lg:sticky lg:top-24">
                            <OffersSideFilters chooseComponentTypeParam={selectedComponentByComputer}/>
                        </div>
                    </div>


                    <div className="flex-1 min-w-0">
                        <div className={`lg:hidden mb-6 ${showMobileFilters ? "block" : "hidden"}`}>
                            <div className="bg-white rounded-xl shadow-sm border p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-lg">Filtry i sortowanie</h3>
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="p-1 -mr-1 text-gray-500 hover:text-gray-800"
                                    >
                                        <X size={24}/>
                                    </button>
                                </div>
                                <OffersSideFilters chooseComponentTypeParam={selectedComponentByComputer}/>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
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

                            <OfferUserList
                                offers={offers}
                                isRefetching={isRefetching}
                                isFetching={isFetching}
                                isLoading={isLoadingOffers}
                                isError={isError}
                            />

                            <ReactPaginate
                                breakLabel="..."
                                nextLabel={<RightArrow/>}
                                previousLabel={<LeftArrow/>}
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
                </div>
            </div>
            );
            }
            export default OffersUserPage;