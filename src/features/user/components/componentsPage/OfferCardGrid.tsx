import { ImageOff } from "lucide-react";
import type {ComponentOffer} from "../../../../types/OfferBase.ts";

interface OfferCardGridProps {
    offer: ComponentOffer;
}

const OfferCardGrid: React.FC<OfferCardGridProps> = ({ offer }) => {
    const renderConditionBadge = (condition: string) => {
        switch (condition?.toLowerCase()) {
            case "new":
                return (
                    <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-green-300 shadow-sm">
            Nowy
          </span>
                );
            case "used":
                return (
                    <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-yellow-300 shadow-sm">
            Używany
          </span>
                );
            case "defective":
                return (
                    <span className="absolute top-2 right-2 bg-red-100 text-red-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-red-300 shadow-sm">
            Uszkodzony
          </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative border border-gray-200 rounded-md hover:border-ocean-blue transition cursor-pointer bg-white shadow-sm hover:shadow-md flex flex-col">
            <div className="relative w-full h-32 sm:h-36 bg-white flex items-center justify-center overflow-hidden rounded-t-md">
                {offer.photoUrl ? (
                    <img
                        src={offer.photoUrl}
                        alt={offer.title}
                        className="w-full h-full object-contain"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                ) : (
                    <ImageOff className="w-8 h-8 text-gray-400" />
                )}
                {renderConditionBadge(offer.condition)}
            </div>

            {/* Dolna część — opis */}
            <div className="p-2 flex flex-col flex-grow justify-between text-center">
                <div className="text-xs font-medium text-midnight-dark truncate">
                    {offer.brand} {offer.model}
                </div>

                <div className="text-[10px] text-gray-500 truncate mb-1">
                    {offer.shopName || "Nieznany sklep"}
                </div>

                <div className="text-sm font-bold text-ocean-dark-blue">
                    {offer.price.toLocaleString("pl-PL")} zł
                </div>
            </div>
        </div>
    );
};

export default OfferCardGrid;
