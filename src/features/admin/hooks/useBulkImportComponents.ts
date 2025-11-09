import {useMutation, useQueryClient} from "@tanstack/react-query";
import {bulkImportComponents} from "../api/bulkImportComponents.ts";
import {showToast} from "../../../lib/ToastContainer.tsx";

export function useBulkImportComponents() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: bulkImportComponents,
        onSuccess: async (result) => {
            showToast.success("Zaimportowano komponenty.");
            await qc.invalidateQueries({ queryKey: ["components"] });
        },
        onError: (e: any) => {
            showToast.error(e?.response?.data?.message ?? "Import CSV nie powiódł się.");
        },
    });
}