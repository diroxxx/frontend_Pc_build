import type {ComponentOffer} from "../../../../types/OfferBase.ts";
import type {FC} from "react";
import OfferCardFlex from "./OfferCardFlex.tsx";
import {LoadingSpinner} from "../../../../assets/components/ui/LoadingSpinner.tsx";
import {useAtom, useAtomValue} from "jotai";
import {viewModeAtom} from "../atoms/OfferListViewMode.ts";
import OfferCardGrid from "./OfferCardGrid.tsx";

interface OffersTableProps {
    offers: ComponentOffer[];
    isFetching: boolean;
    isLoading: boolean;
}

const OfferUserList: FC<OffersTableProps> = ({offers, isFetching, isLoading}) => {
    const viewMode = useAtomValue(viewModeAtom);

     if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-midnight-dark text-sm">Ładowanie ofert...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {isFetching && !isLoading && (
                <div className="absolute top-3 right-3 z-10">
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