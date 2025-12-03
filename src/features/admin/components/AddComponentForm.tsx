import {Check, PlusIcon, X} from "lucide-react";
import {type ComponentItem, ComponentTypeEnum} from "../../../types/BaseItemDto.ts";
import React, {useState} from "react";

interface AddComponentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const AddComponentForm: React.FC<AddComponentModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [componentType, setComponentType] = useState<ComponentTypeEnum | undefined>(undefined);

    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [details, setDetails] = useState<Record<string, string>>({});

    if (!isOpen) return null;

    const handleDetailChange = (key: string, value: string) => {
        setDetails((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!componentType || !brand || !model) {
            alert("Uzupełnij wszystkie wymagane pola");
            return;
        }

        let newComponent: ComponentItem;

        switch (componentType) {
            case ComponentTypeEnum.PROCESSOR:
                newComponent = {
                    componentType: ComponentTypeEnum.PROCESSOR,
                    brand,
                    model,
                    cores: Number(details.cores),
                    threads: Number(details.threads),
                    baseClock: Number(details.baseClock),
                    socketType: details.socketType,
                };
                break;

            case ComponentTypeEnum.GRAPHICS_CARD:
                newComponent = {
                    componentType: ComponentTypeEnum.GRAPHICS_CARD,
                    brand,
                    model,
                    vram: Number(details.vram),
                    gddr: details.gddr,
                    powerDraw: Number(details.powerDraw),
                };
                break;

            case ComponentTypeEnum.MEMORY:
                newComponent = {
                    componentType: ComponentTypeEnum.MEMORY,
                    brand,
                    model,
                    type: details.type,
                    capacity: Number(details.capacity),
                    speed: details.speed,
                    latency: details.latency,
                };
                break;

                case ComponentTypeEnum.MOTHERBOARD:
                    newComponent = {
                        componentType : ComponentTypeEnum.MOTHERBOARD,
                        brand,
                        model,
                        chipset: details.chipset,
                        socketType: details.socketType,
                        memoryType: details.memoryType,
                        format: details.format,
                        ramSlots: Number(details.ramSlots),
                        ramCapacity: Number(details.ramCapacity)
                    }
                    break;

                    case ComponentTypeEnum.POWER_SUPPLY:
                        newComponent = {
                            componentType : ComponentTypeEnum.POWER_SUPPLY,
                            brand,
                            model,
                            maxPowerWatt: Number(details.maxPowerWatt)
                        }
                        break;
                        case ComponentTypeEnum.STORAGE:
                            newComponent = {
                                componentType : ComponentTypeEnum.STORAGE,
                                brand,
                                model,
                                capacity: Number(details.capacity)
                            }
                            break;

                            case ComponentTypeEnum.CPU_COOLER:
                                newComponent = {
                                    componentType : ComponentTypeEnum.CPU_COOLER,
                                    brand,
                                    model,
                                    coolerSocketsType: Array.of(details.coolerSocketsType)
                                }
                                break;
            default:
                alert("Nieobsługiwany typ komponentu");
                return;
        }

        onSubmit(newComponent);
        onClose();
    };

    const renderDynamicFields = () => {
        switch (componentType) {
            case ComponentTypeEnum.PROCESSOR:
                return (
                    <>
                        <Field label="Socket" value={details.socketType} onChange={(v) => handleDetailChange("socketType", v)} />
                        <Field label="Taktowanie bazowe (GHz)" value={details.baseClock} onChange={(v) => handleDetailChange("baseClock", v)} />
                        <Field label="Rdzenie" value={details.cores} onChange={(v) => handleDetailChange("cores", v)} />
                        <Field label="Wątki" value={details.threads} onChange={(v) => handleDetailChange("threads", v)} />
                    </>
                );

            case ComponentTypeEnum.GRAPHICS_CARD:
                return (
                    <>
                        <Field label="Pamięć VRAM (GB)" value={details.vram} onChange={(v) => handleDetailChange("vram", v)} />
                        <Field label="Rodzaj pamięci" value={details.gddr} onChange={(v) => handleDetailChange("gddr", v)} />
                        <Field label="TDP (W)" value={details.powerDraw} onChange={(v) => handleDetailChange("powerDraw", v)} />
                    </>
                );

            case ComponentTypeEnum.MEMORY:
                return (
                    <>
                        <Field label="Typ pamięci" value={details.type} onChange={(v) => handleDetailChange("type", v)} />
                        <Field label="Pojemność (GB)" value={details.capacity} onChange={(v) => handleDetailChange("capacity", v)} />
                        <Field label="Taktowanie (MHz)" value={details.speed} onChange={(v) => handleDetailChange("speed", v)} />
                        <Field label="Opóźnienie (CL)" value={details.latency} onChange={(v) => handleDetailChange("latency", v)} />
                    </>
                );

            case ComponentTypeEnum.MOTHERBOARD:
                return (
                    <>
                        <Field label="Chipset" value={details.chipset} onChange={(v) => handleDetailChange("chipset", v)} />
                        <Field label="Typ socketu" value={details.socketType} onChange={(v) => handleDetailChange("socketType", v)} />
                        <Field label="Rodzaj pamięci" value={details.memoryType} onChange={(v) => handleDetailChange("memoryType", v)} />
                        <Field label="Format płyty" value={details.format} onChange={(v) => handleDetailChange("format", v)} />
                        <Field label="ilość slotów ram" value={details.ramSlots} onChange={(v) => handleDetailChange("ramSlots", v)} />
                        <Field label="max pojemnosci ram" value={details.ramCapacity} onChange={(v) => handleDetailChange("ramCapacity", v)} />
                    </>
                );

            case ComponentTypeEnum.POWER_SUPPLY:
                return (
                    <>
                        <Field label="Moc maksymalna (W)" value={details.maxPowerWatt} onChange={(v) => handleDetailChange("maxPowerWatt", v)} />
                    </>
                );

            case ComponentTypeEnum.STORAGE:
                return (
                    <>
                        <Field label="Pojemność (GB)" value={details.capacity} onChange={(v) => handleDetailChange("capacity", v)} />
                        <Field label="Typ dysku" value={details.type} onChange={(v) => handleDetailChange("type", v)} />
                    </>
                );

            case ComponentTypeEnum.CPU_COOLER:
                return (
                    <>
                        <Field label="Socket" value={details.socketType} onChange={(v) => handleDetailChange("socketType", v)} />
                    </>
                );

            case ComponentTypeEnum.CASE_PC:
                return (
                    <>
                        <Field label="Format" value={details.format} onChange={(v) => handleDetailChange("format", v)} />
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="pointer-events-auto bg-white rounded-xl shadow-xl border border-ocean-light-blue w-full max-w-lg p-6 relative animate-fadeIn"
                style={{
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-midnight-dark flex items-center gap-2">
                        <PlusIcon className="w-5 h-5 text-ocean-dark-blue" />
                        Dodaj nowy komponent
                    </h2>
                    <button onClick={onClose} className="text-ocean-blue hover:text-ocean-dark-blue transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-midnight-dark mb-1">
                            Typ komponentu
                        </label>
                        <select
                            value={componentType}
                            onChange={(e) => setComponentType(e.target.value as ComponentTypeEnum)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-ocean-blue focus:border-ocean-blue"
                        >
                            <option value="">-- Wybierz typ --</option>
                            {Object.values(ComponentTypeEnum).map((type) => (
                                <option key={type} value={type}>
                                    {type.replaceAll("_", " ")}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Field label="Marka" value={brand} onChange={setBrand} />
                    <Field label="Model" value={model} onChange={setModel} />
                    {renderDynamicFields()}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 bg-ocean-blue text-white text-sm font-semibold rounded-md shadow-sm hover:bg-ocean-dark-blue hover:shadow-md transition-all duration-200"
                        >
                            <Check className="w-5 h-5" />
                            Zapisz
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

const Field = ({
                   label,
                   value,
                   onChange,
               }: {
    label: string;
    value?: string;
    onChange: (v: string) => void;
}) => (
    <div>
        <label className="block text-sm font-medium text-midnight-dark mb-1">{label}</label>
        <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-ocean-blue focus:border-ocean-blue"
        />
    </div>
);


export default AddComponentForm;