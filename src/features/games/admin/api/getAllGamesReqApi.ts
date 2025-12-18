import customAxios from "../../../../lib/customAxios.tsx";
import type {GameReqCompDto} from "../../dto/GameReqCompDto.ts";

export const getAllGamesReqApi = async () => {
    const result =  await customAxios<GameReqCompDto[]>("/api/games/specs");
    console.log(result.data);
    return result.data;
}