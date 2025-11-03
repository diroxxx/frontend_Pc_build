import {atom, useSetAtom} from 'jotai';
import customAxios from "../lib/customAxios.tsx";
import {useCallback} from "react";
import {ItemType} from "../types/BaseItemDto.ts";



export interface BaseComponentSpec {
  brand: string;
  model: string;
  componentType: string;
}

export interface ProcessorSpec extends BaseComponentSpec {
  componentType: ItemType.PROCESSOR;
  cores: number;
  threads: number;
  socketType: string;
  baseClock: string;
}


export interface CoolerSpec extends BaseComponentSpec {
  componentType: ItemType.CPU_COOLER;
  coolerSocketsType: string[];
}


export interface GraphicsCardSpec extends BaseComponentSpec {
  componentType: ItemType.GRAPHICS_CARD;
  memorySize: number;
  gddr: string;
  powerDraw: number;
}

export interface MemorySpec extends BaseComponentSpec {
  componentType: ItemType.MEMORY;
  type: string;
  capacity: number;
  speed: string;
  latency: string;
}


export interface MotherboardSpec extends BaseComponentSpec {
  componentType: ItemType.MOTHERBOARD;
  chipset: string;
  socketType: string;
  memoryType: string;
  format: string;
  ramslots: number;
  ramCapacity: number;
}


export interface PowerSupplySpec extends BaseComponentSpec {
  componentType: ItemType.POWER_SUPPLY;
  maxPowerWatt: number; // Maximum power output in watts
}

export interface StorageSpec extends BaseComponentSpec {
  componentType: ItemType.STORAGE;
  capacity: number;     // Storage capacity in GB
}

export interface CaseSpec extends BaseComponentSpec {
  componentType: ItemType.CASE_PC;
  format: string;
}

export type OfferSpec = ProcessorSpec | CoolerSpec | GraphicsCardSpec |
  MemorySpec | MotherboardSpec | PowerSupplySpec | StorageSpec | CaseSpec;

export const isProcessorSpec = (component: OfferSpec): component is ProcessorSpec =>
  component.componentType.toLowerCase() === 'processor';


export const isCoolerSpec = (component: OfferSpec): component is CoolerSpec =>
  component.componentType.toLowerCase() === 'cooler';


export const isGraphicsCardSpec = (component: OfferSpec): component is GraphicsCardSpec =>
  component.componentType.toLowerCase() === 'graphicsCard';


export const isMemorySpec = (component: OfferSpec): component is MemorySpec =>
  component.componentType === 'memory';


export const isMotherboardSpec = (component: OfferSpec): component is MotherboardSpec =>
  component.componentType === 'motherboard';


export const isPowerSupplySpec = (component: OfferSpec): component is PowerSupplySpec =>
  component.componentType === 'powerSupply';


export const isStorageSpec = (component: OfferSpec): component is StorageSpec =>
  component.componentType === 'storage';


export const isCaseSpec = (component: OfferSpec): component is CaseSpec =>
  component.componentType === 'casePc';


export const componentSpecsAtom = atom<OfferSpec[]>([]);

export const componentsByTypeAtom = atom<Record<string, OfferSpec[]>>({});

export const useFetchOffersSpecs = () => {
    const setComponents = useSetAtom(componentSpecsAtom);

    return useCallback( async () => {
        try {
            const response = await customAxios.get<Record<string, OfferSpec[]>>('/offers');
            const flatComponents = Object.values(response.data).flat();
            console.log('Fetched component specifications:', flatComponents);
            setComponents(flatComponents);
        } catch (error) {
            console.error('Failed to fetch component specifications:', error);
            throw error;
        }
    }, [setComponents]);
};


export const componentBrandsAtom = atom((get) => {
  const specs = get(componentSpecsAtom);
  return [...new Set(specs.map(spec => spec.brand).filter(Boolean))].sort();
});


export const componentCategoriesAtom = atom((get) => {
  const specs = get(componentSpecsAtom);
  return [...new Set(specs.map(spec => spec.componentType).filter(Boolean))].sort();
});