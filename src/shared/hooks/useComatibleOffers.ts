import { useMemo } from 'react';
import type { ComponentOffer } from '../dtos/OfferBase';
import type { 
    ProcessorItem, 
    MotherboardItem, 
    CoolerItem, 
    MemoryItem, 
    CaseItem,
    PowerSupplyItem 
} from '../dtos/BaseItemDto';

export function useCompatibleOffers(offers: ComponentOffer[] | undefined) {
    return useMemo(() => {
        if (!offers) return offers;

        const compatibilityDataStr = sessionStorage.getItem('compatibilityFilter');
        if (!compatibilityDataStr) return offers;

        try {
            const compatibilityData = JSON.parse(compatibilityDataStr);

            return offers.filter(offer => {
                if (compatibilityData.socketType) {
                    if ('socketType' in offer && offer.socketType) {
                        if (offer.socketType !== compatibilityData.socketType) {
                            return false;
                        }
                    }
                    if ('coolerSocketsType' in offer && Array.isArray(offer.coolerSocketsType)) {
                        const coolerItem = offer as unknown as CoolerItem;
                        if (!coolerItem.coolerSocketsType.includes(compatibilityData.socketType)) {
                            return false;
                        }
                    }
                }

                if (compatibilityData.memoryType && 'type' in offer) {
                    const memoryItem = offer as unknown as MemoryItem;
                    if (memoryItem.type !== compatibilityData.memoryType) {
                        return false;
                    }
                }

                if (compatibilityData.format && 'format' in offer) {
                    const caseItem = offer as unknown as CaseItem;
                    if (!caseItem.format.includes(compatibilityData.format)) {
                        return false;
                    }
                }

                if (compatibilityData.minPowerWatt && 'maxPowerWatt' in offer) {
                    const psuItem = offer as unknown as PowerSupplyItem;
                    if (psuItem.maxPowerWatt < compatibilityData.minPowerWatt) {
                        return false;
                    }
                }

                return true;
            });
        } catch (e) {
            console.error('Error while parsing compatibility filters:', e);
            return offers;
        }
    }, [offers]);
}