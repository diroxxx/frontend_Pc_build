import type {ComponentOffer} from "../../../../types/OfferBase.ts";
import OfferCardFlex from "./OfferCardFlex.tsx";
import {LoadingSpinner} from "../../../../assets/components/ui/LoadingSpinner.tsx";
import {useAtomValue} from "jotai";
import {viewModeAtom} from "../atoms/OfferListViewMode.ts";
import OfferCardGrid from "./OfferCardGrid.tsx";

interface OffersTableProps {
    offers: ComponentOffer[];
    isFetching: boolean;
    isLoading: boolean;
    isError: boolean;
    isRefetching: boolean;
}

const OfferUserList = ({offers, isLoading, isError, isRefetching}:OffersTableProps) => {
    const viewMode = useAtomValue(viewModeAtom);


    if (!offers || offers.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <p>Brak ofert spełniających wybrane kryteria</p>
            </div>
        );
    }
    if (isError) {
        return (
            <p className="p-4 text-ocean-red">Błąd podczas pobierania danych.</p>
        )
    }


    return (
        <div className="relative">

            {isRefetching && isLoading && (
                <div className="flex justify-center items-center min-h-[400px]">
                    <LoadingSpinner />
                </div>
            )}

            <div
                className={`${
                    viewMode === "grid"
                        ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                        : "flex flex-col gap-4"
                }`}
            >
                {offers.map((offer) =>
                    viewMode === "list" ? (
                        <OfferCardFlex key={offer.websiteUrl} offer={offer} />
                    ) : (
                        <OfferCardGrid key={offer?.websiteUrl} offer={offer} />
                    )
                )}
            </div>
        </div>
    );
}
export default OfferUserList;