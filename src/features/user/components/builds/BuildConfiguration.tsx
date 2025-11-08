import {ComponentTypeEnum} from "../../../../types/BaseItemDto.ts";
import {useEffect} from "react";
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-ocean-light-blue">
            <div className="bg-gradient-ocean-dark text-white p-4">
                <h2 className="text-xl font-bold">
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
                                className="grid grid-cols-4 border-b border-ocean-light-blue p-4 items-center last:border-b-0
                          hover:bg-ocean-light-blue hover:bg-opacity-10 transition-colors duration-200"
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
                                                    className="w-12 h-12 object-contain rounded border border-ocean-light-blue"
                                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                                                    brak
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-midnight-dark">
                                                    {offer.brand} {offer.model}
                                                </div>
                                                <div className="text-xs text-ocean-blue">{offer.condition}</div>
                                            </div>
                                        </div>

                                        <div className="font-semibold text-ocean-blue">
                                            {offer.price.toLocaleString("pl-PL")} zł
                                        </div>

                                        <button
                                            className="bg-gradient-warning hover:bg-gradient-warning-hover text-white px-3 py-1 rounded text-sm font-medium transition-all duration-300 transform hover:scale-105"
                                            onClick={() => onAddComponent(cat as ComponentTypeEnum)}
                                        >
                                            Zmień
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-ocean-blue italic">Nie wybrano</div>
                                        <div></div>
                                        <button
                                            className="bg-gradient-ocean hover:bg-gradient-ocean-hover text-white px-4 py-2 rounded-md font-medium transition-all duration-300 transform hover:scale-105"
                                            onClick={() => onAddComponent(cat as ComponentTypeEnum)}
                                        >
                                            + Dodaj
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    {selectedComputer.offers?.length > 0 && (
                        <div className="bg-gradient-gray border-t-2 border-ocean-blue p-4 flex justify-between items-center">
              <span className="text-lg font-medium text-midnight-dark">
                Łączna cena zestawu:
              </span>
                            <span className="text-xl font-bold text-ocean-dark-blue">
                {selectedComputer.price.toLocaleString("pl-PL")} zł
              </span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-6 text-center p-8 bg-ocean-light-blue bg-opacity-20 border border-ocean-light-blue rounded-lg">
                    <p className="text-ocean-dark-blue">
                        Wybierz istniejący zestaw lub utwórz nowy, aby rozpocząć konfigurację
                    </p>
                </div>
            )}
        </div>
    );
}
