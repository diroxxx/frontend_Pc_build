import type {ComponentOffer} from "../../../../shared/dtos/OfferBase.ts";
import {useState} from "react";
import {useAtom, useAtomValue} from "jotai";
import {showToast} from "../../../../lib/ToastContainer.tsx";
import {selectedComputerAtom} from "../../../computers/atoms/computerAtom.tsx";
import {useUpdateOffersToComputer} from "../../../offersUpdates/admin/hooks/useUpdateOffersToComputer.ts";
import {validateCompatibility} from "../../../computers/hooks/validateCompatibility.ts";
import {ImageOff} from "lucide-react";
import {ShopImageComponent} from "./ShopImageComponent.tsx";
import {userAtom} from "../../../auth/atoms/userAtom.tsx";
import {guestComputersAtom} from "../../../computers/atoms/guestComputersAtom.ts";
import {PriceHistoryModal} from "./PriceHistoryModal.tsx";

interface Props {
    offer: ComponentOffer;
}

const OfferCardFlex = ({ offer } : Props) => {
    const selectedComputer = useAtomValue(selectedComputerAtom);
    const updateMutation = useUpdateOffersToComputer();
    const [imgError, setImgError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const user =useAtomValue(userAtom);
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

    const renderSpecTags = () => {
        const tags = [];

        switch (offer.componentType) {
            case "GRAPHICS_CARD":
                if (offer.vram) tags.push(`${offer.vram}GB`);
                if (offer.gddr) tags.push(offer.gddr);
                if (offer.boostClock) tags.push(`${offer.boostClock}MHz`);
                if (offer.powerDraw) tags.push(`${offer.powerDraw}W`);
                if (offer.lengthInMM) tags.push(`${offer.lengthInMM}mm`);
                break;

            case "PROCESSOR":
                if (offer.cores) tags.push(`${offer.cores} rdzeni`);
                if (offer.threads) tags.push(`${offer.threads} wątków`);
                if (offer.baseClock) tags.push(`${offer.baseClock}GHz`);
                if (offer.socketType) tags.push(offer.socketType);
                if (offer.tdp) tags.push(`${offer.tdp}W`);
                if (offer.boostClock) tags.push(`${offer.boostClock}GHz`);
                if (offer.integratedGraphics) tags.push(offer.integratedGraphics);
                break;

            case "MEMORY":
                if (offer.capacity) tags.push(`${offer.capacity}GB`);
                if (offer.speed) tags.push(`${offer.speed}MHz`);
                if (offer.type) tags.push(offer.type);
                if (offer.latency) tags.push(offer.latency);
                if (offer.amount) tags.push(`${offer.amount}x`);
                break;

            case "STORAGE":
                if (offer.capacity) tags.push(`${offer.capacity}GB`);
                break;

            case "POWER_SUPPLY":
                if (offer.maxPowerWatt) tags.push(`${offer.maxPowerWatt}W`);
                if (offer.efficiencyRating) tags.push(offer.efficiencyRating);
                if (offer.modular) tags.push(` modular: ${offer.modular}`);
                if (offer.type) tags.push(offer.type);
                break;

            case "MOTHERBOARD":
                if (offer.socketType) tags.push(offer.socketType);
                if (offer.chipset) tags.push(offer.chipset);
                if (offer.format) tags.push(offer.format);
                if (offer.memoryType) tags.push(offer.memoryType);
                if (offer.ramSlots) tags.push(`${offer.ramSlots} sloty RAM`);
                if (offer.ramCapacity) tags.push(`${offer.ramCapacity}GB RAM`);
                break;

            case "CPU_COOLER":
                if (offer.coolerSocketsType?.length)
                    tags.push(...offer.coolerSocketsType);
                if (offer.fanRpm) tags.push(`RPM: ${offer.fanRpm}`);
                if (offer.noiseLevel) tags.push(`Poziom hałasu: ${offer.noiseLevel}`);
                if (offer.radiatorSize) tags.push(`Rozmiar radiatora: ${offer.radiatorSize}`);
                break;

            case "CASE_PC":
                if (offer.format) tags.push(offer.format);
                break;

            default:
                break;
        }

        return tags.filter(Boolean);
    };


    const specTags = renderSpecTags();
    const hasValidPhoto = offer.photoUrl && offer.photoUrl.trim() !== "";


    return (
        <>
        {showModal && <PriceHistoryModal offer={offer} onClose={() => setShowModal(false)} />}
        <div onClick={() => setShowModal(true)} className="relative group bg-dark-surface border border-dark-border rounded-xl p-4 hover:border-dark-accent/50 hover:bg-dark-surface2 transition-all duration-200 cursor-pointer overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-transparent before:transition-colors hover:before:bg-dark-accent">
            <div className="flex gap-4">

                <div className="flex flex-col gap-2 flex-shrink-0">
                    <div className="w-20 h-20 flex items-center justify-center bg-dark-surface2 border border-dark-border rounded-xl overflow-hidden">
                        {hasValidPhoto && !imgError ? (
                            <img
                                src={offer.photoUrl}
                                alt={`${offer.brand} ${offer.model}`}
                                className="w-full h-full object-contain"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <ImageOff className="text-dark-border w-8 h-8" strokeWidth={1.5} />
                        )}
                    </div>

                    <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded text-center border
                            ${offer.condition === "NEW"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : offer.condition === "USED"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    : "bg-ocean-red/10 text-ocean-red border-ocean-red/20"}`}
                    >
                        {offer.condition === "NEW"
                            ? "NOWY"
                            : offer.condition === "USED"
                                ? "UŻYWANY"
                                : "USZKODZ."}
                    </span>
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                            <h3 className="text-sm sm:text-base font-bold text-dark-text leading-tight truncate">
                                <a
                                    href={offer.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-dark-accent transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {offer.brand} {offer.model}
                                </a>
                            </h3>
                            {offer.title && (
                                <p className="text-xs text-dark-muted mt-0.5 line-clamp-1 group-hover:line-clamp-2 transition-all">
                                    {offer.title}
                                </p>
                            )}
                        </div>

                        {offer.shopName && (
                            <ShopImageComponent shopName={offer.shopName}/>
                        )}
                    </div>

                    {specTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {specTags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-[11px] px-2 py-0.5 rounded-md bg-dark-tag-bg text-dark-tag-text border border-dark-tag-text/10 font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-3 flex justify-between items-center">
                        <span className="text-xl font-extrabold text-white">
                            {offer.price.toLocaleString("pl-PL")} zł
                        </span>

                        <button
                            onClick={(e) => { e.stopPropagation(); (user ? updateComputer : updateComputerGuest)(); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-accent/15 text-dark-accent hover:bg-dark-accent hover:text-white transition-all text-xs font-semibold"
                            aria-label="Dodaj do zestawu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Dodaj
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};
export default OfferCardFlex;