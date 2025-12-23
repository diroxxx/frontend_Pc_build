import {useEffect, useState} from "react";
import SidePanelBuilds from '../../../computers/components/SidePanelBuilds.tsx';
import {useFetchOffers} from "../../../../shared/hooks/useFetchOffers.ts";
import {ComponentTypeEnum} from "../../../../shared/dtos/BaseItemDto.ts";
import OfferUserList from "../components/OfferUserList.tsx";
import ReactPaginate from "react-paginate";
import {RightArrow} from "../../../../assets/icons/rightArrow.tsx";
import {LeftArrow} from "../../../../assets/icons/leftArrow.tsx";
import { useSearchParams } from "react-router-dom";
import {LayoutGrid, List} from "lucide-react";
import {useAtom} from "jotai";
import {viewModeAtom} from "../atoms/OfferListViewMode.ts";
import { OffersSideFilters} from "../../../../shared/components/OffersSideFilters.tsx";
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

    const {data: offersData, isLoading: isLoadingOffers, error,isError, isFetching, isRefetching} = useFetchOffers(page, offerLeftPanelFilters);
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

            <div className="border-b border-gray-200 ">
                <div className="max-w-7xl mx-auto px-4 py-5">
                    <div className="flex items-start justify-between gap-6">

                        <div className="flex-1 max-w-3xl mx-auto">
                            <OfferSearchFilters />
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
                                <List size={20} />
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
                                <LayoutGrid size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
                <OffersSideFilters chooseComponentTypeParam = {selectedComponentByComputer}/>
                <div className="flex-1" >

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
                    <OfferUserList offers={offers} isRefetching={isRefetching} isFetching={isFetching} isLoading={isLoadingOffers} isError={isError}/>
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