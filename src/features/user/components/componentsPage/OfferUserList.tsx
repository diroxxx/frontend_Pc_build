import type {ComponentOffer} from "../../../../types/OfferBase.ts";
import type {FC} from "react";
import OfferCard from "./OfferCard.tsx";
import {LoadingSpinner} from "../../../../assets/components/ui/LoadingSpinner.tsx";

interface OffersTableProps {
    offers: ComponentOffer[];
    isFetching: boolean;
    isLoading: boolean;
}

const OfferUserList: FC<OffersTableProps> = ({offers, isFetching, isLoading}) => {
    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="relative">
            {(isFetching || isLoading) && (
                <div className="absolute top-3 right-3 z-10">
                    <LoadingSpinner />
                </div>
            )}

            <div className="flex flex-col gap-4">
                {offers.length === 0 ? (
                    <div className="text-center text-gray-600 py-8 bg-white border border-gray-200 rounded-xl shadow-sm">
                        Brak ofert spełniających kryteria wyszukiwania.
                    </div>
                ) : (
                    offers.map((offer, index) => (
                        <OfferCard
                            key={index}
                            offer={offer}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
export default OfferUserList;