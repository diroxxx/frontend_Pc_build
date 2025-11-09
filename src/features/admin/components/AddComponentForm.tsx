import {PlusIcon, SaveIcon, X} from "lucide-react";
import {ComponentTypeEnum} from "../../../types/BaseItemDto.ts";
import {useState} from "react";
import Papa from "papaparse";

interface AddComponentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const AddComponentForm: React.FC<AddComponentModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [componentType, setComponentType] = useState<ComponentTypeEnum | "">("");
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
        onSubmit({ componentType, brand, model, details });
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

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-midnight-dark mb-1">Typ komponentu</label>
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