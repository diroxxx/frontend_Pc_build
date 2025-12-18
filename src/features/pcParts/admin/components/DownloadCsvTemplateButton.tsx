import { ChevronDown, ChevronUp, FileDown as FileDownIcon } from "lucide-react";
import { ComponentTypeEnum } from "../../../../shared/dtos/BaseItemDto.ts";
import { useState } from "react";

type DownloadCsvTemplateButtonProps = {
    className?: string;
};

const csvTemplates: Record<ComponentTypeEnum, { header: string; sample: string[] }> = {
    [ComponentTypeEnum.PROCESSOR]: {
        header: "brand,model,cores,threads,baseClock,socketType,boostClock,integratedGraphics,tdp",
        sample: [
            "Intel,Core i9-13900K,24,32,3.0,LGA1700,5.8,Intel UHD Graphics 770,125",
            "AMD,Ryzen 9 7950X,16,32,4.5,AM5,5.7,AMD Radeon Graphics,170",
            "Intel,Core i5-12600K,10,16,3.7,LGA1700,4.9,Intel UHD Graphics 770,125"
        ]
    },
    [ComponentTypeEnum.GRAPHICS_CARD]: {
        header: "brand,model,vram,gddr,boostClock,powerDraw,lengthInMM",
        sample: [
            "NVIDIA,RTX 4090,24,GDDR6X,2520,450,336",
            "AMD,RX 7900 XTX,24,GDDR6,2500,355,287",
            "NVIDIA,RTX 4070 Ti,12,GDDR6X,2610,285,267"
        ]
    },
    [ComponentTypeEnum.MEMORY]: {
        header: "brand,model,capacity,speed,type,amount,latency",
        sample: [
            "Corsair,Vengeance RGB,16,3600,DDR4,2,18",
            "G.Skill,Trident Z5,32,6000,DDR5,2,36",
            "Kingston,Fury Beast,16,3200,DDR4,2,16"
        ]
    },
    [ComponentTypeEnum.STORAGE]: {
        header: "brand,model,capacity,type",
        sample: [
            "Samsung,980 PRO,1000,NVMe SSD",
            "WD,Blue SN570,500,NVMe SSD",
            "Crucial,MX500,2000,SATA SSD"
        ]
    },
    [ComponentTypeEnum.MOTHERBOARD]: {
        header: "brand,model,chipset,socketType,format,ramSlots,ramCapacity,memoryType",
        sample: [
            "ASUS,ROG STRIX Z790-E,Z790,LGA1700,ATX,4,128,DDR5",
            "MSI,MAG B650 TOMAHAWK,B650,AM5,ATX,4,128,DDR5",
            "Gigabyte,B760M DS3H,B760,LGA1700,Micro-ATX,4,128,DDR5"
        ]
    },
    [ComponentTypeEnum.POWER_SUPPLY]: {
        header: "brand,model,efficiencyRating,modular,type,maxPowerWatt",
        sample: [
            "Corsair,RM850x,80+ Gold,Fully Modular,ATX,850",
            "EVGA,SuperNOVA 750 G6,80+ Gold,Fully Modular,ATX,750",
            "Seasonic,Focus GX-650,80+ Gold,Fully Modular,ATX,650"
        ]
    },
    [ComponentTypeEnum.CASE_PC]: {
        header: "brand,model,format",
        sample: [
            "NZXT,H510 Elite,Mid Tower ATX",
            "Corsair,4000D Airflow,Mid Tower ATX",
            "Fractal Design,Meshify C,Mid Tower ATX"
        ]
    },
    [ComponentTypeEnum.CPU_COOLER]: {
        header: "brand,model,coolerSocketsType,fanRpm,noiseLevel,radiatorSize",
        sample: [
            "Noctua,NH-D15,\"AM4,AM5,LGA1700,LGA1200\",1500,24.6dB,N/A",
            "Corsair,iCUE H150i Elite,\"AM4,AM5,LGA1700,LGA1200\",2400,37dB,360mm",
            "be quiet!,Dark Rock Pro 4,\"AM4,LGA1700,LGA1200\",1500,24.3dB,N/A"
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