import {ComponentTypeEnum} from "../../../../types/BaseItemDto.ts";
import {useAtomValue} from "jotai";
import {selectedComputerAtom} from "../../../../atomContext/computerAtom.tsx";

interface BuildConfigurationProps {
    categories: ComponentTypeEnum[];
    onAddComponent: (category: ComponentTypeEnum) => void;
}
const categoryLabels: Record<string, string> = {
    processor: "CPU",
    graphicsCard: "GPU",
    motherboard: "Płyta główna",
    cooler: "Chłodzenie",
    casePc: "Obudowa",
    memory: "RAM",
    powerSupply: "Zasilacz",
    ssd: "Dysk SSD",
    hdd: "Dysk HDD",
    storage: "Pamięć",
};

export default function BuildConfiguration({
                                               categories,
                                                onAddComponent
                                           }: BuildConfigurationProps) {

    const selectedComputer = useAtomValue(selectedComputerAtom)
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-ocean-light-blue">
            <div className="bg-ocean-blue text-white p-4">
                <h2 className="text-lg font-semibold">
                    {selectedComputer ? selectedComputer.name : "Wybierz lub utwórz zestaw"}
                </h2>
                {selectedComputer && (
                    <p className="text-ocean-light-blue text-sm">
                        Łączna cena: {selectedComputer.price.toLocaleString("pl-PL")} zł
                    </p>
                )}
            </div>

            {selectedComputer ? (
                <div>
                    {categories.map((cat) => {
                        const offer = selectedComputer.offers?.find(
                            (o) => o.componentType === cat
                        );

                        return (
                            <div
                                key={cat}
                                className="grid grid-cols-4 border-b border-gray-200 p-3 items-center last:border-b-0 hover:bg-gray-50 transition-colors"
                            >
                                <div className="font-medium text-midnight-dark">
                                    {categoryLabels[cat] || cat}
                                </div>

                                {offer ? (
                                    <>
                                        <div className="flex items-center gap-3">
                                            {offer.photoUrl ? (
                                                <img
                                                    src={offer.photoUrl}
                                                    alt={`${offer.brand} ${offer.model}`}
                                                    className="w-10 h-10 object-contain rounded border border-gray-300"
                                                    onError={(e) =>
                                                        (e.currentTarget.style.display = "none")
                                                    }
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs border border-dashed">
                                                    brak
                                                </div>
                                            )}

                                            <div>
                                                <div className="font-medium text-midnight-dark text-sm leading-tight">
                                                    {offer.brand} {offer.model}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {offer.shopName ? offer.shopName : "—"} • {offer.condition}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="font-semibold text-ocean-dark-blue text-sm">
                                            {offer.price.toLocaleString("pl-PL")} zł
                                        </div>

                                        <button
                                            className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-midnight-dark transition-colors"
                                            onClick={() =>
                                                onAddComponent(cat as ComponentTypeEnum)
                                            }
                                        >
                                            Zmień
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-ocean-blue italic text-sm">
                                            Nie wybrano
                                        </div>
                                        <div></div>

                                        <button
                                            className="px-3 py-1 text-sm rounded-md bg-ocean-blue text-white hover:bg-ocean-dark-blue transition-colors"
                                            onClick={() =>
                                                onAddComponent(cat as ComponentTypeEnum)
                                            }
                                        >
                                            + Dodaj
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    {/* Podsumowanie */}
                    {selectedComputer.offers?.length > 0 && (
                        <div className="bg-gray-100 border-t border-ocean-light-blue p-4 flex justify-between items-center">
              <span className="text-sm font-medium text-midnight-dark">
                Łączna cena zestawu:
              </span>
                            <span className="text-base font-bold text-ocean-dark-blue">
                {selectedComputer.price.toLocaleString("pl-PL")} zł
              </span>
                        </div>
                    )}
                </div>
            ) : (
                // Gdy nie wybrano zestawu
                <div className="mt-6 text-center p-8 bg-ocean-light-blue bg-opacity-20 border border-ocean-light-blue rounded-lg">
                    <p className="text-ocean-dark-blue">
                        Wybierz istniejący zestaw lub utwórz nowy, aby rozpocząć
                        konfigurację.
                    </p>
                </div>
            )}
        </div>
    );
}
