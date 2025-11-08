import customAxios from "../../../lib/customAxios.tsx";

export const updateComputerName = async (name: string, computerId: number ) => {

    const result = await customAxios.put(`/api/computers/${computerId}/name`, {name: name});
    return result.data;
}