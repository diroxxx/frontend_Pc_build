import customAxios from "../../../../lib/customAxios.tsx";

export const deleteUserByEmailApi = async (email: string) => {
    const response = await customAxios.delete("/api/users?email=" + email);
    return response.data;
}