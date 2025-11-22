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
import {OffersFilters} from "../../../shared/components/OffersFilters.tsx";

const OffersAdminPage = () => {

    const [page, setPage] = useAtom(offerPageAtom);
    const filters = useAtomValue(offerLeftPanelFiltersAtom)
    const {data, isLoading, error, isFetching} = useFetchOffers(page, filters);
    const offers = data?.offers ?? [];
    if (isLoading) {
        return <LoadingSpinner />;
    }
    if (error) return <p className="p-4 text-ocean-red">Błąd podczas pobierania danych.</p>;
    return (
        <div className="flex flex-row gap-4 p-4 ">
            <div className=" mr-4 flex flex-col gap-4 w-[300px]">
                <OfferSearchFilters/>
                <OffersFilters/>
            </div>

            <div>
                <OffersTable offers={offers} isFetching={isFetching} isLoading={isLoading}/>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel={<RightArrow/>}
                    previousLabel={<LeftArrow/>}
                    onPageChange={(e) => setPage(e.selected + 1)}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={1}
                    pageCount={data?.totalPages ?? 1}
                    containerClassName="flex justify-center gap-1 py-4"
                    pageClassName=""
                    pageLinkClassName="px-3 py-1 block rounded bg-gray-100 cursor-pointer"
                    activeLinkClassName="bg-ocean-dark-blue text-white font-semibold"
                    previousLinkClassName="px-3 py-1 block rounded hover:bg-gray-200 cursor-pointer"
                    nextLinkClassName="px-3 py-1 block rounded hover:bg-gray-200 cursor-pointer"
                />

            </div>

        </div>
    )

};
export default OffersAdminPage;