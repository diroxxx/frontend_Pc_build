import CustomAxios from "../../../../lib/customAxios.tsx";
import type {ComputerDto} from "../../../../types/ComputerDto.ts";

export const saveComputerByUserEmail = async (email: string, computer: ComputerDto): Promise<void> => {
    console.log("Wysyłany komputer:", computer);
    const response = await  CustomAxios.post(`/api/users/${email}/computers`, computer);
    return response.data;
}