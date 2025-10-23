import {atom, useSetAtom} from 'jotai';
import customAxios from "../lib/customAxios.tsx";
import {useCallback} from "react";
// ===============================
// COMPONENT SPECIFICATION TYPES
// ===============================

/**
 * Base interface for component specifications
 * Contains common properties shared by all component types
 */
export interface BaseComponentSpec {
  brand: string;        // Component manufacturer (e.g., "Intel", "AMD", "NVIDIA")
  model: string;        // Component model (e.g., "Core i7-12700K", "RTX 4080")
  componentType: string;// Component category identifier
}

/**
 * Processor component specification
 * Contains CPU-specific technical properties
 */
export interface ProcessorSpec extends BaseComponentSpec {
  componentType: 'processor';
  cores: number;        // Number of physical CPU cores
  threads: number;      // Number of logical threads (with hyperthreading)
  socketType: string;   // CPU socket type (e.g., "LGA1700", "AM5")
  baseClock: string;    // Base clock frequency (e.g., "3.6 GHz")
}

/**
 * Cooler component specification
 * Contains cooling system technical properties
 */
export interface CoolerSpec extends BaseComponentSpec {
  componentType: 'cooler';
  coolerSocketsType: string[];  // Compatible CPU socket types
}

/**
 * Graphics card component specification
 * Contains GPU-specific technical properties
 */
export interface GraphicsCardSpec extends BaseComponentSpec {
  componentType: 'graphicsCard';
  memorySize: number;   // VRAM size in GB
  gddr: string;         // Memory type (e.g., "GDDR6X", "GDDR6")
  powerDraw: number;    // Total graphics card power consumption in watts
}

/**
 * Memory (RAM) component specification
 * Contains memory module technical properties
 */
export interface MemorySpec extends BaseComponentSpec {
  componentType: 'memory';
  type: string;         // Memory type (e.g., "DDR4", "DDR5")
  capacity: number;     // Memory capacity in GB
  speed: string;        // Memory speed (e.g., "3200 MHz", "5600 MHz")
  latency: string;      // CAS latency timings (e.g., "CL16", "CL36")
}

/**
 * Motherboard component specification
 * Contains motherboard technical properties and connectivity
 */
export interface MotherboardSpec extends BaseComponentSpec {
  componentType: 'motherboard';
  chipset: string;      // Motherboard chipset (e.g., "Z690", "B550")
  socketType: string;   // CPU socket type supported
  memoryType: string;   // Supported memory type (e.g., "DDR4", "DDR5")
  format: string;       // Form factor (e.g., "ATX", "micro-ATX", "mini-ITX")
  ramslots: number;     // Number of RAM slots available
  ramCapacity: number;  // Maximum RAM capacity supported in GB
}

/**
 * Power supply component specification
 * Contains PSU technical properties
 */
export interface PowerSupplySpec extends BaseComponentSpec {
  componentType: 'powerSupply';
  maxPowerWatt: number; // Maximum power output in watts
}

/**
 * Storage component specification
 * Contains storage device technical properties
 */
export interface StorageSpec extends BaseComponentSpec {
  componentType: 'storage';
  capacity: number;     // Storage capacity in GB
}

/**
 * PC case component specification
 * Contains case technical properties and compatibility
 */
export interface CaseSpec extends BaseComponentSpec {
  componentType: 'casePc';
  format: string;
}

/**
 * Union type representing all possible component specifications
 * Used for type-safe handling of different component types
 */
export type ComponentSpec = ProcessorSpec | CoolerSpec | GraphicsCardSpec | 
  MemorySpec | MotherboardSpec | PowerSupplySpec | StorageSpec | CaseSpec;

// ===============================
// TYPE GUARD FUNCTIONS
// ===============================

/**
 * Type guard for processor components
 * @param component - Component to check
 * @returns true if component is a ProcessorSpec
 */
export const isProcessorSpec = (component: ComponentSpec): component is ProcessorSpec => 
  component.componentType.toLowerCase() === 'processor';

/**
 * Type guard for cooler components
 * @param component - Component to check
 * @returns true if component is a CoolerSpec
 */
export const isCoolerSpec = (component: ComponentSpec): component is CoolerSpec => 
  component.componentType.toLowerCase() === 'cooler';

/**
 * Type guard for graphics card components
 * @param component - Component to check
 * @returns true if component is a GraphicsCardSpec
 */
export const isGraphicsCardSpec = (component: ComponentSpec): component is GraphicsCardSpec => 
  component.componentType.toLowerCase() === 'graphicsCard';

/**
 * Type guard for memory components
 * @param component - Component to check
 * @returns true if component is a MemorySpec
 */
export const isMemorySpec = (component: ComponentSpec): component is MemorySpec => 
  component.componentType === 'memory';

/**
 * Type guard for motherboard components
 * @param component - Component to check
 * @returns true if component is a MotherboardSpec
 */
export const isMotherboardSpec = (component: ComponentSpec): component is MotherboardSpec => 
  component.componentType === 'motherboard';

/**
 * Type guard for power supply components
 * @param component - Component to check
 * @returns true if component is a PowerSupplySpec
 */
export const isPowerSupplySpec = (component: ComponentSpec): component is PowerSupplySpec => 
  component.componentType === 'powerSupply';

/**
 * Type guard for storage components
 * @param component - Component to check
 * @returns true if component is a StorageSpec
 */
export const isStorageSpec = (component: ComponentSpec): component is StorageSpec => 
  component.componentType === 'storage';

/**
 * Type guard for case components
 * @param component - Component to check
 * @returns true if component is a CaseSpec
 */
export const isCaseSpec = (component: ComponentSpec): component is CaseSpec => 
  component.componentType === 'casePc';

// ===============================
// STATE ATOMS - COMPONENT SPECS
// ===============================


export const componentSpecsAtom = atom<ComponentSpec[]>([]);

export const componentsByTypeAtom = atom<Record<string, ComponentSpec[]>>({});

export const useFetchComponentSpecs = () => {
    const setComponents = useSetAtom(componentSpecsAtom);

    return useCallback( async () => {
        try {
            const response = await customAxios.get<Record<string, ComponentSpec[]>>('/components');
            const flatComponents = Object.values(response.data).flat();
            console.log('Fetched component specifications:', flatComponents);
            setComponents(flatComponents);
        } catch (error) {
            console.error('Failed to fetch component specifications:', error);
            throw error;
        }
    }, [setComponents]);
};

// ===============================
// DERIVED ATOMS - COMPONENT DATA
// ===============================

/**
 * Atom returning unique component brands
 * Used for populating brand filter dropdowns in admin interface
 */
export const componentBrandsAtom = atom((get) => {
  const specs = get(componentSpecsAtom);
  return [...new Set(specs.map(spec => spec.brand).filter(Boolean))].sort();
});

/**
 * Atom returning unique component categories
 * Used for populating category filter dropdowns in admin interface
 */
export const componentCategoriesAtom = atom((get) => {
  const specs = get(componentSpecsAtom);
  return [...new Set(specs.map(spec => spec.componentType).filter(Boolean))].sort();
});