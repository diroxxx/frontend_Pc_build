import customAxios from "../../../lib/customAxios"

export const postComponentsCsvFile = async (
    file: File,
    componentType: string
): Promise<number> => {
    const params = new URLSearchParams();
    params.append("componentType", componentType);
    const formData = new FormData();
    formData.append("file", file);

    const response = await customAxios.post(`/admin/import/components?${params.toString()}`, formData);
    return response.data;
}