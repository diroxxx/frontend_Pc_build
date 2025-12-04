import customAxios from "../../../lib/customAxios.tsx";

import type {UserToShowDto} from "./UserToShowDto.ts";

export const getAllUsersApi =  async () => {
    const result = await customAxios.get<UserToShowDto[]>("/api/users");
    return result.data ;
}