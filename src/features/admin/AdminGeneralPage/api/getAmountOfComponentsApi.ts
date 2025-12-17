import customAxios from "../../../../lib/customAxios.tsx";

export const getAmountOfComponentsApi = async () => {
    const result = await customAxios.get<number>("/api/components/amount");
    console.log(result.data);
    return result.data;
};