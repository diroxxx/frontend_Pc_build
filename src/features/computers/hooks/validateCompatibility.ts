import { ComponentTypeEnum } from "../../../types/BaseItemDto.ts"
import type { ComputerDto } from "../../../types/ComputerDto.ts"
import type { ComponentOffer } from "../../../types/OfferBase.ts";

export function validateCompatibility(computer: ComputerDto, offer: ComponentOffer): string | null {
    const existingOffers = computer.offers;

    if (offer.componentType === ComponentTypeEnum.PROCESSOR) {
        const motherboard = existingOffers.find(o => o.componentType === ComponentTypeEnum.MOTHERBOARD);
        if (motherboard && motherboard.socketType !== offer.socketType) {
            return "Wybrany procesor nie pasuje do gniazda płyty głównej. Wymagany jest " + motherboard.socketType;
        }
    }

    if (offer.componentType === ComponentTypeEnum.MOTHERBOARD) {
        const cpu = existingOffers.find(o => o.componentType === ComponentTypeEnum.PROCESSOR);
        if (cpu && cpu.socketType !== offer.socketType) {
            return "Płyta główna nie jest kompatybilna z procesorem. Wymagany jest " + cpu.socketType;
        }
    }

    if (offer.componentType === ComponentTypeEnum.MEMORY) {
        const motherboard = existingOffers.find(o => o.componentType === ComponentTypeEnum.MOTHERBOARD);
        if (motherboard && motherboard.memoryType !== offer.type) {
            return "Pamięć RAM nie jest kompatybilna z płytą główną. Wymagany jest " + motherboard.memoryType;
        }
    }

    if (offer.componentType === ComponentTypeEnum.GRAPHICS_CARD) {
        const psu = existingOffers.find(o => o.componentType === ComponentTypeEnum.POWER_SUPPLY);
        if (psu && psu.maxPowerWatt && offer.powerDraw && psu.maxPowerWatt < offer.powerDraw + 150) {
            return "Zasilacz ma zbyt małą moc dla wybranej karty graficznej.";
        }
    }

    if (offer.componentType === ComponentTypeEnum.POWER_SUPPLY) {
        const gpu = existingOffers.find(o => o.componentType === ComponentTypeEnum.GRAPHICS_CARD);
        if (gpu && gpu.powerDraw && offer.maxPowerWatt && offer.maxPowerWatt < gpu.powerDraw + 150) {
            return "Zasilacz ma zbyt małą moc do obsługi obecnej karty graficznej.";
        }
    }

    if (offer.componentType === ComponentTypeEnum.CASE_PC) {
        const motherboard = existingOffers.find(o => o.componentType === ComponentTypeEnum.MOTHERBOARD);
        if (motherboard && motherboard.format && offer.format) {
            if (!offer.format.includes(motherboard.format)) {
                return "Obudowa nie obsługuje formatu wybranej płyty głównej.";
            }
        }
    }

    if (offer.componentType === ComponentTypeEnum.CPU_COOLER) {
        const cpu = existingOffers.find(o => o.componentType === ComponentTypeEnum.PROCESSOR);
        if (cpu && offer.coolerSocketsType && !offer.coolerSocketsType.includes(cpu.socketType)) {
            return "Chłodzenie nie pasuje do gniazda procesora. Wymaganie jest " + cpu.socketType;
        }
    }

    return null;
}
