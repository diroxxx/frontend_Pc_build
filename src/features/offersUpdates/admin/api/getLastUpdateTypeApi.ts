import customAxios from "../../../../lib/customAxios.tsx";

export const getLastUpdateTypeApi = async () => {
    const result = await customAxios<string>("/api/offersUpdates/lastUpdateType")
    return result.data
}