import customAxios from "../../../../lib/customAxios.tsx";
import type {GameReqCompDto} from "../../dto/GameReqCompDto.ts";

export const updateGameReqCompApi = async (dto:GameReqCompDto, file:File | null) => {

    const fd = new FormData();
    if (file) {
        fd.append("file", file);
    }

    fd.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
    console.log("Sending updateGameReqCompApi with dto:", dto);
    const result  = await customAxios.put("/api/games", fd);
    console.log("Received response from updateGameReqCompApi:", result);
    return result.data;

};