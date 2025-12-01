import type {OfferRecDto} from "../types/OfferRecDto.ts";
import { ImageOff, Plus} from "lucide-react";
import {ShopImageComponent} from "../../offers/components/ShopImageComponent.tsx";
import {useAtomValue} from "jotai";
import {selectedComputerAtom} from "../../../../atomContext/computerAtom.tsx";
import {useUpdateOffersToComputer} from "../../../admin/hooks/useUpdateOffersToComputer.ts";
import {useState} from "react";
import {showToast} from "../../../../lib/ToastContainer.tsx";
import {validateCompatibility} from "../../computers/hooks/validateCompatibility.ts";

export const OfferRecGameCard = ({offerRec}:{offerRec: OfferRecDto} ) => {

    const selectedComputer = useAtomValue(selectedComputerAtom);
    const updateMutation = useUpdateOffersToComputer();
    const [imgError, setImgError] = useState(false);

    // async function updateComputer() {
    //     if (!selectedComputer) {
    //         showToast.warning("Najpierw wybierz zestaw komputerowy");
    //         return;
    //     }

    //     const error = validateCompatibility(selectedComputer, offer);
    //     if (error) {
    //         showToast.error(error);
    //         return;
    //     }
    //
    //     updateMutation.mutate({
    //         computerId: selectedComputer.id,
    //         offerUrl: offer.websiteUrl,
    //     });
    //
    //     showToast.success("Podzespół został dodany do zestawu!");
    // }


    // const renderConditionBadge = (condition: string) => {
    //     switch (condition?.toLowerCase()) {
    //         case "new":
    //             return (
    //                 <span className="absolute top-2 right-2 bg-text-green-v1 text-ocean-dark-blue text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-sm">
    //         Nowy
    //       </span>
    //             );
    //         case "used":
    //             return (
    //                 <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-sm">
    //         Używany
    //       </span>
    //             );
    //         default:
    //             return null;
    //     }
    // };
    const hasValidPhoto = offerRec.photoUrl && offerRec.photoUrl.trim() !== "";


    return (
        <div className="flex gap-3 bg-gray-50 rounded border border-gray-200 hover:border-ocean-blue transition-all overflow-hidden hover:shadow-sm group p-3">

            {/* ZDJĘCIE + badge z kondycją POD zdjęciem */}
            <div className="relative flex-shrink-0">
                {/* Zdjęcie */}
                <div className="w-20 h-20 bg-white rounded overflow-hidden border border-gray-300">
                    {hasValidPhoto && !imgError ? (
                        <img
                            src={offerRec.photoUrl}
                            alt={`${offerRec.brand} ${offerRec.model}`}
                            className="w-full h-full object-contain"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <ImageOff className="text-gray-400 w-10 h-10" strokeWidth={1.5} />
                        </div>
                    )}
                </div>

                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap
                        ${offerRec.condition === "NEW"
                        ? "bg-text-green-v1 text-ocean-dark-blue"
                        : offerRec.condition === "USED"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-ocean-red/20 text-ocean-red"
                    }`}
                >
                    {offerRec.condition === "NEW" ? "NOWY" :
                        offerRec.condition === "USED" ? "UŻYWANY" : "USZKODZONY"}
                </span>
                </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">

                <div>
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                        <p className="text-[10px] font-bold text-ocean-blue uppercase tracking-wide">
                            {offerRec.brand}
                        </p>
                        {offerRec.shopName && (
                            <ShopImageComponent shopName={offerRec.shopName} />
                        )}
                    </div>

                    <h3 className="text-sm">
                        {offerRec.title}
                    </h3>
                </div>

                <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-sm font-bold text-ocean-blue whitespace-nowrap">
                        {offerRec.price.toFixed(2)} zł
                    </p>

                    <a
                        href={offerRec.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-ocean-blue hover:bg-ocean-dark-blue text-white text-[10px] font-semibold rounded transition-all whitespace-nowrap"
                    >
                        Zobacz
                    </a>
                </div>
            </div>
        </div>
    );
}