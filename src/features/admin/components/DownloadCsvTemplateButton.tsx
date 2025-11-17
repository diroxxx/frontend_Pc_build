import { ChevronDown, ChevronUp, FileDown as FileDownIcon } from "lucide-react";
import { ComponentTypeEnum } from "../../../types/BaseItemDto";
import { useState } from "react";

type DownloadCsvTemplateButtonProps = {
    className?: string;
};

const csvTemplates: Record<ComponentTypeEnum, { header: string; sample: string[] }> = {
    [ComponentTypeEnum.PROCESSOR]: {
        header: "componentType,brand,model,price,condition,shopName,cores,threads,baseClock,socketType",
        sample: [
            "PROCESSOR,AMD,Ryzen 5 5600,450,USED,Allegro,6,12,3.5GHz,AM4",
            "PROCESSOR,Intel,Core i5-12400F,599,NEW,x-kom,6,12,2.5GHz,LGA1700",
        ]
    },
    [ComponentTypeEnum.GRAPHICS_CARD]: {
        header: "componentType,brand,model,price,condition,shopName,memorySize,gddr,powerDraw",
        sample: [
            "GRAPHICS_CARD,NVIDIA,RTX 4060,1499,NEW,Allegro,8,GDDR6,115",
            "GRAPHICS_CARD,AMD,RX 7600,1299,NEW,Morele,8,GDDR6,165",
        ]
    },
    [ComponentTypeEnum.MEMORY]: {
        header: "componentType,brand,model,price,condition,shopName,capacity,speed,type",
        sample: [
            "MEMORY,Kingston,Fury Beast,199,NEW,OLX,16,3200,DDR4",
            "MEMORY,Corsair,Vengeance RGB,399,NEW,x-kom,32,6000,DDR5",
        ]
    },
    [ComponentTypeEnum.STORAGE]: {
        header: "componentType,brand,model,price,condition,shopName,capacity,type,format",
        sample: [
            "STORAGE,Crucial,P3,229,NEW,Allegro,1000,NVMe,M.2",
            "STORAGE,Samsung,970 EVO Plus,459,NEW,Morele,2000,NVMe,M.2",
        ]
    },
    [ComponentTypeEnum.MOTHERBOARD]: {
        header: "componentType,brand,model,price,condition,shopName,chipset,socketType,format",
        sample: [
            "MOTHERBOARD,ASUS,TUF B550-PLUS,599,NEW,x-kom,B550,AM4,ATX",
            "MOTHERBOARD,MSI,MAG B660M,499,NEW,Morele,B660,LGA1700,microATX",
        ]
    },
    [ComponentTypeEnum.POWER_SUPPLY]: {
        header: "componentType,brand,model,price,condition,shopName,maxPowerWatt",
        sample: [
            "POWER_SUPPLY,Seasonic,Focus GX,399,USED,OLX,750",
            "POWER_SUPPLY,Corsair,RM850x,649,NEW,x-kom,850",
        ]
    },
    [ComponentTypeEnum.CASE_PC]: {
        header: "componentType,brand,model,price,condition,shopName,format",
        sample: [
            "CASE_PC,NZXT,H510,299,NEW,Allegro,ATX",
            "CASE_PC,Fractal Design,Meshify C,399,NEW,Morele,ATX",
        ]
    },
    [ComponentTypeEnum.CPU_COOLER]: {
        header: "componentType,brand,model,price,condition,shopName,coolerSocketsType",
        sample: [
            "CPU_COOLER,Noctua,NH-D15,399,NEW,x-kom,AM4/LGA1700",
            "CPU_COOLER,be quiet!,Dark Rock 4,299,NEW,Morele,AM4/LGA1700",
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