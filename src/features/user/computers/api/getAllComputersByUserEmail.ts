import customAxios from "../../../../lib/customAxios.tsx";
import  type {ComputerDto} from "../../../../types/ComputerDto.ts";

export async function getAllComputersByUserEmail(email: string) : Promise<ComputerDto[]> {
    const res = await customAxios.get(`/api/users/${email}/computers`);
    return res.data;
}
