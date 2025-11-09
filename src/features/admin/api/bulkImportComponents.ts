// api/components.ts
import customAxios from "../../../lib/customAxios.tsx";
import {type NewComponentRow } from "../../../types/BaseItemDto.ts";

export async function bulkImportComponents(rows: NewComponentRow[]) {
    const res = await customAxios.post("/api/components/bulk", rows);
    return res.data;
}
