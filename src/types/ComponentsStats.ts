import type {ComponentTypeEnum} from "./BaseItemDto.ts";

export type ComponentsStats = {
    componentType: ComponentTypeEnum,
    total: number,
    shopBreakdown : Record<string, number>
}
