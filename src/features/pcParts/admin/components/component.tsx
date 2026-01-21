import {ComponentTypeEnum, type ComponentItem} from "../../../../shared/dtos/BaseItemDto.ts";
import {EditIcon} from "lucide-react";
import {UserRole} from "../../../usersManagment/dtos/UserUpdateDto.ts";
import {RemoveIcon} from "../../../../assets/icons/removeIcon.tsx";
import { useAtom } from "jotai";
import { componentIdToDeleteAtom, editingComponentAtom, showUpdateComponentModalAtom } from "../atoms/editComponentAtom.ts";
import { useFetchComponents } from "../hooks/useFetchComponents.ts";
import { useState } from "react";
import { showToast } from "../../../../lib/ToastContainer.tsx";
import { deleteComponentApi } from "../api/deleteComponentApi.ts";
import { se } from "date-fns/locale";

interface Props {
    component: ComponentItem;
}

export const Component = ({ component}: Props) => {

    const [showFormToUpdate, setShowFormToUpdate] = useAtom(showUpdateComponentModalAtom);
    const [componentToEdit, setComponentToEdit] = useAtom(editingComponentAtom);

     const [page, setPage] = useState<number>(0);
    const [filters, setFilters] = useState<{ itemType: ComponentTypeEnum | undefined; brand: string; searchTerm: string }>({ itemType: undefined, brand: "", searchTerm: "" });
     
    const [componentIdToDelete, setComponentIdToDelete] = useAtom(componentIdToDeleteAtom);
    const {refetch: refetchComps} = useFetchComponents(page, filters);
    
    const baseCells = (
        <>
            <td className="px-3 py-2 font-medium text-midnight-dark">{component.componentType}</td>
            <td className="px-3 py-2 text-midnight-dark">{component.brand}</td>
            <td className="px-3 py-2 text-midnight-dark">{component.model}</td>
        </>
    );

    const actionsCell = (
        <td className={"p-4 py-2"}>
            <div className="flex items-center justify-end gap-1 ">
                <button className={"hover:bg-ocean-dark-blue/10 transition-colors p-1.5"}>
                    <EditIcon
                        className={"w-5 h-5 text-ocean-dark-blue  cursor-pointer"}
                        onClick={() => {
                            setShowFormToUpdate(true);
                            setComponentToEdit(component);
                        }}
                    />
                </button>

                <button
                    onClick={() => {
                        setComponentIdToDelete(component.id || null);
                        deleteComponentApi(component.id!)
                            .then((data) => {
                                showToast.success(data.message || "Usunięto komponent");
                                refetchComps();
                            }).finally(() => {
                            setComponentIdToDelete(null);
                            });
                    }}
                    className="p-1.5 text-ocean-red hover:bg-ocean-red/10 rounded transition-colors" title="Usuń">
                    <RemoveIcon/>
                </button>
            </div>
        </td>
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
                        {actionsCell}
                </tr>
            );

        case "GRAPHICS_CARD":
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>
                        {component.vram} GB {component.gddr} • {component.powerDraw} W
                    </td>
                        {actionsCell}
                </tr>
            );

        case "CPU_COOLER":
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>
                        Sockety: {component.coolerSocketsType.join(", ")}
                    </td>
                        {actionsCell}
                </tr>
            );

        case "MEMORY":
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>
                        {component.type} • {component.capacity} GB • {component.speed} • CL{component.latency}
                    </td>
                        {actionsCell}
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
                        {actionsCell}
                </tr>
            );

        case "STORAGE":
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>{component.capacity} GB</td>
                    {actionsCell}
                </tr>
            );

        case "POWER_SUPPLY":
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>{component.maxPowerWatt} W</td>
                    {actionsCell}
                </tr>
            );

        case "CASE_PC":
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>Format: {component.format}</td>
                    {actionsCell}
                </tr>
            );

        default:
            return (
                <tr className="hover:bg-ocean-light-blue/20 transition-colors">
                    {baseCells}
                    <td className={cellClass}>–</td>
                    {actionsCell}
                </tr>
            );
    }
};