// api/components.ts
import customAxios from "../../../../lib/customAxios.tsx";
import {type NewComponentRow } from "../../../../shared/dtos/BaseItemDto.ts";

export async function bulkImportComponentsApi(rows: NewComponentRow[]) {
    const res = await customAxios.post("/api/components/bulk", rows);
    return res.data;
}
