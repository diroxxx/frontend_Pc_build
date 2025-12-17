import customAxios from "../../../../lib/customAxios.tsx";

export const checkUserInfo = ( nickname: string, email: string ) => {


    return customAxios.get("/api/users/check?nickname=" + nickname + "&email=" + email + "");
}