import type {ItemConditionEnum} from "./ItemConditionEnum.ts";

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

export const PolishComponentTypeEnum: Record<ComponentTypeEnum, string> = {
    [ComponentTypeEnum.PROCESSOR]: "Procesor",
    [ComponentTypeEnum.GRAPHICS_CARD]: "Karta graficzna",
    [ComponentTypeEnum.MEMORY]: "Pamięć RAM",
    [ComponentTypeEnum.MOTHERBOARD]: "Płyta główna",
    [ComponentTypeEnum.POWER_SUPPLY]: "Zasilacz",
    [ComponentTypeEnum.STORAGE]: "Dysk",
    [ComponentTypeEnum.CASE_PC]: "Obudowa",
    [ComponentTypeEnum.CPU_COOLER]: "Chłodzenie CPU",
};
export interface NewComponentRow {
    componentType: ComponentTypeEnum;
    brand: string;
    model: string;
    price: number;
    condition: ItemConditionEnum;
    shopName?: string;

    cores?: number;
    threads?: number;
    baseClock?: string;
    socketType?: string;

    memorySize?: number;
    gddr?: string;
    powerDraw?: number;

    capacity?: number;
    speed?: number;
    type?: string;

    chipset?: string;
    format?: string;

    maxPowerWatt?: number;

    coolerSocketsType?: string;
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
    componentType: ComponentTypeEnum.PROCESSOR;
    cores: number;
    threads: number;
    baseClock: number;
    socketType: string;
    boostClock: number;
    integratedGraphics: string;
    tdp: number;

}

export interface GraphicsCardItem extends BaseItem {
    componentType: ComponentTypeEnum.GRAPHICS_CARD;
    vram: number;
    gddr: string;
    powerDraw: number;
    boostClock: number;
    lengthInMM: number;
}

export interface CoolerItem extends BaseItem {
    componentType: ComponentTypeEnum.CPU_COOLER;
    coolerSocketsType: string[];
    fanRpm: string;
    noiseLevel: string;
    radiatorSize: string;
}

export interface MemoryItem extends BaseItem {
    componentType: ComponentTypeEnum.MEMORY;
    type: string;
    capacity: number;
    speed: number;
    latency: number;
    amount: number;
}

export interface MotherboardItem extends BaseItem {
    componentType: ComponentTypeEnum.MOTHERBOARD;
    chipset: string;
    socketType: string;
    memoryType: string;
    format: string;
    ramSlots: number;
    ramCapacity: number;
}

export interface PowerSupplyItem extends BaseItem {
    componentType: ComponentTypeEnum.POWER_SUPPLY;
    maxPowerWatt: number;
    efficiencyRating: string;
    modular: string;
    type: string;
}

export interface StorageItem extends BaseItem {
    componentType: ComponentTypeEnum.STORAGE;
    capacity: number;
}

export interface CaseItem extends BaseItem {
    componentType: ComponentTypeEnum.CASE_PC;
    format: string;
}

