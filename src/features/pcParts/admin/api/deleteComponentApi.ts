import customAxios  from "../../../../lib/customAxios";

export const deleteComponentApi = async (componentId: number) => {
    console.log("API - Deleting component with ID:", componentId);
    const result = await customAxios.delete(`/api/components/${componentId}`);
    return result.data;
}