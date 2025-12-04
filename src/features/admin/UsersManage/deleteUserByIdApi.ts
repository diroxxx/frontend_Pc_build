import customAxios from "../../../lib/customAxios.tsx";

export const deleteUserByIdApi = async (email: string) => {
    const response = await customAxios.delete("admin/users?email=" + email);
    return response.data;
}