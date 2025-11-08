import CustomAxios from "../lib/customAxios.tsx";

export  const UpdateOffersToComputer = async ( computerId: number, offerUrl: string) =>{
    const result = await CustomAxios.put(`/api/computers/${computerId}/offers`, offerUrl);
    return result.data;
}