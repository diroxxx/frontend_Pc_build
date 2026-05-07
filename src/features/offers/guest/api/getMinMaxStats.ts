import customAxios from "../../../../lib/customAxios";

export const getMinMaxStats = async (componentId: number): Promise<{ min: number; max: number }> => {
    const res = await customAxios.get<{id: number; min: number; max: number }>(`/api/components/${componentId}/stats/min-max`);
    return res.data;
}