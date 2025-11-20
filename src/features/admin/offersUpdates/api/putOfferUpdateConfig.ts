import customAxios from "../../../../lib/customAxios"

export const putOfferUpdateConfig = async (intervalInminutes: number) => {

    const result = await customAxios.put(`/admin/update/automatic?intervalInMinutes=${intervalInminutes}`);
    return result.data;
} 