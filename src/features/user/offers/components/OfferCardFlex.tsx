import type {ComponentOffer} from "../../../../types/OfferBase.ts";
import {type FC, useState} from "react";
import { useAtomValue} from "jotai";
import {showToast} from "../../../../lib/ToastContainer.tsx";
import {selectedComputerAtom} from "../../../../atomContext/computerAtom.tsx";
import {useUpdateOffersToComputer} from "../../../admin/hooks/useUpdateOffersToComputer.ts";
import {validateCompatibility} from "../../hooks/validateCompatibility.ts";
import {ImageOff, Info} from "lucide-react";
import { CheckCircle, Wrench, AlertTriangle } from "lucide-react";

interface Props {
    offer: ComponentOffer;
}

const OfferCardFlex: FC<Props> = ({ offer }) => {
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

    // const renderConditionBadge = (condition: string) => {
    //     switch (condition?.toLowerCase()) {
    //         case "new":
    //             return (
    //                 <span className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
    //       <CheckCircle size={14} /> Nowy
    //     </span>
    //             );
    //         case "used":
    //             return (
    //                 <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full">
    //       <Wrench size={14} /> Używany
    //     </span>
    //             );
    //         case "defective":
    //             return (
    //                 <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
    //       <AlertTriangle size={14} /> Uszkodzony
    //     </span>
    //             );
    //         default:
    //             return null;
    //     }
    // };

    const specTags = renderSpecTags();
    const hasValidPhoto = offer.photoUrl && offer.photoUrl.trim() !== "";


    return (
        <div className="relative group bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 border-gray-200 hover:border-ocean-blue">
            <div className="flex gap-4">

                <div className="flex flex-col gap-1">
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-50 border border-gray-200 rounded">
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
                    </div>
                    
                    <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-sm text-center
                            ${offer.condition === "NEW" ? "bg-text-green-v1 text-ocean-dark-blue"
                                : offer.condition === "USED" ? "bg-yellow-100 text-yellow-700"
                                    : "bg-ocean-red/20 text-ocean-red"}`}
                    >
                        {offer.condition === "NEW"
                            ? "NOWY"
                            : offer.condition === "USED"
                                ? "UŻYWANY"
                                : "USZKODZONY"}
                    </span>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                        <div>
                            <h3 className="text-sm sm:text-base font-semibold text-midnight-dark leading-tight">
                                <a
                                    href={offer.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-ocean-blue hover:underline transition-colors"
                                >
                                    {offer.brand} {offer.model}
                                </a>
                            </h3>
                            {offer.title && (
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 group-hover:line-clamp-2 transition-all">
                                    {offer.title}
                                </p>
                            )}
                        </div>

                        {offer.shopName && (
                            <img
                                src={
                                    offer.shopName.toLowerCase() === "allegro"
                                        ? "allegro.png"
                                        : offer.shopName.toLowerCase() === "olx"
                                            ? "olx.png"
                                            : offer.shopName.toLowerCase() === "allegrolokalnie"
                                                ? "Allegro-Lokalnie.png"
                                                : ""
                                }
                                alt={offer.shopName}
                                className="w-10 h-10 object-contain"
                            />
                        )}
                    </div>

                    {specTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {specTags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-xs px-2 py-0.5 rounded bg-ocean-light-blue bg-opacity-20 text-ocean-dark-blue border border-ocean-light-blue"
                                >
                  {tag}
                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-lg font-bold text-ocean-dark-blue">
                        {offer.price.toLocaleString("pl-PL")} zł
                      </span>

                        <button
                            onClick={updateComputer}
                            className="p-2 rounded-md bg-ocean-blue text-white hover:bg-ocean-dark-blue transition-colors"
                            aria-label="Dodaj do zestawu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default OfferCardFlex;