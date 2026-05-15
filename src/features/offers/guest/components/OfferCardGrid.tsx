import {ImageOff, Plus, TrendingUp, Tag} from "lucide-react";
import type {ComponentOffer} from "../../../../shared/dtos/OfferBase.ts";
import {showToast} from "../../../../lib/ToastContainer.tsx";
import {validateCompatibility} from "../../../computers/hooks/validateCompatibility.ts";
import {useAtom, useAtomValue} from "jotai";
import {selectedComputerAtom} from "../../../computers/atoms/computerAtom.tsx";
import {useUpdateOffersToComputer} from "../../../offersUpdates/admin/hooks/useUpdateOffersToComputer.ts";
import {useState} from "react";
import {ShopImageComponent} from "./ShopImageComponent.tsx";
import {guestComputersAtom} from "../../../computers/atoms/guestComputersAtom.ts";
import {userAtom} from "../../../auth/atoms/userAtom.tsx";
import {PriceHistoryModal} from "./PriceHistoryModal.tsx";

interface OfferCardGridProps {
    offer: ComponentOffer;
}

const OfferCardGrid: React.FC<OfferCardGridProps> = ({ offer }) => {


    const user = useAtomValue(userAtom);
    const selectedComputer = useAtomValue(selectedComputerAtom);
    const updateMutation = useUpdateOffersToComputer();
    const [imgError, setImgError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [guestcomputers, setGuestComputers] = useAtom(guestComputersAtom);
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

    const updateComputerGuest = () => {
        if (!selectedComputer) {
            showToast.warning("Najpierw wybierz zestaw komputerowy");
            return;
        }

        const error = validateCompatibility(selectedComputer, offer);
        if (error) {
            showToast.error(error);
            return;
        }
        const updatedComputer = {
            ...selectedComputer,
            offers: [
                ...selectedComputer.offers.filter(o => o.componentType !== offer.componentType),
                offer
            ],
            price: selectedComputer.offers
                .filter(o => o.componentType !== offer.componentType)
                .reduce((sum, o) => sum + o.price, offer.price)
        };

        const updatedGuestComputers = guestcomputers.map(c =>
            c.id === selectedComputer.id ? updatedComputer : c
        );

        setGuestComputers(updatedGuestComputers);
        showToast.success("Podzespół został dodany do zestawu!");

    }


const renderConditionBadge = (condition: string) => {
    switch (condition?.toLowerCase()) {
        case "new":
            return (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md">
                    NOWY
                </span>
            );
        case "used":
            return (
                <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md">
                    UŻYWANY
                </span>
            );
        default:
            return null;
    }
};
        const hasValidPhoto = offer.photoUrl && offer.photoUrl.trim() !== "";

    return (
    <>
    {showModal && <PriceHistoryModal offer={offer} onClose={() => setShowModal(false)} />}
    <div className={`relative rounded-xl transition-all duration-200 bg-dark-surface flex flex-col h-full ${
        offer.isDeal
            ? "border-2 border-green-500/60 hover:border-green-400 shadow-[0_0_12px_rgba(34,197,94,0.15)]"
            : "border border-dark-border hover:border-dark-accent/50"
    }`}>
        {offer.isDeal && (
            <div className="flex items-center gap-1.5 bg-green-500/15 border-b border-green-500/30 px-3 py-1.5 rounded-t-xl">
                <Tag size={13} className="text-green-400 flex-shrink-0" />
                <span className="text-xs font-bold text-green-400 tracking-wide">OKAZJA</span>
                <span className="text-[10px] text-green-500/70 ml-auto">cena blisko minimum</span>
            </div>
        )}
        <div className={`relative w-full h-36 bg-dark-surface2 flex items-center justify-center overflow-hidden flex-shrink-0 ${offer.isDeal ? "" : "rounded-t-xl"}`}>
            {hasValidPhoto && !imgError ? (
                <img
                    src={offer.photoUrl}
                    alt={`${offer.brand} ${offer.model}`}
                    className="w-full h-full object-contain"
                    onError={() => setImgError(true)}
                />
            ) : (
                <ImageOff className="text-dark-border w-10 h-10" strokeWidth={1.5} />
            )}
            {renderConditionBadge(offer.condition)}
        </div>

        <div className="p-2 text-center flex-1 flex items-center justify-center min-h-[3rem]">
            <a
                href={offer.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-dark-text hover:text-dark-accent transition-colors leading-tight"
                onClick={(e) => e.stopPropagation()}
            >
                {offer.brand} {offer.model}
            </a>
        </div>

        <div className="px-2 pb-2 flex items-center justify-between gap-1.5 flex-shrink-0">
            <div className="flex-shrink-0">
                <ShopImageComponent shopName={offer.shopName}/>
            </div>

            <div className="text-xs font-extrabold text-dark-text flex-grow text-center">
                {offer.price.toLocaleString("pl-PL")} zł
            </div>

            <button
                onClick={() => setShowModal(true)}
                className="p-1.5 rounded-lg bg-dark-surface2 text-dark-muted hover:text-dark-text transition-all flex items-center justify-center flex-shrink-0"
                aria-label="Historia cen"
            >
                <TrendingUp size={13} />
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); (user ? updateComputer : updateComputerGuest)(); }}
                className="p-1.5 rounded-lg bg-dark-accent/15 text-dark-accent hover:bg-dark-accent hover:text-white transition-all flex items-center justify-center flex-shrink-0"
                aria-label="Dodaj do zestawu"
            >
                <Plus size={14} />
            </button>
        </div>
    </div>
    </>
);
};

export default OfferCardGrid;
