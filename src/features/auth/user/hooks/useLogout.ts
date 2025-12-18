import {useQueryClient} from "@tanstack/react-query";
import { useSetAtom} from "jotai";
import {setAuthToken} from "../../hooks/Auth.tsx";
import {userAtom} from "../../atoms/userAtom.tsx";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const setUser = useSetAtom(userAtom);

    return async () => {

        setAuthToken(null);
        setUser(null);
        queryClient.clear();
        localStorage.clear();
        sessionStorage.clear();

        window.location.reload();

    };
}
