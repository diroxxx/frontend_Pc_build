import customAxios from "../../../../lib/customAxios.tsx";

export const getLastUpdateTypeApi = async () => {
    const result = await customAxios<string>("offers/updates/lastUpdateType")
    return result.data
}