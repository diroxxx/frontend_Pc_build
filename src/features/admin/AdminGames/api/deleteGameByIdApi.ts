import customAxios from "../../../../lib/customAxios.tsx";
import {showToast} from "../../../../lib/ToastContainer.tsx";

export const deleteGameByIdApi = async (id: number) => {
    if (id === undefined || id === null) {
        throw new Error("Brak id");
    }
    const response = await customAxios.delete(`/api/games?id=${id}`);
    showToast.success(response.data?.message ?? "Usunięto grę");
    return response.data;
};