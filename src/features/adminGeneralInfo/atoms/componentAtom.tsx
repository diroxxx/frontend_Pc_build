import {atom, useSetAtom} from 'jotai';
import customAxios from "../../../lib/customAxios.tsx";
import {useCallback} from "react";
import {ComponentTypeEnum} from "../../../shared/dtos/BaseItemDto.ts";



export interface BaseComponentSpec {
  brand: string;
  model: string;
  componentType: string;
}

export interface ProcessorSpec extends BaseComponentSpec {
  componentType: ComponentTypeEnum.PROCESSOR;
  cores: number;
  threads: number;
  socketType: string;
  baseClock: string;
}


export interface CoolerSpec extends BaseComponentSpec {
  componentType: ComponentTypeEnum.CPU_COOLER;
  coolerSocketsType: string[];
}


export interface GraphicsCardSpec extends BaseComponentSpec {
  componentType: ComponentTypeEnum.GRAPHICS_CARD;
  memorySize: number;
  gddr: string;
  powerDraw: number;
}

export interface MemorySpec extends BaseComponentSpec {
  componentType: ComponentTypeEnum.MEMORY;
  type: string;
  capacity: number;
  speed: string;
  latency: string;
}


export interface MotherboardSpec extends BaseComponentSpec {
  componentType: ComponentTypeEnum.MOTHERBOARD;
  chipset: string;
  socketType: string;
  memoryType: string;
  format: string;
  ramslots: number;
  ramCapacity: number;
}


export interface PowerSupplySpec extends BaseComponentSpec {
  componentType: ComponentTypeEnum.POWER_SUPPLY;
  maxPowerWatt: number; // Maximum power output in watts
}

export interface StorageSpec extends BaseComponentSpec {
  componentType: ComponentTypeEnum.STORAGE;
  capacity: number;     // Storage capacity in GB
}

export interface CaseSpec extends BaseComponentSpec {
  componentType: ComponentTypeEnum.CASE_PC;
  format: string;
}

export type OfferSpec = ProcessorSpec | CoolerSpec | GraphicsCardSpec |
  MemorySpec | MotherboardSpec | PowerSupplySpec | StorageSpec | CaseSpec;




export const componentSpecsAtom = atom<OfferSpec[]>([]);


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
