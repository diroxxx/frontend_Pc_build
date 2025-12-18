import {useMutation, useQueryClient} from "@tanstack/react-query";
import {bulkImportComponentsApi} from "../AdminComponents/api/bulkImportComponentsApi.ts";
import {showToast} from "../../../lib/ToastContainer.tsx";

export function useBulkImportComponents() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: bulkImportComponentsApi,
        onSuccess: async (result) => {
            showToast.success("Zaimportowano komponenty.");
            await qc.invalidateQueries({ queryKey: ["components"] });
        },
        onError: (e: any) => {
            showToast.error(e?.response?.data?.message ?? "Import CSV nie powiódł się.");
        },
    });
}