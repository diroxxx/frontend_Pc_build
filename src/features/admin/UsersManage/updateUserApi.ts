import customAxios from "../../../lib/customAxios.tsx";
import type {UserUpdateDto} from "./UserUpdateDto.ts";

export const updateUserApi = async (userToUpdate: UserUpdateDto) => {
    const result = await  customAxios.put("/api/users", userToUpdate);
    return result.data;
}