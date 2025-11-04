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


    return(
        <div className="">
            {isFetching && (
                <div className="absolute top-2 right-2">
                    <LoadingSpinner/>
                </div>
            )}
            {isLoading && (
                <div className="absolute top-2 right-2">
                    <LoadingSpinner/>
                </div>
            )}
            {offers.map((offer, index) => (
                <OfferCard key={index} offer={offer}/>
            ))}

        </div>
    )
}
export default OfferUserList;