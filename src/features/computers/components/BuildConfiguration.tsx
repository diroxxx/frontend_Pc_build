import {ComponentTypeEnum} from "../../../shared/dtos/BaseItemDto.ts";
import {useAtomValue} from "jotai";
import {selectedComputerAtom} from "../atoms/computerAtom.tsx";
import {Filter} from "lucide-react";

interface BuildConfigurationProps {
    categories: ComponentTypeEnum[];
    onAddComponent: (category: ComponentTypeEnum) => void;
}
const categoryLabels: Record<string, string> = {
    PROCESSOR: "CPU",
    GRAPHICS_CARD: "GPU",
    MOTHERBOARD: "Płyta główna",
    CPU_COOLER: "Chłodzenie cpu",
    CASE_PC: "Obudowa",
    MEMORY: "RAM",
    POWER_SUPPLY: "Zasilacz",
    STORAGE: "Pamięć",
};
const conditionLabel: Record<string, string> = {
    NEW: "Nowe",
    USED: "Używane",
}

export default function BuildConfiguration({
                                               categories,
                                                onAddComponent
                                           }: BuildConfigurationProps) {

    const selectedComputer = useAtomValue(selectedComputerAtom)
    return (
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-dark-border flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-bold text-dark-text">
                        {selectedComputer ? selectedComputer.name : "Wybierz lub utwórz zestaw"}
                    </h2>
                    {selectedComputer && (
                        <p className="text-xs text-dark-muted mt-0.5">
                            {selectedComputer.offers?.length || 0} komponentów
                        </p>
                    )}
                </div>
                {selectedComputer && selectedComputer.offers?.length > 0 && (
                    <span className="text-lg font-extrabold text-white">
                        {selectedComputer.price.toLocaleString("pl-PL")} zł
                    </span>
                )}
            </div>

            {selectedComputer ? (
                <div>
                    {categories.map((cat) => {
                        const offer = selectedComputer.offers?.find(o => o.componentType === cat);

                        return (
                            <div
                                key={cat}
                                className="grid grid-cols-4 border-b border-dark-border px-5 py-3 items-center last:border-b-0 hover:bg-dark-surface2 transition-colors"
                            >
                                {/* Category label */}
                                <div className="text-xs font-semibold text-dark-muted uppercase tracking-wide">
                                    {categoryLabels[cat] || cat}
                                </div>

                                {offer ? (
                                    <>
                                        <div className="flex items-center gap-3">
                                            {offer.photoUrl ? (
                                                <img
                                                    src={offer.photoUrl}
                                                    alt={`${offer.brand} ${offer.model}`}
                                                    className="w-10 h-10 object-contain rounded-lg border border-dark-border bg-dark-surface2 flex-shrink-0"
                                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-dark-surface2 rounded-lg flex items-center justify-center border border-dark-border flex-shrink-0">
                                                    <span className="text-[9px] text-dark-muted">brak</span>
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <a
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    href={offer.websiteUrl}
                                                    className="text-xs font-semibold text-dark-text hover:text-dark-accent transition-colors line-clamp-1"
                                                >
                                                    {offer.brand} {offer.model}
                                                </a>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-[10px] text-dark-muted">{offer.shopName}</span>
                                                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                                                        offer.condition === "NEW"
                                                            ? "bg-green-500/10 text-green-400"
                                                            : "bg-amber-500/10 text-amber-400"
                                                    }`}>
                                                        {conditionLabel[offer.condition]}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-sm font-bold text-white">
                                            {offer.price.toLocaleString("pl-PL")} zł
                                        </div>

                                        <button
                                            className="justify-self-end px-3 py-1.5 text-xs rounded-lg bg-dark-surface2 border border-dark-border text-dark-muted hover:border-dark-accent hover:text-dark-accent transition-all"
                                            onClick={() => onAddComponent(cat as ComponentTypeEnum)}
                                        >
                                            Zmień
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-xs text-dark-muted italic">Nie wybrano</div>
                                        <div />
                                        <button
                                            className="justify-self-end flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-dark-accent/15 text-dark-accent hover:bg-dark-accent hover:text-white border border-dark-accent/20 hover:border-dark-accent transition-all"
                                            onClick={() => onAddComponent(cat as ComponentTypeEnum)}
                                        >
                                            + Dodaj
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center p-10">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-dark-surface2 border border-dark-border flex items-center justify-center">
                        <Filter className="w-5 h-5 text-dark-muted" />
                    </div>
                    <p className="text-sm text-dark-muted">
                        Wybierz istniejący zestaw lub utwórz nowy, aby rozpocząć konfigurację.
                    </p>
                </div>
            )}
        </div>
    );
}
