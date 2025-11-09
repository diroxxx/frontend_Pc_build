// components/ImportCsvButton.tsx
import  { useRef } from "react";
import Papa from "papaparse";
import { ComponentTypeEnum, type NewComponentRow } from "../../../types/BaseItemDto.ts";
import {ItemConditionEnum} from "../../../types/ItemConditionEnum.ts";
import { Upload as UploadIcon, FileDown as FileDownIcon } from "lucide-react";

type ImportCsvButtonProps = {
    onParsed: (rows: NewComponentRow[]) => void; // np. mutation.mutate(rows)
    className?: string;
};

const REQUIRED_HEADERS = [
    "componentType",
    "brand",
    "model",
    "price",
    "condition",
];

const OPTIONAL_HEADERS = [
    "shopName",
    "cores",
    "threads",
    "baseClock",
    "socketType",
    "memorySize",
    "gddr",
    "powerDraw",
    "capacity",
    "speed",
    "type",
    "chipset",
    "format",
    "maxPowerWatt",
    "coolerSocketsType",
];

const ALL_HEADERS = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS];

function normalizeKey(key: string) {
    return key.trim().toLowerCase();
}

function parseCondition(val: string): ItemConditionEnum | null {
    if (!val) return null;
    const v = val.toUpperCase().trim();
    if (v === "NEW" || v === "USED" || v === "DEFECTIVE") return v as ItemConditionEnum;
    if (v === "NOWY") return ItemConditionEnum.NEW;
    if (v === "UŻYWANY" || v === "UZYWANY") return ItemConditionEnum.USED;
    if (v === "USZKODZONY") return ItemConditionEnum.DEFECTIVE;
    return null;
}

function parseComponentType(val: string): ComponentTypeEnum | null {
    if (!val) return null;
    const v = val.toUpperCase().replace(/\s+/g, "_").trim();
    // Akceptuj skróty z CSV, np. "GPU" → "GRAPHICS_CARD"
    const aliases: Record<string, ComponentTypeEnum> = {
        CPU: ComponentTypeEnum.PROCESSOR,
        GPU: ComponentTypeEnum.GRAPHICS_CARD,
        MOBO: ComponentTypeEnum.MOTHERBOARD,
        RAM: ComponentTypeEnum.MEMORY,
        SSD: ComponentTypeEnum.STORAGE,
        HDD: ComponentTypeEnum.STORAGE,
        PSU: ComponentTypeEnum.POWER_SUPPLY,
        COOLER: ComponentTypeEnum.CPU_COOLER,
        CASE: ComponentTypeEnum.CASE_PC,
    };
    if (aliases[v]) return aliases[v];
    if ((Object.values(ComponentTypeEnum) as string[]).includes(v)) {
        return v as ComponentTypeEnum;
    }
    return null;
}

function coerceNumber(x: any): number | undefined {
    if (x === null || x === undefined || x === "") return undefined;
    const n = Number(String(x).replace(",", "."));
    return isNaN(n) ? undefined : n;
}

function downloadTemplateCsv() {
    const header = ALL_HEADERS.join(",");
    const sample = [
        // Kilka przykładowych wierszy:
        "PROCESSOR,AMD,Ryzen 5 5600,450,USED,,6,12,3.5GHz,AM4,,,,,,,,",
        "GRAPHICS_CARD,NVIDIA,RTX 4060,1499,NEW,Allegro,, , , , ,8,GDDR6,115,,,,,",
        "MEMORY,Kingston,Fury Beast,199,NEW,OLX,,,,, ,16,3200,DDR4,,,,,",
        "STORAGE,Crucial,P3,229,NEW,Allegro,,,,, ,1000,,,NVMe,,,,",
        "POWER_SUPPLY,Seasonic,Focus GX,399,USED,OLX,,,,, , , , , ,750,",
    ].join("\n");

    const blob = new Blob([header + "\n" + sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "components_template.csv";
    a.click();
    URL.revokeObjectURL(url);
}

export default function ImportCsvButton({ onParsed, className }: ImportCsvButtonProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handlePick = () => inputRef.current?.click();

    const handleFile = (file: File) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (h) => normalizeKey(h),
            complete: (res) => {
                const rows: any[] = res.data as any[];
                const errors: string[] = [];

                // Walidacja nagłówków
                const gotHeaders = new Set(Object.keys(rows[0] || {}));
                for (const req of REQUIRED_HEADERS.map(normalizeKey)) {
                    if (!gotHeaders.has(req)) errors.push(`Brakuje kolumny: "${req}"`);
                }
                if (errors.length) {
                    alert(errors.join("\n"));
                    return;
                }

                // Mapowanie wierszy
                const mapped: NewComponentRow[] = rows.map((r, idx) => {
                    const rowNum = idx + 2; // +1 header, +1 index start
                    // wymagane:
                    const ct = parseComponentType(r["componenttype"]);
                    const cond = parseCondition(r["condition"]);
                    const price = coerceNumber(r["price"]);

                    if (!ct) errors.push(`Wiersz ${rowNum}: nieprawidłowy componentType`);
                    if (!r["brand"]) errors.push(`Wiersz ${rowNum}: brand jest wymagany`);
                    if (!r["model"]) errors.push(`Wiersz ${rowNum}: model jest wymagany`);
                    if (price === undefined) errors.push(`Wiersz ${rowNum}: price jest wymagane (liczba)`);
                    if (!cond) errors.push(`Wiersz ${rowNum}: condition nieprawidłowe (NEW/USED/DEFECTIVE)`);

                    const base: NewComponentRow = {
                        componentType: (ct || ComponentTypeEnum.PROCESSOR) as ComponentTypeEnum, // fallback by nie crashować
                        brand: r["brand"] || "",
                        model: r["model"] || "",
                        price: price ?? 0,
                        condition: (cond || "USED") as ItemConditionEnum,
                        shopName: r["shopname"] || r["shop"] || undefined,
                    };

                    // opcjonalne liczby
                    base.cores = coerceNumber(r["cores"]);
                    base.threads = coerceNumber(r["threads"]);
                    base.powerDraw = coerceNumber(r["powerdraw"]);
                    base.memorySize = coerceNumber(r["memorysize"]);
                    base.capacity = coerceNumber(r["capacity"]);
                    base.speed = coerceNumber(r["speed"]);
                    base.maxPowerWatt = coerceNumber(r["maxpowerwatt"]);

                    // stringi
                    base.baseClock = r["baseclock"] || undefined;
                    base.socketType = r["sockettype"] || undefined;
                    base.gddr = r["gddr"] || undefined;
                    base.type = r["type"] || undefined;
                    base.chipset = r["chipset"] || undefined;
                    base.format = r["format"] || undefined;

                    // lista socketów coolera
                    if (r["coolersocketstype"]) {
                        base.coolerSocketsType = String(r["coolersocketstype"])
                            .split(/;|,|\s*\|\s*/)
                            .map((s: string) => s.trim())
                            .filter(Boolean)
                            .join(";");
                    }

                    return base;
                });

                if (errors.length) {
                    alert(errors.join("\n"));
                    return;
                }

                onParsed(mapped);
            },
            error: (err) => {
                alert("Błąd parsowania CSV: " + err.message);
            },
        });
    };

    return (
        <div className={`flex gap-2 ${className ?? ""}`}>
            {/* Import CSV */}
            <button
                type="button"
                onClick={handlePick}
                className="px-3 py-1.5 bg-ocean-light-blue text-ocean-dark-blue rounded hover:bg-ocean-blue hover:text-white text-sm font-medium flex items-center gap-1 transition-colors"
            >
                <UploadIcon className="w-4 h-4" />
                Importuj CSV
            </button>
            <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.currentTarget.value = ""; // reset, by móc wybrać ten sam plik
                }}
            />

            {/* Szablon */}
            <button
                type="button"
                onClick={downloadTemplateCsv}
                className="px-3 py-1.5 bg-white text-ocean-blue rounded border border-ocean-light-blue hover:bg-ocean-light-blue hover:text-ocean-dark-blue text-sm font-medium flex items-center gap-1 transition-colors"
            >
                <FileDownIcon className="w-4 h-4" />
                Pobierz szablon
            </button>
        </div>
    );
}
