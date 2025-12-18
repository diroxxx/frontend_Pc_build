import customAxios from "../../../../lib/customAxios.tsx";
import type {GameReqCompDto} from "../../../games/dto/GameReqCompDto.ts";
import {showToast} from "../../../../lib/ToastContainer.tsx";

export const createNewGameReqCompApi = async (dto: GameReqCompDto, file: File | null) => {
    const fd = new FormData();
    if (file) {
        fd.append("file", file);
    }
    fd.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));

    const result = await customAxios.post("/api/games", fd);


    showToast.success(result.data?.message ?? "Dodano grę i wymagania");
    return result.data;
};