import type {ComponentTypeEnum} from "../../../../shared/dtos/BaseItemDto.ts";

export type ComponentsStats = {
    componentType: ComponentTypeEnum,
    total: number,
    shopBreakdown : Record<string, number>
}
