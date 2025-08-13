import { atom } from 'jotai';

// ComponentDto interface moved here for better organization
export interface ComponentDto {
  // item
  brand: string;
  model: string;
  condition: string;
  photo_url: string;
  website_url: string;
  price: number;
  shop: string;
  componentType: string;

  // processor
  cpuCores?: number;
  cpuThreads?: number;
  cpuSocketType?: string;
  cpuBase_clock?: string;

  // cooler
  coolerSocketsType?: string[];

  // graphics card
  gpuMemorySize?: number;
  gpuGddr?: string;
  gpuPowerDraw?: number;

  // memory
  ramType?: string;
  ramCapacity?: number;
  ramSpeed?: string;
  ramLatency?: string;

  // motherboard
  boardChipset?: string;
  boardSocketType?: string;
  boardMemoryType?: string;
  boardFormat?: string;

  // power supply
  powerSupplyMaxPowerWatt?: number;

  // storage
  storageCapacity?: number;

  // case
  caseFormat?: string;
}

// Base atoms
export const componentsAtom = atom<ComponentDto[]>([]);
export const componentsLoadingAtom = atom<boolean>(true);
export const componentsErrorAtom = atom<string | null>(null);

// Filter atoms
export const priceRangeAtom = atom({ min: 0, max: 10000 });
export const selectedManufacturerAtom = atom('');
export const selectedConditionAtom = atom('');
export const selectedCategoryAtom = atom('');
export const selectedShopAtom = atom('');
export const searchTextAtom = atom('');
export const sortByAtom = atom('newest');

// Dynamic price range atom based on actual component prices
export const maxPriceAtom = atom((get) => {
  const components = get(componentsAtom);
  if (components.length === 0) return 10000;
  return Math.max(...components.map(c => c.price));
});

// Derived atoms
export const manufacturersAtom = atom((get) => {
  const components = get(componentsAtom);
  return [...new Set(components.map(c => c.brand).filter(Boolean))].sort();
});

export const conditionsAtom = atom((get) => {
  const components = get(componentsAtom);
  return [...new Set(components.map(c => c.condition).filter(Boolean))].sort();
});

export const categoriesAtom = atom((get) => {
  const components = get(componentsAtom);
  return [...new Set(components.map(c => c.componentType).filter(Boolean))].sort();
});

export const shopsAtom = atom((get) => {
  const components = get(componentsAtom);
  return [...new Set(components.map(c => c.shop).filter(Boolean))].sort();
});

// Filtered components atom
export const filteredComponentsAtom = atom((get) => {
  const components = get(componentsAtom);
  const priceRange = get(priceRangeAtom);
  const selectedManufacturer = get(selectedManufacturerAtom);
  const selectedCondition = get(selectedConditionAtom);
  const selectedCategory = get(selectedCategoryAtom);
  const selectedShop = get(selectedShopAtom);
  const searchText = get(searchTextAtom);

  return components.filter(component => {
    const priceMatch = component.price >= priceRange.min && component.price <= priceRange.max;
    const manufacturerMatch = !selectedManufacturer || component.brand === selectedManufacturer;
    const conditionMatch = !selectedCondition || component.condition === selectedCondition;
    const categoryMatch = !selectedCategory || component.componentType === selectedCategory;
    const shopMatch = !selectedShop || component.shop === selectedShop;
    
    // Ensure properties exist
    const brand = component.brand || '';
    const model = component.model || '';
    const componentType = component.componentType || '';
    
    const searchMatch = !searchText ||
      brand.toLowerCase().includes(searchText.toLowerCase()) ||
      model.toLowerCase().includes(searchText.toLowerCase()) ||
      componentType.toLowerCase().includes(searchText.toLowerCase());
    
    return priceMatch && manufacturerMatch && conditionMatch && categoryMatch && shopMatch && searchMatch;
  });
});

// Clear filters action atom
export const clearFiltersAtom = atom(null, (get, set) => {
  const maxPrice = get(maxPriceAtom);
  set(priceRangeAtom, { min: 0, max: maxPrice });
  set(selectedManufacturerAtom, '');
  set(selectedConditionAtom, '');
  set(selectedCategoryAtom, '');
  set(selectedShopAtom, '');
  set(searchTextAtom, '');
  set(sortByAtom, 'newest');
});
