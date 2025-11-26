import {ImageOff, Plus} from "lucide-react";
import type {ComponentOffer} from "../../../../types/OfferBase.ts";
import {showToast} from "../../../../lib/ToastContainer.tsx";
import {validateCompatibility} from "../../hooks/validateCompatibility.ts";
import {useAtomValue} from "jotai";
import {selectedComputerAtom} from "../../../../atomContext/computerAtom.tsx";
import {useUpdateOffersToComputer} from "../../../admin/hooks/useUpdateOffersToComputer.ts";
import {useState} from "react";
import {ShopImageComponent} from "./ShopImageComponent.tsx";

interface OfferCardGridProps {
    offer: ComponentOffer;
}

const OfferCardGrid: React.FC<OfferCardGridProps> = ({ offer }) => {



    const selectedComputer = useAtomValue(selectedComputerAtom);
    const updateMutation = useUpdateOffersToComputer();
    const [imgError, setImgError] = useState(false);

    async function updateComputer() {
        if (!selectedComputer) {
            showToast.warning("Najpierw wybierz zestaw komputerowy");
            return;
        }

        const error = validateCompatibility(selectedComputer, offer);
        if (error) {
            showToast.error(error);
            return;
        }

        updateMutation.mutate({
            computerId: selectedComputer.id,
            offerUrl: offer.websiteUrl,
        });

        showToast.success("Podzespół został dodany do zestawu!");
    }


 const renderConditionBadge = (condition: string) => {
        switch (condition?.toLowerCase()) {
            case "new":
                return (
                    <span className="absolute top-2 right-2 bg-text-green-v1 text-ocean-dark-blue text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-sm">
            Nowy
          </span>
                );
            case "used":
                return (
                    <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-sm">
            Używany
          </span>
                );
            default:
                return null;
        }
    };
        const hasValidPhoto = offer.photoUrl && offer.photoUrl.trim() !== "";

    return (
        <div className="relative border border-gray-200 rounded-md hover:border-ocean-blue transition cursor-pointer bg-white shadow-sm hover:shadow-md flex flex-col">
            <div className="relative w-full h-36 bg-white flex items-center justify-center overflow-hidden rounded-t-md">
                {hasValidPhoto && !imgError ? (
                    <img
                        src={offer.photoUrl}
                        alt={`${offer.brand} ${offer.model}`}
                        className="w-full h-full object-contain"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <ImageOff className="text-gray-400 w-10 h-10" strokeWidth={1.5} />
                )}
                {renderConditionBadge(offer.condition)}
            </div>

            <div className="p-2 text-center">
                <a
                    href={offer.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ocean-blue hover:underline transition-colors"
                >
                    {offer.brand} {offer.model}
                </a>
        </div>

    <div className="px-2 pb-2 flex items-center justify-between gap-2">
        <div className="flex-shrink-0">
            <ShopImageComponent size={8} shopName={offer.shopName}/>
        </div>

        <div className="text-sm font-bold text-ocean-dark-blue flex-grow text-center">
            {offer.price.toLocaleString("pl-PL")} zł
        </div>

        <button
            onClick={updateComputer}
            className="p-2 rounded-md bg-ocean-blue text-white hover:bg-ocean-dark-blue transition-colors flex items-center justify-center flex-shrink-0"
            aria-label="Dodaj do zestawu"
        >
            <Plus size={14} />
        </button>
    </div>
</div>
);
};

export default OfferCardGrid;
