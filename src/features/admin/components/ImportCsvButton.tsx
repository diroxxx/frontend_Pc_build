import { useRef } from "react";
import { Upload as UploadIcon } from "lucide-react";
import type { ComponentTypeEnum } from "../../../types/BaseItemDto";
import { postComponentsCsvFile } from "../api/postComponentsCsvFile";
import { showToast } from "../../../lib/ToastContainer";
type ImportCsvButtonProps = {
    componentType: ComponentTypeEnum;
    onImportSuccess?: (count: number) => void;
    onImportError?: (error: string) => void;
    className?: string;
};

export default function ImportCsvButton({ 
    componentType,
    className 
}: ImportCsvButtonProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handlePick = () => inputRef.current?.click();

     const handleFile = async (file: File) => {
        try {
            const count = await postComponentsCsvFile(file, componentType);
            showToast.success(`Zaimportowano ${count} komponentów`);
        } catch (error: any) {
            showToast.error(error.message || "Błąd podczas importu");
        }
    };

     return (
        <div className={className}>
            <button
                type="button"
                onClick={handlePick}
                className="w-full px-3 py-1.5 bg-ocean-light-blue text-ocean-dark-blue rounded hover:bg-ocean-blue hover:text-white text-sm font-medium flex items-center gap-1 transition-colors"
            >
                <UploadIcon className="w-4 h-4" />
                Importuj CSV
            </button>
            <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.currentTarget.value = "";
                }}
            />
        </div>
    );
}