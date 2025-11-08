export enum ComponentTypeEnum {
    PROCESSOR = "PROCESSOR",
    GRAPHICS_CARD = "GRAPHICS_CARD",
    MEMORY = "MEMORY",
    MOTHERBOARD = "MOTHERBOARD",
    POWER_SUPPLY = "POWER_SUPPLY",
    STORAGE = "STORAGE",
    CASE_PC = "CASE_PC",
    CPU_COOLER = "CPU_COOLER",
}

export interface BaseItem {
    id?: number;
    brand: string;
    model: string;
}

export type ComponentItem =
    | ProcessorItem
    | GraphicsCardItem
    | MemoryItem
    | MotherboardItem
    | PowerSupplyItem
    | StorageItem
    | CaseItem
    | CoolerItem;

export interface ProcessorItem extends BaseItem {
    componentType: "PROCESSOR";
    cores: number;
    threads: number;
    baseClock: number;
    socketType: string;
}

export interface GraphicsCardItem extends BaseItem {
    componentType: "GRAPHICS_CARD";
    vram: number;
    gddr: string;
    powerDraw: number;
}

export interface CoolerItem extends BaseItem {
    componentType: "CPU_COOLER";
    coolerSocketsType: string[];
}

export interface MemoryItem extends BaseItem {
    componentType: "MEMORY";
    type: string;
    capacity: number;
    speed: string;
    latency: string;
}

export interface MotherboardItem extends BaseItem {
    componentType: "MOTHERBOARD";
    chipset: string;
    socketType: string;
    memoryType: string;
    format: string;
    ramslots: number;
    ramCapacity: number;
}

export interface PowerSupplyItem extends BaseItem {
    componentType: "POWER_SUPPLY";
    maxPowerWatt: number;
}

export interface StorageItem extends BaseItem {
    componentType: "STORAGE";
    capacity: number;
}

export interface CaseItem extends BaseItem {
    componentType: "CASE_PC";
    format: string;
}

