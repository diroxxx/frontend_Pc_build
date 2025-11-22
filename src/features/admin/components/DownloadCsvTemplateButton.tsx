import { ChevronDown, ChevronUp, FileDown as FileDownIcon } from "lucide-react";
import { ComponentTypeEnum } from "../../../types/BaseItemDto";
import { useState } from "react";

type DownloadCsvTemplateButtonProps = {
    className?: string;
};

const csvTemplates: Record<ComponentTypeEnum, { header: string; sample: string[] }> = {
    [ComponentTypeEnum.PROCESSOR]: {
        header: "brand,model,cores,threads,baseClock,socketType,boostClock,integratedGraphics,tdp",
        sample: [
        ]
    },
    [ComponentTypeEnum.GRAPHICS_CARD]: {
        header: "brand,model,vram,gddr,boostClock,coreClock, lenghtInMM,powerDraw",
        sample: [
        ]
    },
    [ComponentTypeEnum.MEMORY]: {
        header: "brand,model,capacity,speed,type,amount,latency",
        sample: [
        ]
    },
    [ComponentTypeEnum.STORAGE]: {
        header: "brand,model,capacity,type",
        sample: [
        ]
    },
    [ComponentTypeEnum.MOTHERBOARD]: {
        header: "brand,model,chipset,socketType,format,ramSlots,ramCapacity,memoryType",
        sample: [
        ]
    },
    [ComponentTypeEnum.POWER_SUPPLY]: {
        header: "brand,model,efficiencyRating,modular,type,maxPowerWatt",
        sample: [
        ]
    },
    [ComponentTypeEnum.CASE_PC]: {
        header: "brand,model,componentType,format",
        sample: [
        ]
    },
    [ComponentTypeEnum.CPU_COOLER]: {
        header: "brand,model,coolerSocketsType,fanRpm,noiseLevel,radiatorSize",
        sample: [
        ]
    },
};

function downloadCsvForType(type: ComponentTypeEnum) {
    const template = csvTemplates[type];
    const content = [template.header, ...template.sample].join("\n");
    
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type.toLowerCase()}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function DownloadCsvTemplateButton({ className }: DownloadCsvTemplateButtonProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`relative ${className ?? ""}`}>
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-3 py-1.5 bg-white text-ocean-blue rounded border border-ocean-light-blue hover:bg-ocean-light-blue hover:text-ocean-dark-blue text-sm font-medium flex items-center justify-between gap-1 transition-colors"
            >
                <div className="flex items-center gap-1">
                    <FileDownIcon className="w-4 h-4" />
                    <span>Pobierz szablon</span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                ) : (
                    <ChevronDown className="w-4 h-4" />
                )}
            </button>

            {isExpanded && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-ocean-light-blue rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    {Object.values(ComponentTypeEnum).map((type) => (
                        <button
                            key={type}
                            onClick={() => {
                                downloadCsvForType(type);
                                setIsExpanded(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-midnight-dark hover:bg-ocean-light-blue/20 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                            {type.replaceAll("_", " ")}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}