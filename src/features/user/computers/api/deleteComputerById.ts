import customAxios from "../../../../lib/customAxios.tsx";

export const deleteComputerById = async (id: number) => {
    const result = await customAxios.delete(`/api/computers/${id}`);
    return result.data;
}