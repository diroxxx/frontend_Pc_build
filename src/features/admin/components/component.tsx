import {type ComponentItem} from "../../../types/BaseItemDto.ts";
import {ComponentTypeEnum} from "../../../types/BaseItemDto.ts";

interface Props {
    component: ComponentItem;
}

export const Component = ({ component }: Props) => {
    const baseCells = (
        <>
            <td className="px-3 py-2 font-medium text-midnight-dark">{component.componentType}</td>
            <td className="px-3 py-2 text-midnight-dark">{component.brand}</td>
            <td className="px-3 py-2 text-midnight-dark">{component.model}</td>
        </>
    );

    const cellClass = "px-3 py-2 text-midnight-dark";

    switch (component.componentType) {
        case "PROCESSOR":
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>
                        {component.cores}C / {component.threads}T • {component.baseClock} GHz • {component.socketType}
                    </td>
                </tr>
            );

        case "GRAPHICS_CARD":
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>
                        {component.vram} GB {component.gddr} • {component.powerDraw} W
                    </td>
                </tr>
            );

        case "CPU_COOLER":
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>
                        Sockety: {component.coolerSocketsType.join(", ")}
                    </td>
                </tr>
            );

        case "MEMORY":
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>
                        {component.type} • {component.capacity} GB • {component.speed} • CL{component.latency}
                    </td>
                </tr>
            );

        case "MOTHERBOARD":
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>
                        {component.chipset} • {component.format} • {component.memoryType} • {component.ramCapacity} GB /{" "}
                        {component.ramSlots} sloty • {component.socketType}
                    </td>
                </tr>
            );

        case "STORAGE":
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>{component.capacity} GB</td>
                </tr>
            );

        case "POWER_SUPPLY":
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>{component.maxPowerWatt} W</td>
                </tr>
            );

        case "CASE_PC":
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>Format: {component.format}</td>
                </tr>
            );

        default:
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>–</td>
                </tr>
            );
    }
};