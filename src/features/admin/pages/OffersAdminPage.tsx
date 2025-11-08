import {useFetchOffers} from "../../../hooks/useFetchOffers.ts";
import {useState} from "react";
import {ComponentTypeEnum} from "../../../types/BaseItemDto.ts";
import type {ItemConditionEnum} from "../../../types/ItemConditionEnum.ts";

import OffersTable from "../components/OffersTable.tsx";
import Components from "../components/ComponentsList.tsx";
import ReactPaginate from "react-paginate";
import {RightArrow} from "../../../assets/icons/rightArrow.tsx";
import {LeftArrow} from "../../../assets/icons/leftArrow.tsx";
import LoadingSpinner from "../../../components/ui/LoadingSpinner.tsx";

const OffersAdminPage = () => {

    const [filters, setFilters] = useState<{ itemType: ComponentTypeEnum | undefined; brand: string; minPrize: number; maxPrize:number; itemCondition: ItemConditionEnum | undefined }>({ itemType: undefined, brand: "", minPrize: 0, maxPrize: 99999, itemCondition: undefined });
    const [page, setPage] = useState<number>(0);

    const {data, isLoading, error, isFetching} = useFetchOffers(page, filters);
    const offers = data?.offers ?? [];
    if (isLoading) {
        return <LoadingSpinner />;
    }
    if (error) return <p className="p-4 text-ocean-red">Błąd podczas pobierania danych.</p>;
    return (
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
    )

};
export default OffersAdminPage;