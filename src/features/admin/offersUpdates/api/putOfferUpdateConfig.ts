import customAxios from "../../../../lib/customAxios"

export const putOfferUpdateConfig = async (interval: string) => {

    const result = await customAxios.put(`/admin/update/automatic?interval=${interval}`);
    return result.data;
} 