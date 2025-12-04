import customAxios from "../../../lib/customAxios.tsx";
import type {UserUpdateDto} from "./UserUpdateDto.ts";

export const saveNewUserApi = async (user: UserUpdateDto) => {
   const result = await  customAxios.post<UserUpdateDto>("/api/users", user);
   return result
}