import {useQueryClient} from "@tanstack/react-query";
import {useAtomValue, useSetAtom} from "jotai";
import {setAuthToken} from "../lib/Auth.tsx";
import {userAtom} from "../atomContext/userAtom.tsx";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const user = useAtomValue(userAtom);
    const setUser = useSetAtom(userAtom);

    return async () => {

        setAuthToken(null);
        setUser(null);
        queryClient.clear();
        localStorage.clear();
    };
}
