import {useFetchOffers} from "../../../shared/useFetchOffers.ts";
import OffersTable from "../components/OffersTable.tsx";
import ReactPaginate from "react-paginate";
import {RightArrow} from "../../../assets/icons/rightArrow.tsx";
import {LeftArrow} from "../../../assets/icons/leftArrow.tsx";
import {LoadingSpinner} from "../../../assets/components/ui/LoadingSpinner.tsx";
import {useAtom, useAtomValue} from "jotai";
import {offerPageAtom} from "../../../shared/atoms/OfferPageAtom.ts";
import {offerLeftPanelFiltersAtom} from "../../../shared/atoms/OfferLeftPanelFiltersAtom.ts";
import {OfferSearchFilters} from "../../../shared/components/OfferSearchFilters.tsx";
import {OffersSideFilters} from "../../../shared/components/OffersSideFilters.tsx";

const OffersAdminPage = () => {
    const [page, setPage] = useAtom(offerPageAtom);
    const filters = useAtomValue(offerLeftPanelFiltersAtom);
    const { data, isLoading, error, isFetching } = useFetchOffers(page, filters);
    const offers = data?.offers ?? [];

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="p-4 text-ocean-red">Błąd podczas pobierania danych.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-row gap-6 p-4">

            <aside className=" flex flex-col gap-6 shrink-0">
                <OffersSideFilters />
            </aside>

            <main className="flex-1 flex flex-col gap-4">
                <OfferSearchFilters />

                <OffersTable
                    offers={offers}
                    isFetching={isFetching}
                    isLoading={isLoading}
                />

                <div className="flex justify-center py-2">
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel={<RightArrow />}
                        previousLabel={<LeftArrow />}
                        onPageChange={(e) => setPage(e.selected + 1)}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={1}
                        pageCount={data?.totalPages ?? 1}
                        containerClassName="flex items-center gap-1"
                        pageLinkClassName="px-3 py-1 rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
                        activeLinkClassName="bg-ocean-dark-blue text-white font-semibold"
                        previousLinkClassName="px-3 py-1 rounded cursor-pointer hover:bg-gray-200"
                        nextLinkClassName="px-3 py-1 rounded cursor-pointer hover:bg-gray-200"
                    />
                </div>
            </main>
        </div>
    );
};
export default OffersAdminPage;