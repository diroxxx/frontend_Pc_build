import type {ComputerDto} from "../../../../shared/dtos/ComputerDto.ts";
import customAxios from "../../../../lib/customAxios.tsx";

export const postMigrateComputersFromGuestToUserApi = async (email: string, computers: ComputerDto[])=> {
    const result = await customAxios.post(`/api/users/${email}/computers/migrate`, computers);
    return result.data;
}