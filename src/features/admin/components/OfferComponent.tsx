import type {ComponentOffer} from "../../../types/OfferBase.ts";
import React from "react";

interface OfferRowProps {
    offer: ComponentOffer;
    onClick: () => void;
}

const OfferComponent:React.FC<OfferRowProps> = ({ offer, onClick }) => {
    console.log(offer);
    return (
        <tr
            className="hover:bg-gray-50 transition"
            // onClick={onClick}
        >
            <td className="px-3 py-2">{offer.componentType}</td>
            <td className="px-3 py-2">{offer.brand}</td>
            <td className="px-3 py-2">{offer.model}</td>
            <td className="px-3 py-2">{offer.title}</td>
            <td className="px-3 py-2">{offer.condition}</td>
            <td className="px-3 py-2">{offer.shopName}</td>
            <td className="px-3 py-2">{offer.price}</td>
            <td className="px-3 py-2">
                <a
                    href={offer.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ocean-blue hover:underline"
                >
                    Zobacz
                </a>
            </td>

        </tr>
    );
}
export default OfferComponent;