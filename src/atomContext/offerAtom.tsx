import { atom } from 'jotai';
import type {
  ProcessorSpec, 
  CoolerSpec, 
  GraphicsCardSpec,
  MemorySpec,
  MotherboardSpec,
  PowerSupplySpec,
  StorageSpec,
  CaseSpec
} from './componentAtom.tsx';

export interface OfferBase {
  condition: string;
  photoUrl: string;
  websiteUrl: string;
  price: number;
  shop: string;
}

export interface ProcessorOffer extends ProcessorSpec, OfferBase {}
export interface CoolerOffer extends CoolerSpec, OfferBase {}
export interface GraphicsCardOffer extends GraphicsCardSpec, OfferBase {}
export interface MemoryOffer extends MemorySpec, OfferBase {}
export interface MotherboardOffer extends MotherboardSpec, OfferBase {}
export interface PowerSupplyOffer extends PowerSupplySpec, OfferBase {}
export interface StorageOffer extends StorageSpec, OfferBase {}
export interface CaseOffer extends CaseSpec, OfferBase {}

export type ComponentOffer = ProcessorOffer | CoolerOffer | GraphicsCardOffer |
  MemoryOffer | MotherboardOffer | PowerSupplyOffer | StorageOffer | CaseOffer;


export const isProcessorOffer = (component: ComponentOffer | undefined): component is ProcessorOffer =>
    !!component && component.componentType?.toLowerCase() === 'processor';

export const isMotherboardOffer = (component: ComponentOffer | undefined): component is MotherboardOffer =>
    !!component && component.componentType?.toLowerCase() === 'motherboard';

export const isCoolerOffer = (component: ComponentOffer | undefined): component is CoolerOffer =>
     !!component && component.componentType.toLowerCase() === 'cooler';

export const isCaseOffer = (component: ComponentOffer): component is CaseOffer =>
    component.componentType.toLowerCase() === 'casePc';

export const isMemoryOffer = (component: ComponentOffer): component is MemoryOffer =>
    component.componentType.toLowerCase() === 'memory';

export const isPowerSupplyOffer = (component: ComponentOffer): component is PowerSupplyOffer =>
    component.componentType.toLowerCase() === 'powerSupply';

export const isGraphicsCardOffer = (component: ComponentOffer): component is GraphicsCardOffer =>
    component.componentType.toLowerCase() === 'graphicsCard';



// ===============================
// STATE ATOMS - OFFERS
// ===============================

/**
 * Main atom storing all available offers
 * Populated with data from API during page load
 */
export const offersAtom = atom<ComponentOffer[]>([]);

/**
 * Loading state atom for offers
 * true - loading in progress, false - loading completed
 */
export const offersLoadingAtom = atom<boolean>(true);



/**
 * Price range atom for filtering offers
 * Default range: 0-10000 PLN, can be adjusted dynamically
 */
export const priceRangeAtom = atom({ min: 0, max: 10000 });

/**
 * Selected manufacturer atom for filtering
 * Empty string = all manufacturers
 */
export const selectedManufacturerAtom = atom('');

/**
 * Selected condition atom for filtering
 * Empty string = all conditions
 */
export const selectedConditionAtom = atom('');

/**
 * Selected category atom for filtering
 * Empty string = all categories
 */
export const selectedCategoryAtom = atom('');

/**
 * Selected shop atom for filtering
 * Empty string = all shops
 */
export const selectedShopAtom = atom('');

/**
 * Search text atom
 * Searches in brand, model, and component type
 */
export const searchTextAtom = atom('');

/**
 * Sorting atom for offers
 * Possible values: 'newest', 'cheapest', 'expensive'
 */
export const sortByAtom = atom('newest');

// ===============================
// DERIVED ATOMS - DYNAMIC VALUES
// ===============================

/**
 * Atom computing maximum price from available offers
 * Used for dynamically setting price filter range
 */
export const maxPriceAtom = atom((get) => {
  const offers = get(offersAtom);
  if (offers.length === 0) return 10000;
  return Math.max(...offers.map(offer => offer.price));
});


/**
 * Atom returning unique product conditions from offers
 * Used to populate condition filter dropdown
 */
export const conditionsAtom = atom((get) => {
  const offers = get(offersAtom);
  return [...new Set(offers.map(offer => offer.condition).filter(Boolean))].sort();
});

/**
 * Atom returning unique component categories from offers
 * Used to populate category filter dropdown
 */
export const categoriesAtom = atom((get) => {
  const offers = get(offersAtom);
  console.log(offers.map(offer => offer.componentType).filter(Boolean));
  return [...new Set(offers.map(offer => offer.componentType).filter(Boolean))].sort();
});

/**
 * Atom returning unique shops from offers
 * Used to populate shop filter dropdown
 */
export const shopsAtom = atom((get) => {
  const offers = get(offersAtom);
  return [...new Set(offers.map(offer => offer.shop).filter(Boolean))].sort();
});

// ===============================
// MAIN FILTERING ATOM
// ===============================

/**
 * Primary offer filtering atom
 * Automatically reacts to filter changes and returns filtered offers
 * Used in OffersUserPage.tsx to display search results
 * 
 * Applies the following filters:
 * - Price range filtering
 * - Manufacturer filtering
 * - Condition filtering
 * - Category filtering
 * - Shop filtering
 * - Text search (brand, model, component type)
 */
export const filteredOffersAtom = atom((get) => {
  const offers = get(offersAtom);
  const priceRange = get(priceRangeAtom);
  const selectedManufacturer = get(selectedManufacturerAtom);
  const selectedCondition = get(selectedConditionAtom);
  const selectedCategory = get(selectedCategoryAtom);
  const selectedShop = get(selectedShopAtom);
  const searchText = get(searchTextAtom);

  return offers.filter(offer => {
    // Price range filtering
    const priceMatch = offer.price >= priceRange.min && offer.price <= priceRange.max;

    // Manufacturer filtering
    const manufacturerMatch = !selectedManufacturer || offer.brand === selectedManufacturer;

    // Condition filtering
    const conditionMatch = !selectedCondition || offer.condition === selectedCondition;

    // Category filtering
    const categoryMatch = !selectedCategory || offer.componentType === selectedCategory;

    // Shop filtering
    const shopMatch = !selectedShop || offer.shop === selectedShop;

    // Prepare data for text search
    const brand = offer.brand || '';
    const model = offer.model || '';
    const componentType = offer.componentType || '';

    // Text search (case-insensitive)
    const searchMatch = !searchText ||
      brand.toLowerCase().includes(searchText.toLowerCase()) ||
      model.toLowerCase().includes(searchText.toLowerCase()) ||
      componentType.toLowerCase().includes(searchText.toLowerCase());

    // Return true only if all filters match
    return priceMatch && manufacturerMatch && conditionMatch && categoryMatch && shopMatch && searchMatch;
  });
});

// ===============================
// ACTIONS - FILTER MANAGEMENT
// ===============================

/**
 * Action atom for clearing all filters
 * Resets all filters to their default values
 * Triggered by "Clear filters" button
 * 
 * @example
 * const [, clearFilters] = useAtom(clearFiltersAtom);
 * // Then call: clearFilters()
 */
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