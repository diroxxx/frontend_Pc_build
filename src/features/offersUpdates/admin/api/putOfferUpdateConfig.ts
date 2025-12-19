import customAxios from "../../../../lib/customAxios.tsx"

export const putOfferUpdateConfig = async (interval: string) => {

    const result = await customAxios.put(`/api/offersUpdates/automatic?interval=${interval}`);
    return result.data;
} 