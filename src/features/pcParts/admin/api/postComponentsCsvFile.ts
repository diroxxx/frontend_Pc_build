import customAxios from "../../../../lib/customAxios.tsx"

export const postComponentsCsvFile = async (
    file: File,
    componentType: string
): Promise<number> => {
    const params = new URLSearchParams();
    params.append("componentType", componentType);
    const formData = new FormData();
    formData.append("file", file);

    const response = await customAxios.post(`/api/components/import?${params.toString()}`, formData);
    return response.data;
}