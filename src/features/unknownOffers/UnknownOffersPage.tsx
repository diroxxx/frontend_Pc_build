import { useState } from "react";
import { ComponentTypeEnum, PolishComponentTypeEnum } from "../../shared/dtos/BaseItemDto.ts";
import type { UnknownOfferDto, ComponentSearchResultDto } from "./dto/UnknownOfferDto.ts";
import { useUnknownOffers, useAssignOffer, useDismissOffer, useCreateAndAssign } from "./hooks/useUnknownOffers.ts";
import { Search, X, Plus, Link, Trash2, ImageOff, ExternalLink, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Przypisz do istniejącego komponentu ────────────────────────────────────

function AssignPanel({ offer, onClose }: { offer: UnknownOfferDto; onClose: () => void }) {
    const [query, setQuery] = useState("");
    const [filterType, setFilterType] = useState<ComponentTypeEnum | "">("");
    const [selected, setSelected] = useState<ComponentSearchResultDto | null>(null);
    const assignMutation = useAssignOffer();

    // TODO: zastąpić wynikami z useComponentSearch(query, filterType) gdy API gotowe
    const results: ComponentSearchResultDto[] = [];
    const isSearching = false;

    const handleAssign = () => {
        if (!selected) return;
        assignMutation.mutate({ offerId: offer.id, componentId: selected.id });
        onClose();
    };

    return (
        <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Przypisz do istniejącego komponentu</p>

            <div className="flex gap-2">
                <div className="relative">
                    <select
                        value={filterType}
                        onChange={e => { setFilterType(e.target.value as ComponentTypeEnum | ""); setSelected(null); }}
                        className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                    >
                        <option value="">Wszystkie typy</option>
                        {Object.entries(PolishComponentTypeEnum).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative flex-1">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => { setQuery(e.target.value); setSelected(null); }}
                        placeholder="Szukaj marki lub modelu..."
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                    />
                </div>
            </div>

            {isSearching && <p className="text-xs text-gray-400">Szukam...</p>}

            {results.length > 0 && !selected && (
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white divide-y divide-gray-100">
                    {results.map(r => (
                        <button
                            key={r.id}
                            onClick={() => setSelected(r)}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-blue-50 text-left transition-colors"
                        >
                            <span className="text-xs font-medium text-gray-700">{r.brand} {r.model}</span>
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                {PolishComponentTypeEnum[r.componentType as ComponentTypeEnum] ?? r.componentType}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {selected && (
                <div className="flex items-center justify-between px-3 py-2 bg-white border border-ocean-blue rounded-lg">
                    <div>
                        <p className="text-xs font-semibold text-gray-700">{selected.brand} {selected.model}</p>
                        <p className="text-[10px] text-gray-400">
                            {PolishComponentTypeEnum[selected.componentType as ComponentTypeEnum] ?? selected.componentType}
                        </p>
                    </div>
                    <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                        <X size={13} />
                    </button>
                </div>
            )}

            {!isSearching && results.length === 0 && query.length >= 2 && !selected && (
                <p className="text-xs text-gray-400 italic text-center py-2">
                    Brak wyników — API wyszukiwania komponentów nie jest jeszcze zaimplementowane.
                </p>
            )}

            <div className="flex gap-2 pt-1">
                <button
                    onClick={handleAssign}
                    disabled={!selected || assignMutation.isPending}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-ocean-blue text-white text-xs font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ocean-dark-blue transition-colors"
                >
                    <Link size={12} /> Przypisz
                </button>
                <button onClick={onClose} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                    Anuluj
                </button>
            </div>
        </div>
    );
}

// ─── Stwórz nowy komponent i przypisz ────────────────────────────────────────

const COMPONENT_FIELDS: Record<ComponentTypeEnum, { key: string; label: string; type?: string }[]> = {
    [ComponentTypeEnum.PROCESSOR]: [
        { key: "brand", label: "Marka" }, { key: "model", label: "Model" },
        { key: "cores", label: "Rdzenie", type: "number" }, { key: "threads", label: "Wątki", type: "number" },
        { key: "baseClock", label: "Takt bazowy (GHz)", type: "number" }, { key: "socketType", label: "Socket" },
    ],
    [ComponentTypeEnum.GRAPHICS_CARD]: [
        { key: "brand", label: "Marka" }, { key: "model", label: "Model" },
        { key: "vram", label: "VRAM (GB)", type: "number" }, { key: "gddr", label: "GDDR" },
        { key: "powerDraw", label: "TDP (W)", type: "number" }, { key: "baseModel", label: "Chip bazowy" },
    ],
    [ComponentTypeEnum.MEMORY]: [
        { key: "brand", label: "Marka" }, { key: "model", label: "Model" },
        { key: "type", label: "Typ (DDR4/DDR5)" }, { key: "capacity", label: "Pojemność (GB)", type: "number" },
        { key: "speed", label: "Prędkość (MHz)", type: "number" }, { key: "amount", label: "Ilość kości", type: "number" },
    ],
    [ComponentTypeEnum.MOTHERBOARD]: [
        { key: "brand", label: "Marka" }, { key: "model", label: "Model" },
        { key: "chipset", label: "Chipset" }, { key: "socketType", label: "Socket" },
        { key: "memoryType", label: "Typ RAM" }, { key: "format", label: "Format (ATX/mATX)" },
    ],
    [ComponentTypeEnum.POWER_SUPPLY]: [
        { key: "brand", label: "Marka" }, { key: "model", label: "Model" },
        { key: "maxPowerWatt", label: "Moc (W)", type: "number" },
        { key: "efficiencyRating", label: "Certyfikat (80+ Gold...)" },
        { key: "modular", label: "Modularność" }, { key: "type", label: "Typ (ATX)" },
    ],
    [ComponentTypeEnum.STORAGE]: [
        { key: "brand", label: "Marka" }, { key: "model", label: "Model" },
        { key: "capacity", label: "Pojemność (GB)", type: "number" },
        { key: "type", label: "Typ (SSD/HDD/NVMe)" },
    ],
    [ComponentTypeEnum.CASE_PC]: [
        { key: "brand", label: "Marka" }, { key: "model", label: "Model" },
        { key: "format", label: "Format (ATX/mATX)" },
    ],
    [ComponentTypeEnum.CPU_COOLER]: [
        { key: "brand", label: "Marka" }, { key: "model", label: "Model" },
        { key: "coolerSocketsType", label: "Sockety (np. LGA1700,AM5)" },
        { key: "radiatorSize", label: "Rozmiar radiatora" },
    ],
};

function CreateComponentPanel({ offer, onClose }: { offer: UnknownOfferDto; onClose: () => void }) {
    const [componentType, setComponentType] = useState<ComponentTypeEnum | "">("");
    const [fields, setFields] = useState<Record<string, string>>({});
    const createMutation = useCreateAndAssign();

    const handleCreate = () => {
        if (!componentType) return;
        const componentData = {
            componentType,
            ...Object.fromEntries(
                Object.entries(fields).map(([k, v]) => {
                    const fieldDef = COMPONENT_FIELDS[componentType]?.find(f => f.key === k);
                    return [k, fieldDef?.type === "number" ? Number(v) : v];
                })
            ),
        };
        createMutation.mutate({ componentData, offerId: offer.id });
        onClose();
    };

    const currentFields = componentType ? COMPONENT_FIELDS[componentType] ?? [] : [];
    const isValid = componentType && currentFields.every(f => fields[f.key]?.trim());

    return (
        <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-xl space-y-3">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Stwórz nowy komponent i przypisz</p>

            <div className="relative">
                <select
                    value={componentType}
                    onChange={e => { setComponentType(e.target.value as ComponentTypeEnum | ""); setFields({}); }}
                    className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">Wybierz typ komponentu...</option>
                    {Object.entries(PolishComponentTypeEnum).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {componentType && (
                <div className="grid grid-cols-2 gap-2">
                    {currentFields.map(field => (
                        <div key={field.key}>
                            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                {field.label}
                            </label>
                            <input
                                type={field.type ?? "text"}
                                value={fields[field.key] ?? ""}
                                onChange={e => setFields(prev => ({ ...prev, [field.key]: e.target.value }))}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder={field.label}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-2 pt-1">
                <button
                    onClick={handleCreate}
                    disabled={!isValid || createMutation.isPending}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                >
                    <Plus size={12} /> Stwórz i przypisz
                </button>
                <button onClick={onClose} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                    Anuluj
                </button>
            </div>
        </div>
    );
}

// ─── Wiersz oferty ────────────────────────────────────────────────────────────

function OfferRow({ offer }: { offer: UnknownOfferDto }) {
    const [panel, setPanel] = useState<"assign" | "create" | null>(null);
    const dismissMutation = useDismissOffer();

    return (
        <div className={`bg-white border rounded-xl overflow-hidden transition-all ${panel ? "border-gray-300 shadow-sm" : "border-gray-200"}`}>
            <div className="flex items-center gap-3 p-3">
                {/* Zdjęcie */}
                <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {offer.photoUrl ? (
                        <img src={offer.photoUrl} alt={offer.title} className="w-full h-full object-contain" />
                    ) : (
                        <ImageOff size={18} className="text-gray-300" />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <a
                        href={offer.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-gray-800 hover:text-ocean-blue transition-colors line-clamp-1 flex items-center gap-1"
                    >
                        {offer.title}
                        <ExternalLink size={11} className="flex-shrink-0 text-gray-400" />
                    </a>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-500">{offer.shopName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                            {offer.condition === "NEW" ? "Nowe" : "Używane"}
                        </span>
                    </div>
                </div>

                {/* Cena */}
                <span className="text-base font-extrabold text-gray-800 flex-shrink-0">
                    {offer.price.toLocaleString("pl-PL")} zł
                </span>

                {/* Akcje */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                        onClick={() => setPanel(prev => prev === "assign" ? null : "assign")}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            panel === "assign"
                                ? "bg-ocean-blue text-white border-ocean-blue"
                                : "bg-white text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white"
                        }`}
                    >
                        <Link size={12} /> Przypisz
                    </button>
                    <button
                        onClick={() => setPanel(prev => prev === "create" ? null : "create")}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            panel === "create"
                                ? "bg-green-600 text-white border-green-600"
                                : "bg-white text-green-600 border-green-500 hover:bg-green-600 hover:text-white"
                        }`}
                    >
                        <Plus size={12} /> Nowy
                    </button>
                    <button
                        onClick={() => dismissMutation.mutate(offer.id)}
                        disabled={dismissMutation.isPending}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all disabled:opacity-40"
                        title="Odrzuć ofertę"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>

            {panel === "assign" && (
                <div className="px-3 pb-3">
                    <AssignPanel offer={offer} onClose={() => setPanel(null)} />
                </div>
            )}
            {panel === "create" && (
                <div className="px-3 pb-3">
                    <CreateComponentPanel offer={offer} onClose={() => setPanel(null)} />
                </div>
            )}
        </div>
    );
}

// ─── Paginacja ────────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-center gap-2 pt-2">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 0}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-ocean-blue hover:border-ocean-blue disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-gray-500">
                Strona <span className="font-semibold text-gray-700">{page + 1}</span> z {totalPages}
            </span>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-ocean-blue hover:border-ocean-blue disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight size={14} />
            </button>
        </div>
    );
}

// ─── Strona główna ────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export default function UnknownOffersPage() {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");

    const { data, isLoading, isError } = useUnknownOffers(page, PAGE_SIZE);

    const offers = data?.offers ?? [];
    const totalPages = data?.totalPages ?? 0;
    const totalElements = data?.totalElements ?? 0;

    const filtered = search
        ? offers.filter(o => o.title.toLowerCase().includes(search.toLowerCase()) || o.shopName.toLowerCase().includes(search.toLowerCase()))
        : offers;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            Nieprzypisane oferty
                            {totalElements > 0 && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                    {totalElements}
                                </span>
                            )}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Oferty z typem <code className="bg-gray-100 px-1 rounded">UNKNOWN</code> — wymagają ręcznego przypisania do komponentu
                        </p>
                    </div>

                    <div className="relative">
                        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Filtruj po tytule lub sklepie..."
                            className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ocean-blue w-56"
                        />
                    </div>
                </div>
            </div>

            {/* Lista */}
            {isLoading ? (
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-20 bg-white border border-gray-200 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : isError ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <p className="text-red-500 font-semibold text-sm">Błąd podczas pobierania ofert</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    {search ? (
                        <p className="text-gray-400 text-sm">Brak wyników dla "<span className="font-medium">{search}</span>"</p>
                    ) : (
                        <>
                            <p className="text-green-600 font-semibold text-sm">Brak nieprzypisanych ofert 🎉</p>
                            <p className="text-gray-400 text-xs mt-1">Wszystkie oferty zostały przypisane do komponentów.</p>
                        </>
                    )}
                </div>
            ) : (
                <>
                    <div className="space-y-2">
                        {filtered.map(offer => (
                            <OfferRow key={offer.id} offer={offer} />
                        ))}
                    </div>
                    <Pagination page={page} totalPages={totalPages} onPageChange={p => { setPage(p); setSearch(""); }} />
                </>
            )}
        </div>
    );
}
