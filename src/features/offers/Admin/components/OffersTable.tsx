import OfferComponent from "../../../pcParts/admin/components/OfferComponent.tsx";
import type {ComponentOffer} from "../../../../shared/dtos/OfferBase.ts";
import {type FC, useState} from "react";
import OfferEditCard from "./OfferEditCard.tsx";
import {LoadingSpinner} from "../../../../assets/components/ui/LoadingSpinner.tsx";

interface OffersTableProps {
    offers: ComponentOffer[];
    isFetching: boolean;
    isLoading: boolean;
    isError: boolean;
}

const OffersTable: FC<OffersTableProps> = ({ offers, isFetching, isLoading, isError }) => {
    const [selectedOffer, setSelectedOffer] = useState<ComponentOffer | null>(null);
    const [isEditCardOpen, setIsEditCardOpen] = useState(false);

    const handleRowClick = (offer: ComponentOffer) => {
        setSelectedOffer(offer);
        setIsEditCardOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedOffer(null);
        setIsEditCardOpen(false);
    };

    if (isLoading) {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
                <div className="flex min-h-[60vh] items-center justify-center p-6">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
                <div className="flex min-h-[60vh] items-center justify-center">
                    <p className="p-4 text-ocean-red">Błąd podczas pobierania danych.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">

            {isFetching && (
                <div className="absolute top-2 right-2">
                    <div className="w-4 h-4 border-2 border-t-transparent border-ocean-dark-blue rounded-full animate-spin">
                        <LoadingSpinner />
                    </div>
                </div>
            )}

            <table className="w-full text-sm">
                <thead className="bg-ocean-dark-blue text-ocean-white">
                <tr>
                    <th className="px-3 py-2 text-left font-medium">Typ</th>
                    <th className="px-3 py-2 text-left font-medium">Marka</th>
                    <th className="px-3 py-2 text-left font-medium">Model</th>
                    <th className="px-3 py-2 text-left font-medium">Tytuł</th>
                    <th className="px-3 py-2 text-left font-medium">Stan</th>
                    <th className="px-3 py-2 text-left font-medium">Sklep</th>
                    <th className="px-3 py-2 text-left font-medium">Cena</th>
                    <th className="px-3 py-2 text-left font-medium">Url</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {offers.length === 0 ? (
                    <tr>
                        <td
                            colSpan={4}
                            className="px-3 py-8 text-center text-midnight-dark"
                        >
                            Brak ofert w bazie lub brak spełniających kryteria.
                        </td>
                    </tr>
                ) : (
                    offers.map((offer) => (
                        <OfferComponent
                            key={offer.websiteUrl}
                            offer={offer}
                            onClick={() => handleRowClick(offer)}
                        />
                    ))
                )}
                </tbody>
            </table>
            {isEditCardOpen &&selectedOffer &&  (
                <OfferEditCard offer={selectedOffer} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default OffersTable;