import {atom, useSetAtom} from 'jotai';
import customAxios from "../lib/customAxios.tsx";
import {useCallback} from "react";

export interface BaseComponentSpec {
  brand: string;        // Offer manufacturer (e.g., "Intel", "AMD", "NVIDIA")
  model: string;        // Offer model (e.g., "Core i7-12700K", "RTX 4080")
  componentType: string;// Offer category identifier
}


export interface ProcessorSpec extends BaseComponentSpec {
  componentType: 'processor';
  cores: number;        // Number of physical CPU cores
  threads: number;      // Number of logical threads (with hyperthreading)
  socketType: string;   // CPU socket type (e.g., "LGA1700", "AM5")
  baseClock: string;    // Base clock frequency (e.g., "3.6 GHz")
}


export interface CoolerSpec extends BaseComponentSpec {
  componentType: 'cooler';
  coolerSocketsType: string[];  // Compatible CPU socket types
}


export interface GraphicsCardSpec extends BaseComponentSpec {
  componentType: 'graphicsCard';
  memorySize: number;   // VRAM size in GB
  gddr: string;         // Memory type (e.g., "GDDR6X", "GDDR6")
  powerDraw: number;    // Total graphics card power consumption in watts
}

export interface MemorySpec extends BaseComponentSpec {
  componentType: 'memory';
  type: string;         // Memory type (e.g., "DDR4", "DDR5")
  capacity: number;     // Memory capacity in GB
  speed: string;        // Memory speed (e.g., "3200 MHz", "5600 MHz")
  latency: string;      // CAS latency timings (e.g., "CL16", "CL36")
}


export interface MotherboardSpec extends BaseComponentSpec {
  componentType: 'motherboard';
  chipset: string;      // Motherboard chipset (e.g., "Z690", "B550")
  socketType: string;   // CPU socket type supported
  memoryType: string;   // Supported memory type (e.g., "DDR4", "DDR5")
  format: string;       // Form factor (e.g., "ATX", "micro-ATX", "mini-ITX")
  ramslots: number;     // Number of RAM slots available
  ramCapacity: number;  // Maximum RAM capacity supported in GB
}


export interface PowerSupplySpec extends BaseComponentSpec {
  componentType: 'powerSupply';
  maxPowerWatt: number; // Maximum power output in watts
}

export interface StorageSpec extends BaseComponentSpec {
  componentType: 'storage';
  capacity: number;     // Storage capacity in GB
}

export interface CaseSpec extends BaseComponentSpec {
  componentType: 'casePc';
  format: string;
}

export type ComponentSpec = ProcessorSpec | CoolerSpec | GraphicsCardSpec | 
  MemorySpec | MotherboardSpec | PowerSupplySpec | StorageSpec | CaseSpec;

export const isProcessorSpec = (component: ComponentSpec): component is ProcessorSpec => 
  component.componentType.toLowerCase() === 'processor';


export const isCoolerSpec = (component: ComponentSpec): component is CoolerSpec => 
  component.componentType.toLowerCase() === 'cooler';


export const isGraphicsCardSpec = (component: ComponentSpec): component is GraphicsCardSpec => 
  component.componentType.toLowerCase() === 'graphicsCard';


export const isMemorySpec = (component: ComponentSpec): component is MemorySpec => 
  component.componentType === 'memory';


export const isMotherboardSpec = (component: ComponentSpec): component is MotherboardSpec => 
  component.componentType === 'motherboard';


export const isPowerSupplySpec = (component: ComponentSpec): component is PowerSupplySpec => 
  component.componentType === 'powerSupply';


export const isStorageSpec = (component: ComponentSpec): component is StorageSpec => 
  component.componentType === 'storage';


export const isCaseSpec = (component: ComponentSpec): component is CaseSpec => 
  component.componentType === 'casePc';


export const componentSpecsAtom = atom<ComponentSpec[]>([]);

export const componentsByTypeAtom = atom<Record<string, ComponentSpec[]>>({});

export const useFetchOffersSpecs = () => {
    const setComponents = useSetAtom(componentSpecsAtom);

    return useCallback( async () => {
        try {
            const response = await customAxios.get<Record<string, ComponentSpec[]>>('/offers');
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